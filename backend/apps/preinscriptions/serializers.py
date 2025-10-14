"""
Serializers para preinscripciones Scout
"""

from rest_framework import serializers
from .models import Preinscripcion


class PreinscripcionListSerializer(serializers.ModelSerializer):
    """
    Serializer para listas de preinscripciones
    """
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    course_title = serializers.CharField(source='course.title', read_only=True)
    course_code = serializers.CharField(source='course.code', read_only=True)
    estado_display = serializers.CharField(source='get_estado_display', read_only=True)
    puede_pagar = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Preinscripcion
        fields = [
            'id', 'user', 'user_name', 'user_email', 'course', 'course_title', 'course_code',
            'estado', 'estado_display', 'grupo', 'puede_pagar', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class PreinscripcionDetailSerializer(serializers.ModelSerializer):
    """
    Serializer completo para detalles de preinscripción
    """
    user_info = serializers.SerializerMethodField()
    course_info = serializers.SerializerMethodField()
    estado_display = serializers.CharField(source='get_estado_display', read_only=True)
    puede_pagar = serializers.BooleanField(read_only=True)
    pagos = serializers.SerializerMethodField()
    archivos = serializers.SerializerMethodField()
    
    class Meta:
        model = Preinscripcion
        fields = [
            'id', 'user', 'user_info', 'course', 'course_info', 'estado', 'estado_display',
            'observaciones', 'grupo', 'puede_pagar', 'confirmado_at', 'validated_at', 
            'cancelled_at', 'pagos', 'archivos', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'confirmado_at', 'validated_at', 'cancelled_at']
    
    def get_user_info(self, obj):
        """Información del usuario"""
        return {
            'id': obj.user.id,
            'name': obj.user.get_full_name() or obj.user.username,
            'email': obj.user.email,
            'rut': getattr(obj.user, 'rut', ''),
            'telefono': getattr(obj.user, 'telefono', ''),
        }
    
    def get_course_info(self, obj):
        """Información del curso"""
        return {
            'id': obj.course.id,
            'title': obj.course.title,
            'code': obj.course.code,
            'price': str(obj.course.price),
            'start_date': obj.course.start_date,
            'end_date': obj.course.end_date,
            'rama': obj.course.rama,
        }
    
    def get_pagos(self, obj):
        """Lista de pagos relacionados"""
        # TODO: Implementar cuando tengamos el modelo de pagos conectado
        return []
    
    def get_archivos(self, obj):
        """Lista de archivos subidos"""
        archivos = obj.archivos.all()
        return [
            {
                'id': archivo.id,
                'name': archivo.name,
                'tipo': archivo.tipo,
                'estado': archivo.estado,
                'uploaded_at': archivo.uploaded_at,
            }
            for archivo in archivos
        ]


# Alias para compatibilidad
PreinscripcionSerializer = PreinscripcionDetailSerializer


class PreinscripcionCreateSerializer(serializers.ModelSerializer):
    """
    Serializer para crear preinscripciones
    """
    
    class Meta:
        model = Preinscripcion
        fields = ['user', 'course', 'observaciones']
    
    def validate(self, data):
        user = data['user']
        course = data['course']
        
        # Validar que no exista preinscripción duplicada
        if Preinscripcion.objects.filter(user=user, course=course).exists():
            raise serializers.ValidationError(
                "Ya existe una preinscripción para este usuario y curso"
            )
        
        # Validar que el curso esté activo
        if course.status != 'ACTIVE':
            raise serializers.ValidationError(
                "No se puede inscribir en un curso inactivo"
            )
            
        return data


class PreinscripcionUpdateEstadoSerializer(serializers.Serializer):
    """
    Serializer para cambiar estado de preinscripciones
    """
    nuevo_estado = serializers.ChoiceField(choices=Preinscripcion.ESTADOS)
    observaciones = serializers.CharField(required=False, allow_blank=True)
    motivo_rechazo = serializers.CharField(required=False, allow_blank=True)
    
    def validate_nuevo_estado(self, value):
        """Validar que la transición de estado sea válida"""
        instance = getattr(self, 'instance', None)
        if instance and not instance.puede_transicionar(value):
            raise serializers.ValidationError(
                f"No se puede cambiar de {instance.estado} a {value}"
            )
        return value