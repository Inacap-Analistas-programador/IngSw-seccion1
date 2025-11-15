from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.hashers import check_password
from usuarios.models import Usuario


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Serializer personalizado para incluir información adicional del usuario en el token
    """
    username_field = 'email'

    def validate(self, attrs):
        # Obtener email y password
        email = attrs.get('email')
        password = attrs.get('password')

        try:
            # Buscar usuario por email
            usuario = Usuario.objects.select_related('pel_id').get(
                usu_email=email,
                usu_vigente=True
            )

            # Verificar password (asumiendo que está hasheado)
            # NOTA: Ajustar según el método de hash usado en la BD
            if usuario.usu_password != password:  # Temporal - implementar hash apropiado
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


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    Endpoint de login alternativo
    POST /api/auth/login
    Body: {"email": "user@example.com", "password": "password"}
    """
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response(
            {'error': 'Email y password son requeridos'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # Buscar usuario
        usuario = Usuario.objects.select_related('pel_id').get(
            usu_email=email,
            usu_vigente=True
        )

        # Verificar password (implementar hash apropiado en producción)
        if usuario.usu_password != password:
            return Response(
                {'error': 'Credenciales inválidas'},
                status=status.HTTP_401_UNAUTHORIZED
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
        return Response(
            {'error': 'Credenciales inválidas'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """
    Endpoint de logout
    POST /api/auth/logout
    """
    try:
        refresh_token = request.data.get('refresh_token')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        
        return Response({
            'success': True,
            'message': 'Logout exitoso'
        })
    except Exception as e:
        return Response(
            {'error': str(e)},
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
        return Response(
            {'error': str(e)},
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
