from rest_framework import serializers
from .models import PagoPersona, ComprobantePago, PagoComprobante, PagoCambioPersona, Prepago


class PagoPersonaSerializer(serializers.ModelSerializer):
    # Campos de solo lectura para mostrar información detallada
    persona_nombre = serializers.SerializerMethodField(read_only=True)
    curso_nombre = serializers.SerializerMethodField(read_only=True)
    usuario_nombre = serializers.SerializerMethodField(read_only=True)
    tipo_display = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = PagoPersona
        fields = '__all__'
        read_only_fields = ('usu_id',)  # El usuario se asigna automáticamente
    
    def get_persona_nombre(self, obj):
        if obj.per_id:
            return f"{obj.per_id.per_nombres} {obj.per_id.per_apelpat}"
        return None
    
    def get_curso_nombre(self, obj):
        if obj.cur_id:
            return f"{obj.cur_id.cur_codigo} - {obj.cur_id.cur_descripcion}"
        return None
    
    def get_usuario_nombre(self, obj):
        if obj.usu_id:
            return obj.usu_id.usu_username
        return None
    
    def get_tipo_display(self, obj):
        return "Ingreso" if obj.pap_tipo == 1 else "Egreso"


class ComprobantePagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComprobantePago
        fields = '__all__'


class PagoComprobanteSerializer(serializers.ModelSerializer):
    class Meta:
        model = PagoComprobante
        fields = '__all__'


class PagoCambioPersonaSerializer(serializers.ModelSerializer):
    class Meta:
        model = PagoCambioPersona
        fields = '__all__'


class PrepagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prepago
        fields = '__all__'
