from django.db import models
from personas.models import Persona
from courses.models import Curso
from authentication.models import Usuario
from catalog.models import ConceptoContable
from common.models import PersonaCurso


class PagoPersona(models.Model):
    id = models.DecimalField(
        db_column="pap_id", max_digits=10, decimal_places=0, primary_key=True
    )
    persona = models.ForeignKey(Persona, on_delete=models.RESTRICT, db_column="per_id")
    curso = models.ForeignKey(Curso, on_delete=models.RESTRICT, db_column="cur_id")
    usuario = models.ForeignKey(Usuario, on_delete=models.RESTRICT, db_column="usu_id")
    fecha_hora = models.DateTimeField(db_column="pap_fecha_hora")
    tipo = models.IntegerField(db_column="pap_tipo")
    valor = models.DecimalField(db_column="pap_valor", max_digits=21, decimal_places=6)
    estado = models.IntegerField(db_column="pap_estado")
    observacion = models.CharField(
        db_column="pap_observacion", max_length=100, blank=True, null=True
    )

    class Meta:
        db_table = "pago_persona"


class PagoCambioPersona(models.Model):
    id = models.DecimalField(
        db_column="pcp_id", max_digits=10, decimal_places=0, primary_key=True
    )
    persona = models.ForeignKey(Persona, on_delete=models.RESTRICT, db_column="per_id")
    pago_persona = models.ForeignKey(
        PagoPersona, on_delete=models.RESTRICT, db_column="pap_id"
    )
    usuario = models.ForeignKey(Usuario, on_delete=models.RESTRICT, db_column="usu_id")
    fecha_hora = models.DateTimeField(db_column="pcp_fecha_hora")

    class Meta:
        db_table = "pago_cambio_persona"


class Prepago(models.Model):
    id = models.DecimalField(
        db_column="ppa_id", max_digits=10, decimal_places=0, primary_key=True
    )
    persona = models.ForeignKey(Persona, on_delete=models.RESTRICT, db_column="per_id")
    curso = models.ForeignKey(Curso, on_delete=models.RESTRICT, db_column="cur_id")
    pago_persona = models.ForeignKey(
        PagoPersona,
        on_delete=models.RESTRICT,
        db_column="pap_id",
        blank=True,
        null=True,
    )
    valor = models.DecimalField(db_column="ppa_valor", max_digits=21, decimal_places=6)
    observacion = models.TextField(db_column="ppa_observacion", blank=True, null=True)
    vigente = models.BooleanField(db_column="ppa_vigente")

    class Meta:
        db_table = "prepago"


class ComprobantePago(models.Model):
    id = models.DecimalField(
        db_column="cpa_id", max_digits=10, decimal_places=0, primary_key=True
    )
    usuario = models.ForeignKey(Usuario, on_delete=models.RESTRICT, db_column="usu_id")
    persona_curso = models.ForeignKey(
        PersonaCurso, on_delete=models.RESTRICT, db_column="pec_id"
    )
    concepto_contable = models.ForeignKey(
        ConceptoContable, on_delete=models.RESTRICT, db_column="coc_id"
    )
    fecha_hora = models.DateTimeField(db_column="cpa_fecha_hora")
    fecha = models.DateField(db_column="cpa_fecha")
    numero = models.IntegerField(db_column="cpa_numero")
    valor = models.DecimalField(db_column="cpa_valor", max_digits=21, decimal_places=6)

    class Meta:
        db_table = "comprobante_pago"


class PagoComprobante(models.Model):
    id = models.DecimalField(
        db_column="pco_id", max_digits=10, decimal_places=0, primary_key=True
    )
    pago_persona = models.ForeignKey(
        PagoPersona, on_delete=models.RESTRICT, db_column="pap_id"
    )
    comprobante_pago = models.ForeignKey(
        ComprobantePago, on_delete=models.RESTRICT, db_column="cpa_id"
    )

    class Meta:
        db_table = "pago_comprobante"
