from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import (
    Curso,
    CursoSeccion,
    CursoFecha,
    CursoCuota,
    CursoAlimentacion,
    CursoCoordinador,
    CursoFormador,
)
from .serializers import (
    CursoSerializer,
    CursoSeccionSerializer,
    CursoFechaSerializer,
    CursoCuotaSerializer,
    CursoAlimentacionSerializer,
    CursoCoordinadorSerializer,
    CursoFormadorSerializer,
)


class CursoViewSet(viewsets.ModelViewSet):
    queryset = Curso.objects.all()
    serializer_class = CursoSerializer
    permission_classes = [IsAuthenticated]
    
    def get_permissions(self):
        """
        Allow public list and retrieve for course catalog, require authentication for modifications
        """
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]


class CursoSeccionViewSet(viewsets.ModelViewSet):
    queryset = CursoSeccion.objects.all()
    serializer_class = CursoSeccionSerializer
    permission_classes = [IsAuthenticated]


class CursoFechaViewSet(viewsets.ModelViewSet):
    queryset = CursoFecha.objects.all()
    serializer_class = CursoFechaSerializer
    permission_classes = [IsAuthenticated]


class CursoCuotaViewSet(viewsets.ModelViewSet):
    queryset = CursoCuota.objects.all()
    serializer_class = CursoCuotaSerializer
    permission_classes = [IsAuthenticated]


class CursoAlimentacionViewSet(viewsets.ModelViewSet):
    queryset = CursoAlimentacion.objects.all()
    serializer_class = CursoAlimentacionSerializer
    permission_classes = [IsAuthenticated]


class CursoCoordinadorViewSet(viewsets.ModelViewSet):
    queryset = CursoCoordinador.objects.all()
    serializer_class = CursoCoordinadorSerializer
    permission_classes = [IsAuthenticated]


class CursoFormadorViewSet(viewsets.ModelViewSet):
    queryset = CursoFormador.objects.all()
    serializer_class = CursoFormadorSerializer
    permission_classes = [IsAuthenticated]