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
	
	def perform_create(self, serializer):
		# Asignar automáticamente el usuario autenticado
		serializer.save(usu_id=self.request.user)
	
	def get_queryset(self):
		# Ordenar por fecha más reciente primero
		return PagoPersona.objects.all().select_related('per_id', 'cur_id', 'usu_id').order_by('-pap_fecha_hora')


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
