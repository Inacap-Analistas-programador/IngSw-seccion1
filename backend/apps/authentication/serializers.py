"""
Serializers para autenticación JWT y gestión de usuarios
Sistema de Gestión Integral de Cursos Scout
"""

from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from .models import User, Role, RoleAssignment


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer básico para usuarios
    TODO: Agregar campos calculados y validaciones
    """

    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "rut", "rama"]
        read_only_fields = ["id"]


class UserCreateSerializer(serializers.ModelSerializer):
    """
    Serializer para crear usuarios
    TODO: Agregar validación de contraseña y confirmación
    """

    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password", "first_name", "last_name", "rut"]

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
        fields = ["id", "code", "name", "description", "is_active"]


class RoleAssignmentSerializer(serializers.ModelSerializer):
    """
    Serializer para asignaciones de roles
    TODO: Agregar información de usuario y rol
    """

    class Meta:
        model = RoleAssignment
        fields = ["id", "user", "role", "assigned_at", "is_active"]


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Serializer personalizado para JWT que incluye información adicional del usuario
    """

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Agregar campos personalizados al token
        token["full_name"] = user.get_full_name()
        token["rut"] = user.rut
        token["rama"] = user.rama
        token["is_staff"] = user.is_staff

        return token

    def validate(self, attrs):
        # Validación estándar de JWT
        data = super().validate(attrs)

        # Agregar información del usuario a la respuesta
        data["user"] = {
            "id": self.user.id,
            "username": self.user.username,
            "email": self.user.email,
            "full_name": self.user.get_full_name(),
            "rut": self.user.rut,
            "rama": self.user.rama,
            "is_staff": self.user.is_staff,
        }

        return data


class LoginSerializer(serializers.Serializer):
    """
    Serializer básico para login sin JWT
    """

    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        username = attrs.get("username")
        password = attrs.get("password")

        if username and password:
            user = authenticate(
                request=self.context.get("request"),
                username=username,
                password=password,
            )

            if not user:
                msg = "No se puede iniciar sesión con las credenciales proporcionadas."
                raise serializers.ValidationError(msg, code="authorization")

            if not user.is_active:
                msg = "La cuenta de usuario está deshabilitada."
                raise serializers.ValidationError(msg, code="authorization")

            attrs["user"] = user
            return attrs
        else:
            msg = 'Se requiere "username" y "password".'
            raise serializers.ValidationError(msg, code="authorization")
