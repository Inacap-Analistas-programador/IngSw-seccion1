from django.db import models
from personas.models import Persona
from cursos.models import Curso
from usuarios.models import Usuario
from maestros.models import Rol, Rama
from geografia.models import Grupo

# Define choices for inscription states
ESTADO_INSCRIPCION_CHOICES = [
    ('borrador', 'Borrador'),
    ('enviado', 'Enviado'),
    ('en_revision_grupo', 'En Revisión (Grupo)'),
    ('en_revision_distrito', 'En Revisión (Distrito)'),
    ('en_revision_zona', 'En Revisión (Zona)'),
    ('validado', 'Validado'),
    ('rechazado', 'Rechazado'),
    ('confirmado_pago', 'Pago Confirmado'),
    ('acreditado', 'Acreditado'),
    ('en_lista_espera', 'En Lista de Espera'),
]

# Tabla: Preinscripcion
class Preinscripcion(models.Model):
    # id: Identificador único de la preinscripción (clave primaria)
    id = models.AutoField(primary_key=True)
    # persona: Clave foránea a Persona (quien se preinscribe)
    persona = models.ForeignKey(Persona, on_delete=models.CASCADE, db_column='persona_id', related_name='preinscripciones')
    # curso: Clave foránea a Curso (al que se preinscribe)
    curso = models.ForeignKey(Curso, on_delete=models.CASCADE, db_column='curso_id', related_name='preinscripciones')
    # estado: Estado actual de la preinscripción
    estado = models.CharField(max_length=20, choices=ESTADO_INSCRIPCION_CHOICES, default='borrador')
    # rama: Rama a la que pertenece el participante (si aplica)
    rama = models.ForeignKey(Rama, on_delete=models.CASCADE, db_column='rama_id', null=True, blank=True)
    # grupo_asignado: Grupo al que se asigna la persona
    grupo_asignado = models.ForeignKey(Grupo, on_delete=models.CASCADE, db_column='grupo_asignado_id', null=True, blank=True)
    # cuota_asignada: Información sobre la cuota asignada (podría ser un campo de texto o FK a un modelo de cuotas si existe)
    cuota_asignada = models.CharField(max_length=100, null=True, blank=True)
    # habilitado_por: Usuario que habilitó/validó la preinscripción (nullable)
    habilitado_por = models.ForeignKey(Usuario, on_delete=models.SET_NULL, db_column='habilitado_por_id', null=True, blank=True, related_name='preinscripciones_validadas')
    # habilitado_fecha: Fecha en que se habilitó/validó
    habilitado_fecha = models.DateTimeField(null=True, blank=True)
    # confirmado_por_pago_id: Referencia al pago que confirmó la inscripción (nullable)
    # Asumiendo que existe un modelo Pago en la app 'pagos'
    confirmado_por_pago = models.ForeignKey('pagos.PagoPersona', on_delete=models.SET_NULL, db_column='confirmado_por_pago_id', null=True, blank=True, related_name='preinscripciones_confirmadas')
    # en_lista_espera: Indica si la persona está en lista de espera
    en_lista_espera = models.BooleanField(default=False)
    # motivo_rechazo: Motivo si la preinscripción es rechazada
    motivo_rechazo = models.TextField(null=True, blank=True)
    # version_optimistic_lock: Para control de concurrencia (versión del registro)
    version_optimistic_lock = models.IntegerField(default=0)
    # created_at: Fecha y hora de creación
    created_at = models.DateTimeField(auto_now_add=True)
    # updated_at: Fecha y hora de última modificación
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'preinscripcion'
        verbose_name = 'Preinscripción'
        verbose_name_plural = 'Preinscripciones'
        # Asegurar que una persona solo pueda tener una preinscripción activa por curso
        unique_together = ('persona', 'curso')

    def __str__(self):
        return f"Preinscripción {self.id} de {self.persona} para {self.curso}"

# Tabla: PreinscripcionEstadoLog (auditoría de estados)
class PreinscripcionEstadoLog(models.Model):
    # id: Identificador único del log (clave primaria)
    id = models.AutoField(primary_key=True)
    # preinscripcion: Clave foránea a Preinscripcion (la preinscripción afectada)
    preinscripcion = models.ForeignKey(Preinscripcion, on_delete=models.CASCADE, db_column='preinscripcion_id', related_name='estado_logs')
    # estado_anterior: Estado anterior de la preinscripción
    estado_anterior = models.CharField(max_length=20, choices=ESTADO_INSCRIPCION_CHOICES)
    # estado_nuevo: Nuevo estado de la preinscripción
    estado_nuevo = models.CharField(max_length=20, choices=ESTADO_INSCRIPCION_CHOICES)
    # fecha: Fecha y hora del cambio de estado
    fecha = models.DateTimeField(auto_now_add=True)
    # cambiado_por: Usuario que realizó el cambio (nullable)
    cambiado_por = models.ForeignKey(Usuario, on_delete=models.SET_NULL, db_column='cambiado_por_id', null=True, blank=True, related_name='preinscripcion_estado_cambios')
    # detalle: Detalles adicionales sobre el cambio (ej. motivo de rechazo)
    detalle = models.TextField(null=True, blank=True)

    class Meta:
        db_table = 'preinscripcion_estado_log'
        verbose_name = 'Log de Estado de Preinscripción'
        verbose_name_plural = 'Logs de Estado de Preinscripciones'
        ordering = ['-fecha'] # Ordenar por fecha descendente

    def __str__(self):
        return f"Log {self.id}: {self.preinscripcion} de {self.estado_anterior} a {self.estado_nuevo}"

# Tabla: CupoConfiguracion
class CupoConfiguracion(models.Model):
    # id: Identificador único de la configuración de cupo (clave primaria)
    id = models.AutoField(primary_key=True)
    # curso: Clave foránea a Curso (al que se aplica la configuración de cupo)
    curso = models.ForeignKey(Curso, on_delete=models.CASCADE, db_column='curso_id', related_name='cupos_config')
    # rol: Rol para el cual se define el cupo (ej. 'participante', 'formador')
    rol = models.ForeignKey(Rol, on_delete=models.CASCADE, db_column='rol_id')
    # rama: Rama a la que se aplica el cupo (ej. 'scouts', 'lobatos')
    rama = models.ForeignKey(Rama, on_delete=models.CASCADE, db_column='rama_id', null=True, blank=True)
    # cupo_total: Número total de cupos disponibles para esta configuración
    cupo_total = models.IntegerField()
    # cupo_usado: Número de cupos ya utilizados
    cupo_usado = models.IntegerField(default=0)

    class Meta:
        db_table = 'cupo_configuracion'
        verbose_name = 'Configuración de Cupo'
        verbose_name_plural = 'Configuraciones de Cupos'
        # Asegurar que no haya configuraciones duplicadas para el mismo curso, rol y rama
        unique_together = ('curso', 'rol', 'rama')

    def __str__(self):
        return f"Cupos para {self.curso} ({self.rol} - {self.rama if self.rama else 'General'}): {self.cupo_usado}/{self.cupo_total}"

# Tabla: DocumentoPersona (extensión de Archivo para documentos médicos)
# Asumiendo que Archivo es un modelo genérico en la app 'archivos'
# Si Archivo no existe o no es adecuado, se crearía un modelo Documento genérico aquí.
# Por ahora, asumimos que Archivo puede ser extendido o relacionado.
# Si Archivo es un modelo base, podríamos tener una relación OneToOne o ForeignKey.
# Si es una herencia, sería una herencia directa.
# Dada la descripción, parece más una especialización.
# Si Archivo es un modelo base, podríamos hacer:
# class DocumentoPersona(Archivo):
#     persona = models.ForeignKey(Persona, on_delete=models.CASCADE, db_column='persona_id')
#     # ... otros campos específicos si los hay
#
# Sin embargo, para simplificar y dado que 'archivos' app tiene modelos como ArchivoCurso y ArchivoPersona,
# es más probable que se use una relación ForeignKey.
# Crearemos un modelo Documento genérico aquí que se relaciona con Persona y Archivo.

class Documento(models.Model):
    # id: Identificador único del documento (clave primaria)
    id = models.AutoField(primary_key=True)
    # persona: Clave foránea a Persona (a quién pertenece el documento)
    persona = models.ForeignKey(Persona, on_delete=models.CASCADE, db_column='persona_id', related_name='documentos')
    # archivo_relacionado: Clave foránea al modelo Archivo genérico (si existe)
    # Si no existe un modelo Archivo genérico, este campo podría ser un FileField directo.
    # Asumiendo que el modelo Archivo de la app 'archivos' es el que se usa para almacenar el archivo.
    archivo_relacionado = models.ForeignKey('archivos.Archivo', on_delete=models.CASCADE, db_column='archivo_id', related_name='documentos_asociados')
    # tipo_documento: Tipo de documento (ej. 'ficha_medica', 'dni', 'otro')
    tipo_documento = models.CharField(max_length=50)
    # numero: Número del documento (si aplica, ej. DNI)
    numero = models.CharField(max_length=50, null=True, blank=True)
    # file_path: Ruta al archivo (si no se usa Archivo.arc_ruta) - Podría ser redundante si Archivo.arc_ruta se usa.
    # file_path = models.CharField(max_length=255, null=True, blank=True)
    # file_size: Tamaño del archivo en bytes
    file_size = models.BigIntegerField(null=True, blank=True)
    # uploaded_at: Fecha y hora de subida del documento
    uploaded_at = models.DateTimeField(auto_now_add=True)
    # verified: Indica si el documento ha sido verificado
    verified = models.BooleanField(default=False)

    class Meta:
        db_table = 'preinscripcion_documento'
        verbose_name = 'Documento de Persona'
        verbose_name_plural = 'Documentos de Personas'

    def __str__(self):
        return f"Documento '{self.tipo_documento}' para {self.persona} ({self.uploaded_at.strftime('%Y-%m-%d')})"

