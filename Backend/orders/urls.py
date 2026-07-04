from django.urls import path
from .views import (
    OrderListCreateView,
    OrderDetailView,
    CancelOrder,
    UpdateOrderStatus
)

urlpatterns = [

    path(
        'createorder/',
        OrderListCreateView.as_view(),
        name='orders'
    ),

    path(
        'orderdetail/<int:pk>/',
        OrderDetailView.as_view(),
        name='order-detail'
    ),

    path(
        'cancel/<int:pk>/',
        CancelOrder.as_view(),
        name='cancel-order'
    ),

    path(
        'updatestatus/<int:pk>/',
        UpdateOrderStatus.as_view(),
        name='update-order-status'
    ),

]