"""
URLs para catálogos maestros
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r"regiones", views.RegionViewSet)
router.register(r"provincias", views.ProvinciaViewSet)
router.register(r"comunas", views.ComunaViewSet)
router.register(r"zonas", views.ZonaViewSet)
router.register(r"distritos", views.DistritoViewSet)
router.register(r"grupos", views.GrupoScoutViewSet)
router.register(r"ramas", views.RamaViewSet)
router.register(r"tipos-curso", views.TipoCursoViewSet)
router.register(r"niveles", views.NivelViewSet)
router.register(r"estados-civiles", views.EstadoCivilViewSet)
router.register(r"tipos-alimentacion", views.TipoAlimentacionViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
