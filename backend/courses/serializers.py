from rest_framework import serializers
from .models import (
    Curso,
    CursoSeccion,
    CursoCoordinador,
    CursoCuota,
    CursoFecha,
    CursoFormador,
    CursoAlimentacion,
)
from catalog.serializers import RamaSerializer
from personas.serializers import PersonaResponsableSerializer


class CursoSeccionSerializer(serializers.ModelSerializer):
    rama = RamaSerializer(read_only=True)

    class Meta:
        model = CursoSeccion
        fields = "__all__"


class CursoSerializer(serializers.ModelSerializer):
    secciones = CursoSeccionSerializer(many=True, read_only=True)
    persona_responsable = PersonaResponsableSerializer(read_only=True)

<<<<<<< Updated upstream
    class Meta:
        model = Curso
        fields = "__all__"

=======
    # IDs para escritura
    persona_responsable_id = serializers.IntegerField(
        write_only=True, required=False, source="persona_responsable"
    )
    cargo_responsable_id = serializers.IntegerField(
        write_only=True, required=False, source="cargo_responsable"
    )
    comuna_lugar_id = serializers.IntegerField(
        write_only=True, required=False, source="comuna_lugar", allow_null=True
    )
    tipo_curso_id = serializers.IntegerField(
        write_only=True, required=False, source="tipo_curso"
    )
    usuario_id = serializers.IntegerField(
        write_only=True, required=False, source="usuario"
    )

    class Meta:
        model = Curso
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": False, "required": False},
            "fecha_hora": {"required": False},
            "usuario": {"required": False},
        }

    def create(self, validated_data):
        # Si no se proporciona usuario, usar el usuario actual
        if "usuario" not in validated_data and self.context.get("request"):
            validated_data["usuario"] = self.context["request"].user

        # Si no se proporciona fecha_hora, usar la actual
        if "fecha_hora" not in validated_data:
            from django.utils import timezone

            validated_data["fecha_hora"] = timezone.now()

        return super().create(validated_data)
>>>>>>> Stashed changes


class CursoCoordinadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = CursoCoordinador
        fields = "__all__"


class CursoCuotaSerializer(serializers.ModelSerializer):
    class Meta:
        model = CursoCuota
        fields = "__all__"


class CursoFechaSerializer(serializers.ModelSerializer):
    class Meta:
        model = CursoFecha
        fields = "__all__"


class CursoFormadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = CursoFormador
        fields = "__all__"


class CursoAlimentacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CursoAlimentacion
        fields = "__all__"
