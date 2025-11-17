from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Usuario, PerfilAplicacion
from maestros.models import Perfil, Aplicacion
from .serializers import (
    UsuarioSerializer,
    PerfilSerializer,
    AplicacionSerializer,
    PerfilAplicacionSerializer,
)


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated]


class PerfilViewSet(viewsets.ModelViewSet):
    queryset = Perfil.objects.all()
    serializer_class = PerfilSerializer
    permission_classes = [IsAuthenticated]


class AplicacionViewSet(viewsets.ModelViewSet):
    queryset = Aplicacion.objects.all()
    serializer_class = AplicacionSerializer
    permission_classes = [IsAuthenticated]


class PerfilAplicacionViewSet(viewsets.ModelViewSet):
    queryset = PerfilAplicacion.objects.all()
    serializer_class = PerfilAplicacionSerializer
    permission_classes = [IsAuthenticated]

