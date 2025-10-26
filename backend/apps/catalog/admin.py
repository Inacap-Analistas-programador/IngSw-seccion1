from django.contrib import admin
from .models import Region, Provincia, Comuna, Zona, Distrito, GrupoScout, Rama, TipoCurso, Nivel, EstadoCivil, TipoAlimentacion

@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
	list_display = ("codigo", "nombre", "nombre_corto", "is_active", "created_at")
	search_fields = ("codigo", "nombre")
	list_filter = ("is_active",)
	ordering = ("codigo",)

@admin.register(Provincia)
class ProvinciaAdmin(admin.ModelAdmin):
	list_display = ("codigo", "nombre", "region", "is_active", "created_at")
	search_fields = ("codigo", "nombre", "region__nombre")
	list_filter = ("region", "is_active")
	ordering = ("region", "nombre")

@admin.register(Comuna)
class ComunaAdmin(admin.ModelAdmin):
	list_display = ("codigo", "nombre", "provincia", "is_active", "created_at")
	search_fields = ("codigo", "nombre", "provincia__nombre")
	list_filter = ("provincia", "is_active")
	ordering = ("provincia", "nombre")

@admin.register(Zona)
class ZonaAdmin(admin.ModelAdmin):
	list_display = ("codigo", "nombre", "region_principal", "is_active", "created_at")
	search_fields = ("codigo", "nombre")
	list_filter = ("region_principal", "is_active")
	ordering = ("nombre",)

@admin.register(Distrito)
class DistritoAdmin(admin.ModelAdmin):
	list_display = ("codigo", "nombre", "zona", "is_active", "created_at")
	search_fields = ("codigo", "nombre", "zona__nombre")
	list_filter = ("zona", "is_active")
	ordering = ("zona", "nombre")

@admin.register(GrupoScout)
class GrupoScoutAdmin(admin.ModelAdmin):
	list_display = ("codigo", "nombre", "distrito", "comuna", "is_active", "created_at")
	search_fields = ("codigo", "nombre", "distrito__nombre", "comuna__nombre")
	list_filter = ("distrito", "comuna", "is_active")
	ordering = ("distrito", "nombre")

@admin.register(Rama)
class RamaAdmin(admin.ModelAdmin):
	list_display = ("codigo", "nombre", "edad_minima", "edad_maxima", "is_active", "created_at")
	search_fields = ("codigo", "nombre")
	list_filter = ("is_active",)
	ordering = ("edad_minima",)

@admin.register(TipoCurso)
class TipoCursoAdmin(admin.ModelAdmin):
	list_display = ("codigo", "nombre", "duracion_default_horas", "precio_sugerido", "is_active", "created_at")
	search_fields = ("codigo", "nombre")
	list_filter = ("is_active",)
	ordering = ("nombre",)

@admin.register(Nivel)
class NivelAdmin(admin.ModelAdmin):
	list_display = ("codigo", "nombre", "orden", "rama", "is_active", "created_at")
	search_fields = ("codigo", "nombre", "rama__nombre")
	list_filter = ("rama", "is_active")
	ordering = ("orden",)

@admin.register(EstadoCivil)
class EstadoCivilAdmin(admin.ModelAdmin):
	list_display = ("codigo", "nombre", "is_active", "created_at")
	search_fields = ("codigo", "nombre")
	list_filter = ("is_active",)
	ordering = ("nombre",)

@admin.register(TipoAlimentacion)
class TipoAlimentacionAdmin(admin.ModelAdmin):
	list_display = ("codigo", "nombre", "es_restriccion", "is_active", "created_at")
	search_fields = ("codigo", "nombre")
	list_filter = ("es_restriccion", "is_active")
	ordering = ("nombre",)
