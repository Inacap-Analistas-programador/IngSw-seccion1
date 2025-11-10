import django_filters
from .models import Persona


class PersonaFilter(django_filters.FilterSet):
    grupo_id = django_filters.NumberFilter(method='filter_grupo')
    zona_id = django_filters.NumberFilter(method='filter_zona')
    distrito_id = django_filters.NumberFilter(method='filter_distrito')
    cargo_id = django_filters.NumberFilter(method='filter_cargo')
    nivel_id = django_filters.NumberFilter(method='filter_nivel')
    rama_id = django_filters.NumberFilter(method='filter_rama')
    vigente = django_filters.BooleanFilter(field_name='vigente')
    registro_vigente = django_filters.BooleanFilter(field_name='registro_vigente')

    class Meta:
        model = Persona
        fields = {
            'nombres': ['icontains'],
            'email': ['icontains'],
            'run': ['exact'],
        }

    def filter_grupo(self, queryset, name, value):
        if value is None:
            return queryset
        return queryset.filter(personagrupo__grupo_id=value).distinct()

    def filter_zona(self, queryset, name, value):
        if value is None:
            return queryset
        return queryset.filter(personaindividual__zona_id=value).distinct()

    def filter_distrito(self, queryset, name, value):
        if value is None:
            return queryset
        return queryset.filter(personaindividual__distrito_id=value).distinct()

    def filter_cargo(self, queryset, name, value):
        if value is None:
            return queryset
        return queryset.filter(personaindividual__cargo_id=value).distinct()

    def filter_nivel(self, queryset, name, value):
        if value is None:
            return queryset
        return queryset.filter(personanivel__nivel_id=value).distinct()

    def filter_rama(self, queryset, name, value):
        if value is None:
            return queryset
        return queryset.filter(personanivel__rama_id=value).distinct()
