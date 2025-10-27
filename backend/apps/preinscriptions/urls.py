from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = "preinscriptions"

router = DefaultRouter()
router.register(r'preinscripcion', views.PreinscripcionViewSet, basename='preinscripcion')

urlpatterns = [
    path("", include(router.urls)),
    # Compatibilidad para tests que esperan nombres de ruta específicos
    path(
        "mis_preinscripciones/",
        views.PreinscripcionViewSet.as_view({"get": "mis_preinscripciones"}),
        name="mis_preinscripciones-list",
    ),
    path(
        "<int:pk>/cambiar_estado/",
        views.PreinscripcionViewSet.as_view({"patch": "cambiar_estado"}),
        name="preinscripcion-cambiar-estado",
    ),
    # Will be implemented in Sprint N2 - SGICS-401
    # path('', views.PreinscriptionViewSet.as_view({'get': 'list', 'post': 'create'})),
    # path('search-person/', views.PersonSearchView.as_view(), name='search-person'),
]
