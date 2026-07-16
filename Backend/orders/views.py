from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError, PermissionDenied
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import Order
from .serializers import OrderSerializer
from accounts.permissions import IsVendor, IsUser


# ==========================
# Create Order & View Orders
# ==========================

class OrderListCreateView(generics.ListCreateAPIView):
    serializer_class = OrderSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsUser()]

    def get_queryset(self):
        user = self.request.user

        if getattr(user, "role", "") == "vendor":
            return Order.objects.filter(
                product__vendor=user
            ).order_by("-id")

        return Order.objects.filter(
            user=user
        ).order_by("-id")

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

        # Save Order linked to user
        serializer.save(
            total_price=total_price,
            status="Pending",
            user=self.request.user,
            customer_name=self.request.user.username
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
        # only the user who placed the order can cancel it
        if not request.user.is_authenticated:
            raise PermissionDenied("Authentication required.")

        try:
            order = Order.objects.get(pk=pk)

        except Order.DoesNotExist:

            return Response(
                {"error": "Order not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        # ensure the requester is the owner
        if order.user != request.user and not request.user.is_staff:
            raise PermissionDenied("You cannot cancel this order.")

        # Restore Product Stock
        product = order.product
        product.stock += order.quantity
        product.save()

        order.status = "Cancelled"
        order.save()

        return Response(
            {
                "message": "Order cancelled successfully.",
                "status": order.status
            },
            status=200
        )


# ==========================
# Update Order Status
# ==========================

class UpdateOrderStatus(APIView):

    def put(self, request, pk):
        # Only vendor owning the product or staff can update status
        if not request.user.is_authenticated:
            raise PermissionDenied("Authentication required.")

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
            "Rejected",
            "Cancelled",
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

        # Only vendor of the product or staff may update the status
        if not (request.user.is_staff or order.product.vendor == request.user):
            raise PermissionDenied("You cannot update this order.")

        order.status = status_value
        order.save()

        serializer = OrderSerializer(order)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )