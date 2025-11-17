from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.exceptions import TokenError
from django.contrib.auth.hashers import check_password
from django.core.cache import cache
from usuarios.models import Usuario
from usuarios.throttles import LoginRateThrottle
import re
import logging

logger = logging.getLogger('scout_project.security')


def validate_email(email):
    """Valida formato de email"""
    if not email or not isinstance(email, str):
        return False
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def sanitize_input(text):
    """Sanitiza entrada de texto para prevenir XSS"""
    if not text or not isinstance(text, str):
        return ''
    # Remover caracteres peligrosos
    dangerous_chars = ['<', '>', '"', "'", '&', ';']
    for char in dangerous_chars:
        text = text.replace(char, '')
    return text.strip()


def get_client_ip(request):
    """Obtiene la IP real del cliente considerando proxies"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0].strip()
    else:
        ip = request.META.get('REMOTE_ADDR', '')
    return ip


def check_failed_login_attempts(email, ip_address):
    """
    Verifica intentos fallidos de login y bloquea si hay demasiados
    Retorna (is_blocked, attempts_count)
    """
    # Usar tanto email como IP para prevenir ataques distribuidos
    email_key = f"login_attempts_email_{email}"
    ip_key = f"login_attempts_ip_{ip_address}"
    
    email_attempts = cache.get(email_key, 0)
    ip_attempts = cache.get(ip_key, 0)
    
    # Bloquear si hay más de 5 intentos en 15 minutos
    MAX_ATTEMPTS = 5
    if email_attempts >= MAX_ATTEMPTS or ip_attempts >= MAX_ATTEMPTS:
        return (True, max(email_attempts, ip_attempts))
    
    return (False, max(email_attempts, ip_attempts))


def record_failed_login(email, ip_address):
    """Registra un intento fallido de login"""
    email_key = f"login_attempts_email_{email}"
    ip_key = f"login_attempts_ip_{ip_address}"
    
    # Incrementar contadores con expiración de 15 minutos
    LOCKOUT_DURATION = 900  # 15 minutos
    
    email_attempts = cache.get(email_key, 0)
    cache.set(email_key, email_attempts + 1, LOCKOUT_DURATION)
    
    ip_attempts = cache.get(ip_key, 0)
    cache.set(ip_key, ip_attempts + 1, LOCKOUT_DURATION)
    
    logger.warning(
        f'Failed login attempt for email: {email} from IP: {ip_address} '
        f'(attempt {email_attempts + 1})'
    )


def clear_failed_login_attempts(email, ip_address):
    """Limpia los intentos fallidos después de un login exitoso"""
    email_key = f"login_attempts_email_{email}"
    ip_key = f"login_attempts_ip_{ip_address}"
    cache.delete(email_key)
    cache.delete(ip_key)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Serializer personalizado para incluir información adicional del usuario en el token
    """
    username_field = 'email'

    def validate(self, attrs):
        # Obtener email y password
        email = attrs.get('email')
        password = attrs.get('password')

        # Validar formato de email
        if not validate_email(email):
            raise Exception('Formato de email inválido')

        try:
            # Buscar usuario por email
            usuario = Usuario.objects.select_related('pel_id').get(
                usu_email=email,
                usu_vigente=True
            )

            # Verificar password usando check_password de Django
            if not usuario.check_password(password):
                raise Exception('Credenciales inválidas')

            # Generar tokens
            refresh = RefreshToken.for_user(usuario)
            
            # Agregar claims personalizados
            refresh['email'] = usuario.usu_email
            refresh['username'] = usuario.usu_username
            refresh['perfil'] = usuario.pel_id.pel_descripcion if usuario.pel_id else None
            refresh['user_id'] = usuario.usu_id

            return {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'id': usuario.usu_id,
                    'username': usuario.usu_username,
                    'email': usuario.usu_email,
                    'perfil': usuario.pel_id.pel_descripcion if usuario.pel_id else None,
                    'foto': usuario.usu_ruta_foto,
                }
            }

        except Usuario.DoesNotExist:
            raise Exception('Credenciales inválidas')


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Vista personalizada para login con JWT
    """
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [AllowAny]
    throttle_classes = [LoginRateThrottle]


@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([LoginRateThrottle])
def login_view(request):
    """
    Endpoint de login alternativo con protección contra brute force
    POST /api/auth/login
    Body: {"email": "user@example.com", "password": "password"}
    """
    email = sanitize_input(request.data.get('email', ''))
    password = request.data.get('password')
    ip_address = get_client_ip(request)

    if not email or not password:
        return Response(
            {'error': 'Email y password son requeridos'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Validar formato de email
    if not validate_email(email):
        return Response(
            {'error': 'Formato de email inválido'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Verificar si la cuenta está bloqueada por intentos fallidos
    is_blocked, attempts = check_failed_login_attempts(email, ip_address)
    if is_blocked:
        logger.warning(
            f'Login blocked due to too many failed attempts for email: {email} '
            f'from IP: {ip_address}'
        )
        return Response(
            {'error': 'Cuenta temporalmente bloqueada por seguridad. Intente nuevamente en 15 minutos.'},
            status=status.HTTP_429_TOO_MANY_REQUESTS
        )

    # Validar longitud de password (sin revelar detalles específicos)
    if len(password) < 8:
        record_failed_login(email, ip_address)
        return Response(
            {'error': 'Credenciales inválidas'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    try:
        # Buscar usuario
        usuario = Usuario.objects.select_related('pel_id').get(
            usu_email=email,
            usu_vigente=True
        )

        # Verificar password usando check_password de Django
        if not usuario.check_password(password):
            record_failed_login(email, ip_address)
            return Response(
                {'error': 'Credenciales inválidas'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Login exitoso - limpiar intentos fallidos
        clear_failed_login_attempts(email, ip_address)
        
        logger.info(
            f'Successful login for user: {usuario.usu_username} (ID: {usuario.usu_id}) '
            f'from IP: {ip_address}'
        )

        # Generar tokens JWT
        refresh = RefreshToken.for_user(usuario)
        
        return Response({
            'success': True,
            'accessToken': str(refresh.access_token),
            'refreshToken': str(refresh),
            'user': {
                'id': usuario.usu_id,
                'email': usuario.usu_email,
                'name': usuario.usu_username,
                'rol': usuario.pel_id.pel_descripcion if usuario.pel_id else 'usuario',
                'foto': usuario.usu_ruta_foto,
            }
        })

    except Usuario.DoesNotExist:
        # Registrar intento fallido sin revelar si el usuario existe
        record_failed_login(email, ip_address)
        return Response(
            {'error': 'Credenciales inválidas'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    except Exception as e:
        logger.error(f'Login error for email {email}: {str(e)}')
        return Response(
            {'error': 'Error al procesar la solicitud'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """
    Endpoint de logout con blacklist del refresh token
    POST /api/auth/logout
    Body: {"refresh_token": "token"}
    """
    try:
        refresh_token = request.data.get('refresh_token')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
            
            logger.info(
                f'User logout: {request.user.usu_username} (ID: {request.user.usu_id}) '
                f'from IP: {get_client_ip(request)}'
            )
        
        return Response({
            'success': True,
            'message': 'Logout exitoso'
        })
    except TokenError as e:
        logger.warning(f'Token error during logout: {str(e)}')
        return Response(
            {'error': 'Token inválido o expirado'},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        logger.error(f'Logout error: {str(e)}')
        return Response(
            {'error': 'Error al cerrar sesión'},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_view(request):
    """
    Obtener información del usuario actual
    GET /api/auth/me
    """
    try:
        usuario = request.user
        return Response({
            'id': usuario.usu_id,
            'username': usuario.usu_username,
            'email': usuario.usu_email,
            'perfil': usuario.pel_id.pel_descripcion if hasattr(usuario, 'pel_id') and usuario.pel_id else None,
            'foto': usuario.usu_ruta_foto if hasattr(usuario, 'usu_ruta_foto') else None,
        })
    except Exception as e:
        logger.error(f'Error getting user info: {str(e)}')
        return Response(
            {'error': 'Error al obtener información del usuario'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([AllowAny])
def csrf_token_view(request):
    """
    Endpoint para obtener CSRF token
    GET /api/auth/csrf-token
    """
    from django.middleware.csrf import get_token
    return Response({
        'csrfToken': get_token(request)
    })
