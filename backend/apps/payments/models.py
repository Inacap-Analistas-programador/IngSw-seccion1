"""
Modelos para gestión de pagos
Sistema de Gestión Integral de Cursos Scout
"""

from django.db import models
from django.contrib.auth import get_user_model
from decimal import Decimal

User = get_user_model()


class Pago(models.Model):
    """
    Registro de pago asociado a una preinscripción
    """

    # Estados del pago
    ESTADOS = [
        ("PENDIENTE", "Pendiente"),
        ("VERIFICANDO", "Verificando"),
        ("PAGADO", "Pagado"),
        ("FALLIDO", "Fallido"),
        ("ANULADO", "Anulado"),
        ("REEMBOLSADO", "Reembolsado"),
    ]

    # Medios de pago
    MEDIOS = [
        ("TRANSFERENCIA", "Transferencia Bancaria"),
        ("TARJETA", "Tarjeta de Crédito/Débito"),
        ("EFECTIVO", "Efectivo"),
        ("CHEQUE", "Cheque"),
        ("WEBPAY", "WebPay Plus"),
        ("OTRO", "Otro"),
    ]

    # Relación con preinscripción
    preinscripcion = models.ForeignKey(
        "preinscriptions.Preinscripcion", on_delete=models.CASCADE, related_name="pagos"
    )

    # Información del pago
    monto = models.DecimalField(max_digits=12, decimal_places=2)
    medio = models.CharField(max_length=40, choices=MEDIOS)
    referencia = models.CharField(
        max_length=100,
        blank=True,
        help_text="Número de transferencia, transacción, etc.",
    )
    notas = models.TextField(blank=True)

    # Estado y seguimiento
    estado = models.CharField(max_length=15, choices=ESTADOS, default="PENDIENTE")

    # Fechas importantes
    fecha_pago = models.DateField(
        null=True, blank=True, help_text="Fecha en que se realizó el pago"
    )
    fecha_vencimiento = models.DateField(
        null=True, blank=True, help_text="Fecha límite para el pago"
    )

    # Auditoría
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    registrado_por = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="pagos_registrados",
    )

    class Meta:
        db_table = "payments"
        verbose_name = "Pago"
        verbose_name_plural = "Pagos"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Pago {self.id} - {self.preinscripcion.user.get_full_name()} - ${self.monto}"

    @property
    def esta_pagado(self):
        """Verifica si el pago está completado"""
        return self.estado == "PAGADO"

    @property
    def puede_anular(self):
        """Verifica si el pago puede ser anulado"""
        return self.estado in ["PENDIENTE", "VERIFICANDO"]


class Cuota(models.Model):
    """
    Cuotas de un pago (para pagos fraccionados)
    """

    pago = models.ForeignKey(Pago, on_delete=models.CASCADE, related_name="cuotas")

    numero = models.PositiveIntegerField(help_text="Número de cuota (1, 2, 3...)")
    monto = models.DecimalField(max_digits=12, decimal_places=2)
    vencimiento = models.DateField()

    # Estado de la cuota
    pagada = models.BooleanField(default=False)
    pagada_at = models.DateTimeField(null=True, blank=True)
    referencia_pago = models.CharField(max_length=100, blank=True)

    class Meta:
        db_table = "payment_installments"
        verbose_name = "Cuota"
        verbose_name_plural = "Cuotas"
        unique_together = ("pago", "numero")
        ordering = ["pago_id", "numero"]

    def __str__(self):
        return f"Cuota {self.numero}/{self.pago.cuotas.count()} - ${self.monto}"

    @property
    def esta_vencida(self):
        """Verifica si la cuota está vencida"""
        from django.utils import timezone

        return not self.pagada and self.vencimiento < timezone.now().date()


class ComprobanteDescarga(models.Model):
    """
    Registro de descargas de comprobantes
    """

    pago = models.ForeignKey(Pago, on_delete=models.CASCADE, related_name="descargas")
    usuario = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="descargas_comprobantes"
    )

    descargado_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    class Meta:
        db_table = "payment_receipt_downloads"
        verbose_name = "Descarga de Comprobante"
        verbose_name_plural = "Descargas de Comprobantes"

    def __str__(self):
        return f"Descarga - Pago {self.pago.id} por {self.usuario.username}"
