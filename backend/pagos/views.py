from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
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
	permission_classes = [IsAuthenticated]


class ComprobantePagoViewSet(viewsets.ModelViewSet):
	queryset = ComprobantePago.objects.all()
	serializer_class = ComprobantePagoSerializer
	permission_classes = [IsAuthenticated]


class PagoComprobanteViewSet(viewsets.ModelViewSet):
	queryset = PagoComprobante.objects.all()
	serializer_class = PagoComprobanteSerializer
	permission_classes = [IsAuthenticated]


class PagoCambioPersonaViewSet(viewsets.ModelViewSet):
	queryset = PagoCambioPersona.objects.all()
	serializer_class = PagoCambioPersonaSerializer
	permission_classes = [IsAuthenticated]


class PrepagoViewSet(viewsets.ModelViewSet):
	queryset = Prepago.objects.all()
	serializer_class = PrepagoSerializer
	permission_classes = [IsAuthenticated]
