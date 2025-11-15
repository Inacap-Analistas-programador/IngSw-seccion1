from rest_framework import viewsets
from .models import PagoPersona, ComprobantePago, PagoComprobante, PagoCambioPersona, Prepago
from .serializers import (
	PagoPersonaSerializer,
	ComprobantePagoSerializer,
	PagoComprobanteSerializer,
	PagoCambioPersonaSerializer,
	PrepagoSerializer,
)


class PagoPersonaViewSet(viewsets.ModelViewSet):
	queryset = PagoPersona.objects.all()
	serializer_class = PagoPersonaSerializer


class ComprobantePagoViewSet(viewsets.ModelViewSet):
	queryset = ComprobantePago.objects.all()
	serializer_class = ComprobantePagoSerializer


class PagoComprobanteViewSet(viewsets.ModelViewSet):
	queryset = PagoComprobante.objects.all()
	serializer_class = PagoComprobanteSerializer


class PagoCambioPersonaViewSet(viewsets.ModelViewSet):
	queryset = PagoCambioPersona.objects.all()
	serializer_class = PagoCambioPersonaSerializer


class PrepagoViewSet(viewsets.ModelViewSet):
	queryset = Prepago.objects.all()
	serializer_class = PrepagoSerializer
