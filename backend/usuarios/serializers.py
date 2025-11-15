from rest_framework import serializers
from .models import Usuario, Perfil, Aplicacion, PerfilAplicacion

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'

class PerfilSerializer(serializers.ModelSerializer):
    class Meta:
        model = Perfil
        fields = '__all__'

class AplicacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aplicacion
        fields = '__all__'

class PerfilAplicacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PerfilAplicacion
        fields = '__all__'