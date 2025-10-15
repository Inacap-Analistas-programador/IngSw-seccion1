"""
Serializers básicos para preinscripciones
TODO: El equipo debe completar validaciones y campos calculados
"""

from rest_framework import serializers
from .models import Preinscripcion


class PreinscripcionSerializer(serializers.ModelSerializer):
    """
    Serializer básico para preinscripciones
    TODO: Agregar campos de información del usuario y curso
    """

    class Meta:
        model = Preinscripcion
        fields = [
            "id",
            "user",
            "course",
            "estado",
            "observaciones",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class PreinscripcionCreateSerializer(serializers.ModelSerializer):
    """
    Serializer para crear preinscripciones
    """

    class Meta:
        model = Preinscripcion
        fields = ["user", "course", "observaciones"]

    def validate(self, data):
        user = data["user"]
        course = data["course"]

        # Validar que no exista preinscripción duplicada
        if Preinscripcion.objects.filter(user=user, course=course).exists():
            raise serializers.ValidationError(
                "Ya existe una preinscripción para este usuario y curso"
            )

        # Validar que el curso esté activo
        if course.status != "ACTIVE":
            raise serializers.ValidationError(
                "No se puede inscribir en un curso inactivo"
            )

        return data


class PreinscripcionUpdateEstadoSerializer(serializers.Serializer):
    """
    Serializer para cambiar estado de preinscripciones
    """

    nuevo_estado = serializers.ChoiceField(choices=Preinscripcion.ESTADOS)
    observaciones = serializers.CharField(required=False, allow_blank=True)
    motivo_rechazo = serializers.CharField(required=False, allow_blank=True)

    def validate_nuevo_estado(self, value):
        """Validar que la transición de estado sea válida"""
        instance = getattr(self, "instance", None)
        if instance and not instance.puede_transicionar(value):
            raise serializers.ValidationError(
                f"No se puede cambiar de {instance.estado} a {value}"
            )
        return value
