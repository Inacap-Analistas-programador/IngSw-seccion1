from django.contrib import admin
from .models import Usuario, Aplicacion, PerfilAplicacion


@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ['usu_id', 'usu_username', 'usu_email', 'pel_id', 'usu_vigente']
    list_filter = ['usu_vigente', 'pel_id']
    search_fields = ['usu_username', 'usu_email']
    readonly_fields = ['usu_id']


@admin.register(Aplicacion)
class AplicacionAdmin(admin.ModelAdmin):
    list_display = ['apl_id', 'apl_descripcion', 'apl_vigente']
    list_filter = ['apl_vigente']
    search_fields = ['apl_descripcion']


@admin.register(PerfilAplicacion)
class PerfilAplicacionAdmin(admin.ModelAdmin):
    list_display = ['pea_id', 'pel_id', 'apl_id', 'pea_ingresar', 'pea_modificar', 'pea_eliminar', 'pea_consultar']
    list_filter = ['pel_id', 'apl_id', 'pea_ingresar', 'pea_modificar', 'pea_eliminar', 'pea_consultar']
