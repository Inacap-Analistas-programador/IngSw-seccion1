"""
Views para el módulo de pagos
"""

from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
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
class PagoViewSet(viewsets.ModelViewSet):
    """ViewSet para pagos"""
    
    queryset = Pago.objects.all()
    serializer_class = PagoSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['estado', 'medio', 'preinscripcion__course']
    search_fields = [
        'preinscripcion__user__first_name', 
        'preinscripcion__user__last_name', 
        'preinscripcion__user__rut',
        'referencia'
    ]
    ordering_fields = ['created_at', 'fecha_pago', 'monto']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return PagoCreateSerializer
        elif self.action == 'retrieve':
            return PagoDetailSerializer
        return PagoSerializer
    
    def perform_create(self, serializer):
        serializer.save(registrado_por=self.request.user)
    
    @action(detail=True, methods=['patch'])
    def cambiar_estado(self, request, pk=None):
        """Cambia el estado de un pago"""
        pago = self.get_object()
        nuevo_estado = request.data.get('estado')
        
        if nuevo_estado not in dict(Pago.ESTADOS):
            return Response(
                {'error': 'Estado inválido'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        pago.estado = nuevo_estado
        pago.save()
        
        serializer = self.get_serializer(pago)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def crear_cuotas(self, request, pk=None):
        """Crea cuotas para un pago"""
        pago = self.get_object()
        cuotas_data = request.data.get('cuotas', [])
        
        # Validar que no existan cuotas ya
        if pago.cuotas.exists():
            return Response(
                {'error': 'El pago ya tiene cuotas asignadas'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        created_cuotas = []
        for cuota_data in cuotas_data:
            cuota_data['pago'] = pago.id
            serializer = CuotaCreateSerializer(data=cuota_data)
            if serializer.is_valid():
                cuota = serializer.save(pago=pago)
                created_cuotas.append(cuota)
            else:
                # Si hay error, eliminar cuotas ya creadas
                for c in created_cuotas:
                    c.delete()
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(
            CuotaSerializer(created_cuotas, many=True).data,
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=False, methods=['get'])
    def mis_pagos(self, request):
        """Obtiene los pagos del usuario actual"""
        pagos = self.queryset.filter(preinscripcion__user=request.user)
        serializer = self.get_serializer(pagos, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='by-group')
    def by_group(self, request):
        """
        GET /api/payments/by-group/?group=<grupo>&course=<id>

        Retorna pagos filtrados por el campo libre 'grupo' de la preinscripción,
        con un resumen agregado por estado y monto total.
        """
        group = (request.query_params.get('group') or '').strip()
        if not group:
            return Response({'detail': "El parámetro 'group' es requerido"}, status=status.HTTP_400_BAD_REQUEST)

        qs = self.queryset.select_related('preinscripcion__user', 'preinscripcion__course')
        qs = qs.filter(preinscripcion__grupo__iexact=group)

        course_id = request.query_params.get('course')
        if course_id:
            qs = qs.filter(preinscripcion__course_id=course_id)

        count = qs.count()
        if count == 0:
            # Fallback stub (SCRUM-116): en esta versión no llamamos a legacy externo
            return Response({
                'group': group,
                'count': 0,
                'total_amount': '0.00',
                'breakdown': {},
                'items': []
            })

        # Agregados
        from django.db.models import Sum
        total_amount = qs.aggregate(total=Sum('monto'))['total'] or 0

        # Breakdown por estado
        breakdown = {}
        for estado_key, _ in Pago.ESTADOS:
            n = qs.filter(estado=estado_key).count()
            if n:
                breakdown[estado_key] = n

        items = self.get_serializer(qs, many=True).data
        return Response({
            'group': group,
            'count': count,
            'total_amount': str(total_amount),
            'breakdown': breakdown,
            'items': items,
        })
