from django.urls import path
from .views import ProductListCreateView, ProductDetailView

urlpatterns = [
    path('addproducts/', ProductListCreateView.as_view(), name='products'),
    path('productdetail/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('products/', ProductListCreateView.as_view(), name='products_list'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail-pk'),
]