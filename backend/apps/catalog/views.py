"""
ViewSets para los catálogos maestros de SGICS
"""

from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import (
    Region, Provincia, Comuna, Zona, Distrito, GrupoScout,
    Rama, TipoCurso, Nivel, EstadoCivil, TipoAlimentacion
)
from .serializers import (
    RegionSerializer, ProvinciaSerializer, ComunaSerializer,
    ZonaSerializer, DistritoSerializer, GrupoScoutSerializer,
    RamaSerializer, TipoCursoSerializer, NivelSerializer,
    EstadoCivilSerializer, TipoAlimentacionSerializer
)


class RegionViewSet(viewsets.ModelViewSet):
    """
    CRUD completo para regiones de Chile
    """
    queryset = Region.objects.all()
    serializer_class = RegionSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['is_active']
    search_fields = ['codigo', 'nombre', 'nombre_corto']
    ordering = ['codigo']


class ProvinciaViewSet(viewsets.ModelViewSet):
    """
    CRUD completo para provincias con filtros por región
    """
    queryset = Provincia.objects.select_related('region').all()
    serializer_class = ProvinciaSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['region', 'is_active']
    search_fields = ['codigo', 'nombre', 'region__nombre']
    ordering = ['region__codigo', 'nombre']


class ComunaViewSet(viewsets.ModelViewSet):
    """
    CRUD completo para comunas con filtros por provincia y región
    """
    queryset = Comuna.objects.select_related('provincia__region').all()
    serializer_class = ComunaSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['provincia', 'provincia__region', 'is_active']
    search_fields = ['codigo', 'nombre', 'provincia__nombre', 'provincia__region__nombre']
    ordering = ['provincia__region__codigo', 'provincia__nombre', 'nombre']

    @action(detail=False, methods=['get'])
    def by_region(self, request):
        """Endpoint personalizado: comunas agrupadas por región"""
        region_id = request.query_params.get('region_id')
        if region_id:
            comunas = self.get_queryset().filter(provincia__region=region_id)
            serializer = self.get_serializer(comunas, many=True)
            return Response(serializer.data)
        return Response({'error': 'region_id required'}, status=400)


class ZonaViewSet(viewsets.ModelViewSet):
    """
    CRUD para zonas Scout
    """
    queryset = Zona.objects.select_related('region_principal').all()
    serializer_class = ZonaSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['region_principal', 'is_active']
    search_fields = ['codigo', 'nombre', 'descripcion']
    ordering = ['nombre']


class DistritoViewSet(viewsets.ModelViewSet):
    """
    CRUD para distritos Scout con filtros por zona
    """
    queryset = Distrito.objects.select_related('zona').all()
    serializer_class = DistritoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['zona', 'is_active']
    search_fields = ['codigo', 'nombre', 'zona__nombre']
    ordering = ['zona__nombre', 'nombre']


class GrupoScoutViewSet(viewsets.ModelViewSet):
    """
    CRUD completo para grupos Scout
    """
    queryset = GrupoScout.objects.select_related(
        'distrito__zona', 'comuna__provincia__region'
    ).all()
    serializer_class = GrupoScoutSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['distrito', 'distrito__zona', 'comuna', 'is_active']
    search_fields = ['codigo', 'nombre', 'distrito__nombre', 'comuna__nombre']
    ordering = ['distrito__zona__nombre', 'nombre']

    @action(detail=False, methods=['get'])
    def by_zona(self, request):
        """Grupos agrupados por zona"""
        zona_id = request.query_params.get('zona_id')
        if zona_id:
            grupos = self.get_queryset().filter(distrito__zona=zona_id)
            serializer = self.get_serializer(grupos, many=True)
            return Response(serializer.data)
        return Response({'error': 'zona_id required'}, status=400)


class RamaViewSet(viewsets.ModelViewSet):
    """
    CRUD para ramas Scout
    """
    queryset = Rama.objects.all()
    serializer_class = RamaSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['is_active']
    search_fields = ['codigo', 'nombre']
    ordering = ['edad_minima']


class TipoCursoViewSet(viewsets.ModelViewSet):
    """
    CRUD para tipos de cursos
    """
    queryset = TipoCurso.objects.all()
    serializer_class = TipoCursoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['is_active']
    search_fields = ['codigo', 'nombre', 'descripcion']
    ordering = ['nombre']


class NivelViewSet(viewsets.ModelViewSet):
    """
    CRUD para niveles de formación
    """
    queryset = Nivel.objects.select_related('rama').all()
    serializer_class = NivelSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['rama', 'is_active']
    search_fields = ['codigo', 'nombre', 'rama__nombre']
    ordering = ['rama__codigo', 'orden']


class EstadoCivilViewSet(viewsets.ModelViewSet):
    """
    CRUD para estados civiles
    """
    queryset = EstadoCivil.objects.all()
    serializer_class = EstadoCivilSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['codigo', 'nombre']
    ordering = ['nombre']


class TipoAlimentacionViewSet(viewsets.ModelViewSet):
    """
    CRUD para tipos de alimentación
    """
    queryset = TipoAlimentacion.objects.all()
    serializer_class = TipoAlimentacionSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['es_restriccion', 'is_active']
    search_fields = ['codigo', 'nombre', 'descripcion']
    ordering = ['nombre']