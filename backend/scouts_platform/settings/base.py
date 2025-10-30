"""
Configuración base de Django para SGICS
Sistema de Gestión Integral de Cursos Scout

Este archivo contiene todas las configuraciones compartidas entre
los diferentes ambientes (desarrollo, staging, producción).
Las configuraciones específicas se encuentran en development.py y production.py
"""

import os
from pathlib import Path

from decouple import config

# Build paths inside the project like this: BASE_DIR / 'subdir'.
# Directorio raíz del proyecto Django - Apunta a la carpeta backend/
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# ADVERTENCIA DE SEGURIDAD: ¡mantén en secreto la clave secreta utilizada en producción!
# Clave secreta para Django - CAMBIAR en producción usando variable de entorno
SECRET_KEY = config(
    "SECRET_KEY", default="django-insecure-development-key-change-in-production"
)

# Definición de la aplicación
# Aplicaciones de Django instaladas en el proyecto SGICS

# Aplicaciones principales de Django - NO MODIFICAR
DJANGO_APPS = [
    "django.contrib.admin",  # Panel de administración
    "django.contrib.auth",  # Sistema de autenticación
    "django.contrib.contenttypes",  # Framework de tipos de contenido
    "django.contrib.sessions",  # Framework de sesiones
    "django.contrib.messages",  # Framework de mensajes
    "django.contrib.staticfiles",  # Gestión de archivos estáticos
]

# Aplicaciones de terceros instaladas a través de pip
THIRD_PARTY_APPS = [
    "rest_framework",  # Django REST Framework para APIs
    "rest_framework_simplejwt",  # Autenticación JWT para APIs
    "corsheaders",  # Manejo de CORS para frontend
    "django_filters",  # Para filtros en DRF
]

# Aplicaciones locales del proyecto SGICS
# Cada aplicación maneja un módulo específico del sistema
LOCAL_APPS = [
    "authentication",
    "catalog",
    "preinscriptions",
    "payments",
    "files",
    "courses",
    "personas",
    "emails",
]

# Lista completa de aplicaciones instaladas
INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

# Middleware - Capas de procesamiento de peticiones/respuestas
# ORDEN IMPORTANTE: Cada middleware procesa en orden y afecta a los siguientes
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",  # CORS - DEBE ir PRIMERO
    "django.middleware.security.SecurityMiddleware",  # Cabeceras de seguridad
    "whitenoise.middleware.WhiteNoiseMiddleware",  # Servir archivos estáticos en producción
    "django.contrib.sessions.middleware.SessionMiddleware",  # Manejo de sesiones
    "django.middleware.common.CommonMiddleware",  # Funcionalidades comunes
    "django.middleware.csrf.CsrfViewMiddleware",  # Protección CSRF
    "django.contrib.auth.middleware.AuthenticationMiddleware",  # Autenticación
    "django.contrib.messages.middleware.MessageMiddleware",  # Sistema de mensajes
    "django.middleware.clickjacking.XFrameOptionsMiddleware",  # Protección clickjacking
]

# Configuración de URL - Archivo principal de rutas del proyecto
ROOT_URLCONF = "scouts_platform.urls"

# Configuración de plantillas - Configuración del motor de plantillas
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],  # Directorio para plantillas personalizadas
        "APP_DIRS": True,  # Buscar plantillas en directorios de aplicaciones automáticamente
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",  # Variables de depuración
                "django.template.context_processors.request",  # Objeto de petición
                "django.contrib.auth.context_processors.auth",  # Usuario autenticado
                "django.contrib.messages.context_processors.messages",  # Mensajes
            ],
        },
    },
]

# Aplicación WSGI - Punto de entrada para servidor web en producción
WSGI_APPLICATION = "scouts_platform.wsgi.application"

# Modelo de Usuario Personalizado - Modelo de usuario personalizado para SGICS
AUTH_USER_MODEL = "authentication.Usuario"

# Validación de contraseñas - Validadores de contraseñas para seguridad
AUTH_PASSWORD_VALIDATORS = [
    {
        # No puede ser similar a la información personal del usuario
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        # Longitud mínima de 8 caracteres
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        # No puede ser una contraseña común (ej: 123456, password)
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        # No puede ser completamente numérica
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# Internacionalización - Configuración regional para Chile
LANGUAGE_CODE = "es-cl"  # Idioma español de Chile
TIME_ZONE = "America/Santiago"  # Zona horaria de Chile (GMT-3/-4)
USE_I18N = True  # Habilitar internacionalización
USE_TZ = True  # Usar zonas horarias (recomendado)

# Archivos estáticos (CSS, JavaScript, Imágenes)
# Archivos estáticos del proyecto (CSS, JS, imágenes del admin, etc.)
STATIC_URL = "/static/"  # URL pública para archivos estáticos
STATIC_ROOT = BASE_DIR / "staticfiles"  # Directorio donde se recolectan en producción

# Archivos de medios - Archivos subidos por usuarios
MEDIA_URL = "/media/"  # URL pública para archivos de medios
MEDIA_ROOT = BASE_DIR / "media"  # Directorio donde se almacenan los archivos subidos

# Tipo de campo de clave primaria por defecto
# Tipo de campo para claves primarias automáticas (IDs de modelos)
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Configuración de Django REST Framework
# Configuración completa importada desde un módulo dedicado
from .rest_framework import REST_FRAMEWORK_CONFIG

REST_FRAMEWORK = REST_FRAMEWORK_CONFIG

# Configuración de JWT - Configuración de JSON Web Tokens
# Configuración completa importada desde un módulo dedicado
from .jwt import JWT_CONFIG

SIMPLE_JWT = JWT_CONFIG

# Configuración de CORS - Cross-Origin Resource Sharing
# Permite que el frontend (Vue.js) se comunique con el backend (Django)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Frontend Vue.js en desarrollo (Vite)
    "http://127.0.0.1:5173",
    "http://localhost:3000",  # Frontend Vue.js en desarrollo
    "http://127.0.0.1:3000",  # Alternativa de localhost
]

# Permitir cookies y cabeceras de autenticación
CORS_ALLOW_CREDENTIALS = True

# Cabeceras adicionales permitidas para CORS
CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "dnt",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]

# Configuración de subida de archivos
FILE_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024  # 10MB máximo en memoria
DATA_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024  # 10MB máximo total por petición

# Tipos de archivos permitidos para subidas (seguridad)
ALLOWED_FILE_EXTENSIONS = [
    ".pdf",
    ".doc",
    ".docx",  # Documentos
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",  # Imágenes
    ".xls",
    ".xlsx",
    ".csv",  # Hojas de cálculo
]

# Configuración de Logging
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "{levelname} {asctime} {module} {process:d} {thread:d} {message}",
            "style": "{",
        },
    },
    "handlers": {
        "file": {
            "level": "INFO",
            "class": "logging.FileHandler",
            "filename": BASE_DIR / "logs" / "django.log",
            "formatter": "verbose",
        },
        "console": {
            "level": "DEBUG",
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        },
    },
    "loggers": {
        "django": {
            "handlers": ["file", "console"],
            "level": "INFO",
            "propagate": True,
        },
        "scouts_platform": {
            "handlers": ["file", "console"],
            "level": "DEBUG",
            "propagate": True,
        },
    },
}

# Base de datos
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
