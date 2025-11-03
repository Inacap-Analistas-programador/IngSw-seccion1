from .base import *
from decouple import config

# ADVERTENCIA DE SEGURIDAD: ¡no ejecutes con debug activado en producción!
DEBUG = True

ALLOWED_HOSTS = ["*"]

# Base de datos
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": config("DB_NAME"),
        "USER": config("DB_USER"),
        "PASSWORD": config("DB_PASSWORD"),
        "HOST": config("DB_HOST"),
        "PORT": config("DB_PORT"),
    }
else:
    # Fallback a SQLite para que runserver funcione sin configurar MySQL
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# Debug Toolbar (solo desarrollo)
INSTALLED_APPS += [
    'debug_toolbar',
]

# Insertar DebugToolbarMiddleware lo más arriba posible
MIDDLEWARE = [
    'debug_toolbar.middleware.DebugToolbarMiddleware',
] + MIDDLEWARE

# Permitir toolbar desde localhost
INTERNAL_IPS = [
    '127.0.0.1',
]

# Logging de consultas SQL en consola (útil para auditoría)
LOGGING['loggers']['django.db.backends'] = {
    'handlers': ['console'],
    'level': 'DEBUG',
    'propagate': False,
}
