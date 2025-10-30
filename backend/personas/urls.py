from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'', views.PersonaViewSet, basename='personas')
router.register(r'personas-individuales', views.PersonaIndividualViewSet)
router.register(r'personas-niveles', views.PersonaNivelViewSet)
router.register(r'personas-formadores', views.PersonaFormadorViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
