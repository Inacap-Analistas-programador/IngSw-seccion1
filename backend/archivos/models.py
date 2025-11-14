from django.db import models
from usuarios.models import Usuario
from cursos.models import CursoSeccion
from maestros.models import TipoArchivo
from personas.models import Persona

# Tabla: archivo
class Archivo(models.Model):
    # arc_id: Identificador único del archivo (clave primaria)
    arc_id = models.AutoField(primary_key=True)
    # tar_id: Clave foránea a TipoArchivo (tipo de archivo)
    tar_id = models.ForeignKey(TipoArchivo, on_delete=models.CASCADE, db_column='tar_id')
    # usu_id_crea: Clave foránea a Usuario (quien creó el registro)
    usu_id_crea = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='archivos_creados', db_column='usu_id_crea')
    # usu_id_modifica: Clave foránea a Usuario (quien modificó por última vez, opcional)
    usu_id_modifica = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='archivos_modificados', db_column='usu_id_modifica', null=True, blank=True)
    # arc_fecha_hora: Fecha y hora de registro/modificación
    arc_fecha_hora = models.DateTimeField()
    # arc_descripcion: Descripción del archivo
    arc_descripcion = models.CharField(max_length=100)
    # arc_ruta: Ruta completa al archivo en el sistema
    arc_ruta = models.TextField()
    # arc_vigente: Indica si el archivo está activo (True) o inactivo (False)
    arc_vigente = models.BooleanField()

    class Meta:
        db_table = 'archivo'
        verbose_name = 'Archivo'
        verbose_name_plural = 'Archivos'

    def __str__(self):
        return f"{self.arc_descripcion} ({self.tar_id})"

# Tabla: archivo_curso
class ArchivoCurso(models.Model):
    # aru_id: Identificador único de la relación (clave primaria)
    aru_id = models.AutoField(primary_key=True)
    # arc_id: Clave foránea a Archivo (relación ManyToOne)
    arc_id = models.ForeignKey(Archivo, on_delete=models.CASCADE, db_column='arc_id')
    # cus_id: Clave foránea a CursoSeccion (relación ManyToOne)
    cus_id = models.ForeignKey(CursoSeccion, on_delete=models.CASCADE, db_column='cus_id')

    class Meta:
        db_table = 'archivo_curso'
        verbose_name = 'Archivo de Curso'
        verbose_name_plural = 'Archivos de Curso'
        unique_together = ('arc_id', 'cus_id') # Un archivo solo puede estar asociado a una sección de curso una vez

    def __str__(self):
        return f"Archivo {self.arc_id} para Curso Sección {self.cus_id}"

# Tabla: archivo_persona
class ArchivoPersona(models.Model):
    # arp_id: Identificador único de la relación (clave primaria)
    arp_id = models.AutoField(primary_key=True)
    # arc_id: Clave foránea a Archivo (relación ManyToOne)
    arc_id = models.ForeignKey(Archivo, on_delete=models.CASCADE, db_column='arc_id')
    # per_id: Clave foránea a Persona (relación ManyToOne)
    per_id = models.ForeignKey(Persona, on_delete=models.CASCADE, db_column='per_id')
    # cus_id: Clave foránea a CursoSeccion (relación ManyToOne)
    cus_id = models.ForeignKey(CursoSeccion, on_delete=models.CASCADE, db_column='cus_id')

    class Meta:
        db_table = 'archivo_persona'
        verbose_name = 'Archivo de Persona'
        verbose_name_plural = 'Archivos de Persona'
        unique_together = ('arc_id', 'per_id', 'cus_id') # Un archivo solo puede estar asociado a una persona en un curso una vez

    def __str__(self):
        return f"Archivo {self.arc_id} para Persona {self.per_id} en Curso Sección {self.cus_id}"
