#!/usr/bin/env python
"""
SGICS - Sistema de Gestión Integral de Cursos Scout
Utilidad de línea de comandos de Django para tareas administrativas.

Este archivo es el punto de entrada principal para ejecutar comandos Django como:
- python manage.py runserver (ejecutar servidor de desarrollo)
- python manage.py migrate (aplicar migraciones de base de datos)
- python manage.py createsuperuser (crear usuario administrador)
- python manage.py shell (abrir shell interactivo de Django)
- python manage.py test (ejecutar tests)

Uso típico:
    python manage.py <comando> [opciones]

Configuración por defecto: scouts_platform.settings.development
"""
import os
import sys

if __name__ == "__main__":
    """
    Ejecutar tareas administrativas de Django.

    Configura el módulo de settings por defecto y ejecuta el comando
    pasado por línea de comandos usando el sistema de management de Django.
    """
    # Establecer configuración por defecto para desarrollo
    os.environ.setdefault(
        "DJANGO_SETTINGS_MODULE", "scouts_platform.settings.development"
    )

    try:
        # Importar y ejecutar el sistema de comandos de Django
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        # Error si Django no está instalado o no está en el PYTHONPATH
        raise ImportError(
            "No se pudo importar Django. ¿Estás seguro de que está instalado y "
            "disponible en tu variable de entorno PYTHONPATH? ¿Olvidaste "
            "activar el entorno virtual?"
        ) from exc

    # Ejecutar el comando especificado en sys.argv
    execute_from_command_line(sys.argv)
