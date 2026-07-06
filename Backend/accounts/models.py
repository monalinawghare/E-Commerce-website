from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):

    ROLE_CHOICES = (
        ("user", "User"),
        ("vendor", "Vendor"),
    )

    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        default="user"
    )

    phone = models.CharField(max_length=15, blank=True)


class VendorProfile(models.Model):
    user = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        related_name="vendor_profile",
        limit_choices_to={"role": "vendor"}
    )

    shop_name = models.CharField(max_length=150)
    shop_address = models.TextField()
    gst_number = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return f"{self.shop_name} ({self.user.username})"