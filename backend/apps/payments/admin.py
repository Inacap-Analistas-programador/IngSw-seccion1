from django.contrib import admin
from .models import (
    PagoPersona,
    PagoCambioPersona,
    Prepago,
    ComprobantePago,
    PagoComprobante,
    ConceptoContable,
)

@admin.register(PagoPersona)
class PagoPersonaAdmin(admin.ModelAdmin):
    list_display = ("PAP_ID", "PER_ID", "CUR_ID", "PAP_VALOR", "PAP_FECHA_HORA", "PAP_TIPO", "PAP_OBSERVACION")
    search_fields = ("PER_ID", "CUR_ID", "PAP_OBSERVACION")
    list_filter = ("PAP_TIPO", "PAP_FECHA_HORA")
    ordering = ("-PAP_FECHA_HORA",)

@admin.register(PagoCambioPersona)
class PagoCambioPersonaAdmin(admin.ModelAdmin):
    list_display = ("PCP_ID", "PER_ID", "PAP_ID", "PCP_FECHA_HORA")
    search_fields = ("PER_ID", "PAP_ID")
    list_filter = ("PCP_FECHA_HORA",)
    ordering = ("-PCP_FECHA_HORA",)

@admin.register(Prepago)
class PrepagoAdmin(admin.ModelAdmin):
    list_display = ("PPA_ID", "PER_ID", "CUR_ID", "PPA_VALOR", "PPA_VIGENTE")
    search_fields = ("PER_ID", "CUR_ID")
    list_filter = ("PPA_VIGENTE",)
    ordering = ("-PPA_ID",)

@admin.register(ComprobantePago)
class ComprobantePagoAdmin(admin.ModelAdmin):
    list_display = ("CPA_ID", "PEC_ID", "CPA_NUMERO", "CPA_VALOR", "CPA_FECHA")
    search_fields = ("CPA_NUMERO", "CPA_VALOR")
    list_filter = ("CPA_FECHA",)
    ordering = ("-CPA_FECHA",)

@admin.register(PagoComprobante)
class PagoComprobanteAdmin(admin.ModelAdmin):
    list_display = ("PCO_ID", "PAP_ID", "CPA_ID")
    search_fields = ("PAP_ID", "CPA_ID")

@admin.register(ConceptoContable)
class ConceptoContableAdmin(admin.ModelAdmin):
    list_display = ("COC_ID", "COC_DESCRIPCION", "COC_VIGENTE")
    search_fields = ("COC_DESCRIPCION",)
    list_filter = ("COC_VIGENTE",)
