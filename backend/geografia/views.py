from rest_framework import viewsets
from .models import Region, Provincia, Comuna, Zona, Distrito, Grupo
from .serializers import RegionSerializer, ProvinciaSerializer, ComunaSerializer, ZonaSerializer, DistritoSerializer, GrupoSerializer

class RegionViewSet(viewsets.ModelViewSet):
    queryset = Region.objects.all()
    serializer_class = RegionSerializer

class ProvinciaViewSet(viewsets.ModelViewSet):
    queryset = Provincia.objects.all()
    serializer_class = ProvinciaSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        reg_id = self.request.query_params.get('reg_id', None)
        if reg_id is not None:
            queryset = queryset.filter(reg_id=reg_id)
        return queryset

class ComunaViewSet(viewsets.ModelViewSet):
    queryset = Comuna.objects.all()
    serializer_class = ComunaSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        pro_id = self.request.query_params.get('pro_id', None)
        if pro_id is not None:
            queryset = queryset.filter(pro_id=pro_id)
        return queryset

class ZonaViewSet(viewsets.ModelViewSet):
    queryset = Zona.objects.all()
    serializer_class = ZonaSerializer

class DistritoViewSet(viewsets.ModelViewSet):
    queryset = Distrito.objects.all()
    serializer_class = DistritoSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        zon_id = self.request.query_params.get('zon_id', None)
        if zon_id is not None:
            queryset = queryset.filter(zon_id=zon_id)
        return queryset

class GrupoViewSet(viewsets.ModelViewSet):
    queryset = Grupo.objects.all()
    serializer_class = GrupoSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        dis_id = self.request.query_params.get('dis_id', None)
        if dis_id is not None:
            queryset = queryset.filter(dis_id=dis_id)
        return queryset
