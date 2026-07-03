from django.urls import path
from .views import CartListCreateView, CartDetailView

urlpatterns = [
    path('addcart/', CartListCreateView.as_view(), name='cart-list-create'),
    path('cartdetail/<int:pk>/', CartDetailView.as_view(), name='cart-detail'),
]