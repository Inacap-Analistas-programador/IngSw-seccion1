from django.db import models
from personas.models import Persona
from catalog.models import Rol, Alimentacion, Nivel
from courses.models import CursoSeccion
from authentication.models import Usuario

class PersonaCurso(models.Model):
    id = models.DecimalField(db_column='pec_id', max_digits=10, decimal_places=0, primary_key=True)
    persona = models.ForeignKey(Persona, on_delete=models.RESTRICT, db_column='per_id')
    curso_seccion = models.ForeignKey(CursoSeccion, on_delete=models.RESTRICT, db_column='cus_id')
    rol = models.ForeignKey(Rol, on_delete=models.RESTRICT, db_column='rol_id')
    alimentacion = models.ForeignKey(Alimentacion, on_delete=models.RESTRICT, db_column='ali_id')
    nivel = models.ForeignKey(Nivel, on_delete=models.RESTRICT, db_column='niv_id', blank=True, default=0)
    observacion = models.TextField(db_column='pec_observacion', blank=True, default='')
    registro = models.BooleanField(db_column='pec_registro')
    acreditado = models.BooleanField(db_column='pec_acreditado')

    class Meta:
        db_table = 'persona_curso'

class PersonaEstadoCurso(models.Model):
    id = models.DecimalField(db_column='peu_id', max_digits=10, decimal_places=0, primary_key=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.RESTRICT, db_column='usu_id')
    persona_curso = models.ForeignKey(PersonaCurso, on_delete=models.RESTRICT, db_column='pec_id')
    fecha_hora = models.DateTimeField(db_column='peu_fecha_hora')
    estado = models.IntegerField(db_column='peu_estado')
    vigente = models.BooleanField(db_column='peu_vigente')

    class Meta:
        db_table = 'persona_estado_curso'

class PersonaVehiculo(models.Model):
    id = models.DecimalField(db_column='pev_id', max_digits=10, decimal_places=0, primary_key=True)
    persona_curso = models.ForeignKey(PersonaCurso, on_delete=models.RESTRICT, db_column='pec_id')
    marca = models.CharField(db_column='pev_marca', max_length=50)
    modelo = models.CharField(db_column='pev_modelo', max_length=50)
    patente = models.CharField(db_column='pev_patente', max_length=10)

    class Meta:
        db_table = 'persona_vehiculo'
