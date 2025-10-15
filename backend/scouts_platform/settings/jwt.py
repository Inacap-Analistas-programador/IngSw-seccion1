"""
Configuración de autenticación JWT para SGICS

JSON Web Tokens (JWT) proporcionan autenticación stateless y segura:
- No requiere almacenamiento de sesiones en el servidor
- Tokens contienen información del usuario encriptada
- Soporte para refresh tokens para seguridad mejorada
- Integración nativa con frontend JavaScript/TypeScript

Flujo de autenticación:
1. Usuario envía credenciales a /api/auth/login/
2. Backend valida y retorna access_token + refresh_token  
3. Frontend envía access_token en header Authorization
4. Cuando access_token expira, usa refresh_token para obtener uno nuevo
"""

from datetime import timedelta

# Configuración principal de JWT
JWT_CONFIG = {
    # Duración del token de acceso - corto para seguridad
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),  # 1 hora
    # Duración del token de refresh - más largo para usabilidad
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),  # 1 semana
    # Rotar refresh token en cada uso (más seguro)
    "ROTATE_REFRESH_TOKENS": True,
    # Blacklist de tokens antiguos al rotar
    "BLACKLIST_AFTER_ROTATION": True,
    # Algoritmo de encriptación - HS256 es suficiente para aplicaciones internas
    "ALGORITHM": "HS256",
    # Verificar firma del token (siempre debe ser True en producción)
    "VERIFY_SIGNATURE": True,
    # Verificar expiración del token
    "VERIFY_EXP": True,
    # Tiempo de gracia antes de considerar token expirado
    "LEEWAY": timedelta(seconds=0),
    # Audiencia del token (opcional - para validar destino)
    "AUDIENCE": None,
    # Emisor del token (opcional - para validar origen)
    "ISSUER": None,
    # Clase de usuario personalizada
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
    # Claims adicionales en el token
    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
    "TOKEN_TYPE_CLAIM": "token_type",
    "TOKEN_USER_CLASS": "rest_framework_simplejwt.models.TokenUser",
    # Headers del token JWT
    "AUTH_HEADER_TYPES": ("Bearer",),  # Formato: "Authorization: Bearer <token>"
    "AUTH_HEADER_NAME": "HTTP_AUTHORIZATION",
    # Serializers personalizados para login/refresh
    "TOKEN_OBTAIN_SERIALIZER": "apps.authentication.serializers.CustomTokenObtainPairSerializer",
    "TOKEN_REFRESH_SERIALIZER": "rest_framework_simplejwt.serializers.TokenRefreshSerializer",
    "TOKEN_VERIFY_SERIALIZER": "rest_framework_simplejwt.serializers.TokenVerifySerializer",
    "TOKEN_BLACKLIST_SERIALIZER": "rest_framework_simplejwt.serializers.TokenBlacklistSerializer",
}

# TODO: El equipo de seguridad debe revisar estos valores para producción
# - ACCESS_TOKEN_LIFETIME puede ser más corto en producción (15-30 min)
# - Configurar AUDIENCE e ISSUER para validación adicional
# - Considerar algoritmo RS256 si se manejan múltiples servicios
