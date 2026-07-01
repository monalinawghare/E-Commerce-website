from django.urls import path
from .views import ForgotPasswordView, RegisterView, LoginView, ProfileView, LogoutView

urlpatterns = [
    path("", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("forgot-password/", ForgotPasswordView.as_view(), name="forgot-password"),
]