from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'regiones', views.RegionViewSet)
router.register(r'provincias', views.ProvinciaViewSet)
router.register(r'comunas', views.ComunaViewSet)
router.register(r'zonas', views.ZonaViewSet)
router.register(r'distritos', views.DistritoViewSet)
router.register(r'grupos', views.GrupoViewSet)
router.register(r'estados-civiles', views.EstadoCivilViewSet)
router.register(r'niveles', views.NivelViewSet)
router.register(r'ramas', views.RamaViewSet)
router.register(r'roles', views.RolViewSet)
router.register(r'tipos-archivo', views.TipoArchivoViewSet)
router.register(r'tipos-curso', views.TipoCursoViewSet)
router.register(r'cargos', views.CargoViewSet)
router.register(r'alimentaciones', views.AlimentacionViewSet)
router.register(r'aplicaciones', views.AplicacionViewSet)
router.register(r'perfiles', views.PerfilViewSet)
router.register(r'perfiles-aplicacion', views.PerfilAplicacionViewSet)
router.register(r'proveedores', views.ProveedorViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
