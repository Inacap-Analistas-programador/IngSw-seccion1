from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Usuario

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        if user.perfil:
            token['perfil'] = user.perfil.pel_descripcion
        else:
            token['perfil'] = None

        return token
