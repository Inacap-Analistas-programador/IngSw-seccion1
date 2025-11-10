from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from catalog.models import Perfil


<<<<<<< Updated upstream
class UsuarioManager(BaseUserManager):
    def create_user(self, username, password=None, **extra_fields):
        if not username:
            raise ValueError("El nombre de usuario es obligatorio")
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        return self.create_user(username, password, **extra_fields)


class Usuario(AbstractBaseUser, PermissionsMixin):
    id = models.DecimalField(
        db_column="usu_id", max_digits=10, decimal_places=0, primary_key=True
    )
    perfil = models.ForeignKey(
        Perfil, on_delete=models.RESTRICT, db_column="pel_id", blank=True, null=True
    )
    username = models.CharField(db_column="usu_username", max_length=100, unique=True)
    # password se hereda de AbstractBaseUser
    ruta_foto = models.CharField(db_column="usu_ruta_foto", max_length=255, blank=True, null=True)
    vigente = models.BooleanField(db_column="usu_vigente", default=True)

    # Campos requeridos por AbstractBaseUser y PermissionsMixin (asumidos)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    objects = UsuarioManager() # Requerido por AbstractBaseUser
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []
    
    # Asumimos que los métodos has_perm y has_module_perms existen en la implementación completa.
=======
class Usuario(AbstractUser):
    perfil = models.ForeignKey(
        Perfil, on_delete=models.SET_NULL, null=True, blank=True, db_column="pel_id"
    )
    ruta_foto = models.CharField(
        max_length=255, blank=True, null=True, db_column="usu_ruta_foto"
    )
    vigente = models.BooleanField(default=True, db_column="usu_vigente")
>>>>>>> Stashed changes

    class Meta:
        db_table = "usuario"

    def __str__(self):
        return self.username
    
    # Métodos requeridos por PermissionsMixin (si no están en la implementación completa)
    # def has_perm(self, perm, obj=None):
    #     return self.is_superuser
    #
    # def has_module_perms(self, app_label):
    #     return self.is_superuser