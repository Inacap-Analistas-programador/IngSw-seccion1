"""
Módulo de Vistas (Views) para la aplicación de Pagos.

Este módulo contiene los `ViewSets` que definen la lógica de la API para cada
modelo del módulo de pagos. Cada `ViewSet` se encarga de gestionar las
operaciones CRUD (Crear, Leer, Actualizar, Eliminar) para su modelo asociado.
"""
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from .models import PagoPersona, PagoCambioPersona, Prepago, ComprobantePago, PagoComprobante, ConceptoContable
from .serializers import (
    PagoPersonaSerializer, PagoCambioPersonaSerializer, PrepagoSerializer, 
    ComprobantePagoSerializer, PagoComprobanteSerializer, ConceptoContableSerializer
)
from .filters import PagoPersonaFilter, ComprobantePagoFilter
# Importamos la clase de permiso personalizada. Asumiendo que está en un módulo de permisos.
# Para este ejemplo, la importamos desde la configuración de DRF.
from scouts_platform.settings.rest_framework import IsTreasurerOrAdminOrReadOnly
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from apps.preinscriptions.models import Preinscripcion
from .models import PagoPersona

class PagoPersonaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar los pagos de personas (`PagoPersona`).

    Proporciona los endpoints estándar para:
    - `GET /pagos-persona/`: Listar todos los pagos.
    - `POST /pagos-persona/`: Crear un nuevo pago.
    - `GET /pagos-persona/{id}/`: Ver el detalle de un pago.
    - `PUT /pagos-persona/{id}/`: Actualizar un pago existente.
    - `DELETE /pagos-persona/{id}/`: Eliminar un pago.
    """
    # queryset: Define la consulta base para obtener los datos.
    # Usamos `select_related('USU_ID')` para optimizar la consulta, trayendo
    # los datos del usuario relacionado en una sola petición a la base de datos.
    queryset = PagoPersona.objects.select_related('USU_ID').all()
    
    # serializer_class: Especifica el serializador que se usará para convertir
    # los objetos `PagoPersona` a JSON y viceversa.
    serializer_class = PagoPersonaSerializer
    
    # permission_classes: Define quién tiene permiso para acceder a esta vista.
    # `IsTreasurerOrAdminOrReadOnly` permite leer a cualquier usuario autenticado,
    # pero solo permite escribir (crear, actualizar, borrar) a administradores/tesoreros.
    # Allow authenticated users to create payments; domain-specific stricter
    # permissions (treasurer/admin) can be applied elsewhere.
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    # Conectamos la clase de filtro que creamos.
    filterset_class = PagoPersonaFilter

    def perform_create(self, serializer):
        """Asigna automáticamente el usuario autenticado como creador del pago."""
        serializer.save(USU_ID=self.request.user)

    @action(detail=False, methods=['get'], url_path='mis-pagos', url_name='mis-pagos')
    def mis_pagos(self, request):
        pagos = PagoPersona.objects.filter(USU_ID=request.user)
        ser = PagoPersonaSerializer(pagos, many=True)
        return Response(ser.data)

    @action(detail=False, methods=['get'], url_path='by-group', url_name='by-group')
    def by_group(self, request):
        group = request.query_params.get('group')
        if not group:
            return Response({'detail': 'group param required'}, status=status.HTTP_400_BAD_REQUEST)
        course = request.query_params.get('course')
        pres = Preinscripcion.objects.filter(grupo=group, estado=Preinscripcion.APROBADA)
        if course:
            pres = pres.filter(course_id=course)
        user_ids = pres.values_list('user_id', flat=True)
        pagos = PagoPersona.objects.filter(PER_ID__in=user_ids)
        ser = PagoPersonaSerializer(pagos, many=True)
        return Response({'group': group, 'count': pagos.count(), 'items': ser.data})

class PagoCambioPersonaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para el historial de cambios de titularidad de un pago (`PagoCambioPersona`).
    
    Permite auditar las transferencias de pagos entre personas.
    """
    # Optimizamos la consulta para incluir los datos del usuario y del pago original.
    queryset = PagoCambioPersona.objects.select_related('USU_ID', 'PAP_ID').all()
    serializer_class = PagoCambioPersonaSerializer
    permission_classes = [IsTreasurerOrAdminOrReadOnly]

    def perform_create(self, serializer):
        """Asigna automáticamente el usuario autenticado que registra el cambio."""
        serializer.save(USU_ID=self.request.user)

class PrepagoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar los saldos a favor o prepagos (`Prepago`).
    
    Endpoint para administrar los créditos que una persona tiene a su favor.
    """
    # Optimizamos la consulta para incluir el pago que originó el prepago, si existe.
    queryset = Prepago.objects.select_related('PAP_ID').all()
    serializer_class = PrepagoSerializer
    permission_classes = [IsTreasurerOrAdminOrReadOnly]

class ConceptoContableViewSet(viewsets.ModelViewSet):
    """
    ViewSet para el catálogo de conceptos contables (`ConceptoContable`).
    
    Permite administrar los diferentes tipos de transacciones (ej. 'Inscripción', 'Donación').
    """
    queryset = ConceptoContable.objects.all()
    serializer_class = ConceptoContableSerializer
    permission_classes = [IsTreasurerOrAdminOrReadOnly]

class ComprobantePagoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para los documentos de comprobantes de pago (`ComprobantePago`).
    
    Gestiona la creación y consulta de los recibos o facturas que respaldan los pagos.
    """
    # Optimizamos la consulta para incluir el usuario y el concepto contable.
    queryset = ComprobantePago.objects.select_related('USU_ID', 'COC_ID').all()
    serializer_class = ComprobantePagoSerializer
    permission_classes = [IsTreasurerOrAdminOrReadOnly]
    
    # Conectamos el nuevo conjunto de filtros para los comprobantes.
    filterset_class = ComprobantePagoFilter

    def perform_create(self, serializer):
        """Asigna automáticamente el usuario autenticado como emisor del comprobante."""
        serializer.save(USU_ID=self.request.user)

class PagoComprobanteViewSet(viewsets.ModelViewSet):
    """
    ViewSet para la relación entre Pagos y Comprobantes (`PagoComprobante`).
    
    Administra la tabla intermedia que vincula qué pagos pertenecen a qué comprobantes.
    """
    # Optimizamos para traer los datos del pago y del comprobante en una sola consulta.
    queryset = PagoComprobante.objects.select_related('PAP_ID', 'CPA_ID').all()
    serializer_class = PagoComprobanteSerializer
    permission_classes = [IsTreasurerOrAdminOrReadOnly]


# Legacy compatibility ViewSet removed. Use canonical endpoints (pagos-persona,
# comprobantes-pago, prepagos, etc.) for payment operations.


# Compatibility PagoViewSet removed: canonical models (PagoPersona, ComprobantePago, PagoComprobante, Prepago)
# provide the domain functionality. If we need compatibility endpoints they should be
# implemented as separate adapters that translate requests to the canonical models.
