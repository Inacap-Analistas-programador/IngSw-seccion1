from rest_framework import viewsets
from .models import EstadoCivil, Cargo, Nivel, Rama, Rol, TipoArchivo, TipoCurso, Alimentacion, ConceptoContable
from geografia.models import Region, Provincia, Comuna, Zona, Distrito, Grupo
from .serializers import EstadoCivilSerializer, CargoSerializer, NivelSerializer, RamaSerializer, RolSerializer, TipoArchivoSerializer, TipoCursoSerializer, AlimentacionSerializer, ConceptoContableSerializer
from geografia.serializers import RegionSerializer, ProvinciaSerializer, ComunaSerializer, ZonaSerializer, DistritoSerializer, GrupoSerializer

class RegionViewSet(viewsets.ModelViewSet):
    queryset = Region.objects.all()
    serializer_class = RegionSerializer

class ProvinciaViewSet(viewsets.ModelViewSet):
    queryset = Provincia.objects.all()
    serializer_class = ProvinciaSerializer

class ComunaViewSet(viewsets.ModelViewSet):
    queryset = Comuna.objects.all()
    serializer_class = ComunaSerializer

class ZonaViewSet(viewsets.ModelViewSet):
    queryset = Zona.objects.all()
    serializer_class = ZonaSerializer

class DistritoViewSet(viewsets.ModelViewSet):
    queryset = Distrito.objects.all()
    serializer_class = DistritoSerializer

class GrupoViewSet(viewsets.ModelViewSet):
    queryset = Grupo.objects.all()
    serializer_class = GrupoSerializer

class EstadoCivilViewSet(viewsets.ModelViewSet):
    queryset = EstadoCivil.objects.all()
    serializer_class = EstadoCivilSerializer

class CargoViewSet(viewsets.ModelViewSet):
    queryset = Cargo.objects.all()
    serializer_class = CargoSerializer

class NivelViewSet(viewsets.ModelViewSet):
    queryset = Nivel.objects.all()
    serializer_class = NivelSerializer

class RamaViewSet(viewsets.ModelViewSet):
    queryset = Rama.objects.all()
    serializer_class = RamaSerializer

class RolViewSet(viewsets.ModelViewSet):
    queryset = Rol.objects.all()
    serializer_class = RolSerializer

class TipoArchivoViewSet(viewsets.ModelViewSet):
    queryset = TipoArchivo.objects.all()
    serializer_class = TipoArchivoSerializer

class TipoCursoViewSet(viewsets.ModelViewSet):
    queryset = TipoCurso.objects.all()
    serializer_class = TipoCursoSerializer

class AlimentacionViewSet(viewsets.ModelViewSet):
    queryset = Alimentacion.objects.all()
    serializer_class = AlimentacionSerializer

class ConceptoContableViewSet(viewsets.ModelViewSet):
    queryset = ConceptoContable.objects.all()
    serializer_class = ConceptoContableSerializer
