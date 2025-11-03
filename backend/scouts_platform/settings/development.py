from .base import *
from decouple import config

# ADVERTENCIA DE SEGURIDAD: ¡no ejecutes con debug activado en producción!
DEBUG = True

ALLOWED_HOSTS = ['*']

# Base de datos
# Intenta usar MySQL desde variables de entorno (.env). Si faltan, cae a SQLite para facilitar el desarrollo local.
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

_DB_NAME = config('DB_NAME', default=None)

if _DB_NAME:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': _DB_NAME,
            'USER': config('DB_USER', default='root'),
            'PASSWORD': config('DB_PASSWORD', default=''),
            'HOST': config('DB_HOST', default='127.0.0.1'),
            'PORT': config('DB_PORT', default='3306'),
            'OPTIONS': {
                # Evita problemas de tiempo de espera en entornos locales
                'connect_timeout': 10,
            },
        }
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
