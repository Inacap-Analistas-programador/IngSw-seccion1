from django.db import models
from apps.catalog.models import GrupoScout, Rama



class Persona(models.Model):
    """
    Persona básica del sistema. Ampliada para soportar búsquedas avanzadas.

    Campos clave para filtros:
    - rut: Índice único para búsqueda directa/por prefijo
    - nombres: Índice para búsquedas por nombre
    - grupo: FK indexada a GrupoScout
    - rama: FK indexada a Rama
    - fecha_nacimiento: Index para rango de edad
    """

    rut = models.CharField(max_length=15, db_index=True, blank=True, default="")
    nombres = models.CharField(max_length=50, db_index=True)
    email = models.EmailField(max_length=100)
    fecha_nacimiento = models.DateField(null=True, blank=True, db_index=True)
    direccion = models.CharField(max_length=255, blank=True)
    telefono = models.CharField(max_length=15, blank=True)
    vigente = models.BooleanField(default=True)

    # Relaciones organizacionales
    grupo = models.ForeignKey(
        GrupoScout, on_delete=models.SET_NULL, null=True, blank=True, related_name="personas"
    )
    rama = models.ForeignKey(
        Rama, on_delete=models.SET_NULL, null=True, blank=True, related_name="personas"
    )

    def __str__(self):
        return f"{self.nombres} <{self.email}>"

    class Meta:
        indexes = [
            models.Index(fields=["nombres"], name="idx_persona_nombres"),
            models.Index(fields=["fecha_nacimiento"], name="idx_persona_fnac"),
        ]
