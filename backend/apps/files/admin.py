from django.contrib import admin
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from .models import FileUpload


@admin.register(FileUpload)
class FileUploadAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "tipo_display",
        "size_formatted",
        "uploaded_by",
        "uploaded_at",
        "file_actions",
    )
    list_filter = ("tipo", "uploaded_at", "uploaded_by")
    search_fields = ("name", "description", "uploaded_by__username")
    ordering = ("-uploaded_at",)
    date_hierarchy = "uploaded_at"
    list_per_page = 25

    fieldsets = (
        (
            "Información del Archivo",
            {"fields": ("name", "description", "file", "file_type")},
        ),
        (
            "Metadatos",
            {
                "fields": ("uploaded_by", "file_size", "uploaded_at", "verified_at"),
                "classes": ("collapse",),
            },
        ),
    )

    readonly_fields = ("file_size", "uploaded_at", "verified_at")

    def size_formatted(self, obj):
        """Tamaño del archivo formateado"""
        size = getattr(obj, "file_size", None)
        if size:
            if size < 1024:
                return f"{size} B"
            elif size < 1024 * 1024:
                return f"{size / 1024:.1f} KB"
            else:
                return f"{size / (1024 * 1024):.1f} MB"
        return "-"

    size_formatted.short_description = "Tamaño"

    def file_actions(self, obj):
        """Acciones para el archivo"""
        actions = []

        if obj.file:
            # Descargar archivo
            actions.append(
                f'<a href="{obj.file.url}" target="_blank" title="Descargar" style="text-decoration:none;">📁</a>'
            )

            # Ver archivo si es imagen
            # existing model uses 'tipo' and 'mime_type' / original_name to infer
            file_type = getattr(obj, "tipo", "").lower()
            if file_type in ["imagen", "image", "pdf"] or (getattr(obj, "mime_type", "") or "").startswith("image"):
                actions.append(
                    f'<a href="{obj.file.url}" target="_blank" title="Ver archivo" style="text-decoration:none;">👁️</a>'
                )

        return mark_safe(" | ".join(actions)) if actions else "-"

    file_actions.short_description = "Acciones"

    def tipo_display(self, obj):
        return obj.get_tipo_display() if hasattr(obj, "get_tipo_display") else getattr(obj, "tipo", "-")

    tipo_display.short_description = "Tipo"

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("uploaded_by")
