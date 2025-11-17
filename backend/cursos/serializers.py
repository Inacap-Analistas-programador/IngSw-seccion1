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


class CursoFechaSerializer(serializers.ModelSerializer):
    class Meta:
        model = CursoFecha
        fields = ['cuf_id', 'cuf_fecha_inicio', 'cuf_fecha_termino', 'cuf_tipo']


class CursoSerializer(serializers.ModelSerializer):
    fechas = CursoFechaSerializer(many=True, required=False, source='cursofecha_set')
    
    class Meta:
        model = Curso
        fields = '__all__'
    
    def create(self, validated_data):
        fechas_data = validated_data.pop('cursofecha_set', [])
        curso = Curso.objects.create(**validated_data)
        for fecha_data in fechas_data:
            CursoFecha.objects.create(cur_id=curso, **fecha_data)
        return curso
    
    def update(self, instance, validated_data):
        fechas_data = validated_data.pop('cursofecha_set', None)
        
        # Update curso fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update fechas if provided
        if fechas_data is not None:
            # Delete existing fechas and create new ones
            instance.cursofecha_set.all().delete()
            for fecha_data in fechas_data:
                CursoFecha.objects.create(cur_id=instance, **fecha_data)
        
        return instance


class CursoSeccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CursoSeccion
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
