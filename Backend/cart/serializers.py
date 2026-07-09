from rest_framework import serializers
from .models import Cart

class CartSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.product_name", read_only=True)
    price = serializers.DecimalField(source="product.price", max_digits=10, decimal_places=2, read_only=True)
    image = serializers.ImageField(source="product.image", read_only=True)

    class Meta:
        model = Cart
        fields = [
            "id",
            "user",
            "product",
            "product_name",
            "price",
            "image",
            "quantity",
            "added_at",
        ]