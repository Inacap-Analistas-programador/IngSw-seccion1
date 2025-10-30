from rest_framework import serializers
from .models import PersonaCurso, PersonaEstadoCurso, PersonaVehiculo

class PersonaCursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonaCurso
        fields = '__all__'

class PersonaEstadoCursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonaEstadoCurso
        fields = '__all__'

class PersonaVehiculoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonaVehiculo
        fields = '__all__'
