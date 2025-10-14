"""
Configuración de desarrollo para SGICS
Sistema de Gestión Integral de Cursos Scout

Este archivo extiende la configuración base para el ambiente de desarrollo.
Incluye configuración de debug, base de datos local, CORS permisivo, etc.
"""

# Importar TODA la configuración base y luego sobreescribir lo necesario
from .base import *  # noqa: F401,F403

# SECURITY WARNING: don't run with debug turned on in production!
# Modo debug ACTIVADO para desarrollo - Muestra errores detallados
DEBUG = True

# Hosts permitidos en desarrollo - Permite acceso local y Docker
ALLOWED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0']

# Database configuration for development
# OPCIÓN 1: SQLite para desarrollo rápido y MVP
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# OPCIÓN 2: MySQL para desarrollo (usar cuando se necesite consistencia con producción)
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.mysql',
#         'NAME': config('DB_NAME', default='sgics_dev'),
#         'USER': config('DB_USER', default='sgics_user'),
#         'PASSWORD': config('DB_PASSWORD', default='sgics_pass'),
#         'HOST': config('DB_HOST', default='localhost'),
#         'PORT': config('DB_PORT', default='3306'),
#         'OPTIONS': {
#             'charset': 'utf8mb4',           # Soporte completo UTF-8
#             'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
#         },
#     }
# }

# CORS Configuration para desarrollo
# Permite TODAS las conexiones CORS (SOLO en desarrollo)
CORS_ALLOW_ALL_ORIGINS = True

# Email backend for development - Muestra emails en consola
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Cache configuration - Usar cache local en desarrollo
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'sgics-dev-cache',
    }
}

# Development specific apps - Apps adicionales para desarrollo
# INSTALLED_APPS += [
#     'django_extensions',  # Herramientas útiles para desarrollo  
# ]

# Logging más verboso en desarrollo
LOGGING['loggers']['django']['level'] = 'DEBUG'
LOGGING['loggers']['scouts_platform']['level'] = 'DEBUG'

# Variables de entorno para desarrollo
# Crear archivo .env en la raíz del proyecto con:
# DB_NAME=sgics_dev
# DB_USER=sgics_user  
# DB_PASSWORD=sgics_pass
# DB_HOST=localhost
# DB_PORT=3306

# Create logs directory if it doesn't exist
import os
logs_dir = BASE_DIR / 'logs'
if not os.path.exists(logs_dir):
    os.makedirs(logs_dir)