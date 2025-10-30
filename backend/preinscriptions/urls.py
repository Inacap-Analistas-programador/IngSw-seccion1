from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'personas-curso', views.PersonaCursoViewSet)
router.register(r'personas-estado-curso', views.PersonaEstadoCursoViewSet)
router.register(r'personas-vehiculo', views.PersonaVehiculoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
