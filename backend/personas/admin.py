from django.contrib import admin
from .models import (
    Persona, PersonaCurso, PersonaEstadoCurso, PersonaFormador,
    PersonaGrupo, PersonaIndividual, PersonaNivel, PersonaVehiculo
)


@admin.register(Persona)
class PersonaAdmin(admin.ModelAdmin):
    list_display = ['per_id', 'per_run', 'per_dv', 'per_nombres', 'per_apelpat', 'per_apelmat', 'per_email', 'per_vigente']
    list_filter = ['per_vigente', 'esc_id', 'com_id']
    search_fields = ['per_run', 'per_nombres', 'per_apelpat', 'per_apelmat', 'per_email']
    readonly_fields = ['per_fecha_hora']


@admin.register(PersonaCurso)
class PersonaCursoAdmin(admin.ModelAdmin):
    list_display = ['pec_id', 'per_id', 'cus_id', 'rol_id', 'pec_registro', 'pec_acreditado']
    list_filter = ['pec_registro', 'pec_acreditado', 'rol_id']
    search_fields = ['per_id__per_nombres', 'per_id__per_apelpat']


@admin.register(PersonaEstadoCurso)
class PersonaEstadoCursoAdmin(admin.ModelAdmin):
    list_display = ['peu_id', 'pec_id', 'peu_estado', 'peu_fecha_hora', 'peu_vigente']
    list_filter = ['peu_estado', 'peu_vigente', 'peu_fecha_hora']
    readonly_fields = ['peu_fecha_hora']


@admin.register(PersonaFormador)
class PersonaFormadorAdmin(admin.ModelAdmin):
    list_display = ['pef_id', 'per_id', 'pef_hab_1', 'pef_hab_2', 'pef_verif']
    list_filter = ['pef_hab_1', 'pef_hab_2', 'pef_verif']


@admin.register(PersonaGrupo)
class PersonaGrupoAdmin(admin.ModelAdmin):
    list_display = ['peg_id', 'gru_id', 'per_id', 'peg_vigente']
    list_filter = ['peg_vigente', 'gru_id']


@admin.register(PersonaIndividual)
class PersonaIndividualAdmin(admin.ModelAdmin):
    list_display = ['pei_id', 'per_id', 'car_id', 'dis_id', 'zon_id', 'pei_vigente']
    list_filter = ['pei_vigente', 'car_id', 'dis_id', 'zon_id']


@admin.register(PersonaNivel)
class PersonaNivelAdmin(admin.ModelAdmin):
    list_display = ['pen_id', 'per_id', 'niv_id', 'ram_id']
    list_filter = ['niv_id', 'ram_id']


@admin.register(PersonaVehiculo)
class PersonaVehiculoAdmin(admin.ModelAdmin):
    list_display = ['pev_id', 'pec_id', 'pev_marca', 'pev_modelo', 'pev_patente']
    search_fields = ['pev_patente', 'pev_marca', 'pev_modelo']
