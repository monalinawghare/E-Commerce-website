from django.db import models
from products.models import Product
from accounts.models import CustomUser


class Order(models.Model):

    user = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='orders',
        limit_choices_to={"role": "user"},
        null=True,
        blank=True,
    )

    customer_name = models.CharField(max_length=100)

    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT
    )

    quantity = models.PositiveIntegerField()

    total_price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    status = models.CharField(
        max_length=20,
        choices=[
            ('Pending', 'Pending'),
            ('Accepted', 'Accepted'),
            ('Shipped', 'Shipped'),
            ('Delivered', 'Delivered')
        ],
        default='Pending'
    )

    order_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.customer_name} - {self.product.product_name}"