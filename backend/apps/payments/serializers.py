from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import Payment
from apps.preinscriptions.models import Preinscripcion

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'

    def validate_amount(self, value):
        if value <= 0:
            raise ValidationError("El monto debe ser mayor a 0.")
        return value

    def validate_preinscription(self, value):
        # Ensure the preinscription exists and is in an 'APROBADA' state
        if not value.estado == Preinscripcion.APROBADA:
            raise ValidationError("La preinscripción debe estar aprobada para recibir pagos.")
        return value
