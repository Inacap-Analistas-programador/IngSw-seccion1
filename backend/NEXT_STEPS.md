# Guía de Próximos Pasos - Backend GIC

## Estado Actual ✅

**Backend completado al 100%:**
- ✅ Todas las 43 tablas del SQL implementadas en Django
- ✅ 4 tablas adicionales para preinscripción
- ✅ Todas las migraciones aplicadas
- ✅ Modelos con relaciones y restricciones correctas
- ✅ Base de datos sincronizada

## Tareas Pendientes para API REST

### 1. Crear Serializers (DRF)

Para cada app, crear `serializers.py` con los serializers correspondientes:

#### Ejemplo: `personas/serializers.py`
```python
from rest_framework import serializers
from .models import Persona, PersonaCurso, PersonaGrupo

class PersonaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Persona
        fields = '__all__'
    
    def validate_per_run(self, value):
        # Validar RUN chileno
        if not (1000000 <= value <= 99999999):
            raise serializers.ValidationError("RUN inválido")
        return value

class PersonaCursoSerializer(serializers.ModelSerializer):
    persona_nombre = serializers.CharField(source='per_id.per_nombres', read_only=True)
    curso_nombre = serializers.CharField(source='cus_id.cur_id.cur_descripcion', read_only=True)
    
    class Meta:
        model = PersonaCurso
        fields = '__all__'
```

**Apps que necesitan serializers:**
- [ ] usuarios
- [ ] maestros (solo lectura - catálogos)
- [ ] geografia (solo lectura - catálogos)
- [ ] personas
- [ ] cursos
- [ ] archivos
- [ ] pagos
- [ ] proveedores
- [ ] preinscripcion

### 2. Crear ViewSets

Para cada app, crear `views.py` con ViewSets:

#### Ejemplo: `cursos/views.py`
```python
from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Curso, CursoSeccion
from .serializers import CursoSerializer, CursoSeccionSerializer

class CursoViewSet(viewsets.ModelViewSet):
    queryset = Curso.objects.all()
    serializer_class = CursoSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['cur_estado', 'cur_modalidad', 'tcu_id']
    search_fields = ['cur_codigo', 'cur_descripcion']
    ordering_fields = ['cur_fecha_solicitud', 'cur_codigo']
    
    def get_queryset(self):
        # Filtrar según permisos del usuario
        user = self.request.user
        queryset = super().get_queryset()
        # Agregar lógica de permisos aquí
        return queryset
    
    @action(detail=True, methods=['get'])
    def secciones(self, request, pk=None):
        curso = self.get_object()
        secciones = curso.cursoseccion_set.all()
        serializer = CursoSeccionSerializer(secciones, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def participantes(self, request, pk=None):
        curso = self.get_object()
        # Lógica para obtener participantes
        return Response({'participantes': []})
```

### 3. Configurar URLs

#### `scout_project/urls.py` (principal)
```python
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include([
        path('auth/', include('usuarios.urls')),
        path('personas/', include('personas.urls')),
        path('cursos/', include('cursos.urls')),
        path('pagos/', include('pagos.urls')),
        path('preinscripciones/', include('preinscripcion.urls')),
        path('maestros/', include('maestros.urls')),
        path('geografia/', include('geografia.urls')),
        path('archivos/', include('archivos.urls')),
        path('proveedores/', include('proveedores.urls')),
    ])),
]
```

#### Ejemplo por app: `cursos/urls.py`
```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CursoViewSet, CursoSeccionViewSet

router = DefaultRouter()
router.register(r'', CursoViewSet, basename='curso')
router.register(r'secciones', CursoSeccionViewSet, basename='cursoseccion')

urlpatterns = [
    path('', include(router.urls)),
]
```

### 4. Implementar Autenticación JWT

#### Instalar paquete:
```bash
pip install djangorestframework-simplejwt
```

#### Configurar en `settings.py`:
```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}

from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
}
```

#### Crear endpoints de autenticación en `usuarios/urls.py`:
```python
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import LoginView, LogoutView

urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
]
```

### 5. Implementar Permisos por Rol

#### Crear `permissions.py` en cada app:
```python
from rest_framework import permissions

class IsDirigente(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.perfil == 'dirigente'

class IsCoordinadorOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.perfil in ['coordinador', 'dirigente']
```

### 6. Agregar Validaciones de Negocio

Ejemplos de validaciones en serializers:

```python
def validate(self, data):
    # Validar edad mínima para curso
    if data['cus_id'].cur_id.tcu_tipo == 1:  # Curso infantil
        edad = calcular_edad(data['per_id'].per_fecha_nac)
        if edad < 6 or edad > 12:
            raise serializers.ValidationError("Edad fuera de rango para este curso")
    
    # Validar cupos disponibles
    cupos_ocupados = PersonaCurso.objects.filter(
        cus_id=data['cus_id'],
        personaestadocurso__peu_estado=5  # Estado: Vigente
    ).count()
    
    cupos_totales = data['cus_id'].cus_cant_participante
    if cupos_ocupados >= cupos_totales:
        raise serializers.ValidationError("No hay cupos disponibles")
    
    return data
```

### 7. Testing

Crear tests para cada app en `tests.py`:

```python
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from .models import Curso
from usuarios.models import Usuario

class CursoAPITest(APITestCase):
    def setUp(self):
        self.usuario = Usuario.objects.create_user(
            usu_username='test',
            usu_password='testpass123'
        )
        self.client.force_authenticate(user=self.usuario)
    
    def test_listar_cursos(self):
        response = self.client.get('/api/cursos/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_crear_curso(self):
        data = {
            'cur_codigo': 'TEST001',
            'cur_descripcion': 'Curso de Prueba',
            # ... más campos
        }
        response = self.client.post('/api/cursos/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
```

### 8. Documentación API

#### Instalar Swagger:
```bash
pip install drf-yasg
```

#### Configurar en `urls.py`:
```python
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="GIC API",
        default_version='v1',
        description="API para la Asociación de Guías y Scouts",
    ),
    public=True,
)

urlpatterns += [
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
```

## Endpoints Recomendados

Ver archivo `SCHEMA_ANALYSIS.md` para la lista completa de endpoints sugeridos.

## Orden Sugerido de Implementación

1. **Fase 1 - Autenticación y Catálogos (1-2 días)**
   - Implementar JWT authentication
   - Serializers y ViewSets para maestros (solo lectura)
   - Serializers y ViewSets para geografia (solo lectura)

2. **Fase 2 - Gestión de Usuarios y Personas (2-3 días)**
   - Serializers y ViewSets para usuarios
   - Serializers y ViewSets para personas
   - Implementar permisos básicos

3. **Fase 3 - Gestión de Cursos (2-3 días)**
   - Serializers y ViewSets para cursos
   - Endpoints para secciones, fechas, cuotas
   - Validaciones de negocio

4. **Fase 4 - Preinscripciones y Pagos (2-3 días)**
   - Serializers y ViewSets para preinscripcion
   - Serializers y ViewSets para pagos
   - Workflow de estados

5. **Fase 5 - Testing y Documentación (2 días)**
   - Tests unitarios
   - Tests de integración
   - Documentación Swagger

## Comandos Útiles

```bash
# Crear un nuevo serializer/viewset
python manage.py startapp nombre_app

# Verificar configuración
python manage.py check

# Ejecutar tests
python manage.py test

# Ejecutar servidor de desarrollo
python manage.py runserver 0.0.0.0:8000

# Shell interactivo
python manage.py shell

# Crear superusuario
python manage.py createsuperuser
```

## Referencias

- Django REST Framework: https://www.django-rest-framework.org/
- JWT Authentication: https://django-rest-framework-simplejwt.readthedocs.io/
- DRF Permissions: https://www.django-rest-framework.org/api-guide/permissions/
- Swagger/OpenAPI: https://drf-yasg.readthedocs.io/

---

**Última actualización:** 2025-11-15
**Estado:** Backend completo - Listo para desarrollo de API
