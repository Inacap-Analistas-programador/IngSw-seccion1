"""
Configuración ASGI para el proyecto scouts_platform.

Expone el ASGI callable como una variable a nivel de módulo llamada ``application``.

Para más información sobre este archivo, ver
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'scouts_platform.settings.development')

application = get_asgi_application()
