from django.urls import path
from .views import ForgotPasswordView, RegisterView, LoginView, ProfileView, LogoutView, VendorRegisterView

urlpatterns = [
    path("", RegisterView.as_view(), name="register"),
    path("register/", RegisterView.as_view(), name="register_alias"),
    path("vendor-register/", VendorRegisterView.as_view(), name="vendor-register"),
    path("login/", LoginView.as_view(), name="login"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("forgot-password/", ForgotPasswordView.as_view(), name="forgot-password"),
]