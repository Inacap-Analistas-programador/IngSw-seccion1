
from django.db import models
from usuarios.models import Usuario
from personas.models import Persona
from maestros.models import Comuna, TipoCurso, Alimentacion,  Rama, Rol, Nivel, Cargo # Importar modelos maestros
# Tabla: curso
class Curso(models.Model):
    # cur_id: Identificador único del curso (clave primaria)
    cur_id = models.AutoField(primary_key=True)
    # usu_id: Clave foránea a Usuario (quien registra/modifica)
    usu_id = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='usu_id')
    # tcu_id: Clave foránea a TipoCurso (tipo de curso)
    tcu_id = models.ForeignKey(TipoCurso, on_delete=models.CASCADE, db_column='tcu_id')
    # per_id_responsable: Clave foránea a Persona (responsable del curso)
    per_id_responsable = models.ForeignKey(Persona, on_delete=models.CASCADE, db_column='per_id_responsable')
    # car_id_responsable: Clave foránea a Cargo (cargo del responsable)
    car_id_responsable = models.ForeignKey(Cargo, on_delete=models.CASCADE, db_column='car_id_responsable')
    # com_id_lugar: Clave foránea a Comuna (lugar donde se imparte, opcional)
    com_id_lugar = models.ForeignKey(Comuna, on_delete=models.CASCADE, db_column='com_id_lugar', null=True, blank=True)
    # cur_fecha_hora: Fecha y hora de registro/modificación
    cur_fecha_hora = models.DateTimeField()
    # cur_fecha_solicitud: Fecha de solicitud del curso
    cur_fecha_solicitud = models.DateTimeField()
    # cur_codigo: Código único del curso
    cur_codigo = models.CharField(max_length=10)
    # cur_descripcion: Descripción breve del curso
    cur_descripcion = models.CharField(max_length=50, null=True, blank=True)
    # cur_observacion: Observaciones generales del curso
    cur_observacion = models.TextField(null=True, blank=True)
    # cur_administra: Indica la entidad administradora (1: Zona, 2: Distrito)
    cur_administra = models.IntegerField()
    # cur_cuota_con_almuerzo: Valor de la cuota con almuerzo
    cur_cuota_con_almuerzo = models.DecimalField(max_digits=21, decimal_places=6)
    # cur_cuota_sin_almuerzo: Valor de la cuota sin almuerzo
    cur_cuota_sin_almuerzo = models.DecimalField(max_digits=21, decimal_places=6)
    # cur_modalidad: Modalidad del curso (1: Internado, 2: Externado, 3: Internado/Externado)
    cur_modalidad = models.IntegerField()
    # cur_tipo_curso: Tipo de curso (1: Presencial, 2: Online, 3: Híbrido)
    cur_tipo_curso = models.IntegerField()
    # cur_lugar: Lugar específico de impartición (si no es una comuna)
    cur_lugar = models.CharField(max_length=100, null=True, blank=True)
    # cur_estado: Estado del curso (0: Pendiente, 1: Vigente, 2: Anulado, 3: Finalizado)
    cur_estado = models.IntegerField()

    class Meta:
        db_table = 'curso'
        verbose_name = 'Curso'
        verbose_name_plural = 'Cursos'

    def __str__(self):
        return f"{self.cur_codigo} - {self.cur_descripcion}"

# Tabla: curso_seccion
class CursoSeccion(models.Model):
    # cus_id: Identificador único de la sección (clave primaria)
    cus_id = models.AutoField(primary_key=True)
    # cur_id: Clave foránea a Curso (relación ManyToOne)
    cur_id = models.ForeignKey(Curso, on_delete=models.CASCADE, db_column='cur_id')
    # ram_id: Clave foránea a Rama (relación ManyToOne, opcional)
    ram_id = models.ForeignKey(Rama, on_delete=models.CASCADE, db_column='ram_id', null=True, blank=True)
    # cus_seccion: Número o identificador de la sección
    cus_seccion = models.IntegerField()
    # cus_cant_participante: Cantidad de participantes en la sección
    cus_cant_participante = models.IntegerField()

    class Meta:
        db_table = 'curso_seccion'
        verbose_name = 'Sección de Curso'
        verbose_name_plural = 'Secciones de Curso'
        unique_together = ('cur_id', 'cus_seccion') # Asegura que no haya secciones duplicadas para el mismo curso

    def __str__(self):
        return f"Sección {self.cus_seccion} de {self.cur_id}"

# Tabla: curso_fecha
class CursoFecha(models.Model):
    # cuf_id: Identificador único de la fecha (clave primaria)
    cuf_id = models.AutoField(primary_key=True)
    # cur_id: Clave foránea a Curso (relación ManyToOne)
    cur_id = models.ForeignKey(Curso, on_delete=models.CASCADE, db_column='cur_id')
    # cuf_fecha_inicio: Fecha de inicio del curso/periodo
    cuf_fecha_inicio = models.DateTimeField()
    # cuf_fecha_termino: Fecha de término del curso/periodo
    cuf_fecha_termino = models.DateTimeField()
    # cuf_tipo: Tipo de fecha (1: Presencial, 2: Online, 3: Híbrido)
    cuf_tipo = models.IntegerField()

    class Meta:
        db_table = 'curso_fecha'
        verbose_name = 'Fecha de Curso'
        verbose_name_plural = 'Fechas de Curso'

    def __str__(self):
        return f"Periodo de {self.cur_id}: {self.cuf_fecha_inicio} - {self.cuf_fecha_termino}"

# Tabla: curso_cuota
class CursoCuota(models.Model):
    # cuu_id: Identificador único de la cuota (clave primaria)
    cuu_id = models.AutoField(primary_key=True)
    # cur_id: Clave foránea a Curso (relación ManyToOne)
    cur_id = models.ForeignKey(Curso, on_delete=models.CASCADE, db_column='cur_id')
    # cuu_tipo: Tipo de cuota (1: Con Almuerzo, 2: Sin Almuerzo)
    cuu_tipo = models.IntegerField()
    # cuu_fecha: Fecha de la cuota
    cuu_fecha = models.DateTimeField()
    # cuu_valor: Valor de la cuota
    cuu_valor = models.DecimalField(max_digits=21, decimal_places=6)

    class Meta:
        db_table = 'curso_cuota'
        verbose_name = 'Cuota de Curso'
        verbose_name_plural = 'Cuotas de Curso'

    def __str__(self):
        return f"Cuota {self.cuu_tipo} de {self.cur_id} ({self.cuu_valor})"

# Tabla: curso_alimentacion
class CursoAlimentacion(models.Model):
    # cua_id: Identificador único de la relación (clave primaria)
    cua_id = models.AutoField(primary_key=True)
    # cur_id: Clave foránea a Curso (relación ManyToOne)
    cur_id = models.ForeignKey(Curso, on_delete=models.CASCADE, db_column='cur_id')
    # ali_id: Clave foránea a Alimentacion (relación ManyToOne)
    ali_id = models.ForeignKey(Alimentacion, on_delete=models.CASCADE, db_column='ali_id')
    # cua_fecha: Fecha de la alimentación
    cua_fecha = models.DateTimeField()
    # cua_tiempo: Tiempo de la alimentación (1: Desayuno, 2: Almuerzo, 3: Once, 4: Cena, 5: Once/Cena)
    cua_tiempo = models.IntegerField()
    # cua_descripcion: Descripción de la alimentación
    cua_descripcion = models.CharField(max_length=100)
    # cua_cantidad_adicional: Cantidad adicional de raciones
    cua_cantidad_adicional = models.IntegerField()
    # cua_vigente: Indica si la relación está activa (True) o inactiva (False)
    cua_vigente = models.BooleanField()

    class Meta:
        db_table = 'curso_alimentacion'
        verbose_name = 'Alimentación de Curso'
        verbose_name_plural = 'Alimentaciones de Curso'

    def __str__(self):
        return f"{self.ali_id} en {self.cur_id} ({self.cua_tiempo})"

# Tabla: curso_coordinador
class CursoCoordinador(models.Model):
    # cuc_id: Identificador único de la relación (clave primaria)
    cuc_id = models.AutoField(primary_key=True)
    # cur_id: Clave foránea a Curso (relación ManyToOne)
    cur_id = models.ForeignKey(Curso, on_delete=models.CASCADE, db_column='cur_id')
    # car_id: Clave foránea a Cargo (relación ManyToOne)
    car_id = models.ForeignKey(Cargo, on_delete=models.CASCADE, db_column='car_id')
    # per_id: Clave foránea a Persona (relación ManyToOne)
    per_id = models.ForeignKey(Persona, on_delete=models.CASCADE, db_column='per_id')
    # cuc_cargo: Cargo específico del coordinador en este curso
    cuc_cargo = models.CharField(max_length=100, null=True, blank=True)

    class Meta:
        db_table = 'curso_coordinador'
        verbose_name = 'Coordinador de Curso'
        verbose_name_plural = 'Coordinadores de Curso'
        unique_together = ('cur_id', 'per_id') # Una persona solo puede ser coordinador de un curso una vez

    def __str__(self):
        return f"Coordinador {self.per_id} en {self.cur_id}"

# Tabla: curso_formador
class CursoFormador(models.Model):
    # cuo_id: Identificador único de la relación (clave primaria)
    cuo_id = models.AutoField(primary_key=True)
    # cur_id: Clave foránea a Curso (relación ManyToOne)
    cur_id = models.ForeignKey(Curso, on_delete=models.CASCADE, db_column='cur_id')
    # per_id: Clave foránea a Persona (relación ManyToOne)
    per_id = models.ForeignKey(Persona, on_delete=models.CASCADE, db_column='per_id')
    # rol_id: Clave foránea a Rol (rol del formador)
    rol_id = models.ForeignKey(Rol, on_delete=models.CASCADE, db_column='rol_id')
    # cus_id: Clave foránea a CursoSeccion (relación ManyToOne)
    cus_id = models.ForeignKey(CursoSeccion, on_delete=models.CASCADE, db_column='cus_id')
    # cuo_director: Indica si la persona es director del curso (booleano)
    cuo_director = models.BooleanField()

    class Meta:
        db_table = 'curso_formador'
        verbose_name = 'Formador de Curso'
        verbose_name_plural = 'Formadores de Curso'
        unique_together = ('cur_id', 'per_id', 'cus_id') # Asegura combinaciones únicas

    def __str__(self):
        return f"Formador {self.per_id} en {self.cur_id} (Sección: {self.cus_id})"

# Tabla: persona_curso
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

# Tabla: persona_estado_curso
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
