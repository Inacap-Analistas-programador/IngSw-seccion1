from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from personas.models import Persona
from personas.serializers import PersonaSerializer
from .serializers import MyTokenObtainPairSerializer

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class PersonSearchView(APIView):
    def get(self, request):
        rut = request.query_parmaams.get('rut', None)
        if rut is not None:
            try:
                persona = Persona.objects.get(run=rut)
                serializer = PersonaSerializer(persona)
                return Response(serializer.data)
            except Persona.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
