from django.db import models
from catalog.models import TipoArchivo
from authentication.models import Usuario
from courses.models import CursoSeccion
from personas.models import Persona

class Archivo(models.Model):
    id = models.DecimalField(max_digits=10, decimal_places=0, primary_key=True)
    tipo_archivo = models.ForeignKey(TipoArchivo, on_delete=models.RESTRICT)
    usuario_crea = models.ForeignKey(Usuario, on_delete=models.RESTRICT, related_name='archivos_creados')
    usuario_modifica = models.ForeignKey(Usuario, on_delete=models.RESTRICT, related_name='archivos_modificados', null=True, blank=True)
    fecha_hora = models.DateTimeField()
    descripcion = models.CharField(max_length=100)
    ruta = models.TextField()
    vigente = models.BooleanField()

class ArchivoCurso(models.Model):
    id = models.DecimalField(max_digits=10, decimal_places=0, primary_key=True)
    archivo = models.ForeignKey(Archivo, on_delete=models.RESTRICT)
    curso_seccion = models.ForeignKey(CursoSeccion, on_delete=models.RESTRICT)

class ArchivoPersona(models.Model):
    id = models.DecimalField(max_digits=10, decimal_places=0, primary_key=True)
    archivo = models.ForeignKey(Archivo, on_delete=models.RESTRICT)
    persona = models.ForeignKey(Persona, on_delete=models.RESTRICT)
    curso_seccion = models.ForeignKey(CursoSeccion, on_delete=models.RESTRICT)
