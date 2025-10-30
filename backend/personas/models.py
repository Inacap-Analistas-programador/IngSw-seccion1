from django.db import models
from catalog.models import EstadoCivil, Comuna, Cargo, Distrito, Zona, Nivel, Rama
from authentication.models import Usuario

class Persona(models.Model):
    id = models.DecimalField(db_column='per_id', max_digits=10, decimal_places=0, primary_key=True)
    estado_civil = models.ForeignKey(EstadoCivil, on_delete=models.RESTRICT, db_column='esc_id')
    comuna = models.ForeignKey(Comuna, on_delete=models.RESTRICT, db_column='com_id')
    usuario = models.ForeignKey(Usuario, on_delete=models.RESTRICT, db_column='usu_id')
    fecha_hora = models.DateTimeField(db_column='per_fecha_hora')
    run = models.DecimalField(db_column='per_run', max_digits=9, decimal_places=0)
    digito_verificador = models.CharField(db_column='per_dv', max_length=1)
    apelpat = models.CharField(db_column='per_apelpat', max_length=50, blank=True, default='')
    apelmat = models.CharField(db_column='per_apelmat', max_length=50, blank=True, default='')
    nombres = models.CharField(db_column='per_nombres', max_length=50)
    email = models.CharField(db_column='per_email', max_length=100)
    fecha_nac = models.DateTimeField(db_column='per_fecha_nac', null=True, blank=True)
    direccion = models.CharField(db_column='per_direccion', max_length=255)
    tipo_fono = models.IntegerField(db_column='per_tipo_fono')
    fono = models.CharField(db_column='per_fono', max_length=15)
    alergia_enfermedad = models.CharField(db_column='per_alergia_enfermedad', max_length=255, blank=True, default='')
    limitacion = models.CharField(db_column='per_limitacion', max_length=255, blank=True, default='')
    nom_emergencia = models.CharField(db_column='per_nom_emergencia', max_length=50, blank=True, default='')
    fono_emergencia = models.CharField(db_column='per_fono_emergencia', max_length=15, blank=True, default='')
    otros = models.CharField(db_column='per_otros', max_length=255, blank=True, default='')
    num_mmaa = models.IntegerField(db_column='per_num_mmaa', blank=True, null=True)
    profesion = models.CharField(db_column='per_profesion', max_length=100, blank=True, default='')
    tiempo_nnaj = models.CharField(db_column='per_tiempo_nnaj', max_length=50, blank=True, default='')
    tiempo_adulto = models.CharField(db_column='per_tiempo_adulto', max_length=50, blank=True, default='')
    religion = models.CharField(db_column='per_religion', max_length=50, blank=True, default='')
    apodo = models.CharField(db_column='per_apodo', max_length=50)
    foto = models.TextField(db_column='per_foto', blank=True, default='')
    vigente = models.BooleanField(db_column='per_vigente')

    class Meta:
        db_table = 'persona'

class PersonaIndividual(models.Model):
    id = models.DecimalField(db_column='pei_id', max_digits=10, decimal_places=0, primary_key=True)
    persona = models.ForeignKey(Persona, on_delete=models.RESTRICT, db_column='per_id')
    cargo = models.ForeignKey(Cargo, on_delete=models.RESTRICT, db_column='car_id')
    distrito = models.ForeignKey(Distrito, on_delete=models.RESTRICT, db_column='dis_id', blank=True, null=True)
    zona = models.ForeignKey(Zona, on_delete=models.RESTRICT, db_column='zon_id', blank=True, null=True)
    vigente = models.BooleanField(db_column='pei_vigente')

    class Meta:
        db_table = 'persona_individual'

class PersonaNivel(models.Model):
    id = models.DecimalField(db_column='pen_id', max_digits=10, decimal_places=0, primary_key=True)
    persona = models.ForeignKey(Persona, on_delete=models.RESTRICT, db_column='per_id')
    nivel = models.ForeignKey(Nivel, on_delete=models.RESTRICT, db_column='niv_id')
    rama = models.ForeignKey(Rama, on_delete=models.RESTRICT, db_column='ram_id')

    class Meta:
        db_table = 'persona_nivel'

class PersonaFormador(models.Model):
    id = models.DecimalField(db_column='pef_id', max_digits=10, decimal_places=0, primary_key=True)
    persona = models.ForeignKey(Persona, on_delete=models.RESTRICT, db_column='per_id')
    hab_1 = models.BooleanField(db_column='pef_hab_1', default=False)
    hab_2 = models.BooleanField(db_column='pef_hab_2', default=False)
    verif = models.BooleanField(db_column='pef_verif', default=False)
    historial = models.TextField(db_column='pef_historial', blank=True, default='')

    class Meta:
        db_table = 'persona_formador'
