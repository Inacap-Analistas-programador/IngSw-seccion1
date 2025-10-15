"""
Views para el módulo de preinscripciones
"""

from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from django.db.models import Count, Q
from .models import Preinscripcion
from .serializers import (
    PreinscripcionDetailSerializer,
    PreinscripcionListSerializer,
    PreinscripcionCreateSerializer,
    PreinscripcionUpdateEstadoSerializer,
)


class PreinscripcionViewSet(viewsets.ModelViewSet):
    """ViewSet para preinscripciones con CRUD completo"""

    queryset = (
        Preinscripcion.objects.select_related("user", "course")
        .prefetch_related("archivos")
        .all()
    )
    permission_classes = [permissions.AllowAny]  # Temporalmente público
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = ["estado", "course", "user", "course__rama"]
    search_fields = [
        "user__first_name",
        "user__last_name",
        "user__username",
        "course__title",
        "course__code",
    ]
    ordering_fields = ["created_at", "updated_at", "validated_at", "confirmado_at"]
    ordering = ["-created_at"]

    def get_serializer_class(self):
        """Usar serializer apropiado según la acción"""
        if self.action == "list":
            return PreinscripcionListSerializer
        elif self.action == "create":
            return PreinscripcionCreateSerializer
        return PreinscripcionDetailSerializer

    @action(detail=True, methods=["patch"])
    def cambiar_estado(self, request, pk=None):
        """Cambia el estado de una preinscripción"""
        preinscripcion = self.get_object()
        serializer = PreinscripcionUpdateEstadoSerializer(
            instance=preinscripcion, data=request.data
        )

        if serializer.is_valid():
            nuevo_estado = serializer.validated_data["nuevo_estado"]
            observaciones = serializer.validated_data.get("observaciones", "")
            motivo_rechazo = serializer.validated_data.get("motivo_rechazo", "")

            try:
                preinscripcion.cambiar_estado(
                    nuevo_estado=nuevo_estado,
                    processed_by=request.user,
                    observaciones=observaciones,
                )

                if motivo_rechazo:
                    preinscripcion.motivo_rechazo = motivo_rechazo
                    preinscripcion.save()

                return Response(PreinscripcionDetailSerializer(preinscripcion).data)

            except ValueError as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["get"])
    def mis_preinscripciones(self, request):
        """Obtiene las preinscripciones del usuario actual"""
        if not request.user.is_authenticated:
            return Response({"error": "Usuario no autenticado"}, status=401)

        preinscripciones = self.queryset.filter(user=request.user)
        serializer = PreinscripcionListSerializer(preinscripciones, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def dashboard_metrics(self, request):
        """Métricas para dashboard de preinscripciones"""
        total = self.queryset.count()
        por_estado = self.queryset.values("estado").annotate(count=Count("id"))

        # Convertir a diccionario más legible
        estados_count = {item["estado"]: item["count"] for item in por_estado}

        metrics = {
            "total_preinscripciones": total,
            "borrador": estados_count.get("BORRADOR", 0),
            "enviada": estados_count.get("ENVIADA", 0),
            "validacion": estados_count.get("VALIDACION", 0),
            "aprobada": estados_count.get("APROBADA", 0),
            "rechazada": estados_count.get("RECHAZADA", 0),
            "confirmada": estados_count.get("CONFIRMADA", 0),
            "cancelada": estados_count.get("CANCELADA", 0),
        }

        return Response(metrics)

    @action(detail=False, methods=["get"])
    def by_curso(self, request):
        """Preinscripciones filtradas por curso"""
        curso_id = request.query_params.get("curso_id")
        if not curso_id:
            return Response({"error": "curso_id requerido"}, status=400)

        preinscripciones = self.queryset.filter(course_id=curso_id)
        serializer = PreinscripcionListSerializer(preinscripciones, many=True)
        return Response(serializer.data)
