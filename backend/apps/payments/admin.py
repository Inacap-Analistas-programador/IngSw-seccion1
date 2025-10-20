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
    list_display = ("PAP_ID", "PER_ID", "CUR_ID", "PAP_VALOR", "PAP_FECHA_HORA")
    search_fields = ("PER_ID", "CUR_ID")


@admin.register(PagoCambioPersona)
class PagoCambioPersonaAdmin(admin.ModelAdmin):
    list_display = ("PCP_ID", "PER_ID", "PAP_ID", "PCP_FECHA_HORA")


@admin.register(Prepago)
class PrepagoAdmin(admin.ModelAdmin):
    list_display = ("PPA_ID", "PER_ID", "CUR_ID", "PPA_VALOR", "PPA_VIGENTE")


@admin.register(ComprobantePago)
class ComprobantePagoAdmin(admin.ModelAdmin):
    list_display = ("CPA_ID", "PEC_ID", "CPA_NUMERO", "CPA_VALOR", "CPA_FECHA")


@admin.register(PagoComprobante)
class PagoComprobanteAdmin(admin.ModelAdmin):
    list_display = ("PCO_ID", "PAP_ID", "CPA_ID")


@admin.register(ConceptoContable)
class ConceptoContableAdmin(admin.ModelAdmin):
    list_display = ("COC_ID", "COC_DESCRIPCION", "COC_VIGENTE")
