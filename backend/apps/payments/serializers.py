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
from .models import (
    PagoPersona,
    PagoCambioPersona,
    Prepago,
    ComprobantePago,
    PagoComprobante,
    ConceptoContable,
)


class ConceptoContableSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo `ConceptoContable`.

    Convierte el modelo de conceptos contables a formato JSON.
    """

    class Meta:
        model = ConceptoContable
        fields = "__all__"


class PagoPersonaSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo `PagoPersona`.

    Incluye todos los campos del modelo y una validación personalizada
    para asegurar que el valor del pago (`PAP_VALOR`) sea siempre positivo.
    """

    class Meta:
        model = PagoPersona
        fields = [
            "PAP_ID",
            "PER_ID",
            "CUR_ID",
            "USU_ID",
            "PAP_FECHA_HORA",
            "PAP_TIPO",
            "PAP_VALOR",
            "PAP_OBSERVACION",
        ]
        read_only_fields = ["PAP_FECHA_HORA", "USU_ID"]

    def validate_PAP_VALOR(self, value):
        """
        Asegura que el valor de un pago sea siempre un número positivo.
        Se ejecuta automáticamente al validar los datos de entrada para este campo.
        """
        if value <= 0:
            raise ValidationError("El valor del pago debe ser mayor a 0.")
        return value


class PagoCambioPersonaSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo `PagoCambioPersona`.

    Utilizado para ver y registrar el historial de transferencias de pagos.
    """

    class Meta:
        model = PagoCambioPersona
        fields = ["PCP_ID", "PER_ID", "PAP_ID", "USU_ID", "PCP_FECHA_HORA"]
        read_only_fields = ["PCP_FECHA_HORA", "USU_ID"]


class PrepagoSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo `Prepago`.

    Maneja la representación de los saldos a favor de las personas.
    """

    class Meta:
        model = Prepago
        fields = "__all__"


class ComprobantePagoSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo `ComprobantePago`.

    Define la representación JSON para los comprobantes de pago.
    """

    # Campo de solo escritura para recibir una lista de IDs de PagoPersona.
    # No se mostrará en la respuesta (GET), solo se usa para la creación (POST).
    pagos_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        help_text="Lista de IDs de los pagos a asociar a este comprobante.",
    )

    class Meta:
        model = ComprobantePago
        fields = [
            "CPA_ID",
            "USU_ID",
            "PEC_ID",
            "COC_ID",
            "CPA_FECHA_HORA",
            "CPA_FECHA",
            "CPA_NUMERO",
            "CPA_VALOR",
            "pagos_ids",  # Incluimos el campo virtual en la lista de campos.
        ]
        # CPA_VALOR ahora es de solo lectura porque se calculará automáticamente.
        read_only_fields = ["CPA_FECHA_HORA", "USU_ID", "CPA_VALOR"]

    @transaction.atomic
    def create(self, validated_data):
        """
        Sobrescribe el método de creación para implementar la lógica de negocio.
        Se envuelve en una transacción atómica para garantizar la integridad de los datos.
        """
        # 1. Extraemos la lista de IDs de pagos del diccionario de datos validados.
        pagos_ids = validated_data.pop("pagos_ids")
        if not pagos_ids:
            raise ValidationError({"pagos_ids": "Esta lista no puede estar vacía."})
        
        # Validar duplicados antes de consultar la base de datos.
        if len(pagos_ids) != len(set(pagos_ids)):
            raise ValidationError(
                {"pagos_ids": "Uno o más IDs de pago no son válidos o están duplicados."}
            )

        # 2. Buscamos los objetos PagoPersona correspondientes a los IDs.
        pagos = PagoPersona.objects.filter(pk__in=pagos_ids)
        if len(pagos) != len(pagos_ids):
            raise ValidationError(
                {
                    "pagos_ids": "Uno o más IDs de pago no son válidos o están duplicados."
                }
            )

        # 3. Calculamos el valor total sumando el valor de cada pago.
        total_valor = sum(pago.PAP_VALOR for pago in pagos)
        validated_data["CPA_VALOR"] = total_valor

        # 4. Creamos la instancia del ComprobantePago.
        # El USU_ID se asigna en la vista con perform_create.
        comprobante = ComprobantePago.objects.create(**validated_data)

        # 5. Creamos las relaciones en la tabla intermedia PagoComprobante.
        # Usamos bulk_create para una inserción eficiente en la base de datos.
        PagoComprobante.objects.bulk_create(
            [PagoComprobante(PAP_ID=pago, CPA_ID=comprobante) for pago in pagos]
        )

        return comprobante

    def validate_pagos_ids(self, value):
        """Validación temprana de la lista de IDs de pagos para lanzar errores en is_valid()."""
        if not value:
            raise ValidationError("Esta lista no puede estar vacía.")

        if len(value) != len(set(value)):
            raise ValidationError(
                "Uno o más IDs de pago no son válidos o están duplicados."
            )

        pagos_count = PagoPersona.objects.filter(pk__in=value).count()
        if pagos_count != len(value):
            raise ValidationError(
                "Uno o más IDs de pago no son válidos o están duplicados."
            )

        return value


class PagoComprobanteSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo `PagoComprobante`.

    Representa la relación entre un pago y un comprobante.
    """

    class Meta:
        model = PagoComprobante
        fields = "__all__"
