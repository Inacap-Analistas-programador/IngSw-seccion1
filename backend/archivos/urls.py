from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ArchivoViewSet, ArchivoCursoViewSet, ArchivoPersonaViewSet

router = DefaultRouter()
router.register(r'archivos', ArchivoViewSet)
router.register(r'cursos', ArchivoCursoViewSet)
router.register(r'personas', ArchivoPersonaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
