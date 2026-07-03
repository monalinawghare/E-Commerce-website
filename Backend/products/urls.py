from django.urls import path
from .views import ProductListCreateView, ProductDetailView

urlpatterns = [
    path('addproducts/', ProductListCreateView.as_view(), name='products'),
    path('productdetail/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
]