from django.contrib import admin
from django.utils.html import format_html
from .models import FileUpload, FileDownload

@admin.register(FileUpload)
class FileUploadAdmin(admin.ModelAdmin):
    list_display = ("name", "tipo", "estado_colored", "size_human_readable", "uploaded_by", "uploaded_at", "is_public", "file_link")
    list_filter = ("tipo", "estado", "uploaded_at", "uploaded_by", "is_public")
    search_fields = ("name", "description", "uploaded_by__username", "original_name")
    ordering = ("-uploaded_at",)
    date_hierarchy = "uploaded_at"
    readonly_fields = ("uploaded_at", "verified_at", "verified_by")

    fieldsets = (
        ("File", {"fields": ("name", "file", "tipo", "estado", "original_name", "file_size", "mime_type", "is_public")}),
        ("Relaciones", {"fields": ("preinscripcion", "course")}),
        ("Auditoría", {"fields": ("uploaded_by", "uploaded_at", "verified_by", "verified_at", "verification_notes"), "classes": ("collapse",)}),
    )

    def file_link(self, obj):
        if obj.file:
            return format_html('<a href="{}" target="_blank">Descargar</a>', obj.file.url)
        return "-"

    file_link.short_description = "Descarga"

    COLOR_MAP = {
        "SUBIDO": "gray",
        "VERIFICANDO": "orange",
        "APROBADO": "green",
        "RECHAZADO": "red",
    }

    def estado_colored(self, obj):
        color = self.COLOR_MAP.get(obj.estado, "gray")
        return format_html('<span style="color:{};font-weight:bold;">{}</span>', color, obj.get_estado_display())

    estado_colored.short_description = "Estado"

    def aprobar_archivos(self, request, queryset):
        # Only allow transition to APROBADO from SUBIDO or VERIFICANDO
        valid_prev_states = ["SUBIDO", "VERIFICANDO"]
        valid_queryset = queryset.filter(estado__in=valid_prev_states)
        updated = valid_queryset.update(estado="APROBADO")
        self.message_user(request, f"{updated} archivos aprobados. Solo se aprobaron archivos en estados válidos.")
        updated = queryset.update(estado="APROBADO")
        self.message_user(request, f"{updated} archivos aprobados.")
    def rechazar_archivos(self, request, queryset):
        # Only reject files that are not already approved
        to_reject = queryset.exclude(estado="APROBADO")
        updated = to_reject.update(estado="RECHAZADO")
        skipped = queryset.count() - to_reject.count()
        if updated:
            self.message_user(request, f"{updated} archivos rechazados.")
        if skipped:
            self.message_user(request, f"{skipped} archivos no se pueden rechazar porque ya están aprobados.", level="warning")
@admin.register(FileDownload)
class FileDownloadAdmin(admin.ModelAdmin):
    """Admin interface for tracking file downloads."""
    list_display = ("file", "user", "downloaded_at", "ip_address")
    list_filter = ("downloaded_at", "user")
    search_fields = ("file__name", "user__username", "ip_address")

