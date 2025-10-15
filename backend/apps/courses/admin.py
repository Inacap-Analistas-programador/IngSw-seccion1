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
        "modality",
        "status",
        "start_date",
        "end_date",
        "capacity_info",
        "course_actions",
    )
    list_filter = ("modality", "status", "start_date", "created_at")
    search_fields = ("code", "title", "description")
    ordering = ("-created_at",)
    date_hierarchy = "start_date"
    list_per_page = 20

    fieldsets = (
        (
            "Información Básica",
            {"fields": ("code", "title", "description", "modality", "status")},
        ),
        (
            "Fechas y Duración",
            {"fields": ("start_date", "end_date", "duration_hours", "location")},
        ),
        (
            "Capacidad y Costos",
            {
                "fields": (
                    "max_participants",
                    "min_participants",
                    "price",
                    "early_bird_price",
                    "early_bird_deadline",
                )
            },
        ),
        (
            "Requisitos",
            {
                "fields": ("requirements", "target_audience", "age_min", "age_max"),
                "classes": ("collapse",),
            },
        ),
        (
            "Metadatos",
            {"fields": ("created_at", "updated_at"), "classes": ("collapse",)},
        ),
    )

    readonly_fields = ("created_at", "updated_at")

    def capacity_info(self, obj):
        """Información de capacidad del curso"""
        # Obtener inscripciones relacionadas
        from apps.preinscriptions.models import Preinscription

        enrolled = Preinscription.objects.filter(course=obj, status="approved").count()
        max_cap = obj.max_participants or 0
        percentage = (enrolled / max_cap * 100) if max_cap > 0 else 0

        if percentage < 70:
            color = "green"
        elif percentage < 90:
            color = "orange"
        else:
            color = "red"

        return format_html(
            '<span style="color: {}; font-weight: bold;">{}/{} ({}%)</span>',
            color,
            enrolled,
            max_cap,
            round(percentage, 1),
        )

    capacity_info.short_description = "Cupos (Ocupados/Total)"

    def course_actions(self, obj):
        """Acciones rápidas para el curso"""
        actions = []

        # Ver preinscripciones
        try:
            preinscription_url = (
                reverse("admin:preinscriptions_preinscription_changelist")
                + f"?course={obj.id}"
            )
            actions.append(
                f'<a href="{preinscription_url}" title="Ver preinscripciones" style="text-decoration:none;">👥</a>'
            )
        except:
            pass

        # Ver pagos
        try:
            payment_url = (
                reverse("admin:payments_payment_changelist") + f"?course={obj.id}"
            )
            actions.append(
                f'<a href="{payment_url}" title="Ver pagos" style="text-decoration:none;">💰</a>'
            )
        except:
            pass

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

    # Acciones masivas
    def make_active(self, request, queryset):
        """Activar cursos seleccionados"""
        updated = queryset.update(status="active")
        self.message_user(request, f"{updated} cursos activados.")

    make_active.short_description = "Activar cursos seleccionados"

    def make_inactive(self, request, queryset):
        """Desactivar cursos seleccionados"""
        updated = queryset.update(status="inactive")
        self.message_user(request, f"{updated} cursos desactivados.")

    make_inactive.short_description = "Desactivar cursos seleccionados"

    actions = ["make_active", "make_inactive"]
