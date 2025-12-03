from rest_framework import serializers
from .models import PagoPersona, ComprobantePago, PagoComprobante, PagoCambioPersona, Prepago
from personas.models import Persona
from django.utils import timezone
from rest_framework import serializers


class PagoPersonaSerializer(serializers.ModelSerializer):
    # Read only person fields for display/search in frontend
    per_run = serializers.SerializerMethodField(read_only=True)
    per_nombres = serializers.SerializerMethodField(read_only=True)
    per_apelpat = serializers.SerializerMethodField(read_only=True)
    # Allow passing cpa_id to link to a comprobante (optional)
    cpa_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    # Allow passing file and concept to auto-generate comprobante
    file = serializers.FileField(write_only=True, required=False, allow_null=True)
    coc_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = PagoPersona
        fields = '__all__'

    def create(self, validated_data):
        validated_data.pop('file', None)
        validated_data.pop('coc_id', None)
        cpa_id = validated_data.pop('cpa_id', None)
        
        payment = super().create(validated_data)
        
        # If a comprobante was provided, create the association
        if cpa_id:
            try:
                comprobante = ComprobantePago.objects.get(cpa_id=cpa_id)
                PagoComprobante.objects.create(pap_id=payment, cpa_id=comprobante)
            except ComprobantePago.DoesNotExist:
                raise serializers.ValidationError({'cpa_id': f'Comprobante cpa_id={cpa_id} no existe.'})
        return payment

    def get_per_run(self, obj):
        return getattr(obj.per_id, 'per_run', None)

    def get_per_nombres(self, obj):
        return getattr(obj.per_id, 'per_nombres', None)

    def get_per_apelpat(self, obj):
        return getattr(obj.per_id, 'per_apelpat', None)

    def validate(self, data):
        # Ensure pap_tipo is present and valid
        pap_tipo = data.get('pap_tipo') or getattr(self.instance, 'pap_tipo', None)
        if pap_tipo not in [PagoPersona.PAP_TIPO_INGRESO, PagoPersona.PAP_TIPO_EGRESO]:
            raise serializers.ValidationError({'pap_tipo': 'pap_tipo debe ser 1 (Ingreso) o 2 (Egreso).'})
        # If pap_tipo is ingreso, encourage comprobante presence (not hard requirement because comprobante management may be separate)
        return data


class ComprobantePagoSerializer(serializers.ModelSerializer):
    persona_nombre_completo = serializers.SerializerMethodField()
    persona_run = serializers.SerializerMethodField()
    curso_nombre = serializers.SerializerMethodField()
    concepto_nombre = serializers.SerializerMethodField()

    class Meta:
        model = ComprobantePago
        fields = '__all__'

    def get_persona_nombre_completo(self, obj):
        try:
            return f"{obj.pec_id.per_id.per_nombres} {obj.pec_id.per_id.per_apelpat}"
        except AttributeError:
            return "Desconocido"

    def get_persona_run(self, obj):
        try:
            return obj.pec_id.per_id.per_run
        except AttributeError:
            return None

    def get_curso_nombre(self, obj):
        try:
            return obj.pec_id.cus_id.cur_id.cur_descripcion
        except AttributeError:
            return "Sin Curso"

    def get_concepto_nombre(self, obj):
        try:
            return obj.coc_id.coc_descripcion
        except AttributeError:
            return "Sin Concepto"


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

