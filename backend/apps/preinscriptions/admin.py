from django.contrib import admin
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from .models import Preinscripcion


@admin.register(Preinscripcion)
class PreinscripcionAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "course",
        "user_info",
        "estado",
        "total_paid",
        "created_at",
        "status_icons",
    )
    list_filter = ("estado", "created_at", "course")
    search_fields = (
        "course__title",
        "user__first_name",
        "user__last_name",
        "user__username",
        "user__email",
    )
    ordering = ("-created_at",)
    date_hierarchy = "created_at"
    list_per_page = 25

    fieldsets = (
        ("Información del Curso", {"fields": ("course",)}),
        (
            "Datos del Participante",
            {
                "fields": (
                    "persona",
                    "emergency_contact",
                    "emergency_phone",
                    "medical_info",
                    "dietary_restrictions",
                )
            },
        ),
        ("Estado y Seguimiento", {"fields": ("status", "payment_status", "notes")}),
        ("Fechas", {"fields": ("created_at", "updated_at"), "classes": ("collapse",)}),
    )

    readonly_fields = ("created_at", "updated_at")

    def user_info(self, obj):
        """Información del usuario inscrito"""
        if obj.user:
            full_name = (
                obj.user.get_full_name()
                if hasattr(obj.user, "get_full_name")
                else f"{getattr(obj.user, 'first_name', '')} {getattr(obj.user, 'last_name', '')}".strip()
            )
            display_name = full_name or getattr(obj.user, "username", "Usuario")
            return format_html(
                '<div><strong>{}</strong><br><small style="color: #666;">📧 {}</small></div>',
                display_name,
                getattr(obj.user, "email", "Sin email"),
            )
        return "-"

    user_info.short_description = "Participante"

    def status_icons(self, obj):
        """Iconos de estado visual"""
        icons = []

        # Estado de preinscripción (modelo usa 'estado')
        if getattr(obj, "estado", None) in ("BORRADOR", "ENVIADA", "VALIDACION"):
            icons.append('<span style="color: #f59e0b;">⏳ Pendiente</span>')
        elif getattr(obj, "estado", None) in ("APROBADA", "CONFIRMADA"):
            icons.append('<span style="color: #10b981;">✅ Aprobado</span>')
        elif getattr(obj, "estado", None) == "RECHAZADA":
            icons.append('<span style="color: #ef4444;">❌ Rechazado</span>')

        # Estado de pago: inferido desde total_paid
        try:
            paid = obj.total_paid if hasattr(obj, "total_paid") else 0
            if paid and float(paid) > 0:
                icons.append('<span style="color: #10b981;">� Pagado</span>')
            else:
                icons.append('<span style="color: #f59e0b;">� Pago pendiente</span>')
        except Exception:
            # If anything goes wrong reading payments, don't crash admin
            pass

        return format_html("<br>".join(icons)) if icons else "-"

    status_icons.short_description = "Estado"

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("course", "user")

    # Acciones masivas
    def approve_preinscriptions(self, request, queryset):
        """Aprobar preinscripciones seleccionadas"""
        updated = queryset.filter(estado__in=("ENVIADA", "VALIDACION")).update(estado="APROBADA")
        self.message_user(request, f"{updated} preinscripciones aprobadas.")

    approve_preinscriptions.short_description = "Aprobar preinscripciones seleccionadas"

    def reject_preinscriptions(self, request, queryset):
        """Rechazar preinscripciones seleccionadas"""
        updated = queryset.filter(estado__in=("ENVIADA", "VALIDACION")).update(estado="RECHAZADA")
        self.message_user(request, f"{updated} preinscripciones rechazadas.")

    reject_preinscriptions.short_description = "Rechazar preinscripciones seleccionadas"

    actions = ["approve_preinscriptions", "reject_preinscriptions"]
