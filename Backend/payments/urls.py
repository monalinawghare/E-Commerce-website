from django.urls import path
from .views import PaymentListCreateView, PaymentDetailView

urlpatterns = [
    path('paymentcreate/', PaymentListCreateView.as_view(), name='payment'),
    path("paymentdetail/<int:pk>/",PaymentDetailView.as_view(), name='payment-detail')
]