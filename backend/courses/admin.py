from django.contrib import admin
from .models import Curso, CursoSeccion, CursoCoordinador, CursoCuota, CursoFecha, CursoFormador, CursoAlimentacion

admin.site.register(Curso)
admin.site.register(CursoSeccion)
admin.site.register(CursoCoordinador)
admin.site.register(CursoCuota)
admin.site.register(CursoFecha)
admin.site.register(CursoFormador)
admin.site.register(CursoAlimentacion)
