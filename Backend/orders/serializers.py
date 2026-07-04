from rest_framework import serializers
from .models import Order

class OrderSerializer(serializers.ModelSerializer):

    total_price = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        read_only=True
    )

    status = serializers.CharField(read_only=True)

    user = serializers.SerializerMethodField(read_only=True)

    def get_user(self, obj):
        return {
            'id': obj.user.id,
            'username': obj.user.username,
            'email': obj.user.email,
        }

    class Meta:
        model = Order
        fields = "__all__"
        read_only_fields = ('total_price', 'status', 'user')