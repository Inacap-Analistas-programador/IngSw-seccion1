"""
Modelos de preinscripciones para SGICS - Sistema de Gestión Integral de Cursos Scout

Este módulo define el flujo completo de preinscripciones con estados y transiciones.
Basado en la estructura del proyecto /codigo con adaptaciones para el flujo Scout.

Flujo de estados: BORRADOR -> ENVIADA -> VALIDACION -> APROBADA/RECHAZADA -> CONFIRMADA/CANCELADA

TODO: El equipo H debe completar:
- Métodos de transición con validaciones de negocio
- Integración con sistema de pagos y cuotas
- Validaciones de cupos disponibles y fechas límite
- Sistema de notificaciones automáticas por cambios de estado
"""

from django.db import models
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

User = get_user_model()


class Preinscripcion(models.Model):
    """
    Preinscripción de un usuario a un curso Scout con flujo de estados completo.

    Maneja todo el ciclo desde solicitud hasta confirmación final:
    - BORRADOR: Usuario completando la solicitud
    - ENVIADA: Solicitud enviada para revisión
    - VALIDACION: En proceso de validación por coordinadores
    - APROBADA/RECHAZADA: Resultado de la validación
    - CONFIRMADA: Preinscripción confirmada (con pago si aplica)
    - CANCELADA: Cancelada por usuario o coordinador
    """

    # Estados del flujo de preinscripción Scout
    BORRADOR = "BORRADOR"
    ENVIADA = "ENVIADA"
    VALIDACION = "VALIDACION"
    APROBADA = "APROBADA"
    RECHAZADA = "RECHAZADA"
    CONFIRMADA = "CONFIRMADA"
    CANCELADA = "CANCELADA"

    ESTADOS = [
        (BORRADOR, "Borrador"),
        (ENVIADA, "Enviada"),
        (VALIDACION, "En validación"),
        (APROBADA, "Aprobada"),
        (RECHAZADA, "Rechazada"),
        (CONFIRMADA, "Confirmada"),
        (CANCELADA, "Cancelada"),
    ]

    # Relaciones principales
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="preinscripciones",
        verbose_name="Usuario",
    )
    course = models.ForeignKey(
        "courses.Course",
        on_delete=models.CASCADE,
        related_name="preinscripciones",
        verbose_name="Curso",
    )

    # Estado actual y observaciones
    estado = models.CharField(
        max_length=20,
        choices=ESTADOS,
        default=BORRADOR,
        verbose_name="Estado de la preinscripción",
    )
    observaciones = models.TextField(blank=True, verbose_name="Observaciones generales")

    # TODO: El equipo debe agregar campos Scout específicos
    # origen = models.CharField(max_length=30, blank=True)  # De dónde viene el participante
    # grupo_scout = models.CharField(max_length=100, blank=True)  # Grupo de origen
    grupo = models.CharField(
        max_length=100, blank=True, default="", verbose_name="Grupo Scout (texto libre)"
    )

    # Timestamps de transiciones importantes
    confirmado_at = models.DateTimeField(null=True, blank=True)
    validated_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)

    # Auditoría básica
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # TODO: Agregar auditoría completa
    # processed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='processed_preinscriptions')

    def puede_transicionar(self, nuevo_estado: str) -> bool:
        """
        TODO: Implementar validaciones completas de transición de estados
        - Verificar flujo válido según estado actual
        - Validar permisos del usuario que ejecuta
        - Verificar precondiciones (cupos, fechas, pagos)
        """
        flujos_validos = {
            self.BORRADOR: [self.ENVIADA, self.CANCELADA],
            self.ENVIADA: [self.VALIDACION, self.BORRADOR, self.CANCELADA],
            self.VALIDACION: [self.APROBADA, self.RECHAZADA],
            self.APROBADA: [self.CONFIRMADA, self.CANCELADA],
            self.RECHAZADA: [self.BORRADOR],  # Permitir reenvío
            self.CONFIRMADA: [self.CANCELADA],  # Solo cancelación
            self.CANCELADA: [],  # Estado final
        }
        return nuevo_estado in flujos_validos.get(self.estado, [])

    @property
    def puede_pagar(self) -> bool:
        """TODO: Verificar si puede proceder con el pago"""
        return self.estado in [self.APROBADA, self.CONFIRMADA]

    def cambiar_estado(
        self, nuevo_estado: str, observacion: str = "", user_ejecutor=None
    ):
        """
        TODO: Implementar método completo de cambio de estado con:
        - Validación de transición válida
        - Actualización de timestamps correspondientes
        - Registro de auditoría completa
        - Envío de notificaciones automáticas
        - Integración con sistema de pagos si aplica
        """
        if not self.puede_transicionar(nuevo_estado):
            raise ValidationError(
                f"Transición inválida: {self.estado} -> {nuevo_estado}"
            )

        self.estado = nuevo_estado
        if observacion:
            self.observaciones = f"{self.observaciones}\n{observacion}".strip()

        # TODO: Actualizar timestamps específicos según estado
        # TODO: Registrar auditoría con user_ejecutor
        # TODO: Enviar notificaciones

        self.save()

    class Meta:
        db_table = "preinscriptions"
        verbose_name = "Preinscripción"
        verbose_name_plural = "Preinscripciones"
        ordering = ["-created_at"]
        unique_together = ("user", "course")

    def __str__(self):
        user_display = self.user.get_full_name() or self.user.username
        return f"{user_display} -> {self.course.title} [{self.get_estado_display()}]"

    def get_pagos(self):
        """Return a queryset of PagoPersona related to this preinscripcion's user and course.

        Uses django.apps.get_model to avoid import-time cycles. This is non-destructive
        and works even if migrations to add FK fields are pending.
        """
        try:
            from django.apps import apps as django_apps
            pago_persona_model = django_apps.get_model('payments', 'PagoPersona')
        except Exception:
            return pago_persona_model.objects.none() if 'pago_persona_model' in locals() else []

        # Filter by integer IDs stored on PagoPersona (PER_ID, CUR_ID)
        try:
            return pago_persona_model.objects.filter(PER_ID=self.user_id, CUR_ID=self.course_id).order_by('-PAP_FECHA_HORA')
        except Exception:
            # If for any reason the model cannot be queried, return an empty queryset
            try:
                return pago_persona_model.objects.none()
            except Exception:
                return []

    @property
    def total_paid(self):
        """Return the sum of PAP_VALOR for related payments (Decimal). Returns 0 if none."""
        pagos = self.get_pagos()
        # pagos can be a queryset or list fallback
        try:
            from django.db.models import Sum
            agg = pagos.aggregate(total=Sum('PAP_VALOR'))
            return agg.get('total') or 0
        except Exception:
            # Fallback: sum in Python if pagos is a list
            try:
                return sum(p.PAP_VALOR for p in pagos) if pagos else 0
            except Exception:
                return 0
