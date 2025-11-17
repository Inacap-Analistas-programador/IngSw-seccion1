from django.contrib import admin
from .models import Region, Provincia, Comuna, Zona, Distrito, Grupo


@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ['reg_id', 'reg_descripcion', 'reg_vigente']
    list_filter = ['reg_vigente']
    search_fields = ['reg_descripcion']


@admin.register(Provincia)
class ProvinciaAdmin(admin.ModelAdmin):
    list_display = ['pro_id', 'pro_descripcion', 'reg_id', 'pro_vigente']
    list_filter = ['pro_vigente', 'reg_id']
    search_fields = ['pro_descripcion']


@admin.register(Comuna)
class ComunaAdmin(admin.ModelAdmin):
    list_display = ['com_id', 'com_descripcion', 'pro_id', 'com_vigente']
    list_filter = ['com_vigente', 'pro_id']
    search_fields = ['com_descripcion']


@admin.register(Zona)
class ZonaAdmin(admin.ModelAdmin):
    list_display = ['zon_id', 'zon_descripcion', 'zon_unilateral', 'zon_vigente']
    list_filter = ['zon_vigente', 'zon_unilateral']
    search_fields = ['zon_descripcion']


@admin.register(Distrito)
class DistritoAdmin(admin.ModelAdmin):
    list_display = ['dis_id', 'dis_descripcion', 'zon_id', 'dis_vigente']
    list_filter = ['dis_vigente', 'zon_id']
    search_fields = ['dis_descripcion']


@admin.register(Grupo)
class GrupoAdmin(admin.ModelAdmin):
    list_display = ['gru_id', 'gru_descripcion', 'dis_id', 'gru_vigente']
    list_filter = ['gru_vigente', 'dis_id']
    search_fields = ['gru_descripcion']
