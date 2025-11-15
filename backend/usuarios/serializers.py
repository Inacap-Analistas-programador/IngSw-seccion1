from rest_framework import serializers
from .models import Usuario, PerfilAplicacion
from maestros.models import Perfil, Aplicacion


class UsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=False,
        help_text="Password will be hashed automatically"
    )
    
    class Meta:
        model = Usuario
        fields = ['usu_id', 'pel_id', 'usu_username', 'usu_email', 
                  'usu_ruta_foto', 'usu_vigente', 'password']
        read_only_fields = ['usu_id']
        extra_kwargs = {
            'usu_password': {'write_only': True}
        }
    
    def create(self, validated_data):
        """Create user with hashed password"""
        password = validated_data.pop('password', None)
        usuario = Usuario(**validated_data)
        if password:
            usuario.set_password(password)
        usuario.save()
        return usuario
    
    def update(self, instance, validated_data):
        """Update user and hash password if changed"""
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


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