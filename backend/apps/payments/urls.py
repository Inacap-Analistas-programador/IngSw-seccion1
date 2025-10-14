"""
Módulo de URLs para la aplicación de Pagos.

Este archivo define las rutas de la API para todos los recursos relacionados con los pagos.
Utiliza un `DefaultRouter` de Django REST Framework para registrar los `ViewSets`
y generar automáticamente las URLs para las operaciones CRUD (Crear, Leer, Actualizar, Eliminar).
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PagoPersonaViewSet,
    PagoCambioPersonaViewSet,
    PrepagoViewSet,
    ComprobantePagoViewSet,
    PagoComprobanteViewSet,
    ConceptoContableViewSet
)

# Define un espacio de nombres para las URLs de esta aplicación.
# Esto permite referenciar las URLs de forma única en el proyecto,
# por ejemplo: reverse('payments:pago-persona-list')
app_name = 'payments'

# Crea una instancia del router que gestionará las URLs de la API.
router = DefaultRouter()

# Se registran los ViewSets en el router. Cada registro crea un conjunto de URLs
# para un modelo específico. Por ejemplo, para 'pagos-persona', se generan las rutas:
# - `GET /pagos-persona/` (listar y crear)
# - `GET /pagos-persona/{id}/` (ver, actualizar, eliminar)

# Endpoint para gestionar los pagos de personas.
router.register(r'pagos-persona', PagoPersonaViewSet, basename='pago-persona')

# Endpoint para el historial de cambios de titularidad de un pago.
router.register(r'pagos-cambio-persona', PagoCambioPersonaViewSet, basename='pago-cambio-persona')

# Endpoint para gestionar los saldos a favor (prepagos).
router.register(r'prepagos', PrepagoViewSet, basename='prepago')

# Endpoint para el catálogo de conceptos contables.
router.register(r'conceptos-contables', ConceptoContableViewSet, basename='concepto-contable')

# Endpoint para los documentos de comprobantes de pago.
router.register(r'comprobantes-pago', ComprobantePagoViewSet, basename='comprobante-pago')

# Endpoint para la relación entre pagos y comprobantes.
router.register(r'pagos-comprobante', PagoComprobanteViewSet, basename='pago-comprobante')

# Agrupa todas las URLs generadas por el router bajo la ruta raíz de esta aplicación.
# Por ejemplo, si este módulo de URLs se incluye en 'api/payments/', las rutas
# serán como '/api/payments/pagos-persona/'.
urlpatterns = [
    path('', include(router.urls)),
]