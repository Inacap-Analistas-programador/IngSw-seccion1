from django.contrib import admin
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from .models import FileUpload, FileDownload


@admin.register(FileUpload)
class FileUploadAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "tipo",
        "size_human_readable",
        "uploaded_by",
        "uploaded_at",
    )
    list_filter = ("tipo", "uploaded_at", "uploaded_by")
    search_fields = ("name", "description", "uploaded_by__username")
    ordering = ("-uploaded_at",)
    date_hierarchy = "uploaded_at"

    readonly_fields = ("uploaded_at",)

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("uploaded_by")


@admin.register(FileDownload)
class FileDownloadAdmin(admin.ModelAdmin):
    list_display = ("file", "user", "downloaded_at")
    list_filter = ("downloaded_at", "user")
    search_fields = ("file__name", "user__username")
