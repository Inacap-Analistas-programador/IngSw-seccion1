from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import EstadoCivil, Cargo, Nivel, Rama, Rol, TipoArchivo, TipoCurso, Alimentacion, ConceptoContable
from geografia.models import Region, Provincia, Comuna, Zona, Distrito, Grupo
from .serializers import EstadoCivilSerializer, CargoSerializer, NivelSerializer, RamaSerializer, RolSerializer, TipoArchivoSerializer, TipoCursoSerializer, AlimentacionSerializer, ConceptoContableSerializer
from geografia.serializers import RegionSerializer, ProvinciaSerializer, ComunaSerializer, ZonaSerializer, DistritoSerializer, GrupoSerializer

class RegionViewSet(viewsets.ModelViewSet):
    queryset = Region.objects.all()
    serializer_class = RegionSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class ProvinciaViewSet(viewsets.ModelViewSet):
    queryset = Provincia.objects.all()
    serializer_class = ProvinciaSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class ComunaViewSet(viewsets.ModelViewSet):
    queryset = Comuna.objects.all()
    serializer_class = ComunaSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class ZonaViewSet(viewsets.ModelViewSet):
    queryset = Zona.objects.all()
    serializer_class = ZonaSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class DistritoViewSet(viewsets.ModelViewSet):
    queryset = Distrito.objects.all()
    serializer_class = DistritoSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class GrupoViewSet(viewsets.ModelViewSet):
    queryset = Grupo.objects.all()
    serializer_class = GrupoSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class EstadoCivilViewSet(viewsets.ModelViewSet):
    queryset = EstadoCivil.objects.all()
    serializer_class = EstadoCivilSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class CargoViewSet(viewsets.ModelViewSet):
    queryset = Cargo.objects.all()
    serializer_class = CargoSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class NivelViewSet(viewsets.ModelViewSet):
    queryset = Nivel.objects.all()
    serializer_class = NivelSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class RamaViewSet(viewsets.ModelViewSet):
    queryset = Rama.objects.all()
    serializer_class = RamaSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class RolViewSet(viewsets.ModelViewSet):
    queryset = Rol.objects.all()
    serializer_class = RolSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class TipoArchivoViewSet(viewsets.ModelViewSet):
    queryset = TipoArchivo.objects.all()
    serializer_class = TipoArchivoSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class TipoCursoViewSet(viewsets.ModelViewSet):
    queryset = TipoCurso.objects.all()
    serializer_class = TipoCursoSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class AlimentacionViewSet(viewsets.ModelViewSet):
    queryset = Alimentacion.objects.all()
    serializer_class = AlimentacionSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class ConceptoContableViewSet(viewsets.ModelViewSet):
    queryset = ConceptoContable.objects.all()
    serializer_class = ConceptoContableSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
