from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'', views.ArchivoViewSet, basename='archivos')
router.register(r'archivos-curso', views.ArchivoCursoViewSet)
router.register(r'archivos-persona', views.ArchivoPersonaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
