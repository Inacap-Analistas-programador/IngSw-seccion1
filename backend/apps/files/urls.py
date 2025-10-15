from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = "files"

router = DefaultRouter()
router.register(r"", views.FileUploadViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
