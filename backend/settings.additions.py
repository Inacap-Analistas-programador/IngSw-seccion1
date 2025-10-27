"""
Snippets para integrar en settings.py (Django):
1) Variables de entorno básicas
2) CORS_ALLOWED_ORIGINS (sin duplicados)
3) DATABASES usando MySQL por variables de entorno

Pega o adapta estos bloques en tu settings.py del proyecto correcto.
"""

# 1) Variables de entorno básicas
import os
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'dev-only-insecure-secret')
DEBUG = os.getenv('DJANGO_DEBUG', 'False').lower() == 'true'
ALLOWED_HOSTS = [h.strip() for h in os.getenv('DJANGO_ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',') if h.strip()]

# 2) CORS (mantener solo esta lista para evitar duplicado)
CORS_ALLOWED_ORIGINS = [
    os.getenv('FRONTEND_ORIGIN', 'http://localhost:5173'),
]

# 3) DATABASES (MySQL parametrizado)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.getenv('DB_NAME', 'ssb'),
        'USER': os.getenv('DB_USER', 'root'),
        'PASSWORD': os.getenv('DB_PASSWORD', ''),
        'HOST': os.getenv('DB_HOST', '127.0.0.1'),
        'PORT': os.getenv('DB_PORT', '3306'),
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        },
    }
}
