from django.db import models
from catalog.models import TipoCurso, Comuna, Cargo, Rama, Rol, Alimentacion
from personas.models import Persona
from authentication.models import Usuario

class Curso(models.Model):
    id = models.DecimalField(db_column='cur_id', max_digits=10, decimal_places=0, primary_key=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.RESTRICT, db_column='usu_id')
    tipo_curso = models.ForeignKey(TipoCurso, on_delete=models.RESTRICT, db_column='tcu_id')
    persona_responsable = models.ForeignKey(Persona, on_delete=models.RESTRICT, db_column='per_id_responsable', related_name='cursos_responsable')
    cargo_responsable = models.ForeignKey(Cargo, on_delete=models.RESTRICT, db_column='car_id_responsable')
    comuna_lugar = models.ForeignKey(Comuna, on_delete=models.RESTRICT, db_column='com_id_lugar', null=True, blank=True)
    fecha_hora = models.DateTimeField(db_column='cur_fecha_hora')
    fecha_solicitud = models.DateTimeField(db_column='cur_fecha_solicitud')
    codigo = models.CharField(db_column='cur_codigo', max_length=10)
    descripcion = models.CharField(db_column='cur_descripcion', max_length=50, blank=True, default='')
    observacion = models.CharField(db_column='cur_observacion', max_length=255, blank=True, default='')
    administra = models.IntegerField(db_column='cur_administra')
    cuota_con_almuerzo = models.DecimalField(db_column='cur_cuota_con_almuerzo', max_digits=21, decimal_places=6)
    cuota_sin_almuerzo = models.DecimalField(db_column='cur_cuota_sin_almuerzo', max_digits=21, decimal_places=6)
    modalidad = models.IntegerField(db_column='cur_modalidad')
    tipo_curso_enum = models.IntegerField(db_column='cur_tipo_curso')
    lugar = models.CharField(db_column='cur_lugar', max_length=100, blank=True, default='')
    estado = models.IntegerField(db_column='cur_estado')

    class Meta:
        db_table = 'curso'

class CursoSeccion(models.Model):
    id = models.DecimalField(db_column='cus_id', max_digits=10, decimal_places=0, primary_key=True)
    curso = models.ForeignKey(Curso, on_delete=models.RESTRICT, db_column='cur_id', related_name='secciones')
    rama = models.ForeignKey(Rama, on_delete=models.RESTRICT, db_column='ram_id', null=True, blank=True)
    seccion = models.IntegerField(db_column='cus_seccion')
    cantidad_participantes = models.IntegerField(db_column='cus_cant_participante')
    cupos = models.IntegerField(db_column='cus_cupos', default=0)

    class Meta:
        db_table = 'curso_seccion'

class CursoCoordinador(models.Model):
    id = models.DecimalField(db_column='cuc_id', max_digits=10, decimal_places=0, primary_key=True)
    curso = models.ForeignKey(Curso, on_delete=models.RESTRICT, db_column='cur_id')
    cargo = models.ForeignKey(Cargo, on_delete=models.RESTRICT, db_column='car_id')
    persona = models.ForeignKey(Persona, on_delete=models.RESTRICT, db_column='per_id')
    cargo_coordinador = models.CharField(db_column='cuc_cargo', max_length=100, blank=True, default='')

    class Meta:
        db_table = 'curso_coordinador'

class CursoCuota(models.Model):
    id = models.DecimalField(db_column='cuu_id', max_digits=10, decimal_places=0, primary_key=True)
    curso = models.ForeignKey(Curso, on_delete=models.RESTRICT, db_column='cur_id')
    tipo = models.IntegerField(db_column='cuu_tipo')
    fecha = models.DateTimeField(db_column='cuu_fecha')
    valor = models.DecimalField(db_column='cuu_valor', max_digits=21, decimal_places=6)

    class Meta:
        db_table = 'curso_cuota'

class CursoFecha(models.Model):
    id = models.DecimalField(db_column='cuf_id', max_digits=10, decimal_places=0, primary_key=True)
    curso = models.ForeignKey(Curso, on_delete=models.RESTRICT, db_column='cur_id')
    fecha_inicio = models.DateTimeField(db_column='cuf_fecha_inicio')
    fecha_termino = models.DateTimeField(db_column='cuf_fecha_termino')
    tipo = models.IntegerField(db_column='cuf_tipo')

    class Meta:
        db_table = 'curso_fecha'

class CursoFormador(models.Model):
    id = models.DecimalField(db_column='cuo_id', max_digits=10, decimal_places=0, primary_key=True)
    curso = models.ForeignKey(Curso, on_delete=models.RESTRICT, db_column='cur_id')
    persona = models.ForeignKey(Persona, on_delete=models.RESTRICT, db_column='per_id')
    rol = models.ForeignKey(Rol, on_delete=models.RESTRICT, db_column='rol_id')
    seccion = models.ForeignKey(CursoSeccion, on_delete=models.RESTRICT, db_column='cus_id')
    director = models.BooleanField(db_column='cuo_director')

    class Meta:
        db_table = 'curso_formador'

class CursoAlimentacion(models.Model):
    id = models.DecimalField(db_column='cua_id', max_digits=10, decimal_places=0, primary_key=True)
    curso = models.ForeignKey(Curso, on_delete=models.RESTRICT, db_column='cur_id')
    alimentacion = models.ForeignKey(Alimentacion, on_delete=models.RESTRICT, db_column='ali_id')
    fecha = models.DateTimeField(db_column='cua_fecha')
    tiempo = models.IntegerField(db_column='cua_tiempo')
    descripcion = models.CharField(db_column='cua_descripcion', max_length=100)
    cantidad_adicional = models.IntegerField(db_column='cua_cantidad_adicional')
    vigente = models.BooleanField(db_column='cua_vigente')

    class Meta:
        db_table = 'curso_alimentacion'
