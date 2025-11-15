from rest_framework import serializers
from .models import PagoPersona, ComprobantePago, PagoComprobante, PagoCambioPersona, Prepago


class PagoPersonaSerializer(serializers.ModelSerializer):
    class Meta:
        model = PagoPersona
        fields = '__all__'


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
