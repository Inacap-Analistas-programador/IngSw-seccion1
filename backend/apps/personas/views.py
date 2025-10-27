import csv

from django.http import HttpResponse
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Persona
from .serializers import PersonaSerializer


class PersonaViewSet(viewsets.ModelViewSet):
    queryset = Persona.objects.all()
    serializer_class = PersonaSerializer
    permission_classes = [AllowAny]

    @action(detail=False, methods=["get"])
    def export(self, request):
        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = 'attachment; filename="personas.csv"'
        writer = csv.writer(response)
        writer.writerow(["ID", "Nombres", "Email"])
        for persona in self.get_queryset():
            writer.writerow([persona.id, persona.nombres, persona.email])
        return response


class PersonsSearchPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100


class PersonaSearchView(generics.ListAPIView):
    """
    GET /api/persons/search/

    Filtros por query params:
    - rut: str (acepta formato y parciales)
    - nombre: str (icontains sobre 'nombres')
    - grupo: str (código exacto o nombre icontains)
    - rama: str (código exacto o nombre icontains)
    - edad_min: int (>=)
    - edad_max: int (<=)
    Paginación: page, page_size
    """

    serializer_class = PersonaSerializer
    permission_classes = [AllowAny]
    pagination_class = PersonsSearchPagination

    @staticmethod
    def _years_ago(base: date, years: int) -> date:
        try:
            return base.replace(year=base.year - years)
        except ValueError:
            return base.replace(month=2, day=28, year=base.year - years)

    @staticmethod
    def _parse_int(value):
        try:
            return int(value)
        except Exception:
            return None

    def get_queryset(self):
        qs = Persona.objects.all().order_by("id")
        p = self.request.query_params
        filters = Q()

        rut = (p.get("rut") or "").strip()
        if rut:
            cleaned = clean_rut(rut)
            formatted = format_rut(rut) or None
            q = Q(rut__icontains=cleaned)
            if formatted:
                q |= Q(rut__iexact=formatted)
            filters &= q

        nombre = (p.get("nombre") or "").strip()
        if nombre:
            filters &= Q(nombres__icontains=nombre)

        grupo = (p.get("grupo") or "").strip()
        if grupo:
            filters &= Q(grupo__codigo__iexact=grupo) | Q(grupo__nombre__icontains=grupo)

        rama = (p.get("rama") or "").strip()
        if rama:
            filters &= Q(rama__codigo__iexact=rama) | Q(rama__nombre__icontains=rama)

        today = date.today()
        edad_min = p.get("edad_min")
        edad_max = p.get("edad_max")

        edad_min_i = self._parse_int(edad_min) if edad_min not in (None, "") else None
        edad_max_i = self._parse_int(edad_max) if edad_max not in (None, "") else None

        if edad_min_i is not None:
            limite_superior = self._years_ago(today, edad_min_i)
            filters &= Q(fecha_nacimiento__lte=limite_superior)

        if edad_max_i is not None:
            limite_inferior = self._years_ago(today, edad_max_i)
            filters &= Q(fecha_nacimiento__gte=limite_inferior)

        return qs.filter(filters)
