from rest_framework import serializers
from .models import Preinscripcion, PreinscripcionEstadoLog, CupoConfiguracion, Documento
from personas.models import Persona
from cursos.models import Curso
from geografia.models import Grupo
from maestros.models import Rama


class PreinscripcionSerializer(serializers.ModelSerializer):
    # Read-only fields for display
    persona_nombre = serializers.SerializerMethodField()
    persona_email = serializers.SerializerMethodField()
    persona_telefono = serializers.SerializerMethodField()
    curso_nombre = serializers.SerializerMethodField()
    grupo_nombre = serializers.SerializerMethodField()
    rama_nombre = serializers.SerializerMethodField()
    
    class Meta:
        model = Preinscripcion
        fields = [
            'id', 'persona', 'curso', 'estado', 'rama', 'grupo_asignado',
            'cuota_asignada', 'habilitado_por', 'habilitado_fecha',
            'confirmado_por_pago', 'en_lista_espera', 'motivo_rechazo',
            # Vehicle fields
            'vehiculo', 'vehiculo_marca', 'vehiculo_modelo', 'vehiculo_patente',
            'version_optimistic_lock', 'created_at', 'updated_at',
            # Display fields
            'persona_nombre', 'persona_email', 'persona_telefono',
            'curso_nombre', 'grupo_nombre', 'rama_nombre',
        ]
        read_only_fields = ['created_at', 'updated_at', 'habilitado_fecha']
    
    def get_persona_nombre(self, obj):
        return f"{obj.persona.per_nombres} {obj.persona.per_apelpat} {obj.persona.per_apelmat or ''}".strip()
    
    def get_persona_email(self, obj):
        return obj.persona.per_email
    
    def get_persona_telefono(self, obj):
        return obj.persona.per_fono
    
    def get_curso_nombre(self, obj):
        return obj.curso.cur_descripcion
    
    def get_grupo_nombre(self, obj):
        return obj.grupo_asignado.gru_descripcion if obj.grupo_asignado else None
    
    def get_rama_nombre(self, obj):
        return obj.rama.ram_descripcion if obj.rama else None


class PreinscripcionEstadoLogSerializer(serializers.ModelSerializer):
    cambiado_por_username = serializers.CharField(
        source='cambiado_por.usu_username',
        read_only=True
    )
    
    class Meta:
        model = PreinscripcionEstadoLog
        fields = [
            'id', 'preinscripcion', 'estado_anterior', 'estado_nuevo',
            'fecha', 'cambiado_por', 'cambiado_por_username', 'detalle'
        ]
        read_only_fields = ['fecha']


class CupoConfiguracionSerializer(serializers.ModelSerializer):
    curso_nombre = serializers.CharField(
        source='curso.cur_descripcion',
        read_only=True
    )
    rol_nombre = serializers.CharField(
        source='rol.rol_descripcion',
        read_only=True
    )
    rama_nombre = serializers.CharField(
        source='rama.ram_descripcion',
        read_only=True
    )
    cupo_disponible = serializers.SerializerMethodField()
    
    class Meta:
        model = CupoConfiguracion
        fields = [
            'id', 'curso', 'rol', 'rama', 'cupo_total', 'cupo_usado',
            'curso_nombre', 'rol_nombre', 'rama_nombre', 'cupo_disponible'
        ]
    
    def get_cupo_disponible(self, obj):
        return obj.cupo_total - obj.cupo_usado


class DocumentoSerializer(serializers.ModelSerializer):
    persona_nombre = serializers.SerializerMethodField()
    
    class Meta:
        model = Documento
        fields = [
            'id', 'persona', 'archivo_relacionado', 'archivo', 'tipo_documento',
            'numero', 'file_size', 'uploaded_at', 'verified',
            'persona_nombre'
        ]
        read_only_fields = ['uploaded_at']
    
    def get_persona_nombre(self, obj):
        return f"{obj.persona.per_nombres} {obj.persona.per_apelpat}"
