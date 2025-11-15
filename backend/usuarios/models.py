from django.db import models

class Usuario(models.Model):
    # usu_id: Identificador único del usuario (clave primaria)
    usu_id = models.AutoField(primary_key=True)
    # pel_id: Clave foránea a la tabla Perfil (relación ManyToOne)
    pel_id = models.ForeignKey('maestros.Perfil', on_delete=models.CASCADE, db_column='pel_id')
    # usu_username: Nombre de usuario para el inicio de sesión
    usu_username = models.CharField(max_length=100, unique=True)
    # usu_password: Contraseña del usuario (debe ser hasheada en la aplicación)
    usu_password = models.CharField(max_length=50)
    # usu_email: Correo electrónico del usuario
    usu_email = models.EmailField(max_length=100)
    # usu_ruta_foto: Ruta al archivo de la foto del perfil del usuario
    usu_ruta_foto = models.CharField(max_length=255)
    # usu_vigente: Indica si el usuario está activo (True) o inactivo (False)
    usu_vigente = models.BooleanField()

    class Meta:
        db_table = 'usuario' # Nombre de la tabla en la base de datos
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'

    def __str__(self):
        return self.usu_username


from maestros.models import Perfil, Aplicacion

class PerfilAplicacion(models.Model):
    # pea_id: Identificador único de la relación (clave primaria)
    pea_id = models.AutoField(primary_key=True)
    # pel_id: Clave foránea a la tabla Perfil
    pel_id = models.ForeignKey(Perfil, on_delete=models.CASCADE, db_column='pel_id')
    # apl_id: Clave foránea a la tabla Aplicacion
    apl_id = models.ForeignKey(Aplicacion, on_delete=models.CASCADE, db_column='apl_id')
    # pea_ingresar: Permiso de ingreso
    pea_ingresar = models.BooleanField()
    # pea_modificar: Permiso de modificación
    pea_modificar = models.BooleanField()
    # pea_eliminar: Permiso de eliminación
    pea_eliminar = models.BooleanField()
    # pea_consultar: Permiso de consulta
    pea_consultar = models.BooleanField()

    class Meta:
        db_table = 'perfil_aplicacion'
        verbose_name = 'Perfil Aplicación'
        verbose_name_plural = 'Perfiles Aplicaciones'
        # Opcional: Asegurar que la combinación de perfil y aplicación sea única
        unique_together = ('pel_id', 'apl_id')

    def __str__(self):
        return f"{self.pel_id.pel_descripcion} - {self.apl_id.apl_descripcion}"
