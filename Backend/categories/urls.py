from django.urls import path
from .views import (
    CategoryListCreateView,
    CategoryDetailView,
)

urlpatterns = [

    path(
        "addcategory/",CategoryListCreateView.as_view(),
        name="category-list"),

    path('categories/', CategoryListCreateView.as_view(), name='categories_list'),

    path(
        "categorydetail/<int:pk>/",CategoryDetailView.as_view(),name="category-detail"
    ),
    path('categories/<int:pk>/', CategoryDetailView.as_view(), name='category-detail-pk')
]