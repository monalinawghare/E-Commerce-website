from rest_framework import generics,status
from .models import Payment
from .serializers import PaymentSerializer
import razorpay
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


class PaymentListCreateView(generics.ListCreateAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer


class PaymentDetailView(generics.RetrieveAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    
client = razorpay.Client(
    auth=(
        settings.RAZORPAY_KEY_ID,
        settings.RAZORPAY_KEY_SECRET
    )
)

class CreateRazorpayOrder(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        amount = request.data.get("amount")

        payment = client.order.create({
            "amount": int(float(amount) * 100),
            "currency": "INR",
            "payment_capture": 1
        })

        return Response({
            "order_id": payment["id"],
            "amount": payment["amount"],
            "currency": payment["currency"],
            "key": settings.RAZORPAY_KEY_ID
        })
        
class VerifyPayment(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        data = request.data
        try:
            client.utility.verify_payment_signature({
                "razorpay_order_id":
                data["razorpay_order_id"],

                "razorpay_payment_id":
                data["razorpay_payment_id"],

                "razorpay_signature":
                data["razorpay_signature"],
            })

            return Response({
                "message": "Payment Verified"
            })

        except Exception as e:
            return Response(
                {
                    "message": "Payment Failed",
                    "error": str(e)
                },
                status=status.HTTP_400_BAD_REQUEST
            )