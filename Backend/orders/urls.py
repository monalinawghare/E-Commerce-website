from django.urls import path
from .views import (
    OrderListCreateView,
    OrderDetailView,
    CancelOrder,
    UpdateOrderStatus
)

urlpatterns = [

    path(
        '',
        OrderListCreateView.as_view(),
        name='orders'
    ),

    path(
        '<int:pk>/',
        OrderDetailView.as_view(),
        name='order-detail'
    ),

    path(
        '<int:pk>/cancel/',
        CancelOrder.as_view(),
        name='cancel-order'
    ),

    path(
        '<int:pk>/status/',
        UpdateOrderStatus.as_view(),
        name='update-order-status'
    ),

]