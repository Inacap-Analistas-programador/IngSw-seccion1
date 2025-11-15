from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegionViewSet, ProvinciaViewSet, ComunaViewSet, ZonaViewSet, DistritoViewSet, GrupoViewSet

router = DefaultRouter()
router.register(r'regiones', RegionViewSet)
router.register(r'provincias', ProvinciaViewSet)
router.register(r'comunas', ComunaViewSet)
router.register(r'zonas', ZonaViewSet)
router.register(r'distritos', DistritoViewSet)
router.register(r'grupos', GrupoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
