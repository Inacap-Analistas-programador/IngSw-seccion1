from django.contrib.auth.models import AbstractUser
from django.db import models
from catalog.models import Perfil

class Usuario(AbstractUser):
    perfil = models.ForeignKey(Perfil, on_delete=models.SET_NULL, null=True, blank=True, db_column='pel_id')
    ruta_foto = models.CharField(max_length=255, blank=True, null=True, db_column='usu_ruta_foto')
    vigente = models.BooleanField(default=True, db_column='usu_vigente')

    class Meta:
        db_table = 'usuario'

    def save(self, *args, **kwargs):
        # Asegurarse de que el username y usu_username estén sincronizados
        self.username = self.usu_username
        super().save(*args, **kwargs)

    @property
    def usu_username(self):
        return self.username

    @usu_username.setter
    def usu_username(self, value):
        self.username = value
