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
    product_name = serializers.CharField(
        source="product.product_name",
        read_only=True
    )
    image = serializers.ImageField(source="product.image", read_only=True)

    def get_user(self, obj):
        if obj.user:
            return {
                'id': obj.user.id,
                'username': obj.user.username,
                'email': obj.user.email,
            }
        return None

    class Meta:
        model = Order
        fields = "__all__"
        read_only_fields = ('id','total_price', 'status', 'user','product_name', 'image')