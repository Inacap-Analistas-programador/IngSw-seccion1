from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from .models import Persona, PersonaIndividual, PersonaNivel, PersonaFormador
from .serializers import (
    PersonaSerializer,
    PersonaIndividualSerializer,
    PersonaNivelSerializer,
    PersonaFormadorSerializer,
)
from .filters import PersonaFilter


class PersonaViewSet(viewsets.ModelViewSet):
    queryset = Persona.objects.all()
    serializer_class = PersonaSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = PersonaFilter


class PersonaIndividualViewSet(viewsets.ModelViewSet):
    queryset = PersonaIndividual.objects.all()
    serializer_class = PersonaIndividualSerializer


class PersonaNivelViewSet(viewsets.ModelViewSet):
    queryset = PersonaNivel.objects.all()
    serializer_class = PersonaNivelSerializer


class PersonaFormadorViewSet(viewsets.ModelViewSet):
    queryset = PersonaFormador.objects.all()
    serializer_class = PersonaFormadorSerializer
