"""
Modelos de catálogos maestros para SGICS - Sistema de Gestión Integral de Cursos Scout

Este módulo define las entidades de catálogo base del sistema:
- Geografía: Region, Provincia, Comuna
- Organización Scout: Zona, Distrito, Grupo, Rama
- Tipos y estados: TipoCurso, Nivel, EstadoCivil, etc.

Basado en el esquema SQL Server proporcionado, adaptado a Django/MySQL.
"""

from django.db import models
from django.core.validators import RegexValidator


class Region(models.Model):
    """
    Regiones de Chile según división político-administrativa
    """

    codigo = models.CharField(
        max_length=4,
        unique=True,
        primary_key=True,
        validators=[RegexValidator(r"^\d{1,2}$", "Código debe ser numérico")],
    )
    nombre = models.CharField(max_length=80, unique=True)
    nombre_corto = models.CharField(max_length=20, blank=True)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "catalog_region"
        verbose_name = "Región"
        verbose_name_plural = "Regiones"
        ordering = ["codigo"]

    def __str__(self):
        return f"{self.nombre} ({self.codigo})"


class Provincia(models.Model):
    """
    Provincias de Chile agrupadas por región
    """

    codigo = models.CharField(
        max_length=4,
        unique=True,
        primary_key=True,
        validators=[RegexValidator(r"^\d{1,3}$", "Código debe ser numérico")],
    )
    nombre = models.CharField(max_length=80)
    region = models.ForeignKey(
        Region, on_delete=models.CASCADE, related_name="provincias"
    )

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "catalog_provincia"
        verbose_name = "Provincia"
        verbose_name_plural = "Provincias"
        ordering = ["region__codigo", "nombre"]

    def __str__(self):
        return f"{self.nombre} - {self.region.nombre}"


class Comuna(models.Model):
    """
    Comunas de Chile agrupadas por provincia
    """

    codigo = models.CharField(
        max_length=5,
        unique=True,
        primary_key=True,
        validators=[RegexValidator(r"^\d{1,5}$", "Código debe ser numérico")],
    )
    nombre = models.CharField(max_length=80)
    provincia = models.ForeignKey(
        Provincia, on_delete=models.CASCADE, related_name="comunas"
    )

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "catalog_comuna"
        verbose_name = "Comuna"
        verbose_name_plural = "Comunas"
        ordering = ["provincia__region__codigo", "provincia__nombre", "nombre"]

    def __str__(self):
        return f"{self.nombre} - {self.provincia.nombre}"


class Zona(models.Model):
    """
    Zonas Scout - agrupación territorial de grupos Scout
    """

    codigo = models.CharField(max_length=10, unique=True, primary_key=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)

    # Área geográfica de cobertura (opcional)
    region_principal = models.ForeignKey(
        Region,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        help_text="Región principal de cobertura de la zona",
    )

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "catalog_zona"
        verbose_name = "Zona Scout"
        verbose_name_plural = "Zonas Scout"
        ordering = ["nombre"]

    def __str__(self):
        return f"Zona {self.nombre} ({self.codigo})"


class Distrito(models.Model):
    """
    Distritos Scout - subdivisions de zona
    """

    codigo = models.CharField(max_length=10, unique=True, primary_key=True)
    nombre = models.CharField(max_length=100)
    zona = models.ForeignKey(Zona, on_delete=models.CASCADE, related_name="distritos")
    descripcion = models.TextField(blank=True)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "catalog_distrito"
        verbose_name = "Distrito Scout"
        verbose_name_plural = "Distritos Scout"
        ordering = ["zona__nombre", "nombre"]

    def __str__(self):
        return f"Distrito {self.nombre} - {self.zona.nombre}"


class GrupoScout(models.Model):
    """
    Grupos Scout - unidades locales del movimiento
    """

    codigo = models.CharField(max_length=20, unique=True, primary_key=True)
    nombre = models.CharField(max_length=150)
    distrito = models.ForeignKey(
        Distrito, on_delete=models.CASCADE, related_name="grupos"
    )
    comuna = models.ForeignKey(
        Comuna,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        help_text="Comuna donde se ubica el grupo",
    )

    # Información de contacto
    direccion = models.TextField(blank=True)
    telefono = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)

    # Estado del grupo
    fecha_fundacion = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "catalog_grupo_scout"
        verbose_name = "Grupo Scout"
        verbose_name_plural = "Grupos Scout"
        ordering = ["distrito__zona__nombre", "nombre"]

    def __str__(self):
        return f"Grupo {self.nombre} ({self.codigo})"


class Rama(models.Model):
    """
    Ramas del movimiento Scout por grupos etarios
    """

    RAMAS_CHOICES = [
        ("CASTORES", "Castores (5-7 años)"),
        ("MANADA", "Manada (7-11 años)"),
        ("TROPA", "Tropa (11-15 años)"),
        ("COMUNIDAD", "Comunidad (15-18 años)"),
        ("ROVER", "Rover (18-21 años)"),
        ("DIRIGENTES", "Dirigentes"),
    ]

    codigo = models.CharField(
        max_length=20, choices=RAMAS_CHOICES, unique=True, primary_key=True
    )
    nombre = models.CharField(max_length=50)
    descripcion = models.TextField(blank=True)
    edad_minima = models.PositiveIntegerField(null=True, blank=True)
    edad_maxima = models.PositiveIntegerField(null=True, blank=True)

    # Color característico para UI
    color_hex = models.CharField(
        max_length=7,
        blank=True,
        validators=[RegexValidator(r"^#[0-9A-Fa-f]{6}$", "Color debe ser hex válido")],
    )

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "catalog_rama"
        verbose_name = "Rama Scout"
        verbose_name_plural = "Ramas Scout"
        ordering = ["edad_minima"]

    def __str__(self):
        return self.nombre


class TipoCurso(models.Model):
    """
    Tipos de cursos Scout según modalidad y nivel
    """

    TIPOS_CHOICES = [
        ("BASICO", "Formación Básica"),
        ("INTERMEDIO", "Formación Intermedia"),
        ("AVANZADO", "Formación Avanzada"),
        ("ESPECIALIDAD", "Especialidad"),
        ("PERFECCIONAMIENTO", "Perfeccionamiento"),
        ("TALLER", "Taller"),
        ("SEMINARIO", "Seminario"),
    ]

    codigo = models.CharField(
        max_length=20, choices=TIPOS_CHOICES, unique=True, primary_key=True
    )
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)

    # Configuraciones por defecto
    duracion_default_horas = models.PositiveIntegerField(
        null=True, blank=True, help_text="Duración típica en horas académicas"
    )
    precio_sugerido = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "catalog_tipo_curso"
        verbose_name = "Tipo de Curso"
        verbose_name_plural = "Tipos de Curso"
        ordering = ["nombre"]

    def __str__(self):
        return self.nombre


class Nivel(models.Model):
    """
    Niveles de formación Scout (progresión)
    """

    codigo = models.CharField(max_length=20, unique=True, primary_key=True)
    nombre = models.CharField(max_length=80)
    descripcion = models.TextField(blank=True)

    # Orden de progresión
    orden = models.PositiveIntegerField(
        default=0, help_text="Orden en la progresión (0=inicial)"
    )

    # Rama asociada (opcional)
    rama = models.ForeignKey(
        Rama, on_delete=models.SET_NULL, null=True, blank=True, related_name="niveles"
    )

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "catalog_nivel"
        verbose_name = "Nivel"
        verbose_name_plural = "Niveles"
        ordering = ["rama__codigo", "orden"]

    def __str__(self):
        rama_str = f" - {self.rama.nombre}" if self.rama else ""
        return f"{self.nombre}{rama_str}"


class EstadoCivil(models.Model):
    """
    Estados civiles para registro de participantes
    """

    codigo = models.CharField(max_length=10, unique=True, primary_key=True)
    nombre = models.CharField(max_length=30)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "catalog_estado_civil"
        verbose_name = "Estado Civil"
        verbose_name_plural = "Estados Civiles"
        ordering = ["nombre"]

    def __str__(self):
        return self.nombre


class TipoAlimentacion(models.Model):
    """
    Tipos de alimentación y restricciones dietéticas
    """

    codigo = models.CharField(max_length=20, unique=True, primary_key=True)
    nombre = models.CharField(max_length=60)
    descripcion = models.TextField(blank=True)

    # Clasificación
    es_restriccion = models.BooleanField(
        default=False, help_text="Si es una restricción médica/religiosa vs preferencia"
    )

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "catalog_tipo_alimentacion"
        verbose_name = "Tipo de Alimentación"
        verbose_name_plural = "Tipos de Alimentación"
        ordering = ["nombre"]

    def __str__(self):
        return self.nombre
