"""
Serializers para el módulo de pagos
"""

from rest_framework import serializers
from .models import Pago, Cuota, ComprobanteDescarga


class CuotaSerializer(serializers.ModelSerializer):
    """Serializer para cuotas"""

    esta_vencida = serializers.ReadOnlyField()

    class Meta:
        model = Cuota
        fields = [
            "id",
            "numero",
            "monto",
            "vencimiento",
            "pagada",
            "pagada_at",
            "referencia_pago",
            "esta_vencida",
        ]


class PagoSerializer(serializers.ModelSerializer):
    """Serializer básico para pagos"""

    preinscripcion_info = serializers.SerializerMethodField()
    registrado_por_name = serializers.CharField(
        source="registrado_por.get_full_name", read_only=True
    )
    esta_pagado = serializers.ReadOnlyField()
    puede_anular = serializers.ReadOnlyField()

    class Meta:
        model = Pago
        fields = [
            "id",
            "preinscripcion",
            "preinscripcion_info",
            "monto",
            "medio",
            "referencia",
            "notas",
            "estado",
            "fecha_pago",
            "fecha_vencimiento",
            "registrado_por",
            "registrado_por_name",
            "esta_pagado",
            "puede_anular",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "registrado_por"]

    def get_preinscripcion_info(self, obj):
        """Información básica de la preinscripción"""
        return {
            "id": obj.preinscripcion.id,
            "user_name": obj.preinscripcion.user.get_full_name(),
            "user_rut": obj.preinscripcion.user.rut,
            "course_title": obj.preinscripcion.course.title,
            "course_code": obj.preinscripcion.course.code,
        }


class PagoDetailSerializer(PagoSerializer):
    """Serializer detallado para pagos (incluye cuotas)"""

    cuotas = CuotaSerializer(many=True, read_only=True)

    class Meta(PagoSerializer.Meta):
        fields = PagoSerializer.Meta.fields + ["cuotas"]


class PagoCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear pagos"""

    class Meta:
        model = Pago
        fields = [
            "preinscripcion",
            "monto",
            "medio",
            "referencia",
            "notas",
            "fecha_pago",
            "fecha_vencimiento",
        ]

    def validate(self, data):
        """Validaciones para crear pago"""
        preinscripcion = data["preinscripcion"]

        # Verificar que la preinscripción puede recibir pagos
        if not preinscripcion.puede_pagar:
            raise serializers.ValidationError(
                f"La preinscripción debe estar aprobada para recibir pagos. "
                f"Estado actual: {preinscripcion.get_estado_display()}"
            )

        # Verificar monto mínimo
        if data["monto"] <= 0:
            raise serializers.ValidationError("El monto debe ser mayor a 0")

        return data


class CuotaCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear cuotas"""

    class Meta:
        model = Cuota
        fields = ["numero", "monto", "vencimiento"]

    def validate_monto(self, value):
        if value <= 0:
            raise serializers.ValidationError("El monto debe ser mayor a 0")
        return value
