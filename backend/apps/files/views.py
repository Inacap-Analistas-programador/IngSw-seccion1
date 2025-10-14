"""
Views para el módulo de archivos
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import FileResponse, Http404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from .models import FileUpload, FileDownload
from .serializers import FileUploadSerializer, FileUploadCreateSerializer


class FileUploadViewSet(viewsets.ModelViewSet):
    """ViewSet para gestión de archivos"""
    
    queryset = FileUpload.objects.all()
    serializer_class = FileUploadSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['tipo', 'estado', 'preinscripcion', 'course', 'uploaded_by']
    search_fields = ['name', 'description', 'original_name']
    ordering_fields = ['uploaded_at', 'name', 'file_size']
    ordering = ['-uploaded_at']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return FileUploadCreateSerializer
        return FileUploadSerializer
    
    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)
    
    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        """Descarga un archivo"""
        file_obj = self.get_object()
        
        # Verificar permisos de descarga
        if not file_obj.puede_descargar(request.user):
            return Response(
                {'error': 'No tiene permisos para descargar este archivo'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Registrar la descarga
        FileDownload.objects.create(
            file=file_obj,
            user=request.user,
            ip_address=self.get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', '')
        )
        
        try:
            # Servir el archivo
            return FileResponse(
                file_obj.file.open('rb'),
                as_attachment=True,
                filename=file_obj.original_name
            )
        except FileNotFoundError:
            raise Http404("Archivo no encontrado")
    
    @action(detail=True, methods=['patch'])
    def verificar(self, request, pk=None):
        """Verifica un archivo (solo staff)"""
        if not request.user.is_staff:
            return Response(
                {'error': 'No tiene permisos para verificar archivos'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        file_obj = self.get_object()
        nuevo_estado = request.data.get('estado')
        notas = request.data.get('verification_notes', '')
        
        if nuevo_estado not in ['APROBADO', 'RECHAZADO']:
            return Response(
                {'error': 'Estado debe ser APROBADO o RECHAZADO'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        from django.utils import timezone
        file_obj.estado = nuevo_estado
        file_obj.verified_by = request.user
        file_obj.verified_at = timezone.now()
        file_obj.verification_notes = notas
        file_obj.save()
        
        serializer = self.get_serializer(file_obj)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def mis_archivos(self, request):
        """Obtiene los archivos del usuario actual"""
        archivos = self.queryset.filter(uploaded_by=request.user)
        serializer = self.get_serializer(archivos, many=True)
        return Response(serializer.data)
    
    def get_client_ip(self, request):
        """Obtiene la IP del cliente"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        return x_forwarded_for.split(',')[0] if x_forwarded_for else request.META.get('REMOTE_ADDR')