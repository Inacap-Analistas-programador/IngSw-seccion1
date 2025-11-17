from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PersonaViewSet,
    PersonaGrupoViewSet,
    PersonaNivelViewSet,
    PersonaFormadorViewSet,
    PersonaIndividualViewSet,
    PersonaVehiculoViewSet,
    PersonaCursoViewSet,
    PersonaEstadoCursoViewSet,
)

router = DefaultRouter()
router.register(r'personas', PersonaViewSet)
router.register(r'grupos', PersonaGrupoViewSet)
router.register(r'niveles', PersonaNivelViewSet)
router.register(r'formadores', PersonaFormadorViewSet)
router.register(r'individuales', PersonaIndividualViewSet)
router.register(r'vehiculos', PersonaVehiculoViewSet)
router.register(r'cursos', PersonaCursoViewSet)
router.register(r'estados', PersonaEstadoCursoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
