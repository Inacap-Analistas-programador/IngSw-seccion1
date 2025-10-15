from django.contrib import admin
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from .models import File


@admin.register(File)
class FileAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "file_type",
        "size_formatted",
        "uploaded_by",
        "created_at",
        "file_actions",
    )
    list_filter = ("file_type", "created_at", "uploaded_by")
    search_fields = ("name", "description", "uploaded_by__username")
    ordering = ("-created_at",)
    date_hierarchy = "created_at"
    list_per_page = 25

    fieldsets = (
        (
            "Información del Archivo",
            {"fields": ("name", "description", "file", "file_type")},
        ),
        (
            "Metadatos",
            {
                "fields": ("uploaded_by", "size", "created_at", "updated_at"),
                "classes": ("collapse",),
            },
        ),
    )

    readonly_fields = ("size", "created_at", "updated_at")

    def size_formatted(self, obj):
        """Tamaño del archivo formateado"""
        if obj.size:
            if obj.size < 1024:
                return f"{obj.size} B"
            elif obj.size < 1024 * 1024:
                return f"{obj.size / 1024:.1f} KB"
            else:
                return f"{obj.size / (1024 * 1024):.1f} MB"
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
            if obj.file_type in ["image", "pdf"]:
                actions.append(
                    f'<a href="{obj.file.url}" target="_blank" title="Ver archivo" style="text-decoration:none;">👁️</a>'
                )

        return mark_safe(" | ".join(actions)) if actions else "-"

    file_actions.short_description = "Acciones"

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("uploaded_by")
