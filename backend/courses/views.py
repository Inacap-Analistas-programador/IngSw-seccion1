from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Count
from .models import Curso, Rama, CursoSeccion, CursoCoordinador, CursoCuota, CursoFecha, CursoFormador, CursoAlimentacion
from .serializers import CursoSerializer, CursoSeccionSerializer, CursoCoordinadorSerializer, CursoCuotaSerializer, CursoFechaSerializer, CursoFormadorSerializer, CursoAlimentacionSerializer
from .filters import CursoFilter

class DashboardStatsView(APIView):
    def get(self, request):
        from preinscriptions.models import Preinscripcion
        
        total_cursos = Curso.objects.count()
        cursos_activos = Curso.objects.filter(estado=1).count()
        total_participantes = Preinscripcion.objects.filter(estado=1).count()

        # Participantes por rama
        participantes_por_rama = Rama.objects.annotate(
            num_participantes=Count('cursoseccion__preinscripcion')
        ).values('nombre', 'num_participantes')

        data = {
            'total_cursos': total_cursos,
            'cursos_activos': cursos_activos,
            'total_participantes': total_participantes,
            'participantes_por_rama': list(participantes_por_rama),
        }
        return Response(data)

class CursoViewSet(viewsets.ModelViewSet):
    queryset = Curso.objects.select_related(
        'usuario', 
        'tipo_curso', 
        'persona_responsable', 
        'cargo_responsable', 
        'comuna_lugar'
    ).prefetch_related(
        'secciones__rama'
    ).all()
    serializer_class = CursoSerializer
    filterset_class = CursoFilter

    @action(detail=True, methods=['post'], url_path='change-status')
    def change_status(self, request, pk=None):
        """
        Cambia el estado de un curso.
        Se espera un cuerpo de solicitud con la clave 'estado'.
        """
        curso = self.get_object()
        nuevo_estado = request.data.get('estado')

        if nuevo_estado is None:
            return Response(
                {'error': 'El campo "estado" es requerido.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            curso.estado = int(nuevo_estado)
            curso.save()
            serializer = self.get_serializer(curso)
            return Response(serializer.data)
        except (ValueError, TypeError):
            return Response(
                {'error': 'El valor del estado no es válido.'},
                status=status.HTTP_400_BAD_REQUEST
            )

class CursoSeccionViewSet(viewsets.ModelViewSet):
    queryset = CursoSeccion.objects.all()
    serializer_class = CursoSeccionSerializer

class CursoCoordinadorViewSet(viewsets.ModelViewSet):
    queryset = CursoCoordinador.objects.all()
    serializer_class = CursoCoordinadorSerializer

class CursoCuotaViewSet(viewsets.ModelViewSet):
    queryset = CursoCuota.objects.all()
    serializer_class = CursoCuotaSerializer

class CursoFechaViewSet(viewsets.ModelViewSet):
    queryset = CursoFecha.objects.all()
    serializer_class = CursoFechaSerializer

class CursoFormadorViewSet(viewsets.ModelViewSet):
    queryset = CursoFormador.objects.all()
    serializer_class = CursoFormadorSerializer

class CursoAlimentacionViewSet(viewsets.ModelViewSet):
    queryset = CursoAlimentacion.objects.all()
    serializer_class = CursoAlimentacionSerializer
