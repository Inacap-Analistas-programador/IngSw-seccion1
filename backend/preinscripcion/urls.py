from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PreinscripcionViewSet, PreinscripcionEstadoLogViewSet,
    CupoConfiguracionViewSet, DocumentoViewSet
)

router = DefaultRouter()
router.register(r'preinscripcion', PreinscripcionViewSet, basename='preinscripcion')
router.register(r'preinscripcion-estado-log', PreinscripcionEstadoLogViewSet, basename='preinscripcion-estado-log')
router.register(r'cupo-configuracion', CupoConfiguracionViewSet, basename='cupo-configuracion')
router.register(r'documento', DocumentoViewSet, basename='documento')

urlpatterns = [
    path('', include(router.urls)),
]
