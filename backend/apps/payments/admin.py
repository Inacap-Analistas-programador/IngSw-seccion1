from django.contrib import admin
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from django.db.models import Sum
from .models import PagoPersona


@admin.register(PagoPersona)
class PagoPersonaAdmin(admin.ModelAdmin):
    list_display = (
        "PAP_ID",
        "persona_info",
        "course_info",
        "amount_formatted",
        "PAP_TIPO",
        "pap_fecha_hora",
        "status_icons",
    )
    list_filter = ("PAP_TIPO", "PAP_FECHA_HORA", "USU_ID")
    search_fields = ("PER_ID", "CUR_ID", "USU_ID__username", "PAP_OBSERVACION", "PAP_ID")
    ordering = ("-PAP_FECHA_HORA",)
    date_hierarchy = "PAP_FECHA_HORA"
    list_per_page = 25

    fieldsets = (
        (
            "Información del Pago",
            {"fields": ("PER_ID", "CUR_ID", "PAP_VALOR", "PAP_TIPO")},
        ),
        (
            "Estado y Transacción",
            {"fields": ("PAP_OBSERVACION",)},
        ),
        (
            "Fechas del Sistema",
            {"fields": ("PAP_FECHA_HORA",), "classes": ("collapse",)},
        ),
    )

    readonly_fields = ("PAP_FECHA_HORA",)

    def persona_info(self, obj):
        """Información de la persona que realizó el pago"""
        # The model stores PER_ID (integer). Try resolving a Persona model instance if available.
        try:
            from django.apps import apps as django_apps

            Persona = django_apps.get_model("personas", "Persona")
            persona = Persona.objects.filter(id=getattr(obj, "PER_ID", None)).first()
            if persona:
                name = getattr(persona, "get_full_name", lambda: f"{getattr(persona, 'first_name', '')} {getattr(persona, 'last_name', '')}")()
                rut = getattr(persona, "rut", "")
                return format_html(
                    '<div><strong>{}</strong><br><small style="color: #666;">RUT: {}</small></div>',
                    name,
                    rut or "Sin RUT",
                )
        except Exception:
            pass

        # Fallback to showing PER_ID
        per = getattr(obj, "PER_ID", None)
        return f"Persona ID: {per}" if per is not None else "-"

    persona_info.short_description = "Participante"

    def amount_formatted(self, obj):
        """Monto formateado"""
        amount = getattr(obj, "PAP_VALOR", None)
        try:
            return format_html('<strong style="color: #059669;">${:,.0f}</strong>', amount)
        except Exception:
            return str(amount) or "-"

    amount_formatted.short_description = "Monto"

    def status_icons(self, obj):
        """Estado visual con iconos"""
        status_info = []

        # Estado del pago
        # Use PAP_TIPO to indicate Ingreso/Egreso
        tipo = getattr(obj, "PAP_TIPO", None)
        if tipo == 1:
            status_info.append('<span style="color: #10b981;">✅ Ingreso</span>')
        elif tipo == 2:
            status_info.append('<span style="color: #ef4444;">↩️ Egreso</span>')

        # Show a short observation if present
        obs = getattr(obj, "PAP_OBSERVACION", None)
        if obs:
            status_info.append(f"<small style=\"color:#666\">{obs[:40]}{'...' if len(obs) > 40 else ''}</small>")

        return format_html("<br>".join(status_info)) if status_info else "-"

    status_icons.short_description = "Estado y Método"

    def get_queryset(self, request):
        # PER_ID and CUR_ID are integer fields; only USU_ID is a FK
        return super().get_queryset(request).select_related("USU_ID")

    def course_info(self, obj):
        """Resolve a course name from CUR_ID if possible"""
        try:
            from django.apps import apps as django_apps

            Course = django_apps.get_model("courses", "Course")
            course = Course.objects.filter(id=getattr(obj, "CUR_ID", None)).first()
            if course:
                return getattr(course, "title", str(course))
        except Exception:
            pass
        cur = getattr(obj, "CUR_ID", None)
        return f"Curso ID: {cur}" if cur is not None else "-"

    def pap_fecha_hora(self, obj):
        dt = getattr(obj, "PAP_FECHA_HORA", None)
        return dt if dt is not None else "-"

    course_info.short_description = "Curso"
    pap_fecha_hora.short_description = "Fecha/Hora"

    # No bulk status actions are defined because this model uses legacy field names (PAP_TIPO, etc.)
    actions = []

    def changelist_view(self, request, extra_context=None):
        """Agregar estadísticas al changelist"""
        extra_context = extra_context or {}

        # Calcular estadísticas
        queryset = self.get_queryset(request)
        total_amount = queryset.aggregate(total=Sum("PAP_VALOR"))["total"] or 0
        pending_count = queryset.filter(PAP_TIPO=1).count()
        completed_count = queryset.filter(PAP_TIPO=2).count()

        extra_context["total_amount"] = total_amount
        extra_context["pending_count"] = pending_count
        extra_context["completed_count"] = completed_count

        return super().changelist_view(request, extra_context=extra_context)
