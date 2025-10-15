"""
Serializers para los catálogos maestros de SGICS
"""

from rest_framework import serializers
from .models import (
    Region,
    Provincia,
    Comuna,
    Zona,
    Distrito,
    GrupoScout,
    Rama,
    TipoCurso,
    Nivel,
    EstadoCivil,
    TipoAlimentacion,
)


class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = ["codigo", "nombre", "nombre_corto", "is_active", "created_at"]
        read_only_fields = ["created_at"]


class ProvinciaSerializer(serializers.ModelSerializer):
    region_nombre = serializers.CharField(source="region.nombre", read_only=True)

    class Meta:
        model = Provincia
        fields = [
            "codigo",
            "nombre",
            "region",
            "region_nombre",
            "is_active",
            "created_at",
        ]
        read_only_fields = ["created_at"]


class ComunaSerializer(serializers.ModelSerializer):
    provincia_nombre = serializers.CharField(source="provincia.nombre", read_only=True)
    region_nombre = serializers.CharField(
        source="provincia.region.nombre", read_only=True
    )

    class Meta:
        model = Comuna
        fields = [
            "codigo",
            "nombre",
            "provincia",
            "provincia_nombre",
            "region_nombre",
            "is_active",
            "created_at",
        ]
        read_only_fields = ["created_at"]


class ZonaSerializer(serializers.ModelSerializer):
    region_principal_nombre = serializers.CharField(
        source="region_principal.nombre", read_only=True
    )

    class Meta:
        model = Zona
        fields = [
            "codigo",
            "nombre",
            "descripcion",
            "region_principal",
            "region_principal_nombre",
            "is_active",
            "created_at",
        ]
        read_only_fields = ["created_at"]


class DistritoSerializer(serializers.ModelSerializer):
    zona_nombre = serializers.CharField(source="zona.nombre", read_only=True)

    class Meta:
        model = Distrito
        fields = [
            "codigo",
            "nombre",
            "zona",
            "zona_nombre",
            "descripcion",
            "is_active",
            "created_at",
        ]
        read_only_fields = ["created_at"]


class GrupoScoutSerializer(serializers.ModelSerializer):
    distrito_nombre = serializers.CharField(source="distrito.nombre", read_only=True)
    zona_nombre = serializers.CharField(source="distrito.zona.nombre", read_only=True)
    comuna_nombre = serializers.CharField(source="comuna.nombre", read_only=True)

    class Meta:
        model = GrupoScout
        fields = [
            "codigo",
            "nombre",
            "distrito",
            "distrito_nombre",
            "zona_nombre",
            "comuna",
            "comuna_nombre",
            "direccion",
            "telefono",
            "email",
            "fecha_fundacion",
            "is_active",
            "created_at",
        ]
        read_only_fields = ["created_at"]


class RamaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rama
        fields = [
            "codigo",
            "nombre",
            "descripcion",
            "edad_minima",
            "edad_maxima",
            "color_hex",
            "is_active",
            "created_at",
        ]
        read_only_fields = ["created_at"]


class TipoCursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoCurso
        fields = [
            "codigo",
            "nombre",
            "descripcion",
            "duracion_default_horas",
            "precio_sugerido",
            "is_active",
            "created_at",
        ]
        read_only_fields = ["created_at"]


class NivelSerializer(serializers.ModelSerializer):
    rama_nombre = serializers.CharField(source="rama.nombre", read_only=True)

    class Meta:
        model = Nivel
        fields = [
            "codigo",
            "nombre",
            "descripcion",
            "orden",
            "rama",
            "rama_nombre",
            "is_active",
            "created_at",
        ]
        read_only_fields = ["created_at"]


class EstadoCivilSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadoCivil
        fields = ["codigo", "nombre", "is_active", "created_at"]
        read_only_fields = ["created_at"]


class TipoAlimentacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoAlimentacion
        fields = [
            "codigo",
            "nombre",
            "descripcion",
            "es_restriccion",
            "is_active",
            "created_at",
        ]
        read_only_fields = ["created_at"]
