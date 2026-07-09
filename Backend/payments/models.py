from django.db import models
from django.conf import settings
from orders.models import Order


class Payment(models.Model):
    PAYMENT_METHOD = (
        ('COD', 'Cash On Delivery'),
        ('ONLINE', 'Online Payment'),
    )

    PAYMENT_STATUS = (
        ('Pending', 'Pending'),
        ('Completed', 'Completed'),
        ('Failed', 'Failed'),
    )
    razorpay_order_id = models.CharField(
    max_length=100,
    blank=True,
    null=True
)

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    order = models.OneToOneField(
        Order,
        on_delete=models.CASCADE
    )
    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENT_METHOD
    )
    payment_status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS,
        default='Pending'
    )
    transaction_id = models.CharField(
        max_length=200,
        blank=True,
        null=True
    )
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    payment_date = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.transaction_id or f"Payment {self.id}"