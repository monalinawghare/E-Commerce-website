from django.urls import path
from .views import VendorDashboardView, CustomerDashboardView

urlpatterns = [

    path(
        'vendor/',VendorDashboardView.as_view(),name='vendor-dashboard'),

    path(
        'customer/',CustomerDashboardView.as_view(),name='customer-dashboard'),

]