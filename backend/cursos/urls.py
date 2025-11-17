from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CursoViewSet,
    CursoSeccionViewSet,
    CursoFechaViewSet,
    CursoCuotaViewSet,
    CursoAlimentacionViewSet,
    CursoCoordinadorViewSet,
    CursoFormadorViewSet,
)

router = DefaultRouter()
router.register(r'cursos', CursoViewSet)
router.register(r'secciones', CursoSeccionViewSet)
router.register(r'fechas', CursoFechaViewSet)
router.register(r'cuotas', CursoCuotaViewSet)
router.register(r'alimentacion', CursoAlimentacionViewSet)
router.register(r'coordinadores', CursoCoordinadorViewSet)
router.register(r'formadores', CursoFormadorViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
