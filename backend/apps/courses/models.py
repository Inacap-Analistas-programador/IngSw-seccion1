"""
Modelos de gestión de cursos para SGICS - Sistema de Gestión Integral de Cursos Scout

Este módulo define las entidades principales para la gestión de cursos Scout:
- Category: Categorías de formación Scout
- Course: Cursos específicos con toda su configuración
- CourseTeam: Equipos de coordinación y formación por curso

Basado en la estructura del proyecto /codigo con adaptaciones para SGICS.

TODO: El equipo C debe completar:
- Validadores de fechas y precios según reglas de negocio
- Propiedades calculadas (available_slots, is_enrollment_open)
- Métodos de lógica de inscripciones y participantes
- Integración con sistema de notificaciones
"""

from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError
from decimal import Decimal

User = get_user_model()


class Category(models.Model):
    """
    Categorías de cursos Scout organizadas por tipo de formación.

    Define los diferentes tipos de formación disponibles en el movimiento Scout:
    - Formación Básica: Cursos introductorios
    - Especialidades: Cursos técnicos específicos
    - Perfeccionamiento: Cursos avanzados para dirigentes
    - Campismo: Cursos de actividades al aire libre
    """

    name = models.CharField(
        max_length=100, unique=True, verbose_name="Nombre de la categoría"
    )
    description = models.TextField(
        blank=True, verbose_name="Descripción de la categoría"
    )
    is_active = models.BooleanField(default=True, verbose_name="Categoría activa")

    # TODO: El equipo debe agregar campos adicionales
    # color = models.CharField(max_length=7, default='#007bff')  # Color hex para UI
    # icon = models.CharField(max_length=50, blank=True)  # Icono para UI
    # order = models.PositiveIntegerField(default=0)  # Orden de visualización

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "courses_categories"
        verbose_name = "Categoría de Curso"
        verbose_name_plural = "Categorías de Cursos"
        ordering = ["name"]

    def __str__(self):
        return self.name


class Course(models.Model):
    """
    Curso Scout con toda la información necesaria para gestión e inscripciones.

    Define un curso específico con:
    - Información general (título, descripción, código único)
    - Configuración de participantes y precios
    - Estados del curso (borrador, activo, archivado)
    - Fechas de inscripción y realización
    - Clasificación por rama Scout
    """

    # Estados del curso durante su ciclo de vida
    DRAFT = "DRAFT"
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"
    ARCHIVED = "ARCHIVED"

    STATUS_CHOICES = [
        (DRAFT, "Borrador"),
        (ACTIVE, "Activo"),
        (INACTIVE, "Inactivo"),
        (ARCHIVED, "Archivado"),
    ]

    # Ramas del movimiento Scout según estructura organizacional
    RAMA_CHOICES = [
        ("MANADA", "Manada (7-11 años)"),
        ("TROPA", "Tropa (11-15 años)"),
        ("COMUNIDAD", "Comunidad (15-18 años)"),
        ("ROVER", "Rover (18-21 años)"),
        ("DIRIGENTES", "Dirigentes"),
        ("GENERAL", "General (todas las ramas)"),
    ]

    # Información básica del curso
    title = models.CharField(max_length=200, verbose_name="Título del curso")
    description = models.TextField(verbose_name="Descripción del curso")
    code = models.CharField(
        max_length=20, unique=True, verbose_name="Código único del curso"
    )

    # Clasificación y estado
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="courses",
        verbose_name="Categoría del curso",
    )
    rama = models.CharField(
        max_length=20,
        choices=RAMA_CHOICES,
        default="GENERAL",
        verbose_name="Rama Scout objetivo",
    )
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default=DRAFT,
        verbose_name="Estado del curso",
    )

    # Configuración económica y de participantes
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal("0.00"),
        validators=[MinValueValidator(Decimal("0.00"))],
        verbose_name="Precio del curso",
    )
    max_participants = models.PositiveIntegerField(
        default=30,
        validators=[MinValueValidator(1)],
        verbose_name="Máximo de participantes",
    )

    # Fechas importantes del curso
    start_date = models.DateField(verbose_name="Fecha de inicio")
    end_date = models.DateField(verbose_name="Fecha de fin")

    # TODO: El equipo debe agregar fechas de inscripción
    # enrollment_start = models.DateTimeField(null=True, blank=True)
    # enrollment_end = models.DateTimeField(null=True, blank=True)

    # Auditoría
    created_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name="created_courses"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        """TODO: Implementar validaciones de fechas y reglas de negocio"""
        if self.start_date and self.end_date:
            if self.start_date > self.end_date:
                raise ValidationError(
                    "La fecha de inicio debe ser anterior a la fecha de fin"
                )

    @property
    def available_slots(self):
        """TODO: Calcular cupos disponibles basado en preinscripciones confirmadas"""
        # return self.max_participants - self.preinscripciones.filter(estado='CONFIRMADA').count()
        return self.max_participants  # Implementación temporal

    @property
    def is_enrollment_open(self):
        """TODO: Verificar si las inscripciones están abiertas"""
        # Verificar fechas de inscripción, estado del curso, cupos disponibles
        return self.status == self.ACTIVE

    class Meta:
        db_table = "courses"
        verbose_name = "Curso"
        verbose_name_plural = "Cursos"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.code} - {self.title}"


class CourseTeam(models.Model):
    """
    Equipo de coordinación y formación asignado a cada curso.

    Define los roles del equipo que trabajará en el curso:
    - Coordinador: Responsable general del curso
    - Formador: Instructor del contenido técnico
    - Asistente: Apoyo logístico y administrativo
    """

    # Roles específicos del equipo de curso Scout
    ROLE_CHOICES = [
        ("COORDINADOR", "Coordinador de Curso"),
        ("FORMADOR", "Formador/Instructor"),
        ("ASISTENTE", "Asistente de Coordinación"),
        ("OBSERVADOR", "Observador/Evaluador"),
    ]

    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name="team", verbose_name="Curso"
    )
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, verbose_name="Miembro del equipo"
    )
    role = models.CharField(
        max_length=20, choices=ROLE_CHOICES, verbose_name="Rol en el equipo"
    )

    assigned_at = models.DateTimeField(
        auto_now_add=True, verbose_name="Fecha de asignación"
    )

    # TODO: El equipo debe agregar más campos
    # is_active = models.BooleanField(default=True)
    # assigned_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    # notes = models.TextField(blank=True)

    class Meta:
        db_table = "course_teams"
        unique_together = ("course", "user", "role")
        verbose_name = "Miembro del Equipo de Curso"
        verbose_name_plural = "Equipos de Cursos"

    def __str__(self):
        return f"{self.course.code} - {self.user.get_full_name() or self.user.username} ({self.get_role_display()})"
