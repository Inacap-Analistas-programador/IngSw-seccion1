"""Módulo payments: define los modelos relacionados con pagos y comprobantes.

Este módulo es el núcleo para la gestión financiera de la plataforma, permitiendo
registrar pagos, gestionar saldos a favor, emitir comprobantes y auditar cambios.
"""
from django.db import models
from apps.authentication.models import User
from django.utils import timezone


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

    PAP_ID = models.AutoField(
        primary_key=True, help_text="Identificador único del pago."
    )
    PER_ID = models.IntegerField(
        help_text="ID de la persona que realiza o recibe el pago. FK al modelo de Personas."
    )
    CUR_ID = models.IntegerField(
        help_text="ID del curso asociado al pago. Futura FK al modelo de Cursos."
    )
    USU_ID = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name="pagos_realizados",
        help_text="Usuario que registra la transacción.",
    )
    PAP_FECHA_HORA = models.DateTimeField(
        default=timezone.now,
        help_text="Fecha y hora exactas en que se registra el pago.",
    )
    PAP_TIPO = models.IntegerField(
        choices=[(1, "Ingreso"), (2, "Egreso")],
        default=1,
        help_text="Clasifica el movimiento: 1 para Ingreso (ej. abono) y 2 para Egreso (ej. devolución).",
    )
    PAP_VALOR = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Monto del pago. Debe ser un valor positivo.",
    )
    PAP_OBSERVACION = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text="Notas adicionales sobre el pago (ej. 'Abono 50%').",
    )

    class Meta:
        verbose_name = "Pago de Persona"
        verbose_name_plural = "Pagos de Personas"
        db_table = "PAGO_PERSONA"
        ordering = ["-PAP_FECHA_HORA"]

    def __str__(self):
        return f"Pago {self.PAP_ID} - Persona ID {self.PER_ID} por ${self.PAP_VALOR}"


class PagoCambioPersona(models.Model):
    """
    Registra la transferencia de titularidad de un pago (`PagoPersona`) a una nueva persona.
    Este modelo es crucial para la auditoría, ya que mantiene un historial de todos los cambios
    de responsabilidad sobre un pago.

    Ejemplo de uso:
    - Un padre paga la inscripción de su hijo, pero luego se decide que el pago corresponde a su otro hijo.
      Se crea un registro en este modelo para documentar el cambio.
    """

    PCP_ID = models.AutoField(
        primary_key=True, help_text="Identificador único del registro de cambio."
    )
    PER_ID = models.IntegerField(
        help_text="ID de la nueva persona a la que se le asigna el pago. FK al modelo de Personas."
    )
    PAP_ID = models.ForeignKey(
        PagoPersona,
        on_delete=models.PROTECT,
        related_name="cambios_pago",
        help_text="Pago original que se está transfiriendo.",
    )
    USU_ID = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name="cambios_pago_realizados",
        help_text="Usuario que autorizó y registró el cambio.",
    )
    PCP_FECHA_HORA = models.DateTimeField(
        default=timezone.now, help_text="Fecha y hora en que se realizó el cambio."
    )

    class Meta:
        verbose_name = "Historial de Cambio de Pago"
        verbose_name_plural = "Historiales de Cambios de Pago"
        db_table = "PAGO_CAMBIO_PERSONA"
        ordering = ["-PCP_FECHA_HORA"]

    def __str__(self):
        return f"Cambio {self.PCP_ID}: Pago {self.PAP_ID.PAP_ID} transferido a Persona {self.PER_ID}"


class Prepago(models.Model):
    """
    Representa un saldo a favor (crédito) que una persona tiene para un curso.
    Este saldo puede ser utilizado para cubrir total o parcialmente futuros pagos.

    Ejemplo de uso:
    - Un participante paga $100.000, pero el costo del curso es $80.000. Los $20.000 restantes
      se registran como un prepago a su favor.
    """

    PPA_ID = models.AutoField(
        primary_key=True, help_text="Identificador único del prepago."
    )
    PER_ID = models.IntegerField(
        help_text="ID de la persona a la que pertenece el saldo. FK al modelo de Personas."
    )
    CUR_ID = models.IntegerField(
        help_text="ID del curso donde se puede usar este saldo. FK al modelo de Cursos."
    )
    PAP_ID = models.ForeignKey(
        PagoPersona,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="prepago_asociado",
        help_text="Pago original que generó este saldo a favor (opcional).",
    )
    PPA_VALOR = models.DecimalField(
        max_digits=10, decimal_places=2, help_text="Monto del saldo a favor."
    )
    PPA_OBSERVACION = models.TextField(
        blank=True,
        null=True,
        help_text="Notas sobre el origen o condición del prepago.",
    )
    PPA_VIGENTE = models.BooleanField(
        default=True,
        help_text="Indica si el saldo a favor todavía está disponible para ser usado.",
    )

    class Meta:
        verbose_name = "Prepago (Saldo a Favor)"
        verbose_name_plural = "Prepagos (Saldos a Favor)"
        db_table = "PREPAGO"
        ordering = ["-PPA_ID"]

    def __str__(self):
        estado = "Vigente" if self.PPA_VIGENTE else "Utilizado"
        return f"Prepago {self.PPA_ID} de ${self.PPA_VALOR} para Persona {self.PER_ID} ({estado})"


class ConceptoContable(models.Model):
    """
    Catálogo de conceptos para clasificar los diferentes tipos de transacciones financieras.
    Permite agrupar y reportar los movimientos de dinero según su naturaleza.

    Ejemplo de conceptos:
    - 'Inscripción Anual'
    - 'Cuota de Campamento'
    - 'Donación'
    - 'Venta de Uniforme'
    """

    COC_ID = models.AutoField(
        primary_key=True, help_text="Identificador único del concepto contable."
    )
    COC_DESCRIPCION = models.CharField(
        max_length=100,
        unique=True,
        help_text="Nombre descriptivo del concepto (ej. 'Inscripción Anual').",
    )
    COC_VIGENTE = models.BooleanField(
        default=True,
        help_text="Indica si el concepto está activo y puede ser utilizado en nuevas transacciones.",
    )

    class Meta:
        verbose_name = "Concepto Contable"
        verbose_name_plural = "Conceptos Contables"
        db_table = "CONCEPTO_CONTABLE"
        ordering = ["COC_DESCRIPCION"]

    def __str__(self):
        return self.COC_DESCRIPCION


class ComprobantePago(models.Model):
    """
    Documento formal que respalda una o más operaciones de pago.
    Actúa como un recibo o factura que agrupa transacciones bajo un número único.

    Ejemplo de uso:
    - Se emite un comprobante a un apoderado que incluye el pago de la cuota de dos de sus hijos.
    """

    CPA_ID = models.AutoField(
        primary_key=True, help_text="Identificador único del comprobante."
    )
    USU_ID = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name="comprobantes_creados",
        help_text="Usuario que emitió el comprobante.",
    )
    PEC_ID = models.IntegerField(
        help_text="ID de la Persona-Curso a la que se emite el comprobante. FK a PersonaCurso."
    )
    COC_ID = models.ForeignKey(
        ConceptoContable,
        on_delete=models.PROTECT,
        related_name="comprobantes_concepto",
        help_text="Concepto contable principal del comprobante.",
    )
    CPA_FECHA_HORA = models.DateTimeField(
        default=timezone.now, help_text="Fecha y hora de emisión del comprobante."
    )
    CPA_FECHA = models.DateField(
        default=timezone.localdate,
        help_text="Fecha del comprobante (sin hora) para reportes.",
    )
    CPA_NUMERO = models.IntegerField(
        unique=True, help_text="Número correlativo y único del comprobante."
    )
    CPA_VALOR = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        help_text="Valor total del comprobante, puede ser la suma de varios pagos.",
    )

    class Meta:
        verbose_name = "Comprobante de Pago"
        verbose_name_plural = "Comprobantes de Pagos"
        db_table = "COMPROBANTE_PAGO"
        ordering = ["-CPA_FECHA", "-CPA_NUMERO"]

    def __str__(self):
        return f"Comprobante N°{self.CPA_NUMERO} por ${self.CPA_VALOR}"


class PagoComprobante(models.Model):
    """
    Tabla intermedia que establece una relación muchos a muchos entre `PagoPersona` y `ComprobantePago`.
    Permite que un pago esté asociado a un comprobante y que un comprobante agrupe varios pagos.
    """

    PCO_ID = models.AutoField(
        primary_key=True, help_text="Identificador único de la relación."
    )
    PAP_ID = models.ForeignKey(
        PagoPersona,
        on_delete=models.CASCADE,
        related_name="pagos_comprobante",
        help_text="Pago que forma parte del comprobante.",
    )
    CPA_ID = models.ForeignKey(
        ComprobantePago,
        on_delete=models.CASCADE,
        related_name="comprobantes_pago",
        help_text="Comprobante que agrupa el pago.",
    )

    class Meta:
        verbose_name = "Relación Pago-Comprobante"
        verbose_name_plural = "Relaciones Pago-Comprobante"
        db_table = "PAGO_COMPROBANTE"
        unique_together = ("PAP_ID", "CPA_ID")  # Evita duplicados

    def __str__(self):
        return f"Relación {self.PCO_ID}: Pago {self.PAP_ID.PAP_ID} en Comprobante {self.CPA_ID.CPA_NUMERO}"
