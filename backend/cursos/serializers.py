from rest_framework import serializers
from .models import (
    Curso,
    CursoSeccion,
    CursoFecha,
    CursoCuota,
    CursoAlimentacion,
    CursoCoordinador,
    CursoFormador,
)


class CursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Curso
        fields = '__all__'


class CursoSeccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CursoSeccion
        fields = '__all__'


class CursoFechaSerializer(serializers.ModelSerializer):
    class Meta:
        model = CursoFecha
        fields = '__all__'


class CursoCuotaSerializer(serializers.ModelSerializer):
    class Meta:
        model = CursoCuota
        fields = '__all__'


class CursoAlimentacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CursoAlimentacion
        fields = '__all__'


class CursoCoordinadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = CursoCoordinador
        fields = '__all__'


class CursoFormadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = CursoFormador
        fields = '__all__'
