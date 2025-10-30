from rest_framework import viewsets
from .models import PagoPersona, PagoCambioPersona, Prepago, ConceptoContable, ComprobantePago, PagoComprobante
from .serializers import PagoPersonaSerializer, PagoCambioPersonaSerializer, PrepagoSerializer, ConceptoContableSerializer, ComprobantePagoSerializer, PagoComprobanteSerializer

class PagoPersonaViewSet(viewsets.ModelViewSet):
    queryset = PagoPersona.objects.all()
    serializer_class = PagoPersonaSerializer

class PagoCambioPersonaViewSet(viewsets.ModelViewSet):
    queryset = PagoCambioPersona.objects.all()
    serializer_class = PagoCambioPersonaSerializer

class PrepagoViewSet(viewsets.ModelViewSet):
    queryset = Prepago.objects.all()
    serializer_class = PrepagoSerializer

class ConceptoContableViewSet(viewsets.ModelViewSet):
    queryset = ConceptoContable.objects.all()
    serializer_class = ConceptoContableSerializer

class ComprobantePagoViewSet(viewsets.ModelViewSet):
    queryset = ComprobantePago.objects.all()
    serializer_class = ComprobantePagoSerializer

class PagoComprobanteViewSet(viewsets.ModelViewSet):
    queryset = PagoComprobante.objects.all()
    serializer_class = PagoComprobanteSerializer
