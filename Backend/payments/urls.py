from django.urls import path
from.views import PaymentView, PaymentDetailView

urlpatterns = [
    path('payment/', PaymentView.as_view(), name='payment'),
    path("payment/<int:pk>/",PaymentDetailView.as_view(), name='payment-detail')
]