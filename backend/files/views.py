from rest_framework import viewsets
from .models import Archivo, ArchivoCurso, ArchivoPersona
from .serializers import ArchivoSerializer, ArchivoCursoSerializer, ArchivoPersonaSerializer

class ArchivoViewSet(viewsets.ModelViewSet):
    queryset = Archivo.objects.all()
    serializer_class = ArchivoSerializer

class ArchivoCursoViewSet(viewsets.ModelViewSet):
    queryset = ArchivoCurso.objects.all()
    serializer_class = ArchivoCursoSerializer

class ArchivoPersonaViewSet(viewsets.ModelViewSet):
    queryset = ArchivoPersona.objects.all()
    serializer_class = ArchivoPersonaSerializer
