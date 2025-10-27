"""
Serializers para el módulo de archivos
"""

from rest_framework import serializers
from .models import FileUpload, FileDownload


class FileUploadSerializer(serializers.ModelSerializer):
    """Serializer básico para archivos"""

    uploaded_by_name = serializers.CharField(
        source="uploaded_by.get_full_name", read_only=True
    )
    verified_by_name = serializers.CharField(
        source="verified_by.get_full_name", read_only=True
    )
    file_extension = serializers.ReadOnlyField()
    size_human_readable = serializers.ReadOnlyField()
    download_url = serializers.SerializerMethodField()

    class Meta:
        model = FileUpload
        fields = [
            "id",
            "name",
            "description",
            "file",
            "download_url",
            "tipo",
            "estado",
            "original_name",
            "file_size",
            "size_human_readable",
            "file_extension",
            "mime_type",
            "preinscripcion",
            "course",
            "uploaded_by",
            "uploaded_by_name",
            "uploaded_at",
            "verified_by",
            "verified_by_name",
            "verified_at",
            "verification_notes",
            "is_public",
        ]
        read_only_fields = [
            "id",
            "original_name",
            "file_size",
            "mime_type",
            "uploaded_by",
            "uploaded_at",
            "verified_by",
            "verified_at",
        ]

    def get_download_url(self, obj):
        """URL para descargar el archivo"""
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(f"/api/files/{obj.id}/download/")
        return None


class FileUploadCreateSerializer(serializers.ModelSerializer):
    """Serializer para subir archivos"""

    # Algunos tests y clientes usan el nombre de campo en español 'archivo'.
    # Proporcionamos un alias que mapea a 'file' para compatibilidad.
    archivo = serializers.FileField(source="file", write_only=True, required=False)
    # Declarar 'file' explícitamente para que no sea requerido por defecto
    file = serializers.FileField(write_only=True, required=False)
    # 'name' puede ser omitido por el cliente; lo rellenamos desde el archivo
    name = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = FileUpload
        fields = [
            "name",
            "description",
            "file",
            # alias usado por tests/cliente en español
            "archivo",
            "tipo",
            "preinscripcion",
            "course",
            "is_public",
        ]

    def validate_file(self, value):
        """Valida el archivo subido"""
        # Verificar tamaño máximo (10MB)
        max_size = 10 * 1024 * 1024  # 10MB
        if value.size > max_size:
            raise serializers.ValidationError(
                "El archivo es demasiado grande. Máximo permitido: 10MB"
            )

        return value

    def create(self, validated_data):
        """Crea el archivo con metadatos"""
        file = validated_data.get("file")

        if not file:
            # No debería ocurrir porque la validación previene esto,
            # pero guardamos una defensiva clara.
            raise serializers.ValidationError({"file": "No se envió ningún archivo."})

        # Validación adicional del tamaño aquí por si el validador de campo
        # no fue invocado (ej. alias 'archivo' o comportamiento del cliente).
        max_size = 10 * 1024 * 1024  # 10MB
        if getattr(file, "size", 0) > max_size:
            raise serializers.ValidationError("El archivo es demasiado grande. Máximo permitido: 10MB")

        # Si no se proporcionó un nombre legible, usar el nombre original del archivo
        if not validated_data.get("name"):
            validated_data["name"] = getattr(file, "name", "uploaded_file")

        # Extraer metadatos del archivo
        validated_data["original_name"] = file.name
        validated_data["file_size"] = file.size
        validated_data["mime_type"] = getattr(file, "content_type", "")

        return super().create(validated_data)


class FileDownloadSerializer(serializers.ModelSerializer):
    """Serializer para descargas de archivos"""

    file_name = serializers.CharField(source="file.name", read_only=True)
    user_name = serializers.CharField(source="user.get_full_name", read_only=True)

    class Meta:
        model = FileDownload
        fields = [
            "id",
            "file",
            "file_name",
            "user",
            "user_name",
            "downloaded_at",
            "ip_address",
            "user_agent",
        ]
