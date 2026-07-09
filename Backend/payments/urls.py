from django.urls import path
from .views import PaymentListCreateView, PaymentDetailView , CreateRazorpayOrder, VerifyPayment

urlpatterns = [
    path('paymentcreate/', PaymentListCreateView.as_view(), name='payment'),
    path("paymentdetail/<int:pk>/",PaymentDetailView.as_view(), name='payment-detail'),
    path("create-razorpay-order/",CreateRazorpayOrder.as_view()),
    path("verify-payment/", VerifyPayment.as_view()),
]