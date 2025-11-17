from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UsuarioViewSet,
    PerfilViewSet,
    AplicacionViewSet,
    PerfilAplicacionViewSet,
)

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'perfiles', PerfilViewSet)
router.register(r'aplicaciones', AplicacionViewSet)
router.register(r'perfil-aplicaciones', PerfilAplicacionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
