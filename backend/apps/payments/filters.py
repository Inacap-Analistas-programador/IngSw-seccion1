# c:\Users\the_8\Desktop\boysxou\ProyectoBoyscout\IngSw-seccion1\backend\apps\payments\filters.py

import django_filters
from .models import PagoPersona, ComprobantePago


class PagoPersonaFilter(django_filters.FilterSet):
    """
    Filtros personalizados para el modelo PagoPersona.
    """

    fecha_inicio = django_filters.DateFilter(
        field_name="PAP_FECHA_HORA",
        lookup_expr="gte",
        label="Fecha de inicio (YYYY-MM-DD)",
    )
    fecha_fin = django_filters.DateFilter(
        field_name="PAP_FECHA_HORA",
        lookup_expr="lte",
        label="Fecha de fin (YYYY-MM-DD)",
    )

    class Meta:
        model = PagoPersona
        fields = ["PER_ID", "CUR_ID", "PAP_TIPO"]


class ComprobantePagoFilter(django_filters.FilterSet):
    """
    Filtros personalizados para el modelo ComprobantePago.
    """

    class Meta:
        model = ComprobantePago
        fields = ["PEC_ID", "COC_ID", "CPA_NUMERO"]
