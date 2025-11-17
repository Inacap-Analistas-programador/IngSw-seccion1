from django.contrib import admin
from .models import (
    Alimentacion, Cargo, ConceptoContable, EstadoCivil, Nivel, 
    Perfil, Rama, Rol, TipoArchivo, TipoCurso
)


@admin.register(Alimentacion)
class AlimentacionAdmin(admin.ModelAdmin):
    list_display = ['ali_id', 'ali_descripcion', 'ali_vigente']
    list_filter = ['ali_vigente']
    search_fields = ['ali_descripcion']


@admin.register(Cargo)
class CargoAdmin(admin.ModelAdmin):
    list_display = ['car_id', 'car_descripcion', 'car_vigente']
    list_filter = ['car_vigente']
    search_fields = ['car_descripcion']


@admin.register(ConceptoContable)
class ConceptoContableAdmin(admin.ModelAdmin):
    list_display = ['coc_id', 'coc_descripcion', 'coc_vigente']
    list_filter = ['coc_vigente']
    search_fields = ['coc_descripcion']


@admin.register(EstadoCivil)
class EstadoCivilAdmin(admin.ModelAdmin):
    list_display = ['esc_id', 'esc_descripcion', 'esc_vigente']
    list_filter = ['esc_vigente']
    search_fields = ['esc_descripcion']


@admin.register(Nivel)
class NivelAdmin(admin.ModelAdmin):
    list_display = ['niv_id', 'niv_descripcion', 'niv_orden', 'niv_vigente']
    list_filter = ['niv_vigente']
    search_fields = ['niv_descripcion']
    ordering = ['niv_orden']


@admin.register(Perfil)
class PerfilAdmin(admin.ModelAdmin):
    list_display = ['pel_id', 'pel_descripcion', 'pel_vigente']
    list_filter = ['pel_vigente']
    search_fields = ['pel_descripcion']


@admin.register(Rama)
class RamaAdmin(admin.ModelAdmin):
    list_display = ['ram_id', 'ram_descripcion', 'ram_vigente']
    list_filter = ['ram_vigente']
    search_fields = ['ram_descripcion']


@admin.register(Rol)
class RolAdmin(admin.ModelAdmin):
    list_display = ['rol_id', 'rol_descripcion', 'rol_tipo', 'rol_vigente']
    list_filter = ['rol_vigente', 'rol_tipo']
    search_fields = ['rol_descripcion']


@admin.register(TipoArchivo)
class TipoArchivoAdmin(admin.ModelAdmin):
    list_display = ['tar_id', 'tar_descripcion', 'tar_vigente']
    list_filter = ['tar_vigente']
    search_fields = ['tar_descripcion']


@admin.register(TipoCurso)
class TipoCursoAdmin(admin.ModelAdmin):
    list_display = ['tcu_id', 'tcu_descripcion', 'tcu_tipo', 'tcu_cant_participante', 'tcu_vigente']
    list_filter = ['tcu_vigente', 'tcu_tipo']
    search_fields = ['tcu_descripcion']
