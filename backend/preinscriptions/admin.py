from django.contrib import admin
from .models import PersonaCurso, PersonaEstadoCurso, PersonaVehiculo

admin.site.register(PersonaCurso)
admin.site.register(PersonaEstadoCurso)
admin.site.register(PersonaVehiculo)
