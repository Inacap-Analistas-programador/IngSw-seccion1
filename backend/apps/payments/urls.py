"""
Módulo de URLs para la aplicación de Pagos.

Este archivo define las rutas de la API para todos los recursos relacionados con los pagos.
Utiliza un `DefaultRouter` de Django REST Framework para registrar los `ViewSets`
y generar automáticamente las URLs para las operaciones CRUD (Crear, Leer, Actualizar, Eliminar).
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PaymentViewSet

app_name = 'payments'

# Crea una instancia del router que gestionará las URLs de la API.
router = DefaultRouter()
router.register(r'payments', PaymentViewSet, basename='payment') # Register PaymentViewSet

urlpatterns = [
    path('', include(router.urls)),
]
