"""
Views para gestión de cursos Scout
Sistema de Gestión Integral de Cursos Scout
"""

from rest_framework import viewsets, status, filters, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import Course, Category, CourseTeam
from .serializers import (
    CourseDetailSerializer, 
    CourseListSerializer,
    CategorySerializer, 
    CourseTeamSerializer
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para categorías de cursos (solo lectura para usuarios normales)
    """
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]  # Temporalmente público


class CourseViewSet(viewsets.ModelViewSet):
    """
    ViewSet para cursos con filtros y búsqueda
    """
    queryset = Course.objects.select_related('category', 'created_by').prefetch_related('team__user')
    permission_classes = [permissions.AllowAny]  # Temporalmente público
    
    # Filtros y búsqueda
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'rama', 'category']
    search_fields = ['title', 'code', 'description']
    ordering_fields = ['start_date', 'created_at', 'title']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        """Usar serializer apropiado según la acción"""
        if self.action == 'list':
            return CourseListSerializer
        return CourseDetailSerializer
    
    def get_queryset(self):
        """Filtrar cursos según permisos del usuario"""
        queryset = self.queryset
        
        # Filtrar solo cursos activos para usuarios no staff
        if not self.request.user.is_staff:
            queryset = queryset.filter(status=Course.ACTIVE)
            
        return queryset
    
    def perform_create(self, serializer):
        """Asignar usuario creador al curso"""
        serializer.save(created_by=self.request.user)
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Lista solo cursos activos"""
        queryset = self.get_queryset().filter(status=Course.ACTIVE)
        serializer = CourseListSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def dashboard_metrics(self, request):
        """Métricas globales para dashboard semáforo"""
        # KPIs por estado
        total_courses = Course.objects.count()
        active_courses = Course.objects.filter(status=Course.ACTIVE).count()
        draft_courses = Course.objects.filter(status=Course.DRAFT).count()
        inactive_courses = Course.objects.filter(status=Course.INACTIVE).count()
        archived_courses = Course.objects.filter(status=Course.ARCHIVED).count()

        # Lógica de warning/overdue
        from django.utils import timezone
        from datetime import timedelta
        today = timezone.now().date()
        warning_date = today + timedelta(days=7)
        warning_courses = Course.objects.filter(
            status=Course.ACTIVE, 
            end_date__gte=today, 
            end_date__lte=warning_date
        ).count()
        overdue_courses = Course.objects.filter(
            status=Course.ACTIVE, 
            end_date__lt=today
        ).count()

        metrics = {
            'total_courses': total_courses,
            'active_courses': active_courses,
            'draft_courses': draft_courses,
            'inactive_courses': inactive_courses,
            'archived_courses': archived_courses,
            'warning_courses': warning_courses,
            'overdue_courses': overdue_courses,
        }
        return Response(metrics)
    
    @action(detail=False, methods=['get'])
    def by_rama(self, request):
        """Cursos agrupados por rama"""
        rama = request.query_params.get('rama')
        if not rama:
            return Response({'error': 'Parámetro rama requerido'}, status=400)
            
        queryset = self.get_queryset().filter(rama=rama, status=Course.ACTIVE)
        serializer = CourseListSerializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def metrics(self, request, pk=None):
        """Métricas básicas del curso"""
        course = self.get_object()
        
        # TODO: Conectar con modelos de preinscripciones y pagos
        metrics = {
            'id': course.id,
            'title': course.title,
            'total_slots': course.max_participants,
            'available_slots': course.available_slots,
            'preinscriptions_count': 0,  # TODO: course.preinscripciones.count()
            'confirmed_count': 0,       # TODO: course.preinscripciones.filter(estado='CONFIRMADA').count()
            'payments_count': 0,        # TODO: payments relacionados
            'team_count': course.team.count(),
        }
        
        return Response(metrics)


class CourseTeamViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión de equipos de curso
    """
    queryset = CourseTeam.objects.select_related('course', 'user').all()
    serializer_class = CourseTeamSerializer
    permission_classes = [permissions.AllowAny]  # Temporalmente público
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['course', 'user', 'role']
    ordering = ['-assigned_at']