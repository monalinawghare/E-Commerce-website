from django.contrib import admin
from django.urls import path, include

urlpatterns = [

    path('admin/', admin.site.urls),

    # Accounts
    path('', include('accounts.urls')),

    # Categories
    path(
        'api/categories/',
        include('categories.urls')
    ),

    # Products
    path(
        'api/products/',
        include('products.urls')
    ),

    # Orders
    path(
        'api/orders/',
        include('orders.urls')
    ),

    # Cart
    path(
        'cart/',
        include('cart.urls')
    ),

    # Payments
    path(
        '',
        include('payments.urls')
    ),

    # Dashboard
    path(
        'api/dashboard/',
        include('dashboard.urls')
    ),
]