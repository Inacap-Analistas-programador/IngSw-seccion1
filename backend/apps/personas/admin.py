from django.contrib import admin
from .models import Persona

@admin.register(Persona)
class PersonaAdmin(admin.ModelAdmin):
    list_display = ("id", "nombres", "email", "fecha_nacimiento", "direccion", "telefono", "vigente")
    search_fields = ("nombres", "email", "direccion", "telefono")
    list_filter = ("vigente", "fecha_nacimiento")
    ordering = ("nombres",)
    list_per_page = 25

    fieldsets = (
        ("Datos Básicos", {"fields": ("nombres", "email", "fecha_nacimiento", "direccion", "telefono", "vigente")}),
    )

    readonly_fields = ()
