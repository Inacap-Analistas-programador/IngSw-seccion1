from rest_framework import serializers
from .models import (
    Persona,
    PersonaGrupo,
    PersonaNivel,
    PersonaFormador,
    PersonaIndividual,
    PersonaVehiculo,
    PersonaCurso,
    PersonaEstadoCurso,
)


class PersonaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Persona
        fields = '__all__'


class PersonaGrupoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonaGrupo
        fields = '__all__'


class PersonaNivelSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonaNivel
        fields = '__all__'


class PersonaFormadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonaFormador
        fields = '__all__'


class PersonaIndividualSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonaIndividual
        fields = '__all__'


class PersonaVehiculoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonaVehiculo
        fields = '__all__'


class PersonaCursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonaCurso
        fields = '__all__'


class PersonaEstadoCursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonaEstadoCurso
        fields = '__all__'
