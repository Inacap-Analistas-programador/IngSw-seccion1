from rest_framework import viewsets, status
from rest_framework.response import Response
from apps.preinscriptions.models import Preinscripcion
from .models import Payment
from .serializers import PaymentSerializer

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        group_param = request.query_params.get('group', None)

        if group_param:
            # TODO: Implementar el filtrado real por grupo una vez que el modelo Preinscripcion tenga un campo 'group'.
            # Por ahora, esto es un marcador de posición.
            # Ejemplo: queryset = queryset.filter(preinscription__group=group_param)
            print(f"Filtrando por grupo: {group_param} (marcador de posición - el modelo Preinscripcion necesita el campo 'group')")
            # Devolver un queryset vacío o uno filtrado basado en un campo ficticio para demostración
            # Por ahora, simplemente devolveremos el queryset sin filtrar, pero registraremos el intento.
            pass 

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        payment = serializer.save()

        # No hay confirmación automática condicional basada en autoConfirm del curso
        # Si se necesita lógica de confirmación, debe ser implementada aquí
        # o en un servicio/señal separado.

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
