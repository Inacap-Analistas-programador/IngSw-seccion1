from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CursoViewSet

router = DefaultRouter()
router.register(r'cursos', CursoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
