from django.shortcuts import render

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils import timezone
from .models import Preinscripcion, PreinscripcionEstadoLog, CupoConfiguracion, Documento
from .serializers import (
    PreinscripcionSerializer, PreinscripcionEstadoLogSerializer,
    CupoConfiguracionSerializer, DocumentoSerializer
)


class PreinscripcionViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar preinscripciones
    """
    queryset = Preinscripcion.objects.all().select_related(
        'persona', 'curso', 'rama', 'grupo_asignado', 'habilitado_por'
    )
    serializer_class = PreinscripcionSerializer
    permission_classes = [AllowAny]  # Changed temporarily for testing
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by estado
        estado = self.request.query_params.get('estado', None)
        if estado:
            queryset = queryset.filter(estado=estado)
        
        # Filter by curso
        curso_id = self.request.query_params.get('curso', None)
        if curso_id:
            queryset = queryset.filter(curso_id=curso_id)
        
        # Filter by persona
        persona_id = self.request.query_params.get('persona', None)
        if persona_id:
            queryset = queryset.filter(persona_id=persona_id)
        
        return queryset.order_by('-created_at')
    
    def perform_create(self, serializer):
        # Create preinscripcion with initial estado
        preinscripcion = serializer.save()
        
        # Log the initial state
        PreinscripcionEstadoLog.objects.create(
            preinscripcion=preinscripcion,
            estado_anterior='borrador',
            estado_nuevo=preinscripcion.estado,
            cambiado_por=self.request.user if hasattr(self.request, 'user') else None,
            detalle='Preinscripción creada'
        )
    
    def perform_update(self, serializer):
        # Get the old instance
        old_instance = self.get_object()
        old_estado = old_instance.estado
        
        # Update the instance
        preinscripcion = serializer.save()
        
        # Log state change if estado changed
        if old_estado != preinscripcion.estado:
            PreinscripcionEstadoLog.objects.create(
                preinscripcion=preinscripcion,
                estado_anterior=old_estado,
                estado_nuevo=preinscripcion.estado,
                cambiado_por=self.request.user if hasattr(self.request, 'user') else None,
                detalle=f'Estado cambiado de {old_estado} a {preinscripcion.estado}'
            )
    
    @action(detail=True, methods=['get'])
    def estado_log(self, request, pk=None):
        """Get the estado log for a specific preinscripcion"""
        preinscripcion = self.get_object()
        logs = PreinscripcionEstadoLog.objects.filter(
            preinscripcion=preinscripcion
        ).order_by('-fecha')
        serializer = PreinscripcionEstadoLogSerializer(logs, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get statistics about preinscripciones"""
        queryset = self.get_queryset()
        
        stats = {
            'total': queryset.count(),
            'por_estado': {},
            'en_lista_espera': queryset.filter(en_lista_espera=True).count()
        }
        
        # Count by estado
        for choice in Preinscripcion._meta.get_field('estado').choices:
            estado_key = choice[0]
            count = queryset.filter(estado=estado_key).count()
            stats['por_estado'][estado_key] = count
        
        return Response(stats)


class PreinscripcionEstadoLogViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para consultar logs de estado (solo lectura)
    """
    queryset = PreinscripcionEstadoLog.objects.all().select_related(
        'preinscripcion', 'cambiado_por'
    )
    serializer_class = PreinscripcionEstadoLogSerializer
    permission_classes = [AllowAny]  # Changed temporarily for testing
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by preinscripcion
        preinscripcion_id = self.request.query_params.get('preinscripcion', None)
        if preinscripcion_id:
            queryset = queryset.filter(preinscripcion_id=preinscripcion_id)
        
        return queryset.order_by('-fecha')


class CupoConfiguracionViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar configuración de cupos
    """
    queryset = CupoConfiguracion.objects.all().select_related(
        'curso', 'rol', 'rama'
    )
    serializer_class = CupoConfiguracionSerializer
    permission_classes = [AllowAny]  # Changed temporarily for testing
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by curso
        curso_id = self.request.query_params.get('curso', None)
        if curso_id:
            queryset = queryset.filter(curso_id=curso_id)
        
        return queryset


class DocumentoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar documentos de personas
    """
    queryset = Documento.objects.all().select_related(
        'persona', 'archivo_relacionado'
    )
    serializer_class = DocumentoSerializer
    permission_classes = [AllowAny]  # Changed temporarily for testing
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by persona
        persona_id = self.request.query_params.get('persona', None)
        if persona_id:
            queryset = queryset.filter(persona_id=persona_id)
        
        # Filter by tipo_documento
        tipo = self.request.query_params.get('tipo', None)
        if tipo:
            queryset = queryset.filter(tipo_documento=tipo)
        
        return queryset.order_by('-uploaded_at')

