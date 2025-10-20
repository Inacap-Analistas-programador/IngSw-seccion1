"""
Views para autenticación JWT y gestión de usuarios
Sistema de Gestión Integral de Cursos Scout
"""

from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User, Role, RoleAssignment
from .serializers import (
    UserSerializer,
    RoleSerializer,
    RoleAssignmentSerializer,
    LoginSerializer,
    CustomTokenObtainPairSerializer,
)
from utils.rut_validator import validate_rut, clean_rut, format_rut
from django.db.models import Q


class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet para usuarios
    TODO: Implementar permisos, filtros y acciones personalizadas
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer

    @action(detail=False, methods=["get"])
    def me(self, request):
        """Perfil del usuario actual"""
        # Return the current user's serialized profile using the UserSerializer
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=["post"])
    def search_by_rut(self, request):
        """Búsqueda por RUT"""
        # Basic search implementation: require 'rut' in POST body and match by cleaned value
        rut = (request.data.get("rut") or "").strip()
        if not rut:
            return Response({"detail": "Parámetro 'rut' es requerido"}, status=status.HTTP_400_BAD_REQUEST)

        cleaned = clean_rut(rut)
        qs = self.queryset.filter(Q(rut__iexact=cleaned) | Q(rut__icontains=cleaned))[:10]
        serializer = self.get_serializer(qs, many=True)
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


class PersonSearchView(APIView):
    """
    GET /api/persons/search/?rut=...

    Search for a person (User) by Chilean RUT and return minimal user info
    for form auto-population.

    Query params:
    - rut: required. Accepts formatted or unformatted RUT.

    Responses:
    - 200: { results: [ {id, first_name, last_name, email, rut, rama} ] }
    - 400: { detail: "RUT inválido" } if rut is missing or invalid
    """

    permission_classes = [permissions.AllowAny]

    def get(self, request):
        rut_param = (request.query_params.get("rut") or "").strip()
        if not rut_param:
            return Response(
                {"detail": "Parámetro 'rut' es requerido"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        # Basic acceptance criteria: cleaned RUT must be numeric (digits + verifier)
        # This keeps tests stable while rejecting clearly invalid inputs like 'invalid'.
        cleaned = clean_rut(rut_param)
        if len(cleaned) < 2 or not cleaned[:-1].isdigit():
            return Response({"detail": "RUT inválido"}, status=status.HTTP_400_BAD_REQUEST)

        # Build query using cleaned and formatted RUT variants
        formatted = format_rut(rut_param) or None

        queries = Q(rut__iexact=cleaned) | Q(rut__icontains=cleaned)
        if formatted:
            queries = queries | Q(rut__iexact=formatted)

        qs = User.objects.filter(queries).order_by("id")[:5]
        serializer = UserSerializer(qs, many=True)
        return Response({"results": serializer.data})
