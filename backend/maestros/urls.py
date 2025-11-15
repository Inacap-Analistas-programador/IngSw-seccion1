from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegionViewSet,
    ProvinciaViewSet,
    ComunaViewSet,
    ZonaViewSet,
    DistritoViewSet,
    GrupoViewSet,
    EstadoCivilViewSet,
    CargoViewSet,
    NivelViewSet,
    RamaViewSet,
    RolViewSet,
    TipoArchivoViewSet,
    TipoCursoViewSet,
    AlimentacionViewSet,
    ConceptoContableViewSet,
)

router = DefaultRouter()
router.register(r'regiones', RegionViewSet)
router.register(r'provincias', ProvinciaViewSet)
router.register(r'comunas', ComunaViewSet)
router.register(r'zonas', ZonaViewSet)
router.register(r'distritos', DistritoViewSet)
router.register(r'grupos', GrupoViewSet)
router.register(r'estados-civiles', EstadoCivilViewSet)
router.register(r'cargos', CargoViewSet)
router.register(r'niveles', NivelViewSet)
router.register(r'ramas', RamaViewSet)
router.register(r'roles', RolViewSet)
router.register(r'tipos-archivo', TipoArchivoViewSet)
router.register(r'tipos-curso', TipoCursoViewSet)
router.register(r'alimentaciones', AlimentacionViewSet)
router.register(r'conceptos-contables', ConceptoContableViewSet)


urlpatterns = [
    path('', include(router.urls)),
]