"""
Configuración de testing para SGICS
Sistema de Gestión Integral de Cursos Scout

Este archivo contiene configuraciones específicas para ejecutar tests.
Usa base de datos en memoria y configuraciones optimizadas para velocidad.
"""

from .base import *

# Testing Configuration
DEBUG = False

# Use in-memory database for faster tests
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ":memory:",
        "OPTIONS": {
            "timeout": 20,
        },
    }
}


# Disable migrations during testing for speed
class DisableMigrations:
    def __contains__(self, item):
        return True

    def __getitem__(self, item):
        return None


MIGRATION_MODULES = DisableMigrations()

# Password hashers - Use fast hasher for testing
PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.MD5PasswordHasher",  # Fastest for testing
]

# Email backend for testing
EMAIL_BACKEND = "django.core.mail.backends.locmem.EmailBackend"

# Cache - Use local memory for testing
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
    }
}

# Media files - Use temporary directory for testing
import tempfile

MEDIA_ROOT = tempfile.gettempdir()

# Logging - Minimal logging during tests
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "class": "logging.NullHandler",
        },
    },
    "loggers": {
        "django": {
            "handlers": ["console"],
        },
        "scouts_platform": {
            "handlers": ["console"],
        },
    },
}

# Celery - Use eager execution for testing
CELERY_TASK_ALWAYS_EAGER = True
CELERY_TASK_EAGER_PROPAGATES = True

# CORS - Allow all for testing
CORS_ALLOW_ALL_ORIGINS = True

# Secret key for testing
SECRET_KEY = "test-secret-key-not-for-production"
