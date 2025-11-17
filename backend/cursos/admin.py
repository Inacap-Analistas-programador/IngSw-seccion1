from django.contrib import admin
from .models import (
    Curso, CursoSeccion, CursoFecha, CursoCuota, CursoAlimentacion,
    CursoCoordinador, CursoFormador
)


@admin.register(Curso)
class CursoAdmin(admin.ModelAdmin):
    list_display = ['cur_id', 'cur_codigo', 'cur_descripcion', 'cur_fecha_hora', 'cur_estado', 'tcu_id']
    list_filter = ['cur_estado', 'tcu_id', 'cur_modalidad', 'cur_tipo_curso']
    search_fields = ['cur_codigo', 'cur_descripcion']
    readonly_fields = ['cur_fecha_solicitud']


@admin.register(CursoSeccion)
class CursoSeccionAdmin(admin.ModelAdmin):
    list_display = ['cus_id', 'cur_id', 'ram_id', 'cus_seccion', 'cus_cant_participante']
    list_filter = ['ram_id', 'cur_id']
    search_fields = ['cur_id__cur_descripcion']


@admin.register(CursoFecha)
class CursoFechaAdmin(admin.ModelAdmin):
    list_display = ['cuf_id', 'cur_id', 'cuf_fecha_inicio', 'cuf_fecha_termino', 'cuf_tipo']
    list_filter = ['cuf_tipo', 'cuf_fecha_inicio']
    date_hierarchy = 'cuf_fecha_inicio'


@admin.register(CursoCuota)
class CursoCuotaAdmin(admin.ModelAdmin):
    list_display = ['cuu_id', 'cur_id', 'cuu_tipo', 'cuu_fecha', 'cuu_valor']
    list_filter = ['cuu_tipo', 'cuu_fecha']
    date_hierarchy = 'cuu_fecha'


@admin.register(CursoAlimentacion)
class CursoAlimentacionAdmin(admin.ModelAdmin):
    list_display = ['cua_id', 'cur_id', 'ali_id', 'cua_fecha', 'cua_tiempo', 'cua_vigente']
    list_filter = ['ali_id', 'cua_tiempo', 'cua_vigente']
    date_hierarchy = 'cua_fecha'


@admin.register(CursoCoordinador)
class CursoCoordinadorAdmin(admin.ModelAdmin):
    list_display = ['cuc_id', 'cur_id', 'per_id', 'car_id', 'cuc_cargo']
    list_filter = ['car_id', 'cur_id']
    search_fields = ['per_id__per_nombres', 'cuc_cargo']


@admin.register(CursoFormador)
class CursoFormadorAdmin(admin.ModelAdmin):
    list_display = ['cuo_id', 'cur_id', 'per_id', 'rol_id', 'cus_id', 'cuo_director']
    list_filter = ['rol_id', 'cuo_director', 'cur_id']
    search_fields = ['per_id__per_nombres']
