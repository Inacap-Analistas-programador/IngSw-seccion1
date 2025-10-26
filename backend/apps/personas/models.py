from django.db import models

class Persona(models.Model):
    nombres = models.CharField(max_length=50)
    email = models.EmailField(max_length=100)
    fecha_nacimiento = models.DateField(null=True, blank=True)
    direccion = models.CharField(max_length=255, null=True, blank=True)
    telefono = models.CharField(max_length=15, null=True, blank=True)
    vigente = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.nombres} <{self.email}>"
