from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PersonaViewSet

router = DefaultRouter()
router.register(r'personas', PersonaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
