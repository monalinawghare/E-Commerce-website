from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

from .models import Order
from .serializers import OrderSerializer


# ==========================
# Create Order & View Orders
# ==========================

class OrderListCreateView(generics.ListCreateAPIView):

    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def perform_create(self, serializer):

        product = serializer.validated_data["product"]
        quantity = serializer.validated_data["quantity"]

        # Quantity Validation
        if quantity <= 0:
            raise ValidationError({
                "quantity": "Quantity must be greater than 0."
            })

        # Stock Validation
        if quantity > product.stock:
            raise ValidationError({
                "quantity": f"Only {product.stock} item(s) available in stock."
            })

        # Calculate Total Price
        total_price = product.price * quantity

        # Reduce Stock
        product.stock -= quantity
        product.save()

        # Save Order
        serializer.save(
            total_price=total_price,
            status="Pending"
        )


# ==========================
# View Single Order
# ==========================

class OrderDetailView(generics.RetrieveAPIView):

    queryset = Order.objects.all()
    serializer_class = OrderSerializer


# ==========================
# Cancel Order
# ==========================

class CancelOrder(APIView):

    def delete(self, request, pk):

        try:
            order = Order.objects.get(pk=pk)

        except Order.DoesNotExist:

            return Response(
                {"error": "Order not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Restore Product Stock
        product = order.product
        product.stock += order.quantity
        product.save()

        # Delete Order
        order.delete()

        return Response(
            {
                "message": "Order cancelled successfully."
            },
            status=status.HTTP_200_OK
        )


# ==========================
# Update Order Status
# ==========================

class UpdateOrderStatus(APIView):

    def put(self, request, pk):

        try:
            order = Order.objects.get(pk=pk)

        except Order.DoesNotExist:

            return Response(
                {"error": "Order not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        status_value = request.data.get("status")

        valid_status = [
            "Pending",
            "Accepted",
            "Shipped",
            "Delivered"
        ]

        if status_value not in valid_status:

            return Response(
                {
                    "error": "Invalid Status"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        order.status = status_value
        order.save()

        serializer = OrderSerializer(order)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )