from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import FileResponse
from .models import File
from .serializers import FileSerializer
import mimetypes
import os

class FileViewSet(viewsets.ModelViewSet):
    queryset = File.objects.all()
    serializer_class = FileSerializer

    def perform_create(self, serializer):
        file_obj = self.request.FILES['file']
        # Get file type using mimetypes
        file_type, _ = mimetypes.guess_type(file_obj.name)
        if not file_type:
            file_type = 'application/octet-stream'
        
        serializer.save(
            uploaded_by=self.request.user,
            size=file_obj.size,
            type=file_type
        )

    @action(detail=False, methods=['post'], url_path='upload')
    def upload(self, request):
        """Dedicated upload endpoint: POST /api/files/upload/"""
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

        filename = request.data.get('filename') or file_obj.name
        related_to = request.data.get('related_to')

        # Prepare serializer data (size/type/uploaded_by set on save)
        serializer = self.get_serializer(data={
            'filename': filename,
            'file': file_obj,
            'related_to': related_to,
        })
        serializer.is_valid(raise_exception=True)

        file_type, _ = mimetypes.guess_type(file_obj.name)
        if not file_type:
            file_type = 'application/octet-stream'

        instance = serializer.save(
            uploaded_by=request.user,
            size=file_obj.size,
            type=file_type,
        )

        return Response(self.get_serializer(instance).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        file_obj = self.get_object()
        file_path = file_obj.file.path
        
        if os.path.exists(file_path):
            response = FileResponse(open(file_path, 'rb'))
            response['Content-Disposition'] = f'attachment; filename="{file_obj.filename}"'
            response['Content-Type'] = file_obj.type
            return response
        return Response(
            {'error': 'File not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
