from django.db import models
from categories.models import Category
from accounts.models import CustomUser


class Product(models.Model):
    vendor = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name="products",
        limit_choices_to={"role": "vendor"},
        null=True,
        blank=True
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="products"
    )
    product_name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    stock = models.PositiveIntegerField()
    image = models.ImageField(
        upload_to="products/",
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["product_name"]

    def __str__(self):
        return self.product_name