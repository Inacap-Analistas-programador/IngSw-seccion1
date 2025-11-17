"""
Custom authentication backend for Usuario model
"""
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed
from usuarios.models import Usuario
import logging

logger = logging.getLogger('scout_project.security')


class UsuarioJWTAuthentication(JWTAuthentication):
    """
    Custom JWT Authentication that works with Usuario model instead of Django's User model
    """
    
    def get_user(self, validated_token):
        """
        Get the Usuario instance from the token's user_id claim
        """
        try:
            user_id = validated_token.get('user_id')
            if user_id is None:
                raise InvalidToken('Token contained no recognizable user identification')
            
            usuario = Usuario.objects.select_related('pel_id').get(
                usu_id=user_id,
                usu_vigente=True
            )
            
            return usuario
            
        except Usuario.DoesNotExist:
            raise AuthenticationFailed('User not found', code='user_not_found')
        except Exception as e:
            logger.error(f'Error retrieving user from token: {str(e)}')
            raise AuthenticationFailed('Invalid token', code='invalid_token')
