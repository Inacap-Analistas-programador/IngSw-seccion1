from django.contrib import admin
from .models import Proveedor


@admin.register(Proveedor)
class ProveedorAdmin(admin.ModelAdmin):
    list_display = ['prv_id', 'prv_descripcion', 'prv_celular1', 'prv_celular2', 'prv_vigente']
    list_filter = ['prv_vigente']
    search_fields = ['prv_descripcion', 'prv_celular1', 'prv_celular2', 'prv_direccion']
