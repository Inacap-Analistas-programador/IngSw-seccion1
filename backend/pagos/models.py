from django.db import models
from usuarios.models import Usuario
from cursos.models import Curso
from personas.models import Persona, PersonaCurso
from maestros.models import ConceptoContable

# Tabla: pago_persona
class PagoPersona(models.Model):
    # pap_id: Identificador único del pago (clave primaria)
    pap_id = models.AutoField(primary_key=True)
    # per_id: Clave foránea a Persona (quien realiza el pago)
    per_id = models.ForeignKey('personas.Persona', on_delete=models.CASCADE, db_column='per_id')
    # cur_id: Clave foránea a Curso (a qué curso se asocia el pago)
    cur_id = models.ForeignKey(Curso, on_delete=models.CASCADE, db_column='cur_id')
    # usu_id: Clave foránea a Usuario (quien registra el pago)
    usu_id = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='usu_id')
    # pap_fecha_hora: Fecha y hora de registro/modificación
    pap_fecha_hora = models.DateTimeField()
    # pap_tipo: Tipo de pago (1: Ingreso, 2: Egreso)
    pap_tipo = models.IntegerField()
    # pap_valor: Monto del pago
    pap_valor = models.DecimalField(max_digits=21, decimal_places=6)
    # pap_observacion: Observaciones sobre el pago
    pap_observacion = models.CharField(max_length=100, null=True, blank=True)

    class Meta:
        db_table = 'pago_persona'
        verbose_name = 'Pago de Persona'
        verbose_name_plural = 'Pagos de Personas'

    def __str__(self):
        return f"Pago {self.pap_id} de {self.per_id} por {self.pap_valor}"

# Tabla: comprobante_pago
class ComprobantePago(models.Model):
    # cpa_id: Identificador único del comprobante (clave primaria)
    cpa_id = models.AutoField(primary_key=True)
    # usu_id: Clave foránea a Usuario (quien emite el comprobante)
    usu_id = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='usu_id')
    # pec_id: Clave foránea a PersonaCurso (inscripción relacionada, si aplica)
    pec_id = models.ForeignKey(PersonaCurso, on_delete=models.CASCADE, db_column='pec_id')
    # coc_id: Clave foránea a ConceptoContable (concepto del pago)
    coc_id = models.ForeignKey(ConceptoContable, on_delete=models.CASCADE, db_column='coc_id')
    # cpa_fecha_hora: Fecha y hora de emisión del comprobante
    cpa_fecha_hora = models.DateTimeField()
    # cpa_fecha: Fecha del comprobante
    cpa_fecha = models.DateField()
    # cpa_numero: Número del comprobante
    cpa_numero = models.IntegerField()
    # cpa_valor: Valor total del comprobante
    cpa_valor = models.DecimalField(max_digits=21, decimal_places=6)

    class Meta:
        db_table = 'comprobante_pago'
        verbose_name = 'Comprobante de Pago'
        verbose_name_plural = 'Comprobantes de Pago'

    def __str__(self):
        return f"Comprobante {self.cpa_numero} ({self.cpa_valor})"

# Tabla: pago_comprobante (Tabla de unión entre PagoPersona y ComprobantePago)
class PagoComprobante(models.Model):
    # pco_id: Identificador único de la relación (clave primaria)
    pco_id = models.AutoField(primary_key=True)
    # pap_id: Clave foránea a PagoPersona (relación ManyToOne)
    pap_id = models.ForeignKey(PagoPersona, on_delete=models.CASCADE, db_column='pap_id')
    # cpa_id: Clave foránea a ComprobantePago (relación ManyToOne)
    cpa_id = models.ForeignKey(ComprobantePago, on_delete=models.CASCADE, db_column='cpa_id')

    class Meta:
        db_table = 'pago_comprobante'
        verbose_name = 'Pago asociado a Comprobante'
        verbose_name_plural = 'Pagos asociados a Comprobantes'
        unique_together = ('pap_id', 'cpa_id') # Un pago solo puede estar asociado a un comprobante una vez

    def __str__(self):
        return f"Pago {self.pap_id} con Comprobante {self.cpa_id}"

# Tabla: pago_cambio_persona
class PagoCambioPersona(models.Model):
    # pcp_id: Identificador único del cambio (clave primaria)
    pcp_id = models.AutoField(primary_key=True)
    # per_id: Clave foránea a Persona (persona afectada por el cambio)
    per_id = models.ForeignKey('personas.Persona', on_delete=models.CASCADE, db_column='per_id')
    # pap_id: Clave foránea a PagoPersona (el pago que fue modificado)
    pap_id = models.ForeignKey(PagoPersona, on_delete=models.CASCADE, db_column='pap_id')
    # usu_id: Clave foránea a Usuario (quien realizó el cambio)
    usu_id = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='usu_id')
    # pcp_fecha_hora: Fecha y hora del cambio
    pcp_fecha_hora = models.DateTimeField()

    class Meta:
        db_table = 'pago_cambio_persona'
        verbose_name = 'Cambio en Pago de Persona'
        verbose_name_plural = 'Cambios en Pagos de Personas'

    def __str__(self):
        return f"Cambio en pago {self.pap_id} para {self.per_id} por {self.usu_id}"

# Tabla: prepago
class Prepago(models.Model):
    # ppa_id: Identificador único del prepago (clave primaria)
    ppa_id = models.AutoField(primary_key=True)
    # per_id: Clave foránea a Persona (persona que realiza el prepago)
    per_id = models.ForeignKey('personas.Persona', on_delete=models.CASCADE, db_column='per_id')
    # cur_id: Clave foránea a Curso (curso al que se aplica el prepago)
    cur_id = models.ForeignKey(Curso, on_delete=models.CASCADE, db_column='cur_id')
    # pap_id: Clave foránea a PagoPersona (pago asociado, opcional)
    pap_id = models.ForeignKey(PagoPersona, on_delete=models.CASCADE, db_column='pap_id', null=True, blank=True)
    # ppa_valor: Monto del prepago
    ppa_valor = models.DecimalField(max_digits=21, decimal_places=6)
    # ppa_observacion: Observaciones sobre el prepago
    ppa_observacion = models.TextField(null=True, blank=True)
    # ppa_vigente: Indica si el prepago está activo (True) o inactivo (False)
    ppa_vigente = models.BooleanField()

    class Meta:
        db_table = 'prepago'
        verbose_name = 'Prepago'
        verbose_name_plural = 'Prepagos'

    def __str__(self):
        return f"Prepago {self.ppa_id} de {self.per_id} por {self.ppa_valor} para {self.cur_id}"
