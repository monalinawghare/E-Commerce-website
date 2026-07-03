from django.contrib import admin
from django.urls import path, include

urlpatterns = [

    path('admin/', admin.site.urls),
    # Accounts
    path('', include('accounts.urls')),

    # Categories
    path('',include('categories.urls')),

    # Products
    path('',include('products.urls')),

    # Orders
    path('',include('orders.urls')),

    # Cart
    path('',include('cart.urls')),

    # Payments
    path('',include('payments.urls')),

    # Dashboard
    path('',include('dashboard.urls')),
]