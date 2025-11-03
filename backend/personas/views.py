from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from .models import Persona, PersonaIndividual, PersonaNivel, PersonaFormador
from .serializers import PersonaSerializer, PersonaIndividualSerializer, PersonaNivelSerializer, PersonaFormadorSerializer
from .filters import PersonaFilter

class PersonaViewSet(viewsets.ModelViewSet):
    queryset = Persona.objects.select_related(
        'estado_civil', 'comuna', 'usuario'
    ).all()
    serializer_class = PersonaSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = PersonaFilter

class PersonaIndividualViewSet(viewsets.ModelViewSet):
    queryset = PersonaIndividual.objects.select_related(
        'persona', 'cargo', 'distrito', 'zona'
    ).all()
    serializer_class = PersonaIndividualSerializer

class PersonaNivelViewSet(viewsets.ModelViewSet):
    queryset = PersonaNivel.objects.select_related(
        'persona', 'nivel', 'rama'
    ).all()
    serializer_class = PersonaNivelSerializer

class PersonaFormadorViewSet(viewsets.ModelViewSet):
    queryset = PersonaFormador.objects.select_related('persona').all()
    serializer_class = PersonaFormadorSerializer
