"""
Configuraciones específicas para Django REST Framework en SGICS

Este archivo centraliza toda la configuración de la API REST:
- Autenticación y permisos
- Paginación de resultados
- Serialización de respuestas
- Filtros y ordenamiento
- Documentación automática de APIs

El proyecto utiliza JWT para autenticación y RBAC para autorización.
Todas las APIs siguen el estándar REST con códigos HTTP apropiados.
"""

from rest_framework.permissions import BasePermission

# Configuraciones principales de Django REST Framework
REST_FRAMEWORK_CONFIG = {
    # Renderizadores de respuesta - JSON por defecto, Browsable API en desarrollo
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
        "rest_framework.renderers.BrowsableAPIRenderer",  # Solo en desarrollo
    ],
    # Parser de contenido - acepta JSON, form-data y multipart
    "DEFAULT_PARSER_CLASSES": [
        "rest_framework.parsers.JSONParser",
        "rest_framework.parsers.FormParser",
        "rest_framework.parsers.MultiPartParser",
    ],
    # Autenticación - JWT como método principal
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",  # Para browsable API
    ],
    # Permisos por defecto - usuario autenticado requerido
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    # Paginación - resultados limitados por página
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,  # 20 elementos por página por defecto
    # Filtros y búsquedas
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ],
    # Manejo de excepciones personalizado
    "EXCEPTION_HANDLER": "utils.api_exceptions.custom_exception_handler",
    # Formato de fecha y hora estándar ISO 8601
    "DATETIME_FORMAT": "%Y-%m-%dT%H:%M:%S.%fZ",
    "DATE_FORMAT": "%Y-%m-%d",
    "TIME_FORMAT": "%H:%M:%S",
}


class IsOwnerOrReadOnly(BasePermission):
    """
    Permiso personalizado para permitir solo al propietario editar objetos.

    Casos de uso:
    - Usuarios solo pueden editar su propio perfil
    - Scouts solo pueden ver/editar sus propias preinscripciones
    - Instructores pueden ver cursos pero solo editar los propios

    TODO: El equipo de autenticación debe expandir estos permisos
    """

    def has_object_permission(self, request, view, obj):
        # Permisos de lectura para cualquier request (GET, HEAD, OPTIONS)
        if request.method in ["GET", "HEAD", "OPTIONS"]:
            return True

        # Permisos de escritura solo para el propietario del objeto
        return obj.owner == request.user


class IsInstructorOrReadOnly(BasePermission):
    """
    Permiso para instructores de cursos Scout.

    Permite:
    - Lectura a usuarios autenticados
    - Escritura solo a usuarios con rol de instructor

    TODO: Integrar con el sistema de roles RBAC
    """

    def has_permission(self, request, view):
        # Lectura permitida para usuarios autenticados
        if request.method in ["GET", "HEAD", "OPTIONS"]:
            return request.user.is_authenticated

        # Escritura solo para instructores
        # TODO: Verificar rol específico en lugar de is_staff
        return request.user.is_authenticated and request.user.is_staff


class IsAdminOrCoordinator(BasePermission):
    """
    Permiso para administradores y coordinadores de cursos.

    Roles permitidos:
    - Administrador del sistema (acceso completo)
    - Coordinador de cursos (gestión de cursos y preinscripciones)

    TODO: El equipo debe implementar verificación de roles específicos
    """

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        # TODO: Verificar roles específicos usando el modelo Role
        # return request.user.has_role('ADMIN') or request.user.has_role('COORDINADOR')

        # Implementación temporal usando is_staff
        return request.user.is_staff


class IsTreasurerOrAdminOrReadOnly(BasePermission):
    """
    Permiso para el módulo de pagos.

    Permite:
    - Lectura (GET, HEAD, OPTIONS) a cualquier usuario autenticado.
    - Escritura (POST, PUT, DELETE) solo a administradores o usuarios con rol de "Tesorero".
    """

    def has_permission(self, request, view):
        # Si el usuario no está autenticado, no tiene permiso para nada.
        if not request.user or not request.user.is_authenticated:
            return False

        # Si el método es seguro (lectura), se permite.
        if request.method in ["GET", "HEAD", "OPTIONS"]:
            return True

        # Si el método es de escritura, solo se permite a administradores (is_staff).
        # Ahora usamos el sistema de roles: se permite si es admin/staff o si tiene el rol 'TESORERO'.
        # El método has_role() debería estar definido en el modelo User.
        return request.user.is_staff or request.user.has_role("TESORERO")
