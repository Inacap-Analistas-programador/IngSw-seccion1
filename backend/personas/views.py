from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import (
    Persona,
    PersonaGrupo,
    PersonaNivel,
    PersonaFormador,
    PersonaIndividual,
    PersonaVehiculo,
    PersonaCurso,
    PersonaEstadoCurso,
)
from .serializers import (
    PersonaSerializer,
    PersonaGrupoSerializer,
    PersonaNivelSerializer,
    PersonaFormadorSerializer,
    PersonaIndividualSerializer,
    PersonaVehiculoSerializer,
    PersonaCursoSerializer,
    PersonaEstadoCursoSerializer,
)


class PersonaViewSet(viewsets.ModelViewSet):
    queryset = Persona.objects.all()
    serializer_class = PersonaSerializer
    permission_classes = [IsAuthenticated]


class PersonaGrupoViewSet(viewsets.ModelViewSet):
    queryset = PersonaGrupo.objects.all()
    serializer_class = PersonaGrupoSerializer
    permission_classes = [IsAuthenticated]


class PersonaNivelViewSet(viewsets.ModelViewSet):
    queryset = PersonaNivel.objects.all()
    serializer_class = PersonaNivelSerializer
    permission_classes = [IsAuthenticated]


class PersonaFormadorViewSet(viewsets.ModelViewSet):
    queryset = PersonaFormador.objects.all()
    serializer_class = PersonaFormadorSerializer
    permission_classes = [IsAuthenticated]


class PersonaIndividualViewSet(viewsets.ModelViewSet):
    queryset = PersonaIndividual.objects.all()
    serializer_class = PersonaIndividualSerializer
    permission_classes = [IsAuthenticated]


class PersonaVehiculoViewSet(viewsets.ModelViewSet):
    queryset = PersonaVehiculo.objects.all()
    serializer_class = PersonaVehiculoSerializer
    permission_classes = [IsAuthenticated]


class PersonaCursoViewSet(viewsets.ModelViewSet):
    queryset = PersonaCurso.objects.all()
    serializer_class = PersonaCursoSerializer
    permission_classes = [IsAuthenticated]


class PersonaEstadoCursoViewSet(viewsets.ModelViewSet):
    queryset = PersonaEstadoCurso.objects.all()
    serializer_class = PersonaEstadoCursoSerializer
    permission_classes = [IsAuthenticated]