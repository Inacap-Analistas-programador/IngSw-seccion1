from django.contrib import admin
from importlib import import_module
from django.apps import apps

# Registrar todos los modelos de todas las apps del proyecto
for app_config in apps.get_app_configs():
    try:
        models_module = import_module(f"{app_config.name}.models")
        for model in app_config.get_models():
            try:
                admin.site.register(model)
            except admin.sites.AlreadyRegistered:
                pass
    except ModuleNotFoundError:
        continue

# Personalización del panel admin
admin.site.site_header = "SGICS - Sistema de Gestión Integral de Cursos Scout"
admin.site.site_title = "SGICS Admin"
admin.site.index_title = "Panel de Administración del Sistema"
