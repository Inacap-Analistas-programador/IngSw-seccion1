from rest_framework import viewsets
from .models import PagoPersona, PagoCambioPersona, Prepago, ConceptoContable, ComprobantePago, PagoComprobante
from .serializers import PagoPersonaSerializer, PagoCambioPersonaSerializer, PrepagoSerializer, ConceptoContableSerializer, ComprobantePagoSerializer, PagoComprobanteSerializer

class PagoPersonaViewSet(viewsets.ModelViewSet):
    queryset = (
        PagoPersona.objects.select_related("persona", "curso", "usuario").all()
    )
    serializer_class = PagoPersonaSerializer

class PagoCambioPersonaViewSet(viewsets.ModelViewSet):
    queryset = (
        PagoCambioPersona.objects.select_related(
            "persona", "pago_persona", "usuario"
        ).all()
    )
    serializer_class = PagoCambioPersonaSerializer

class PrepagoViewSet(viewsets.ModelViewSet):
    queryset = (
        Prepago.objects.select_related("persona", "curso", "pago_persona").all()
    )
    serializer_class = PrepagoSerializer

class ConceptoContableViewSet(viewsets.ModelViewSet):
    queryset = ConceptoContable.objects.all()
    serializer_class = ConceptoContableSerializer

class ComprobantePagoViewSet(viewsets.ModelViewSet):
    queryset = (
        ComprobantePago.objects.select_related(
            "usuario", "persona_curso", "concepto_contable"
        ).all()
    )
    serializer_class = ComprobantePagoSerializer

class PagoComprobanteViewSet(viewsets.ModelViewSet):
    queryset = (
        PagoComprobante.objects.select_related(
            "pago_persona", "comprobante_pago"
        ).all()
    )
    serializer_class = PagoComprobanteSerializer
