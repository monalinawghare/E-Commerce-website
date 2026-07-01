from rest_framework import generics
from .models import Product
from .serializers import ProductSerializer


class ProductListCreateView(generics.ListCreateAPIView):

    serializer_class = ProductSerializer

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


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):

    queryset = Product.objects.all()
    serializer_class = ProductSerializer