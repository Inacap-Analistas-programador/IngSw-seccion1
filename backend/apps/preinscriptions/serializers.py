"""
Serializers básicos para preinscripciones
TODO: El equipo debe completar validaciones y campos calculados
"""

from rest_framework import serializers
from .models import Preinscripcion


class PreinscripcionSerializer(serializers.ModelSerializer):
    """
    Serializer básico para preinscripciones
    TODO: Agregar campos de información del usuario y curso
    """
    
    class Meta:
        model = Preinscripcion
        fields = ['id', 'user', 'course', 'estado', 'observaciones', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class PreinscripcionCreateSerializer(serializers.ModelSerializer):
    """
    Serializer para crear preinscripciones
    TODO: Implementar validaciones de cupos y fechas de inscripción
    """
    
    class Meta:
        model = Preinscripcion
        fields = ['user', 'course', 'observaciones']
    
    def validate(self, data):
        # TODO: Validar que no exista preinscripción duplicada
        # TODO: Validar cupos disponibles del curso
        # TODO: Validar fechas de inscripción
        return data