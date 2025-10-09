"""
Views básicas para autenticación
TODO: El equipo debe implementar la lógica de negocio completa
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import User, Role, RoleAssignment
from .serializers import UserSerializer, RoleSerializer, RoleAssignmentSerializer


class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet para usuarios
    TODO: Implementar permisos, filtros y acciones personalizadas
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Perfil del usuario actual"""
        # TODO: Usar serializer específico para perfil
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def search_by_rut(self, request):
        """Búsqueda por RUT"""
        # TODO: Implementar validación de RUT y filtros
        rut = request.data.get('rut', '')
        users = self.queryset.filter(rut__icontains=rut)[:10]
        serializer = self.get_serializer(users, many=True)
        return Response(serializer.data)


class RoleViewSet(viewsets.ModelViewSet):
    """
    ViewSet para roles
    TODO: Agregar permisos de administrador
    """
    queryset = Role.objects.all()
    serializer_class = RoleSerializer


class RoleAssignmentViewSet(viewsets.ModelViewSet):
    """
    ViewSet para asignación de roles
    TODO: Implementar lógica de permisos y auditoría
    """
    queryset = RoleAssignment.objects.all()
    serializer_class = RoleAssignmentSerializer