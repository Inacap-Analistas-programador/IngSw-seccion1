"""
Serializers básicos para autenticación
TODO: El equipo debe completar las validaciones y funcionalidades
"""

from rest_framework import serializers
from .models import User, Role, RoleAssignment


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer básico para usuarios
    TODO: Agregar campos calculados y validaciones
    """
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'rut', 'rama']
        read_only_fields = ['id']


class UserCreateSerializer(serializers.ModelSerializer):
    """
    Serializer para crear usuarios
    TODO: Agregar validación de contraseña y confirmación
    """
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'rut']
    
    def create(self, validated_data):
        # TODO: Implementar validaciones de RUT y contraseña
        user = User.objects.create_user(**validated_data)
        return user


class RoleSerializer(serializers.ModelSerializer):
    """
    Serializer para roles
    TODO: Agregar conteo de asignaciones
    """
    
    class Meta:
        model = Role
        fields = ['id', 'code', 'name', 'description', 'is_active']


class RoleAssignmentSerializer(serializers.ModelSerializer):
    """
    Serializer para asignaciones de roles
    TODO: Agregar información de usuario y rol
    """
    
    class Meta:
        model = RoleAssignment
        fields = ['id', 'user', 'role', 'assigned_at', 'is_active']


class LoginSerializer(serializers.Serializer):
    """
    Serializer para login
    TODO: Implementar autenticación JWT completa
    """
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        # TODO: Validar credenciales y estado del usuario
        return attrs