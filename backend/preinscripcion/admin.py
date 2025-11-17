from django.contrib import admin
from .models import (
    Preinscripcion, PreinscripcionEstadoLog,
    CupoConfiguracion, Documento
)


admin.site.register(Preinscripcion)
admin.site.register(PreinscripcionEstadoLog)
admin.site.register(CupoConfiguracion)
admin.site.register(Documento)
