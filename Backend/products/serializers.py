from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    vendor = serializers.SerializerMethodField(read_only=True)

    def get_vendor(self, obj):
        if obj.vendor is None:
            return None

        return {
            "id": obj.vendor.id,
            "username": obj.vendor.username,
            "first_name": obj.vendor.first_name,
            "last_name": obj.vendor.last_name,
        }

    class Meta:
        model = Product
        fields = [
            "id",
            "vendor",
            "category",
            "product_name",
            "description",
            "price",
            "stock",
            "created_at",
            "updated_at",
        ]

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Price must be greater than 0."
            )
        return value

    def validate_stock(self, value):
        if value < 0:
            raise serializers.ValidationError(
                "Stock cannot be negative."
            )
        return value