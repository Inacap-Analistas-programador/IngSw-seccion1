"""
Modelos para gestión de archivos
Sistema de Gestión Integral de Cursos Scout
"""

import os
from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import FileExtensionValidator

User = get_user_model()


def upload_path(instance, filename):
    """Genera la ruta de subida para archivos"""
    # Organizar por año/mes/día/usuario
    from datetime import datetime

    now = datetime.now()
    return f"uploads/{now.year}/{now.month:02d}/{now.day:02d}/{instance.uploaded_by.id}/{filename}"


class FileUpload(models.Model):
    """
    Modelo para gestión de archivos subidos
    """

    # Tipos de archivo
    TIPO_CHOICES = [
        ("DOCUMENTO", "Documento"),
        ("IMAGEN", "Imagen"),
        ("CERTIFICADO", "Certificado"),
        ("COMPROBANTE", "Comprobante de Pago"),
        ("OTRO", "Otro"),
    ]

    # Estados del archivo
    ESTADO_CHOICES = [
        ("SUBIDO", "Subido"),
        ("VERIFICANDO", "En Verificación"),
        ("APROBADO", "Aprobado"),
        ("RECHAZADO", "Rechazado"),
    ]

    # Información básica del archivo
    name = models.CharField(max_length=255, verbose_name="Nombre del archivo")
    description = models.TextField(blank=True, verbose_name="Descripción")
    file = models.FileField(
        upload_to=upload_path,
        validators=[
            FileExtensionValidator(
                allowed_extensions=["pdf", "doc", "docx", "jpg", "jpeg", "png", "gif"]
            )
        ],
    )

    # Clasificación
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES, default="DOCUMENTO")
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default="SUBIDO")

    # Metadatos
    original_name = models.CharField(max_length=255)
    file_size = models.PositiveIntegerField(help_text="Tamaño en bytes")
    mime_type = models.CharField(max_length=100, blank=True)

    # Relaciones opcionales
    preinscripcion = models.ForeignKey(
        "preinscriptions.Preinscripcion",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="archivos",
    )

    course = models.ForeignKey(
        "courses.Course",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="archivos",
    )

    # Auditoría
    uploaded_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="uploaded_files"
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)

    # Verificación
    verified_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="verified_files",
    )
    verified_at = models.DateTimeField(null=True, blank=True)
    verification_notes = models.TextField(blank=True)

    # Control de acceso
    is_public = models.BooleanField(
        default=False, help_text="Si el archivo es público o requiere autenticación"
    )

    class Meta:
        db_table = "file_uploads"
        verbose_name = "Archivo"
        verbose_name_plural = "Archivos"
        ordering = ["-uploaded_at"]

    def __str__(self):
        return f"{self.name} ({self.get_tipo_display()})"

    @property
    def file_extension(self):
        """Obtiene la extensión del archivo"""
        return os.path.splitext(self.original_name)[1].lower()

    @property
    def size_human_readable(self):
        """Tamaño del archivo en formato legible"""
        size = self.file_size
        for unit in ["bytes", "KB", "MB", "GB"]:
            if size < 1024.0:
                return f"{size:.1f} {unit}"
            size /= 1024.0
        return f"{size:.1f} TB"

    def puede_descargar(self, user):
        """Verifica si un usuario puede descargar el archivo"""
        if self.is_public:
            return True

        # El propietario siempre puede descargar
        if self.uploaded_by == user:
            return True

        # Staff puede descargar cualquier archivo
        if user.is_staff:
            return True

        # Si está relacionado con una preinscripción del usuario
        if self.preinscripcion and self.preinscripcion.user == user:
            return True

        return False


class FileDownload(models.Model):
    """
    Registro de descargas de archivos
    """

    file = models.ForeignKey(
        FileUpload, on_delete=models.CASCADE, related_name="downloads"
    )
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="file_downloads"
    )

    downloaded_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)

    class Meta:
        db_table = "file_downloads"
        verbose_name = "Descarga de Archivo"
        verbose_name_plural = "Descargas de Archivos"

    def __str__(self):
        return f"{self.file.name} descargado por {self.user.username}"
