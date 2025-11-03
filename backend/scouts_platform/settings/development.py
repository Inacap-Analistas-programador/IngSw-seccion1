from .base import *
from decouple import config
import dj_database_url
from pathlib import Path

# ADVERTENCIA DE SEGURIDAD: ¡no ejecutes con debug activado en producción!
DEBUG = True

ALLOWED_HOSTS = ["*"]

# Base de datos
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases
# Prioridad: DATABASE_URL > variables individuales DB_* > SQLite (fallback)
if config("DATABASE_URL", default=None):
    DATABASES = {
        "default": dj_database_url.config(
            default=config("DATABASE_URL"),
            conn_max_age=600,
        )
    }
elif config("USE_SQLITE", default="False") == "True":
    # Opción SQLite para desarrollo local sin MySQL
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }
else:
    # Configuración MySQL
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.mysql",
            "NAME": config("DB_NAME", default="sgics_dev"),
            "USER": config("DB_USER", default="root"),
            "PASSWORD": config("DB_PASSWORD", default="root"),
            "HOST": config("DB_HOST", default="localhost"),
            "PORT": config("DB_PORT", default="3306"),
        }
    }
