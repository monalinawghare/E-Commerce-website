from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Product
from .serializers import ProductSerializer
from accounts.permissions import IsVendor
from rest_framework.exceptions import PermissionDenied


class ProductListCreateView(generics.ListCreateAPIView):

    serializer_class = ProductSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated(), IsVendor()]

    def get_queryset(self):

        queryset = Product.objects.all()

        # Search Product
        search = self.request.query_params.get("search")
        if search:
            queryset = queryset.filter(
                product_name__icontains=search
            )

        # Filter by Category
        category = self.request.query_params.get("category")
        if category:
            queryset = queryset.filter(
                category_id=category
            )

        # Sort by Price
        sort = self.request.query_params.get("sort")

        if sort == "price":
            queryset = queryset.order_by("price")

        elif sort == "-price":
            queryset = queryset.order_by("-price")

        return queryset

    def perform_create(self, serializer):
        # assign vendor from authenticated user
        serializer.save(vendor=self.request.user)


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):

    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_permissions(self):
        if self.request.method in ('GET',):
            return [AllowAny()]
        return [IsAuthenticated(), IsVendor()]

    def check_object_permissions(self, request, obj):
        # allow only vendor owner or staff to modify
        if request.method in ('PUT', 'PATCH', 'DELETE'):
            user = request.user
            if not (user.is_staff or obj.vendor == user):
                raise PermissionDenied("You do not have permission to modify this product.")
        return super().check_object_permissions(request, obj)