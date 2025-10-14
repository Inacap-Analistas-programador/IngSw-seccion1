"""
Configuración de URLs para SGICS - Sistema de Gestión Integral de Cursos Scout

Este archivo define todas las rutas principales del proyecto:

Estructura de URLs:
- /admin/                    -> Panel de administración de Django
- /api/auth/login/          -> Endpoint para login JWT  
- /api/auth/refresh/        -> Endpoint para refresh de token JWT
- /api/auth/                -> URLs del módulo de autenticación
- /api/preinscriptions/     -> URLs del módulo de preinscripciones
- /api/payments/            -> URLs del módulo de pagos
- /api/files/               -> URLs del módulo de archivos
- /api/courses/             -> URLs del módulo de cursos
- /healthz/                 -> Endpoints de health check

En desarrollo también sirve archivos estáticos y de media.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from apps.authentication.views import PersonSearchView

# Patrones de URL principales del proyecto
urlpatterns = [
    # Panel de administración de Django
    path('admin/', admin.site.urls),
    
    # Autenticación JWT para APIs
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Rutas de APIs por módulo - Cada app tiene sus propias URLs
    path('api/auth/', include('apps.authentication.urls')),           # Gestión de usuarios y roles
    path('api/catalog/', include('apps.catalog.urls')),               # Catálogos maestros (regiones, zonas, etc.)
    path('api/preinscriptions/', include('apps.preinscriptions.urls')), # Preinscripciones de cursos
    path('api/payments/', include('apps.payments.urls')),             # Gestión de pagos
    path('api/files/', include('apps.files.urls')),                   # Subida y gestión de archivos
    path('api/courses/', include('apps.courses.urls')),               # Gestión de cursos
    path('api/persons/search/', PersonSearchView.as_view(), name='persons-search'),
    
    # Endpoints de salud del sistema (para monitoreo)
    path('healthz/', include('utils.health.urls')),
]

# Servir archivos estáticos y de media SOLO en desarrollo
# En producción esto lo maneja nginx u otro servidor web
if settings.DEBUG:
    # Archivos subidos por usuarios (media)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    # Archivos estáticos (CSS, JS, imágenes del admin)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)