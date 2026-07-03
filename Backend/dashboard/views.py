from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum
from products.models import Product
from categories.models import Category
from orders.models import Order
from cart.models import Cart
from rest_framework.permissions import IsAuthenticated
from accounts.permissions import IsVendor, IsUser
from rest_framework.exceptions import PermissionDenied


class VendorDashboardView(APIView):
    permission_classes = [IsAuthenticated, IsVendor]

    def get(self, request):
        user = request.user

        # Ensure vendor
        if getattr(user, 'role', '') != 'vendor':
            raise PermissionDenied("Vendor access only")

        recent_orders = Order.objects.filter(product__vendor=user).order_by("-order_date")[:5]
        recent_orders_data = []
        for order in recent_orders:
            recent_orders_data.append({
                "customer": order.customer_name,
                "vendor": order.product.vendor.username,
                "product": order.product.product_name,
                "quantity": order.quantity,
                "status": order.status,
                "total_price": order.total_price,
            })

        total_revenue = Order.objects.filter(product__vendor=user).aggregate(
            total=Sum("total_price")
        )["total"] or 0

        data = {
            "total_products": Product.objects.filter(vendor=user).count(),
            "total_categories": Category.objects.count(),
            "total_orders": Order.objects.filter(product__vendor=user).count(),
            "pending_orders": Order.objects.filter(product__vendor=user, status="Pending").count(),
            "out_of_stock_products": Product.objects.filter(vendor=user, stock=0).count(),
            "low_stock_products": Product.objects.filter(vendor=user, stock__lte=5).count(),
            "total_revenue": total_revenue,
            "recent_orders": recent_orders_data,
        }

        return Response(data)


class CustomerDashboardView(APIView):
    permission_classes = [IsAuthenticated, IsUser]

    def get(self, request):
        user = request.user

        recent_orders = Order.objects.filter(user=user).order_by("-order_date")[:5]

        recent_orders_data = []

        for order in recent_orders:

            recent_orders_data.append({

                "customer": order.customer_name,
                "product": order.product.product_name,
                "quantity": order.quantity,
                "status": order.status,
                "total_price": order.total_price,

            })

        total_spent = Order.objects.filter(user=user).aggregate(
            total=Sum("total_price")
        )["total"] or 0

        data = {
            "total_orders": Order.objects.filter(user=user).count(),
            "pending_orders": Order.objects.filter(user=user, status="Pending").count(),
            "cart_items": Cart.objects.filter(user=user).count() if hasattr(Cart, 'objects') else 0,
            "total_spent": total_spent,
            "recent_orders": recent_orders_data,
        }

        return Response(data)