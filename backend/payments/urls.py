from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'', views.PagoPersonaViewSet, basename='pagos')
router.register(r'pagos-cambio-persona', views.PagoCambioPersonaViewSet)
router.register(r'prepagos', views.PrepagoViewSet)
router.register(r'conceptos-contables', views.ConceptoContableViewSet)
router.register(r'comprobantes-pago', views.ComprobantePagoViewSet)
router.register(r'pagos-comprobante', views.PagoComprobanteViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
