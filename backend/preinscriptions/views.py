from rest_framework import viewsets
from .models import PersonaCurso, PersonaEstadoCurso, PersonaVehiculo
from .serializers import PersonaCursoSerializer, PersonaEstadoCursoSerializer, PersonaVehiculoSerializer

class PersonaCursoViewSet(viewsets.ModelViewSet):
    queryset = PersonaCurso.objects.all()
    serializer_class = PersonaCursoSerializer

class PersonaEstadoCursoViewSet(viewsets.ModelViewSet):
    queryset = PersonaEstadoCurso.objects.all()
    serializer_class = PersonaEstadoCursoSerializer

class PersonaVehiculoViewSet(viewsets.ModelViewSet):
    queryset = PersonaVehiculo.objects.all()
    serializer_class = PersonaVehiculoSerializer
