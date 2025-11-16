from django.db import models
from maestros.models import EstadoCivil, Nivel, Rama, Cargo, Rol, Alimentacion
from geografia.models import Comuna, Grupo, Distrito, Zona
from cursos.models import CursoSeccion
from usuarios.models import Usuario

class Persona(models.Model):
    per_id = models.AutoField(primary_key=True)
    esc_id = models.ForeignKey(EstadoCivil, on_delete=models.CASCADE, db_column='esc_id')
    com_id = models.ForeignKey(Comuna, on_delete=models.CASCADE, db_column='com_id')
    usu_id = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='usu_id')
    per_fecha_hora = models.DateTimeField(auto_now_add=True)
    per_run = models.IntegerField()
    per_dv = models.CharField(max_length=1)
    per_apelpat = models.CharField(max_length=50)
    per_apelmat = models.CharField(max_length=50, blank=True, null=True)
    per_nombres = models.CharField(max_length=50)
    per_email = models.EmailField(max_length=100)
    per_fecha_nac = models.DateTimeField()
    per_direccion = models.CharField(max_length=255)
    per_tipo_fono = models.IntegerField()
    per_fono = models.CharField(max_length=15)
    per_alergia_enfermedad = models.CharField(max_length=255, blank=True, null=True)
    per_limitacion = models.CharField(max_length=255, blank=True, null=True)
    per_nom_emergencia = models.CharField(max_length=50, blank=True, null=True)
    per_fono_emergencia = models.CharField(max_length=15, blank=True, null=True)
    per_otros = models.CharField(max_length=255, blank=True, null=True)
    per_num_mmaa = models.IntegerField(blank=True, null=True)
    per_profesion = models.CharField(max_length=100, blank=True, null=True)
    per_tiempo_nnaj = models.CharField(max_length=50, blank=True, null=True)
    per_tiempo_adulto = models.CharField(max_length=50, blank=True, null=True)
    per_religion = models.CharField(max_length=50, blank=True, null=True)
    per_apodo = models.CharField(max_length=50)
    per_foto = models.TextField(blank=True, null=True)
    per_vigente = models.BooleanField()

    class Meta:
        db_table = 'persona'
        verbose_name = 'Persona'
        verbose_name_plural = 'Personas'

    def __str__(self):
        return f"{self.per_nombres} {self.per_apelpat}"

class PersonaGrupo(models.Model):
    peg_id = models.AutoField(primary_key=True)
    gru_id = models.ForeignKey(Grupo, on_delete=models.CASCADE, db_column='gru_id')
    per_id = models.ForeignKey(Persona, on_delete=models.CASCADE, db_column='per_id')
    peg_vigente = models.BooleanField()

    class Meta:
        db_table = 'persona_grupo'
        verbose_name = 'Persona en Grupo'
        verbose_name_plural = 'Personas en Grupos'
        unique_together = (('gru_id', 'per_id'),)

class PersonaNivel(models.Model):
    pen_id = models.AutoField(primary_key=True)
    per_id = models.ForeignKey(Persona, on_delete=models.CASCADE, db_column='per_id')
    niv_id = models.ForeignKey(Nivel, on_delete=models.CASCADE, db_column='niv_id')
    ram_id = models.ForeignKey(Rama, on_delete=models.CASCADE, db_column='ram_id')

    class Meta:
        db_table = 'persona_nivel'
        verbose_name = 'Persona Nivel'
        verbose_name_plural = 'Personas Niveles'

class PersonaFormador(models.Model):
    pef_id = models.AutoField(primary_key=True)
    per_id = models.ForeignKey(Persona, on_delete=models.CASCADE, db_column='per_id')
    pef_hab_1 = models.BooleanField()
    pef_hab_2 = models.BooleanField()
    pef_verif = models.BooleanField()
    pef_historial = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'persona_formador'
        verbose_name = 'Persona Formador'
        verbose_name_plural = 'Personas Formadores'

class PersonaIndividual(models.Model):
    pei_id = models.AutoField(primary_key=True)
    per_id = models.ForeignKey(Persona, on_delete=models.CASCADE, db_column='per_id')
    car_id = models.ForeignKey(Cargo, on_delete=models.CASCADE, db_column='car_id')
    dis_id = models.ForeignKey(Distrito, on_delete=models.CASCADE, db_column='dis_id', blank=True, null=True)
    zon_id = models.ForeignKey(Zona, on_delete=models.CASCADE, db_column='zon_id', blank=True, null=True)
    pei_vigente = models.BooleanField()

    class Meta:
        db_table = 'persona_individual'
        verbose_name = 'Persona Individual'
        verbose_name_plural = 'Personas Individuales'

class PersonaVehiculo(models.Model):
    pev_id = models.AutoField(primary_key=True)
    pec_id = models.ForeignKey('personas.PersonaCurso', on_delete=models.CASCADE, db_column='pec_id')
    pev_marca = models.CharField(max_length=50)
    pev_modelo = models.CharField(max_length=50)
    pev_patente = models.CharField(max_length=10)

    class Meta:
        db_table = 'persona_vehiculo'
        verbose_name = 'Vehículo de Persona'
        verbose_name_plural = 'Vehículos de Personas'

class PersonaCurso(models.Model):
    # pec_id: Identificador único de la inscripción (clave primaria)
    pec_id = models.AutoField(primary_key=True)
    # per_id: Clave foránea a Persona (relación ManyToOne)
    per_id = models.ForeignKey(Persona, on_delete=models.CASCADE, db_column='per_id')
    # cus_id: Clave foránea a CursoSeccion (relación ManyToOne)
    cus_id = models.ForeignKey(CursoSeccion, on_delete=models.CASCADE, db_column='cus_id')
    # rol_id: Clave foránea a Rol (rol de la persona en el curso)
    rol_id = models.ForeignKey(Rol, on_delete=models.CASCADE, db_column='rol_id')
    # ali_id: Clave foránea a Alimentacion (preferencia de alimentación)
    ali_id = models.ForeignKey(Alimentacion, on_delete=models.CASCADE, db_column='ali_id')
    # niv_id: Clave foránea a Nivel (nivel de la persona en el curso, opcional)
    niv_id = models.ForeignKey(Nivel, on_delete=models.CASCADE, db_column='niv_id', null=True, blank=True)
    # pec_observacion: Observaciones sobre la inscripción
    pec_observacion = models.TextField(null=True, blank=True)
    # pec_registro: Indica si la persona está registrada (booleano)
    pec_registro = models.BooleanField()
    # pec_acreditado: Indica si la persona está acreditada (booleano)
    pec_acreditado = models.BooleanField()

    class Meta:
        db_table = 'persona_curso'
        verbose_name = 'Inscripción de Persona en Curso'
        verbose_name_plural = 'Inscripciones de Personas en Cursos'
        unique_together = ('per_id', 'cus_id') # Una persona solo puede inscribirse una vez por sección de curso

    def __str__(self):
        return f"{self.per_id} en {self.cus_id}"

class PersonaEstadoCurso(models.Model):
    # peu_id: Identificador único del cambio de estado (clave primaria)
    peu_id = models.AutoField(primary_key=True)
    # usu_id: Clave foránea a Usuario (quien realiza el cambio)
    usu_id = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='usu_id')
    # pec_id: Clave foránea a PersonaCurso (la inscripción afectada)
    pec_id = models.ForeignKey(PersonaCurso, on_delete=models.CASCADE, db_column='pec_id')
    # peu_fecha_hora: Fecha y hora del cambio de estado
    peu_fecha_hora = models.DateTimeField()
    # peu_estado: Nuevo estado de la inscripción (1: PreInscripción, 2: Avisado, 3: Lista de Espera, 4: Inscrito, 5: Vigente, 6: Anulado, 10: Sobrecupo)
    peu_estado = models.IntegerField()
    # peu_vigente: Indica si el registro de estado está activo (True) o inactivo (False)
    peu_vigente = models.BooleanField()

    class Meta:
        db_table = 'persona_estado_curso'
        verbose_name = 'Estado de Inscripción de Persona'
        verbose_name_plural = 'Estados de Inscripción de Personas'

    def __str__(self):
        return f"Estado {self.peu_estado} para {self.pec_id} por {self.usu_id}"
