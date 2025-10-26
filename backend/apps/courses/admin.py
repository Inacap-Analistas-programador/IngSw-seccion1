from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import Course


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = (
        "code",
        "title",
        "rama",
        "status",
        "start_date",
        "end_date",
        "capacity_info",
        "course_actions",
    )
    list_filter = ("rama", "status", "start_date", "created_at")
    search_fields = ("code", "title", "description")
    ordering = ("-created_at",)
    date_hierarchy = "start_date"
    list_per_page = 20

    fieldsets = (
        ("Información Básica", {"fields": ("code", "title", "description", "category", "rama", "status")}),
        ("Fechas", {"fields": ("start_date", "end_date")}),
        ("Participantes y Precios", {"fields": ("max_participants", "price")}),
        ("Auditoría", {"fields": ("created_by", "created_at", "updated_at"), "classes": ("collapse",)}),
    )

    readonly_fields = ("created_at", "updated_at")

    def capacity_info(self, obj):
        # Implementación temporal: muestra cupos disponibles
        return f"{obj.available_slots}/{obj.max_participants}"

    capacity_info.short_description = "Cupos disponibles"

    def course_actions(self, obj):
        actions = []
        # Ver en frontend
        if obj.id:
            frontend_url = f"/courses/{obj.id}/"
            actions.append(
                f'<a href="{frontend_url}" target="_blank" title="Ver en frontend" style="text-decoration:none;">🌐</a>'
            )
        return mark_safe(" | ".join(actions)) if actions else "-"

    course_actions.short_description = "Acciones"

    def get_queryset(self, request):
        return super().get_queryset(request)

    def make_active(self, request, queryset):
        updated = queryset.update(status="ACTIVE")
        self.message_user(request, f"{updated} cursos activados.")

    make_active.short_description = "Activar cursos seleccionados"

    def make_inactive(self, request, queryset):
        updated = queryset.update(status="INACTIVE")
        self.message_user(request, f"{updated} cursos desactivados.")

    make_inactive.short_description = "Desactivar cursos seleccionados"

    actions = ["make_active", "make_inactive"]
