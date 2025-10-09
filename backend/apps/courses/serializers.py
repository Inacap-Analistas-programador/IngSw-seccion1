"""
Serializers básicos para cursos
TODO: El equipo debe completar validaciones y campos calculados
"""

from rest_framework import serializers
from .models import Course, Category, CourseTeam


class CategorySerializer(serializers.ModelSerializer):
    """Serializer para categorías"""
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'is_active']


class CourseSerializer(serializers.ModelSerializer):
    """
    Serializer básico para cursos
    TODO: Agregar campos calculados y validaciones de fechas
    """
    
    class Meta:
        model = Course
        fields = [
            'id', 'title', 'description', 'code', 'category', 'rama', 
            'status', 'price', 'max_participants', 'start_date', 'end_date',
            'created_by', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by']


class CourseTeamSerializer(serializers.ModelSerializer):
    """
    Serializer para equipo del curso
    TODO: Agregar información del usuario y validaciones
    """
    
    class Meta:
        model = CourseTeam
        fields = ['id', 'course', 'user', 'role', 'assigned_at']