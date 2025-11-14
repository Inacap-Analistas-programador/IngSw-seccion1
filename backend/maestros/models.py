from django.db import models
#alimentacion se importa de maestros.models
from maestros.models import Region, Provincia, Comuna, Zona, Distrito, Grupo, EstadoCivil
# Tabla: region
class Region(models.Model):
    # reg_id: Identificador único de la región (clave primaria)
    reg_id = models.AutoField(primary_key=True)
    # reg_descripcion: Nombre de la región
    reg_descripcion = models.CharField(max_length=100)
    # reg_vigente: Indica si la región está activa (True) o inactiva (False)
    reg_vigente = models.BooleanField()

    class Meta:
        db_table = 'region'
        verbose_name = 'Región'
        verbose_name_plural = 'Regiones'

    def __str__(self):
        return self.reg_descripcion

# Tabla: provincia
class Provincia(models.Model):
    # pro_id: Identificador único de la provincia (clave primaria)
    pro_id = models.AutoField(primary_key=True)
    # reg_id: Clave foránea a la tabla Region (relación ManyToOne)
    reg_id = models.ForeignKey(Region, on_delete=models.CASCADE, db_column='reg_id')
    # pro_descripcion: Nombre de la provincia
    pro_descripcion = models.CharField(max_length=100)
    # pro_vigente: Indica si la provincia está activa (True) o inactiva (False)
    pro_vigente = models.BooleanField()

    class Meta:
        db_table = 'provincia'
        verbose_name = 'Provincia'
        verbose_name_plural = 'Provincias'

    def __str__(self):
        return self.pro_descripcion

# Tabla: comuna
class Comuna(models.Model):
    # com_id: Identificador único de la comuna (clave primaria)
    com_id = models.AutoField(primary_key=True)
    # pro_id: Clave foránea a la tabla Provincia (relación ManyToOne)
    pro_id = models.ForeignKey(Provincia, on_delete=models.CASCADE, db_column='pro_id')
    # com_descripcion: Nombre de la comuna
    com_descripcion = models.CharField(max_length=100)
    # com_vigente: Indica si la comuna está activa (True) o inactiva (False)
    com_vigente = models.BooleanField()

    class Meta:
        db_table = 'comuna'
        verbose_name = 'Comuna'
        verbose_name_plural = 'Comunas'

    def __str__(self):
        return self.com_descripcion

# Tabla: zona
class Zona(models.Model):
    # zon_id: Identificador único de la zona (clave primaria)
    zon_id = models.AutoField(primary_key=True)
    # zon_descripcion: Nombre de la zona
    zon_descripcion = models.CharField(max_length=100)
    # zon_unilateral: Indica si la zona es unilateral (True/False)
    zon_unilateral = models.BooleanField()
    # zon_vigente: Indica si la zona está activa (True) o inactiva (False)
    zon_vigente = models.BooleanField()

    class Meta:
        db_table = 'zona'
        verbose_name = 'Zona'
        verbose_name_plural = 'Zonas'

    def __str__(self):
        return self.zon_descripcion

# Tabla: distrito
class Distrito(models.Model):
    # dis_id: Identificador único del distrito (clave primaria)
    dis_id = models.AutoField(primary_key=True)
    # zon_id: Clave foránea a la tabla Zona (relación ManyToOne)
    zon_id = models.ForeignKey(Zona, on_delete=models.CASCADE, db_column='zon_id')
    # dis_descripcion: Nombre del distrito
    dis_descripcion = models.CharField(max_length=100)
    # dis_vigente: Indica si el distrito está activo (True) o inactivo (False)
    dis_vigente = models.BooleanField()

    class Meta:
        db_table = 'distrito'
        verbose_name = 'Distrito'
        verbose_name_plural = 'Distritos'

    def __str__(self):
        return self.dis_descripcion

# Tabla: grupo
class Grupo(models.Model):
    # gru_id: Identificador único del grupo (clave primaria)
    gru_id = models.AutoField(primary_key=True)
    # dis_id: Clave foránea a la tabla Distrito (relación ManyToOne)
    dis_id = models.ForeignKey(Distrito, on_delete=models.CASCADE, db_column='dis_id')
    # gru_descripcion: Nombre del grupo
    gru_descripcion = models.CharField(max_length=100)
    # gru_vigente: Indica si el grupo está activo (True) o inactivo (False)
    gru_vigente = models.BooleanField()

    class Meta:
        db_table = 'grupo'
        verbose_name = 'Grupo'
        verbose_name_plural = 'Grupos'

    def __str__(self):
        return self.gru_descripcion

# Tabla: estado_civil
class EstadoCivil(models.Model):
    # esc_id: Identificador único del estado civil (clave primaria)
    esc_id = models.AutoField(primary_key=True)
    # esc_descripcion: Descripción del estado civil (ej. Soltero, Casado, etc.)
    esc_descripcion = models.CharField(max_length=50)
    # esc_vigente: Indica si el estado civil está activo (True) o inactivo (False)
    esc_vigente = models.BooleanField()

    class Meta:
        db_table = 'estado_civil'
        verbose_name = 'Estado Civil'
        verbose_name_plural = 'Estados Civiles'

    def __str__(self):
        return self.esc_descripcion

# Tabla: cargo
class Cargo(models.Model):
    # car_id: Identificador único del cargo (clave primaria)
    car_id = models.AutoField(primary_key=True)
    # car_descripcion: Descripción del cargo (ej. Profesor, Alumno, etc.)
    car_descripcion = models.CharField(max_length=100)
    # car_vigente: Indica si el cargo está activo (True) o inactivo (False)
    car_vigente = models.BooleanField()

    class Meta:
        db_table = 'cargo'
        verbose_name = 'Cargo'
        verbose_name_plural = 'Cargos'

    def __str__(self):
        return self.car_descripcion

# Tabla: nivel
class Nivel(models.Model):
    # niv_id: Identificador único del nivel (clave primaria)
    niv_id = models.AutoField(primary_key=True)
    # niv_descripcion: Descripción del nivel (ej. Básico, Intermedio, Avanzado)
    niv_descripcion = models.CharField(max_length=50)
    # niv_orden: Orden de aparición del nivel
    niv_orden = models.IntegerField()
    # niv_vigente: Indica si el nivel está activo (True) o inactivo (False)
    niv_vigente = models.BooleanField()

    class Meta:
        db_table = 'nivel'
        verbose_name = 'Nivel'
        verbose_name_plural = 'Niveles'

    def __str__(self):
        return self.niv_descripcion

# Tabla: rama
class Rama(models.Model):
    # ram_id: Identificador único de la rama (clave primaria)
    ram_id = models.AutoField(primary_key=True)
    # ram_descripcion: Descripción de la rama (ej. Científica, Humanista)
    ram_descripcion = models.CharField(max_length=50)
    # ram_vigente: Indica si la rama está activa (True) o inactiva (False)
    ram_vigente = models.BooleanField()

    class Meta:
        db_table = 'rama'
        verbose_name = 'Rama'
        verbose_name_plural = 'Ramas'

    def __str__(self):
        return self.ram_descripcion

# Tabla: rol
class Rol(models.Model):
    # rol_id: Identificador único del rol (clave primaria)
    rol_id = models.AutoField(primary_key=True)
    # rol_descripcion: Descripción del rol (ej. Participante, Formador)
    rol_descripcion = models.CharField(max_length=50)
    # rol_tipo: Tipo de rol (numérico, con significado definido en la base de datos)
    rol_tipo = models.IntegerField()
    # rol_vigente: Indica si el rol está activo (True) o inactivo (False)
    rol_vigente = models.BooleanField()

    class Meta:
        db_table = 'rol'
        verbose_name = 'Rol'
        verbose_name_plural = 'Roles'

    def __str__(self):
        return self.rol_descripcion

# Tabla: tipo_archivo
class TipoArchivo(models.Model):
    # tar_id: Identificador único del tipo de archivo (clave primaria)
    tar_id = models.AutoField(primary_key=True)
    # tar_descripcion: Descripción del tipo de archivo (ej. Documento, Imagen)
    tar_descripcion = models.CharField(max_length=50)
    # tar_vigente: Indica si el tipo de archivo está activo (True) o inactivo (False)
    tar_vigente = models.BooleanField()

    class Meta:
        db_table = 'tipo_archivo'
        verbose_name = 'Tipo de Archivo'
        verbose_name_plural = 'Tipos de Archivo'

    def __str__(self):
        return self.tar_descripcion

# Tabla: tipo_curso
class TipoCurso(models.Model):
    # tcu_id: Identificador único del tipo de curso (clave primaria)
    tcu_id = models.AutoField(primary_key=True)
    # tcu_descripcion: Descripción del tipo de curso (ej. Presencial, Online)
    tcu_descripcion = models.CharField(max_length=100)
    # tcu_tipo: Tipo numérico del curso (ej. Inicial, Medio, Avanzado)
    tcu_tipo = models.IntegerField()
    # tcu_cant_participante: Cantidad máxima de participantes
    tcu_cant_participante = models.IntegerField(null=True, blank=True)
    # tcu_vigente: Indica si el tipo de curso está activo (True) o inactivo (False)
    tcu_vigente = models.BooleanField()

    class Meta:
        db_table = 'tipo_curso'
        verbose_name = 'Tipo de Curso'
        verbose_name_plural = 'Tipos de Curso'

    def __str__(self):
        return self.tcu_descripcion

# Tabla: alimentacion
class Alimentacion(models.Model):
    # ali_id: Identificador único del tipo de alimentación (clave primaria)
    ali_id = models.AutoField(primary_key=True)
    # ali_descripcion: Descripción del tipo de alimentación (ej. Con Almuerzo, Sin Almuerzo)
    ali_descripcion = models.CharField(max_length=100)
    # ali_tipo: Tipo numérico de alimentación (relacionado con CUU_TIPO)
    ali_tipo = models.IntegerField()
    # ali_vigente: Indica si el tipo de alimentación está activo (True) o inactivo (False)
    ali_vigente = models.BooleanField()

    class Meta:
        db_table = 'alimentacion'
        verbose_name = 'Alimentación'
        verbose_name_plural = 'Alimentaciones'

    def __str__(self):
        return self.ali_descripcion

# Tabla: concepto_contable
class ConceptoContable(models.Model):
    # coc_id: Identificador único del concepto contable (clave primaria)
    coc_id = models.AutoField(primary_key=True)
    # coc_descripcion: Descripción del concepto contable
    coc_descripcion = models.CharField(max_length=50)
    # coc_vigente: Indica si el concepto contable está activo (True) o inactivo (False)
    coc_vigente = models.BooleanField()

    class Meta:
        db_table = 'concepto_contable'
        verbose_name = 'Concepto Contable'
        verbose_name_plural = 'Conceptos Contables'

    def __str__(self):
        return self.coc_descripcion
