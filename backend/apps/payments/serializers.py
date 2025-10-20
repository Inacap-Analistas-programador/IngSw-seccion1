"""
Módulo de Serializers para la aplicación de Pagos.

Este módulo contiene los serializers que convierten los modelos de Django
en formatos de datos como JSON para ser utilizados por la API REST.
Cada serializer se corresponde con un modelo y define qué campos
se deben incluir en su representación.
"""
from rest_framework import serializers
from django.db import transaction
from rest_framework.exceptions import ValidationError
from decimal import Decimal
from django.db.models import Max
from .models import (
    PagoPersona, PagoCambioPersona, Prepago, ComprobantePago, 
    PagoComprobante, ConceptoContable
)


class ConceptoContableSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo `ConceptoContable`.
    
    Convierte el modelo de conceptos contables a formato JSON.
    """
    class Meta:
        model = ConceptoContable
        fields = '__all__'

class PagoPersonaSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo `PagoPersona`.

    Incluye todos los campos del modelo y una validación personalizada
    para asegurar que el valor del pago (`PAP_VALOR`) sea siempre positivo.
    """
    class Meta:
        model = PagoPersona
        fields = [
            'PAP_ID',
            'PER_ID',
            'CUR_ID',
            'USU_ID',
            'PAP_FECHA_HORA',
            'PAP_TIPO',
            'PAP_VALOR',
            'PAP_OBSERVACION'
        ]
        read_only_fields = ['PAP_FECHA_HORA', 'USU_ID']

    def validate_PAP_VALOR(self, value):
        """
        Asegura que el valor de un pago sea siempre un número positivo.
        Se ejecuta automáticamente al validar los datos de entrada para este campo.
        """
        if value <= 0:
            raise ValidationError("El valor del pago debe ser mayor a 0.")
        return value

    def validate(self, attrs):
        """Ensure there's an approved Preinscripcion for the given PER_ID and CUR_ID when creating."""
        if self.instance is None:
            per = attrs.get('PER_ID')
            cur = attrs.get('CUR_ID')
            if per is None or cur is None:
                raise ValidationError('PER_ID and CUR_ID are required.')
            from apps.preinscriptions.models import Preinscripcion
            exists = Preinscripcion.objects.filter(user_id=per, course_id=cur, estado=Preinscripcion.APROBADA).exists()
            if not exists:
                raise ValidationError('No approved preinscripcion for given person and course.')
        return attrs

class PagoCambioPersonaSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo `PagoCambioPersona`.
    
    Utilizado para ver y registrar el historial de transferencias de pagos.
    """
    class Meta:
        model = PagoCambioPersona
        fields = [
            'PCP_ID',
            'PER_ID',
            'PAP_ID',
            'USU_ID',
            'PCP_FECHA_HORA'
        ]
        read_only_fields = ['PCP_FECHA_HORA', 'USU_ID']

class PrepagoSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo `Prepago`.
    
    Maneja la representación de los saldos a favor de las personas.
    """
    class Meta:
        model = Prepago
        fields = '__all__'

class ComprobantePagoSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo `ComprobantePago`.
    
    Define la representación JSON para los comprobantes de pago.
    """
    # Campo de solo escritura para recibir una lista de IDs de PagoPersona.
    # No se mostrará en la respuesta (GET), solo se usa para la creación (POST).
    pagos_ids = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, help_text="Lista de IDs de los pagos a asociar a este comprobante."
    )

    class Meta:
        model = ComprobantePago
        model = ComprobantePago
        fields = [
            'CPA_ID',
            'USU_ID',
            'PEC_ID',
            'COC_ID',
            'CPA_FECHA_HORA',
            'CPA_FECHA',
            'CPA_NUMERO',
            'CPA_VALOR',
            'pagos_ids'  # Incluimos el campo virtual en la lista de campos.
        ]
        # CPA_VALOR ahora es de solo lectura porque se calculará automáticamente.
        read_only_fields = ['CPA_FECHA_HORA', 'USU_ID', 'CPA_VALOR']

    @transaction.atomic
    def create(self, validated_data):
        """
        Sobrescribe el método de creación para implementar la lógica de negocio.
        Se envuelve en una transacción atómica para garantizar la integridad de los datos.
        """
        # 1. Extraemos la lista de IDs de pagos del diccionario de datos validados.
        pagos_ids = validated_data.pop('pagos_ids')
        if not pagos_ids:
            raise ValidationError({"pagos_ids": "Esta lista no puede estar vacía."})

        # 2. Buscamos los objetos PagoPersona correspondientes a los IDs.
        pagos_qs = PagoPersona.objects.filter(pk__in=pagos_ids)
        pagos = list(pagos_qs)
        if len(pagos) != len(set(pagos_ids)):
            raise ValidationError({"pagos_ids": "Uno o más IDs de pago no son válidos o están duplicados."})

        # 2b. Verificamos que ninguno de los pagos ya esté asociado a un comprobante
        assigned = PagoComprobante.objects.filter(PAP_ID__in=pagos_qs).select_related('CPA_ID')
        if assigned.exists():
            conflicto_ids = list(assigned.values_list('PAP_ID', flat=True))
            msg = f"Algunos pagos ya están asignados a comprobantes: {conflicto_ids}" if conflicto_ids else "Pagos ya asignados"
            raise ValidationError({"pagos_ids": msg})

        # 3. Calculamos el valor total sumando el valor de cada pago con Decimal para precisión
        total_valor = sum((p.PAP_VALOR or Decimal('0')) for p in pagos)
        validated_data['CPA_VALOR'] = total_valor

        # 3b. Si no se proporcionó CPA_NUMERO, generar uno secuencial máximo+1
        if not validated_data.get('CPA_NUMERO'):
            max_num = ComprobantePago.objects.aggregate(max=Max('CPA_NUMERO'))['max'] or 0
            validated_data['CPA_NUMERO'] = int(max_num) + 1

        # 4. Creamos la instancia del ComprobantePago (USU_ID debería asignarse en la vista si aplica)
        comprobante = ComprobantePago.objects.create(**validated_data)

        # 5. Creamos las relaciones en la tabla intermedia PagoComprobante.
        relaciones = [PagoComprobante(PAP_ID=pago, CPA_ID=comprobante) for pago in pagos]
        PagoComprobante.objects.bulk_create(relaciones)

        return comprobante

class PagoComprobanteSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo `PagoComprobante`.
    
    Representa la relación entre un pago y un comprobante.
    """
    class Meta:
        model = PagoComprobante
        fields = '__all__'


# Legacy PagoCompatSerializer removed. Use canonical serializers (PagoPersona,
# ComprobantePago, etc.) instead.
