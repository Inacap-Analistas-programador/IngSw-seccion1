from django.db import models

class Region(models.Model):
    id = models.DecimalField(db_column='reg_id', max_digits=10, decimal_places=0, primary_key=True)
    descripcion = models.CharField(db_column='reg_descripcion', max_length=100)
    vigente = models.BooleanField(db_column='reg_vigente')

    class Meta:
        db_table = 'region'

class Provincia(models.Model):
    id = models.DecimalField(db_column='pro_id', max_digits=10, decimal_places=0, primary_key=True)
    region = models.ForeignKey(Region, on_delete=models.RESTRICT, db_column='reg_id')
    descripcion = models.CharField(db_column='pro_descripcion', max_length=100)
    vigente = models.BooleanField(db_column='pro_vigente')

    class Meta:
        db_table = 'provincia'

class Comuna(models.Model):
    id = models.DecimalField(db_column='com_id', max_digits=10, decimal_places=0, primary_key=True)
    provincia = models.ForeignKey(Provincia, on_delete=models.RESTRICT, db_column='pro_id')
    descripcion = models.CharField(db_column='com_descripcion', max_length=100)
    vigente = models.BooleanField(db_column='com_vigente')

    class Meta:
        db_table = 'comuna'

class Zona(models.Model):
    id = models.DecimalField(db_column='zon_id', max_digits=10, decimal_places=0, primary_key=True)
    descripcion = models.CharField(db_column='zon_descripcion', max_length=100)
    unilateral = models.BooleanField(db_column='zon_unilateral')
    vigente = models.BooleanField(db_column='zon_vigente')

    class Meta:
        db_table = 'zona'

class Distrito(models.Model):
    id = models.DecimalField(db_column='dis_id', max_digits=10, decimal_places=0, primary_key=True)
    zona = models.ForeignKey(Zona, on_delete=models.RESTRICT, db_column='zon_id')
    descripcion = models.CharField(db_column='dis_descripcion', max_length=100)
    vigente = models.BooleanField(db_column='dis_vigente')

    class Meta:
        db_table = 'distrito'

class Grupo(models.Model):
    id = models.DecimalField(db_column='gru_id', max_digits=10, decimal_places=0, primary_key=True)
    distrito = models.ForeignKey(Distrito, on_delete=models.RESTRICT, db_column='dis_id')
    descripcion = models.CharField(db_column='gru_descripcion', max_length=100)
    vigente = models.BooleanField(db_column='gru_vigente')

    class Meta:
        db_table = 'grupo'

class EstadoCivil(models.Model):
    id = models.DecimalField(db_column='esc_id', max_digits=10, decimal_places=0, primary_key=True)
    descripcion = models.CharField(db_column='esc_descripcion', max_length=50)
    vigente = models.BooleanField(db_column='esc_vigente')

    class Meta:
        db_table = 'estado_civil'

class Nivel(models.Model):
    id = models.DecimalField(db_column='niv_id', max_digits=10, decimal_places=0, primary_key=True)
    descripcion = models.CharField(db_column='niv_descripcion', max_length=50)
    orden = models.IntegerField(db_column='niv_orden')
    vigente = models.BooleanField(db_column='niv_vigente')

    class Meta:
        db_table = 'nivel'

class Rama(models.Model):
    id = models.DecimalField(db_column='ram_id', max_digits=10, decimal_places=0, primary_key=True)
    descripcion = models.CharField(db_column='ram_descripcion', max_length=50)
    vigente = models.BooleanField(db_column='ram_vigente')

    class Meta:
        db_table = 'rama'

class Rol(models.Model):
    id = models.DecimalField(db_column='rol_id', max_digits=10, decimal_places=0, primary_key=True)
    descripcion = models.CharField(db_column='rol_descripcion', max_length=50)
    tipo = models.IntegerField(db_column='rol_tipo')
    vigente = models.BooleanField(db_column='rol_vigente')

    class Meta:
        db_table = 'rol'

class TipoArchivo(models.Model):
    id = models.DecimalField(db_column='tar_id', max_digits=10, decimal_places=0, primary_key=True)
    descripcion = models.CharField(db_column='tar_descripcion', max_length=50)
    vigente = models.BooleanField(db_column='tar_vigente')

    class Meta:
        db_table = 'tipo_archivo'

class TipoCurso(models.Model):
    id = models.DecimalField(db_column='tcu_id', max_digits=10, decimal_places=0, primary_key=True)
    descripcion = models.CharField(db_column='tcu_descripcion', max_length=100)
    tipo = models.IntegerField(db_column='tcu_tipo')
    cant_participante = models.IntegerField(db_column='tcu_cant_participante', blank=True, null=True)
    vigente = models.BooleanField(db_column='tcu_vigente')

    class Meta:
        db_table = 'tipo_curso'

class Cargo(models.Model):
    id = models.DecimalField(db_column='car_id', max_digits=10, decimal_places=0, primary_key=True)
    descripcion = models.CharField(db_column='car_descripcion', max_length=100)
    vigente = models.BooleanField(db_column='car_vigente')

    class Meta:
        db_table = 'cargo'

class Alimentacion(models.Model):
    id = models.DecimalField(db_column='ali_id', max_digits=10, decimal_places=0, primary_key=True)
    descripcion = models.CharField(db_column='ali_descripcion', max_length=100)
    tipo = models.IntegerField(db_column='ali_tipo')
    vigente = models.BooleanField(db_column='ali_vigente')

    class Meta:
        db_table = 'alimentacion'

class Aplicacion(models.Model):
    id = models.DecimalField(db_column='apl_id', max_digits=10, decimal_places=0, primary_key=True)
    descripcion = models.CharField(db_column='apl_descripcion', max_length=50)
    vigente = models.BooleanField(db_column='apl_vigente')

    class Meta:
        db_table = 'aplicacion'

class Perfil(models.Model):
    id = models.DecimalField(db_column='pel_id', max_digits=10, decimal_places=0, primary_key=True)
    descripcion = models.CharField(db_column='pel_descripcion', max_length=50)
    vigente = models.BooleanField(db_column='pel_vigente')

    class Meta:
        db_table = 'perfil'

class PerfilAplicacion(models.Model):
    id = models.DecimalField(db_column='pea_id', max_digits=10, decimal_places=0, primary_key=True)
    perfil = models.ForeignKey(Perfil, on_delete=models.RESTRICT, db_column='pel_id')
    aplicacion = models.ForeignKey(Aplicacion, on_delete=models.RESTRICT, db_column='apl_id')
    ingresar = models.BooleanField(db_column='pea_ingresar')
    modificar = models.BooleanField(db_column='pea_modificar')
    eliminar = models.BooleanField(db_column='pea_eliminar')
    consultar = models.BooleanField(db_column='pea_consultar')

    class Meta:
        db_table = 'perfil_aplicacion'

class Proveedor(models.Model):
    id = models.DecimalField(db_column='prv_id', max_digits=10, decimal_places=0, primary_key=True)
    descripcion = models.CharField(db_column='prv_descripcion', max_length=100)
    celular1 = models.CharField(db_column='prv_celular1', max_length=15)
    celular2 = models.CharField(db_column='prv_celular2', max_length=15, blank=True, default='')
    direccion = models.CharField(db_column='prv_direccion', max_length=100)
    observacion = models.TextField(db_column='prv_observacion', blank=True, default='')
    vigente = models.BooleanField(db_column='prv_vigente')

    class Meta:
        db_table = 'proveedor'
