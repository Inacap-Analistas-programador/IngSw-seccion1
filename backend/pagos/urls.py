from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PagoPersonaViewSet,
    ComprobantePagoViewSet,
    PagoComprobanteViewSet,
    PagoCambioPersonaViewSet,
    PrepagoViewSet,
)

router = DefaultRouter()
router.register(r'pagopersonas', PagoPersonaViewSet)
router.register(r'comprobantes', ComprobantePagoViewSet)
router.register(r'pagocomprobantes', PagoComprobanteViewSet)
router.register(r'pago-cambios', PagoCambioPersonaViewSet)
router.register(r'prepagos', PrepagoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
