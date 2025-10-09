"""
Views básicas para cursos
TODO: El equipo debe implementar filtros, permisos y acciones personalizadas
"""

from rest_framework import viewsets
from .models import Course, Category
from .serializers import CourseSerializer, CategorySerializer


class CategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet para categorías
    TODO: Agregar permisos y filtros
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class CourseViewSet(viewsets.ModelViewSet):
    """
    ViewSet para cursos
    TODO: Implementar filtros por rama, estado, búsqueda, etc.
    """
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    
    # TODO: Agregar filter_backends y filterset_fields
    # TODO: Implementar search_fields y ordering
    
    def perform_create(self, serializer):
        # TODO: Agregar validaciones adicionales
        serializer.save(created_by=self.request.user)