from django.db import models

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
