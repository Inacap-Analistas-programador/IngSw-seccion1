from django.contrib import admin
from .models import (
    PagoPersona, ComprobantePago, PagoComprobante, 
    PagoCambioPersona, Prepago
)


@admin.register(PagoPersona)
class PagoPersonaAdmin(admin.ModelAdmin):
    list_display = ['pap_id', 'per_id', 'cur_id', 'pap_tipo', 'pap_valor', 'pap_fecha_hora']
    list_filter = ['pap_tipo', 'pap_fecha_hora', 'cur_id']
    search_fields = ['per_id__per_nombres', 'pap_observacion']
    readonly_fields = ['pap_fecha_hora']


@admin.register(ComprobantePago)
class ComprobantePagoAdmin(admin.ModelAdmin):
    list_display = ['cpa_id', 'cpa_numero', 'cpa_valor', 'usu_id', 'coc_id', 'pec_id']
    list_filter = ['coc_id']
    search_fields = ['cpa_numero']


@admin.register(PagoComprobante)
class PagoComprobanteAdmin(admin.ModelAdmin):
    list_display = ['pco_id', 'pap_id', 'cpa_id']
    list_filter = ['pap_id', 'cpa_id']


@admin.register(PagoCambioPersona)
class PagoCambioPersonaAdmin(admin.ModelAdmin):
    list_display = ['pcp_id', 'per_id', 'pap_id', 'usu_id', 'pcp_fecha_hora']
    list_filter = ['pcp_fecha_hora']
    readonly_fields = ['pcp_fecha_hora']


@admin.register(Prepago)
class PrepagoAdmin(admin.ModelAdmin):
    list_display = ['ppa_id', 'per_id', 'cur_id', 'pap_id', 'ppa_valor', 'ppa_vigente']
    list_filter = ['ppa_vigente', 'cur_id']
    search_fields = ['per_id__per_nombres', 'ppa_observacion']
