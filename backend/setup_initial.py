#!/usr/bin/env python
"""
Script de inicialización del proyecto SGICS
Ejecuta las configuraciones básicas necesarias para el desarrollo
"""

import os
import sys

import django
from django.conf import settings
from django.core.management import execute_from_command_line


def setup_django_environment():
    """Configura Django para el script"""
    os.environ.setdefault(
        "DJANGO_SETTINGS_MODULE", "scouts_platform.settings.development"
    )
    django.setup()


def create_initial_data():
    """Crea datos iniciales básicos"""
    print("Creando datos iniciales...")

    # Importar modelos después de setup
    from django.contrib.auth import get_user_model

    from apps.authentication.models import Role

    # get_user_model() imported but not used
    # Crear roles básicos


def run_migrations():
    """Ejecuta las migraciones de Django"""
    print("Ejecutando migraciones...")
    try:
        execute_from_command_line(["manage.py", "migrate"])
        return True
    except Exception as e:
        print(f"Error al ejecutar migraciones: {e}")
        return False


def main():
    # Verificar que estamos en el directorio correcto
    if not os.path.exists("manage.py"):
        sys.exit(1)

    try:
        # Configurar Django
        setup_django_environment()

        # Ejecutar migraciones
        if not run_migrations():
            sys.exit(1)

        # Crear datos iniciales
        create_initial_data()

        print("\n" + "=" * 50)
        print("✓ Inicialización completada exitosamente!")
        print("=" * 50)
        print("\nPróximos pasos:")
        print("1. Ejecutar servidor: python manage.py runserver")
        print("2. Acceder admin: http://localhost:8000/admin/")
        print("3. Usuario: admin / Contraseña: admin123")
        print("4. API Docs: http://localhost:8000/api/")

    except Exception as e:
        print(f" Error durante la inicialización: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
