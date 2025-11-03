from django.contrib.auth.models import AbstractUser
from django.db import models
from catalog.models import Perfil


class Usuario(AbstractUser):
    perfil = models.ForeignKey(
        Perfil, on_delete=models.RESTRICT, db_column="pel_id", blank=True, null=True
    )
    ruta_foto = models.CharField(db_column="usu_ruta_foto", max_length=255, blank=True, null=True)
    vigente = models.BooleanField(db_column="usu_vigente", default=True)

    class Meta:
        db_table = "usuario"

    def __str__(self):
        return self.username
