from django.contrib import admin
from .models import Persona, PersonaIndividual, PersonaNivel, PersonaFormador

admin.site.register(Persona)
admin.site.register(PersonaIndividual)
admin.site.register(PersonaNivel)
admin.site.register(PersonaFormador)
