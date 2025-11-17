from rest_framework import serializers
from .models import Archivo, ArchivoCurso, ArchivoPersona


class ArchivoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Archivo
        fields = '__all__'


class ArchivoCursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArchivoCurso
        fields = '__all__'


class ArchivoPersonaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArchivoPersona
        fields = '__all__'
