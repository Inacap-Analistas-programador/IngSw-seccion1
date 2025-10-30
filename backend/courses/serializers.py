from rest_framework import serializers
from .models import Curso, CursoSeccion, CursoCoordinador, CursoCuota, CursoFecha, CursoFormador, CursoAlimentacion
from catalog.serializers import RamaSerializer
from personas.serializers import PersonaResponsableSerializer

class CursoSeccionSerializer(serializers.ModelSerializer):
    rama = RamaSerializer(read_only=True)
    class Meta:
        model = CursoSeccion
        fields = '__all__'

class CursoSerializer(serializers.ModelSerializer):
    secciones = CursoSeccionSerializer(many=True, read_only=True)
    persona_responsable = PersonaResponsableSerializer(read_only=True)
    class Meta:
        model = Curso
        fields = '__all__'

class CursoCoordinadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = CursoCoordinador
        fields = '__all__'

class CursoCuotaSerializer(serializers.ModelSerializer):
    class Meta:
        model = CursoCuota
        fields = '__all__'

class CursoFechaSerializer(serializers.ModelSerializer):
    class Meta:
        model = CursoFecha
        fields = '__all__'

class CursoFormadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = CursoFormador
        fields = '__all__'

class CursoAlimentacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CursoAlimentacion
        fields = '__all__'
