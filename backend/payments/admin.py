from django.contrib import admin
from .models import PagoPersona, PagoCambioPersona, Prepago, ConceptoContable, ComprobantePago, PagoComprobante

admin.site.register(PagoPersona)
admin.site.register(PagoCambioPersona)
admin.site.register(Prepago)
admin.site.register(ConceptoContable)
admin.site.register(ComprobantePago)
admin.site.register(PagoComprobante)
