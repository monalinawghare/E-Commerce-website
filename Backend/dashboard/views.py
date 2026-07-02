from rest_framework.views import APIView
from rest_framework.response import Response

from django.db.models import Sum

from products.models import Product
from categories.models import Category
from orders.models import Order
from cart.models import Cart


class VendorDashboardView(APIView):

    def get(self, request):

        recent_orders = Order.objects.order_by("-order_date")[:5]

        recent_orders_data = []

        for order in recent_orders:

            recent_orders_data.append({

                "customer": order.customer_name,
                "vendor": order.product.vendor_name,
                "product": order.product.product_name,
                "quantity": order.quantity,
                "status": order.status,
                "total_price": order.total_price,

            })

        total_revenue = Order.objects.aggregate(
            total=Sum("total_price")
        )["total"] or 0

        data = {

            "total_products": Product.objects.count(),

            "total_categories": Category.objects.count(),

            "total_orders": Order.objects.count(),

            "pending_orders": Order.objects.filter(
                status="Pending"
            ).count(),

            "out_of_stock_products": Product.objects.filter(
                stock=0
            ).count(),

            "low_stock_products": Product.objects.filter(
                stock__lte=5
            ).count(),

            "total_revenue": total_revenue,

            "recent_orders": recent_orders_data,

        }

        return Response(data)


class CustomerDashboardView(APIView):

    def get(self, request):

        recent_orders = Order.objects.order_by("-order_date")[:5]

        recent_orders_data = []

        for order in recent_orders:

            recent_orders_data.append({

                "customer": order.customer_name,
                "product": order.product.product_name,
                "quantity": order.quantity,
                "status": order.status,
                "total_price": order.total_price,

            })

        total_spent = Order.objects.aggregate(
            total=Sum("total_price")
        )["total"] or 0

        data = {

            "total_orders": Order.objects.count(),

            "pending_orders": Order.objects.filter(
                status="Pending"
            ).count(),

            "cart_items": Cart.objects.count(),

            "total_spent": total_spent,

            "recent_orders": recent_orders_data,

        }

        return Response(data)