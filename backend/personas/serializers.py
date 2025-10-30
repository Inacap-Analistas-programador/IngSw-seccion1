from rest_framework import serializers
from .models import Persona, PersonaIndividual, PersonaNivel, PersonaFormador

class PersonaResponsableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Persona
        fields = ['id', 'nombres', 'apelpat']

class PersonaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Persona
        fields = '__all__'

class PersonaIndividualSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonaIndividual
        fields = '__all__'

class PersonaNivelSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonaNivel
        fields = '__all__'

class PersonaFormadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonaFormador
        fields = '__all__'
