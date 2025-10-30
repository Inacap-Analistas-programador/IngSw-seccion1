from django.db import models
from personas.models import Persona
from courses.models import Curso
from authentication.models import Usuario
from preinscriptions.models import PersonaCurso

class ConceptoContable(models.Model):
    id = models.DecimalField(max_digits=10, decimal_places=0, primary_key=True)
    descripcion = models.CharField(max_length=50)
    vigente = models.BooleanField()

class PagoPersona(models.Model):
    id = models.DecimalField(max_digits=10, decimal_places=0, primary_key=True)
    persona = models.ForeignKey(Persona, on_delete=models.RESTRICT)
    curso = models.ForeignKey(Curso, on_delete=models.RESTRICT)
    usuario = models.ForeignKey(Usuario, on_delete=models.RESTRICT)
    fecha_hora = models.DateTimeField()
    tipo = models.IntegerField()
    valor = models.DecimalField(max_digits=21, decimal_places=6)
    observacion = models.CharField(max_length=100, blank=True, default='')

class PagoCambioPersona(models.Model):
    id = models.DecimalField(max_digits=10, decimal_places=0, primary_key=True)
    persona = models.ForeignKey(Persona, on_delete=models.RESTRICT)
    pago_persona = models.ForeignKey(PagoPersona, on_delete=models.RESTRICT)
    usuario = models.ForeignKey(Usuario, on_delete=models.RESTRICT)
    fecha_hora = models.DateTimeField()

class Prepago(models.Model):
    id = models.DecimalField(max_digits=10, decimal_places=0, primary_key=True)
    persona = models.ForeignKey(Persona, on_delete=models.RESTRICT)
    curso = models.ForeignKey(Curso, on_delete=models.RESTRICT)
    pago_persona = models.ForeignKey(PagoPersona, on_delete=models.RESTRICT, blank=True, default=0)
    valor = models.DecimalField(max_digits=21, decimal_places=6)
    observacion = models.TextField(blank=True, default='')
    vigente = models.BooleanField()

class ComprobantePago(models.Model):
    id = models.DecimalField(max_digits=10, decimal_places=0, primary_key=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.RESTRICT)
    persona_curso = models.ForeignKey(PersonaCurso, on_delete=models.RESTRICT)
    concepto_contable = models.ForeignKey(ConceptoContable, on_delete=models.RESTRICT)
    fecha_hora = models.DateTimeField()
    fecha = models.DateField()
    numero = models.IntegerField()
    valor = models.DecimalField(max_digits=21, decimal_places=6)

class PagoComprobante(models.Model):
    id = models.DecimalField(max_digits=10, decimal_places=0, primary_key=True)
    pago_persona = models.ForeignKey(PagoPersona, on_delete=models.RESTRICT)
    comprobante_pago = models.ForeignKey(ComprobantePago, on_delete=models.RESTRICT)
