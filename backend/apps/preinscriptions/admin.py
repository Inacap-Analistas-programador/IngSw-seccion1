from django.contrib import admin
from django.utils.html import format_html
from .models import Preinscripcion

@admin.register(Preinscripcion)
class PreinscripcionAdmin(admin.ModelAdmin):
	list_display = ("user", "course", "estado", "grupo", "created_at", "total_paid", "estado_icon")
	list_filter = ("estado", "created_at", "course")
	search_fields = ("user__username", "course__title", "grupo")
	ordering = ("-created_at",)
	date_hierarchy = "created_at"
	readonly_fields = ("created_at", "updated_at")

	fieldsets = (
		("Datos de Preinscripción", {"fields": ("user", "course", "estado", "grupo", "observaciones")}),
		("Fechas", {"fields": ("created_at", "updated_at", "confirmado_at", "validated_at", "cancelled_at"), "classes": ("collapse",)}),
	)

	def estado_icon(self, obj):
		color = {
			"BORRADOR": "gray",
			"ENVIADA": "blue",
			"VALIDACION": "orange",
			"APROBADA": "green",
			"RECHAZADA": "red",
			"CONFIRMADA": "purple",
			"CANCELADA": "black",
		}.get(obj.estado, "gray")
		return format_html('<span style="color:{};font-weight:bold;">{}</span>', color, obj.get_estado_display())

	estado_icon.short_description = "Estado visual"
