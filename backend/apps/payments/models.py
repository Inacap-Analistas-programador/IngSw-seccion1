"""Módulo payments: define los modelos relacionados con pagos y comprobantes.

Este módulo es el núcleo para la gestión financiera de la plataforma, permitiendo
registrar pagos, gestionar saldos a favor, emitir comprobantes y auditar cambios.
"""
from django.db import models
from django.utils import timezone
from django.conf import settings



class PagoPersona(models.Model):
    """
    Almacena un registro de pago monetario asociado a una persona y un curso.
    Este modelo es la base para registrar cualquier transacción financiera individual.

    Ejemplo de uso:
    - Un tesorero registra el pago de la cuota de inscripción de un scout.
    - Se registra una devolución de dinero a un participante.

    Relaciones con otros modelos:
    - `User`: A través de `USU_ID`, para saber qué usuario del sistema registró el pago.
    - `PagoCambioPersona`: Si este pago se transfiere a otra persona, se crea un registro en `PagoCambioPersona`.
    - `Prepago`: Un pago puede generar un saldo a favor que se registra como un `Prepago`.
    - `PagoComprobante`: Este pago puede estar respaldado por uno o más `ComprobantePago`.
    """
    PAP_ID = models.AutoField(primary_key=True, help_text="Identificador único del pago.")
    PER_ID = models.IntegerField(help_text="ID de la persona que realiza o recibe el pago. FK al modelo de Personas.")
    CUR_ID = models.IntegerField(help_text="ID del curso asociado al pago. Futura FK al modelo de Cursos.")
    USU_ID = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='pagos_realizados', help_text="Usuario que registra la transacción.")
    PAP_FECHA_HORA = models.DateTimeField(default=timezone.now)
    PAP_TIPO = models.IntegerField(choices=[(1, 'Ingreso'), (2, 'Egreso')], default=1)
    PAP_VALOR = models.DecimalField(max_digits=21, decimal_places=6, help_text="Monto del pago")
    PAP_OBSERVACION = models.CharField(max_length=255, blank=True)

    # nullable migration FKs (non-destructive)
    PER_FK = models.ForeignKey('authentication.User', null=True, blank=True, on_delete=models.SET_NULL, related_name='pagos_persona_per_fk', db_column='PER_FK')
    CUR_FK = models.ForeignKey('courses.Course', null=True, blank=True, on_delete=models.SET_NULL, related_name='pagos_persona_cur_fk', db_column='CUR_FK')

    class Meta:
        db_table = 'pago_persona'
        verbose_name = 'Pago de Persona'
        verbose_name_plural = 'Pagos de Personas'
        ordering = ['-PAP_FECHA_HORA']

    def __str__(self):
        return f"Pago {self.PAP_ID} - Persona ID {self.PER_ID} por ${self.PAP_VALOR}"
    
    # Optional foreign keys to gradually migrate from integer IDs to relations.
    # These are nullable and non-destructive: keep the legacy integer PER_ID/CUR_ID
    # while allowing a safe migration path to actual FK relations.
    PER_FK = models.ForeignKey(
        'personas.Persona',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='pagos_persona_per_fk',
        help_text='(Nullable) FK to Persona when available',
        db_column='PER_FK',
    )

    CUR_FK = models.ForeignKey(
        'courses.Course',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='pagos_persona_cur_fk',
        help_text='(Nullable) FK to Course when available',
        db_column='CUR_FK',
    )

    def get_persona(self):
        """Return linked Persona object if present or try best-effort lookup by PER_ID."""
        if getattr(self, 'PER_FK', None):
            return self.PER_FK
        try:
            from apps.personas.models import Persona

            return Persona.objects.filter(pk=self.PER_ID).first()
        except Exception:
            return None

    def get_course(self):
        """Return linked Course object if present or try best-effort lookup by CUR_ID."""
        if getattr(self, 'CUR_FK', None):
            return self.CUR_FK
        try:
            from apps.courses.models import Course

            return Course.objects.filter(pk=self.CUR_ID).first()
        except Exception:
            return None

class PagoCambioPersona(models.Model):
    PCP_ID = models.AutoField(primary_key=True)
    PER_ID = models.IntegerField()
    PAP_ID = models.ForeignKey(PagoPersona, on_delete=models.PROTECT, related_name='cambios_pago')
    USU_ID = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='cambios_pago_realizados')
    PCP_FECHA_HORA = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'pago_cambio_persona'
        verbose_name = 'Historial de Cambio de Pago'
        verbose_name_plural = 'Historiales de Cambios de Pago'
        ordering = ['-PCP_FECHA_HORA']

    def __str__(self):
        return f"Cambio {self.PCP_ID}: Pago {self.PAP_ID_id} transferido a Persona {self.PER_ID}"


class Prepago(models.Model):
    PPA_ID = models.AutoField(primary_key=True)
    PER_ID = models.IntegerField()
    CUR_ID = models.IntegerField()
    PAP_ID = models.ForeignKey(PagoPersona, on_delete=models.SET_NULL, null=True, blank=True, related_name='prepago_asociado')
    PPA_VALOR = models.DecimalField(max_digits=21, decimal_places=6)
    PPA_OBSERVACION = models.TextField(blank=True)
    PPA_VIGENTE = models.BooleanField(default=True)

    class Meta:
        db_table = 'prepago'
        verbose_name = 'Prepago (Saldo a Favor)'
        verbose_name_plural = 'Prepagos (Saldos a Favor)'
        ordering = ['-PPA_ID']

    def __str__(self):
        estado = 'Vigente' if self.PPA_VIGENTE else 'Utilizado'
        return f"Prepago {self.PPA_ID} de ${self.PPA_VALOR} para Persona {self.PER_ID} ({estado})"


class ConceptoContable(models.Model):
    COC_ID = models.AutoField(primary_key=True)
    COC_DESCRIPCION = models.CharField(max_length=100, unique=True)
    COC_VIGENTE = models.BooleanField(default=True)

    class Meta:
        db_table = 'concepto_contable'
        verbose_name = 'Concepto Contable'
        verbose_name_plural = 'Conceptos Contables'
        ordering = ['COC_DESCRIPCION']

    def __str__(self):
        return self.COC_DESCRIPCION


class ComprobantePago(models.Model):
    CPA_ID = models.AutoField(primary_key=True)
    USU_ID = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='comprobantes_creados')
    PEC_ID = models.IntegerField()
    COC_ID = models.ForeignKey(ConceptoContable, on_delete=models.PROTECT, related_name='comprobantes_concepto')
    CPA_FECHA_HORA = models.DateTimeField(default=timezone.now)
    CPA_FECHA = models.DateField(default=timezone.localdate)
    CPA_NUMERO = models.IntegerField(unique=True)
    CPA_VALOR = models.DecimalField(max_digits=21, decimal_places=6)

    class Meta:
        db_table = 'comprobante_pago'
        verbose_name = 'Comprobante de Pago'
        verbose_name_plural = 'Comprobantes de Pagos'
        ordering = ['-CPA_FECHA', '-CPA_NUMERO']

    def __str__(self):
        return f"Comprobante N°{self.CPA_NUMERO} por ${self.CPA_VALOR}"


class PagoComprobante(models.Model):
    PCO_ID = models.AutoField(primary_key=True)
    PAP_ID = models.ForeignKey(PagoPersona, on_delete=models.CASCADE, related_name='pagos_comprobante')
    CPA_ID = models.ForeignKey(ComprobantePago, on_delete=models.CASCADE, related_name='comprobantes_pago')

    class Meta:
        db_table = 'pago_comprobante'
        verbose_name = 'Relación Pago-Comprobante'
        verbose_name_plural = 'Relaciones Pago-Comprobante'
        unique_together = ('PAP_ID', 'CPA_ID')

    def __str__(self):
        return f"Relación {self.PCO_ID}: Pago {self.PAP_ID_id} en Comprobante {self.CPA_ID_id}"


# Compatibility models for newer API tests (Pago, Cuota)
# Note: compatibility 'Pago' and 'Cuota' models removed. The canonical models come from
# PagoPersona / ComprobantePago / PagoComprobante / Prepago as defined above (db_table names
# match legacy schema: pago_persona, comprobante_pago, pago_comprobante, prepago).

# NOTE: Legacy compatibility model `Pago` removed. The canonical payment models
# are `PagoPersona`, `ComprobantePago`, `PagoComprobante`, `Prepago`, etc.
# If you need to remove the old 'payments' table from the DB, a migration
# has been added under migrations/ (delete model). Review before applying.


# Compatibility: provide a minimal legacy `Pago` model so historical migrations
# and tests that import migrations referencing `payments.Pago` can run. This
# is intentionally lightweight and kept only for compatibility during the
# migration phase. It maps to the legacy `payments` table name used previously.
class Pago(models.Model):
    id = models.AutoField(primary_key=True)
    monto = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    medio = models.CharField(max_length=40, null=True)
    referencia = models.CharField(max_length=100, blank=True, null=True)
    notas = models.TextField(blank=True, null=True)
    estado = models.CharField(max_length=30, default="PENDIENTE")
    fecha_pago = models.DateField(null=True, blank=True)
    fecha_vencimiento = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "payments"
        verbose_name = "Legacy Pago (compat)"
        verbose_name_plural = "Legacy Pagos (compat)"

    def __str__(self):
        return f"Legacy Pago {self.id} - {self.monto}"
