from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import HttpResponse
import csv
from .models import Persona
from .serializers import PersonaSerializer

from rest_framework.permissions import AllowAny

class PersonaViewSet(viewsets.ModelViewSet):
    queryset = Persona.objects.all()
    serializer_class = PersonaSerializer
    permission_classes = [AllowAny]

    @action(detail=False, methods=['get'])
    def export(self, request):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="personas.csv"'
        writer = csv.writer(response)
        writer.writerow(['ID', 'Nombres', 'Email'])
        for persona in self.get_queryset():
            writer.writerow([persona.id, persona.nombres, persona.email])
        return response
