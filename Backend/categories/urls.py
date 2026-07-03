from django.urls import path
from .views import (
    CategoryListCreateView,
    CategoryDetailView,
)

urlpatterns = [

    path(
        "addcategory/",CategoryListCreateView.as_view(),
        name="category-list"),

    path(
        "categorydetail/<int:pk>/",CategoryDetailView.as_view(),name="category-detail"
    ),
]