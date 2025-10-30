from django_filters import rest_framework as filters
from .models import Curso

class CursoFilter(filters.FilterSet):
    titulo = filters.CharFilter(field_name='descripcion', lookup_expr='icontains')
    rama = filters.CharFilter(field_name='secciones__rama__nombre', lookup_expr='icontains')
    fecha_desde = filters.DateFilter(field_name='fechas__fecha_inicio', lookup_expr='gte')
    fecha_hasta = filters.DateFilter(field_name='fechas__fecha_termino', lookup_expr='lte')

    class Meta:
        model = Curso
        fields = ['titulo', 'rama', 'fecha_desde', 'fecha_hasta']
