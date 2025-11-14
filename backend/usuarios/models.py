from django.db import models

class Usuario(models.Model):
    # usu_id: Identificador único del usuario (clave primaria)
    usu_id = models.AutoField(primary_key=True)
    # pel_id: Clave foránea a la tabla Perfil (relación ManyToOne)
    pel_id = models.ForeignKey('usuarios.Perfil', on_delete=models.CASCADE, db_column='pel_id')
    # usu_username: Nombre de usuario para el inicio de sesión
    usu_username = models.CharField(max_length=100, unique=True)
    # usu_password: Contraseña del usuario (debe ser hasheada en la aplicación)
    usu_password = models.CharField(max_length=128) # Django usa max_length=128 para contraseñas hasheadas
    # usu_ruta_foto: Ruta al archivo de la foto del perfil del usuario
    usu_ruta_foto = models.TextField()
    # usu_vigente: Indica si el usuario está activo (True) o inactivo (False)
    usu_vigente = models.BooleanField()

    class Meta:
        db_table = 'usuario' # Nombre de la tabla en la base de datos
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'

    def __str__(self):
        return self.usu_username

class Perfil(models.Model):
    # pel_id: Identificador único del perfil (clave primaria)
    pel_id = models.AutoField(primary_key=True)
    # pel_descripcion: Descripción del perfil (ej. Administrador, Usuario, etc.)
    pel_descripcion = models.CharField(max_length=50)
    # pel_vigente: Indica si el perfil está activo (True) o inactivo (False)
    pel_vigente = models.BooleanField()

    class Meta:
        db_table = 'perfil' # Nombre de la tabla en la base de datos
        verbose_name = 'Perfil'
        verbose_name_plural = 'Perfiles'

    def __str__(self):
        return self.pel_descripcion

# Nota: La tabla 'perfil_aplicacion' es una tabla de unión para la relación ManyToMany entre Perfil y Aplicacion.
# Se definirá en la aplicación 'usuarios' si es necesario, o se puede manejar en una aplicación separada si la lógica lo amerita.
# Por ahora, se asume que 'aplicacion' podría ser una tabla maestra en 'maestros' o una entidad separada.
# Si 'aplicacion' es una entidad de gestión de permisos, podría ir aquí o en una app de 'permisos'.
# Dado que el diagrama la muestra relacionada con Perfil, la incluiremos aquí por ahora.

class Aplicacion(models.Model):
    # apl_id: Identificador único de la aplicación (clave primaria)
    apl_id = models.AutoField(primary_key=True)
    # apl_descripcion: Nombre o descripción de la aplicación/módulo
    apl_descripcion = models.CharField(max_length=50)
    # apl_vigente: Indica si la aplicación está activa (True) o inactiva (False)
    apl_vigente = models.BooleanField()

    class Meta:
        db_table = 'aplicacion'
        verbose_name = 'Aplicación'
        verbose_name_plural = 'Aplicaciones'

    def __str__(self):
        return self.apl_descripcion

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
