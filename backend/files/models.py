from django.db import models
from authentication.models import Usuario
from catalog.models import TipoArchivo



class Archivo(models.Model):
<<<<<<< Updated upstream
    id = models.DecimalField(
        db_column="arc_id", max_digits=10, decimal_places=0, primary_key=True
    )
    tipo_archivo = models.ForeignKey(
        TipoArchivo, on_delete=models.RESTRICT, db_column="tar_id"
    )
    usuario_crea = models.ForeignKey(
        Usuario,
        on_delete=models.RESTRICT,
        db_column="usu_id_crea",
        related_name="archivos_creados",
=======
    id = models.DecimalField(max_digits=10, decimal_places=0, primary_key=True)
    tipo_archivo = models.ForeignKey(TipoArchivo, on_delete=models.RESTRICT)
    usuario_crea = models.ForeignKey(
        Usuario, on_delete=models.RESTRICT, related_name="archivos_creados"
>>>>>>> Stashed changes
    )
    usuario_modifica = models.ForeignKey(
        Usuario,
        on_delete=models.RESTRICT,
<<<<<<< Updated upstream
        db_column="usu_id_modifica",
        related_name="archivos_modificados",
        blank=True,
        null=True,
    )
    fecha_hora = models.DateTimeField(db_column="arc_fecha_hora")
    descripcion = models.CharField(db_column="arc_descripcion", max_length=100)
    ruta = models.TextField(db_column="arc_ruta")
    vigente = models.BooleanField(db_column="arc_vigente")

    class Meta:
        db_table = "archivo"

=======
        related_name="archivos_modificados",
        null=True,
        blank=True,
    )
    fecha_hora = models.DateTimeField()
    descripcion = models.CharField(max_length=100)
    ruta = models.TextField()
    vigente = models.BooleanField()
>>>>>>> Stashed changes


class ArchivoCurso(models.Model):
    id = models.DecimalField(
        db_column="aru_id", max_digits=10, decimal_places=0, primary_key=True
    )
    archivo = models.ForeignKey(Archivo, on_delete=models.RESTRICT, db_column="arc_id")
    curso_seccion = models.ForeignKey(
        "courses.CursoSeccion", on_delete=models.RESTRICT, db_column="cus_id"
    )

    class Meta:
        db_table = "archivo_curso"



class ArchivoPersona(models.Model):
    id = models.DecimalField(
        db_column="arp_id", max_digits=10, decimal_places=0, primary_key=True
    )
    archivo = models.ForeignKey(Archivo, on_delete=models.RESTRICT, db_column="arc_id")
    persona = models.ForeignKey(
        "personas.Persona", on_delete=models.RESTRICT, db_column="per_id"
    )
    curso_seccion = models.ForeignKey(
        "courses.CursoSeccion", on_delete=models.RESTRICT, db_column="cus_id"
    )

    class Meta:
        db_table = "archivo_persona"
