"""
Views para el módulo de pagos
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from .models import Pago, Cuota
from .serializers import (
    PagoSerializer, PagoDetailSerializer, PagoCreateSerializer,
    CuotaSerializer, CuotaCreateSerializer
)


class PagoViewSet(viewsets.ModelViewSet):
    """ViewSet para pagos"""
    
    queryset = Pago.objects.all()
    serializer_class = PagoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchBackend, filters.OrderingFilter]
    filterset_fields = ['estado', 'medio', 'preinscripcion__course']
    search_fields = [
        'preinscripcion__user__first_name', 
        'preinscripcion__user__last_name', 
        'preinscripcion__user__rut',
        'referencia'
    ]
    ordering_fields = ['created_at', 'fecha_pago', 'monto']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return PagoCreateSerializer
        elif self.action == 'retrieve':
            return PagoDetailSerializer
        return PagoSerializer
    
    def perform_create(self, serializer):
        serializer.save(registrado_por=self.request.user)
    
    @action(detail=True, methods=['patch'])
    def cambiar_estado(self, request, pk=None):
        """Cambia el estado de un pago"""
        pago = self.get_object()
        nuevo_estado = request.data.get('estado')
        
        if nuevo_estado not in dict(Pago.ESTADOS):
            return Response(
                {'error': 'Estado inválido'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        pago.estado = nuevo_estado
        pago.save()
        
        serializer = self.get_serializer(pago)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def crear_cuotas(self, request, pk=None):
        """Crea cuotas para un pago"""
        pago = self.get_object()
        cuotas_data = request.data.get('cuotas', [])
        
        # Validar que no existan cuotas ya
        if pago.cuotas.exists():
            return Response(
                {'error': 'El pago ya tiene cuotas asignadas'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        created_cuotas = []
        for cuota_data in cuotas_data:
            cuota_data['pago'] = pago.id
            serializer = CuotaCreateSerializer(data=cuota_data)
            if serializer.is_valid():
                cuota = serializer.save(pago=pago)
                created_cuotas.append(cuota)
            else:
                # Si hay error, eliminar cuotas ya creadas
                for c in created_cuotas:
                    c.delete()
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(
            CuotaSerializer(created_cuotas, many=True).data,
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=False, methods=['get'])
    def mis_pagos(self, request):
        """Obtiene los pagos del usuario actual"""
        pagos = self.queryset.filter(preinscripcion__user=request.user)
        serializer = self.get_serializer(pagos, many=True)
        return Response(serializer.data)