from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
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
    
    def get_permissions(self):
        """
        Allow public POST for pre-registration, require authentication for other operations
        """
        if self.action in ['create', 'search_by_rut']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        queryset = Persona.objects.all()
        if self.request.query_params.get('all') == 'true':
            self.pagination_class = None
        return queryset

    @action(detail=False, methods=['get'], url_path='search-by-rut')
    def search_by_rut(self, request):
        rut = request.query_params.get('rut')
        if not rut:
            return Response({'error': 'RUT parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Clean RUT: remove dots, take part before hyphen
        rut_clean = rut.replace('.', '').split('-')[0]
        
        try:
            rut_int = int(rut_clean)
            persona = Persona.objects.filter(per_run=rut_int).first()
            if persona:
                serializer = self.get_serializer(persona)
                return Response(serializer.data)
            else:
                return Response({'message': 'Persona not found'}, status=status.HTTP_404_NOT_FOUND)
        except ValueError:
            return Response({'error': 'Invalid RUT format'}, status=status.HTTP_400_BAD_REQUEST)


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