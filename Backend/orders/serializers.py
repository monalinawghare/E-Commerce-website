from rest_framework import serializers
from .models import Order

class OrderSerializer(serializers.ModelSerializer):

    total_price = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        read_only=True
    )

    status = serializers.CharField(read_only=True)

    class Meta:
        model = Order
        fields = "__all__"