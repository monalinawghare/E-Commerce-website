from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Category
from .serializers import CategorySerializer
from accounts.permissions import IsVendor
from rest_framework.parsers import MultiPartParser, FormParser


class CategoryListCreateView(generics.ListCreateAPIView):

    serializer_class = CategorySerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated(), IsVendor()]

    def get_queryset(self):
        return Category.objects.all()


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):

    serializer_class = CategorySerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated(), IsVendor()]

    def get_queryset(self):
        return Category.objects.all()