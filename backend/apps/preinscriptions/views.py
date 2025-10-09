"""
Views para el módulo de preinscripciones
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from .models import Preinscripcion
from .serializers import (
    PreinscripcionSerializer, PreinscripcionCreateSerializer,
    PreinscripcionUpdateEstadoSerializer
)


class PreinscripcionViewSet(viewsets.ModelViewSet):
    """ViewSet para preinscripciones"""
    
    queryset = Preinscripcion.objects.all()
    serializer_class = PreinscripcionSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchBackend, filters.OrderingFilter]
    filterset_fields = ['estado', 'course', 'user']
    search_fields = ['user__first_name', 'user__last_name', 'user__rut', 'course__title']
    ordering_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return PreinscripcionCreateSerializer
        return PreinscripcionSerializer
    
    @action(detail=True, methods=['patch'])
    def cambiar_estado(self, request, pk=None):
        """Cambia el estado de una preinscripción"""
        preinscripcion = self.get_object()
        serializer = PreinscripcionUpdateEstadoSerializer(
            instance=preinscripcion, 
            data=request.data
        )
        
        if serializer.is_valid():
            nuevo_estado = serializer.validated_data['nuevo_estado']
            observaciones = serializer.validated_data.get('observaciones', '')
            motivo_rechazo = serializer.validated_data.get('motivo_rechazo', '')
            
            try:
                preinscripcion.cambiar_estado(
                    nuevo_estado=nuevo_estado,
                    processed_by=request.user,
                    observaciones=observaciones
                )
                
                if motivo_rechazo:
                    preinscripcion.motivo_rechazo = motivo_rechazo
                    preinscripcion.save()
                
                return Response(PreinscripcionSerializer(preinscripcion).data)
                
            except ValueError as e:
                return Response(
                    {'error': str(e)}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def mis_preinscripciones(self, request):
        """Obtiene las preinscripciones del usuario actual"""
        preinscripciones = self.queryset.filter(user=request.user)
        serializer = self.get_serializer(preinscripciones, many=True)
        return Response(serializer.data)