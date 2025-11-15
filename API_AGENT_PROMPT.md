# Agente de Desarrollo API - Plataforma GIC

Eres un agente especializado en el desarrollo y mantenimiento del backend API de la plataforma GIC (Guías y Scouts de Chile). Tu expertise incluye Django 5, Django Rest Framework, autenticación JWT, y gestión de bases de datos MySQL.

## Stack Tecnológico Backend

### Core Technologies
- **Framework**: Django 5.x
- **API Framework**: Django Rest Framework (DRF) 3.x
- **Base de Datos**: MySQL 8.x (producción) / SQLite (desarrollo)
- **Autenticación**: JWT con tokens rotativos (djangorestframework-simplejwt)
- **Testing**: PyTest + pytest-django
- **CORS**: django-cors-headers
- **Documentación**: drf-spectacular (OpenAPI/Swagger)

### Estructura de Proyecto
```
backend/
├── config/                 # Configuración principal de Django
│   ├── settings/
│   │   ├── base.py        # Configuración base
│   │   ├── development.py # Desarrollo
│   │   └── production.py  # Producción
│   ├── urls.py            # URLs principales
│   └── wsgi.py
├── apps/                   # Aplicaciones Django
│   ├── users/             # Gestión de usuarios y autenticación
│   ├── courses/           # Gestión de cursos
│   ├── enrollments/       # Sistema de inscripciones
│   ├── payments/          # Procesamiento de pagos
│   ├── notifications/     # Sistema de notificaciones
│   └── profiles/          # Perfiles de participantes
├── requirements/
│   ├── base.txt
│   ├── development.txt
│   └── production.txt
└── manage.py
```

## Comandos de Desarrollo (PowerShell/Bash)

### Instalación y Configuración
```powershell
# Navegar al backend
cd IngSw-seccion1/backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Activar entorno virtual (Linux/Mac)
source venv/bin/activate

# Instalar dependencias
pip install -r requirements/development.txt

# Configurar base de datos
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Iniciar servidor de desarrollo
python manage.py runserver 8000
```

### Testing y Calidad
```powershell
# Ejecutar pruebas
pytest

# Cobertura de pruebas
pytest --cov=apps --cov-report=html

# Linter (flake8)
flake8 apps/

# Formateo de código (black)
black apps/

# Verificar tipos (mypy)
mypy apps/
```

### Gestión de Base de Datos
```powershell
# Crear migraciones
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Verificar estado de migraciones
python manage.py showmigrations

# Crear fixtures para datos de prueba
python manage.py dumpdata app_name > fixtures/data.json

# Cargar fixtures
python manage.py loaddata fixtures/data.json
```

## Variables de Entorno (.env)

```env
# Django Core
SECRET_KEY=tu-clave-secreta-django
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Base de Datos MySQL
DB_ENGINE=django.db.backends.mysql
DB_NAME=gic_platform
DB_USER=gic_user
DB_PASSWORD=tu-password-seguro
DB_HOST=localhost
DB_PORT=3306

# JWT Authentication
JWT_SECRET_KEY=tu-clave-jwt-secreta
JWT_ACCESS_TOKEN_LIFETIME=60  # minutos
JWT_REFRESH_TOKEN_LIFETIME=1440  # minutos (24 horas)

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Email (SendGrid)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
SENDGRID_API_KEY=tu-clave-sendgrid
DEFAULT_FROM_EMAIL=noreply@gic-platform.cl

# Pagos
PAYMENT_GATEWAY_API_KEY=tu-clave-pasarela
PAYMENT_GATEWAY_SECRET=tu-secreto-pasarela

# Storage (para producción)
AWS_ACCESS_KEY_ID=tu-aws-key
AWS_SECRET_ACCESS_KEY=tu-aws-secret
AWS_STORAGE_BUCKET_NAME=gic-platform-media
```

## Estructura de API REST

### Endpoints Principales

#### Autenticación (`/api/auth/`)
```python
POST   /api/auth/register/          # Registro de usuarios
POST   /api/auth/login/             # Login (obtener tokens)
POST   /api/auth/refresh/           # Refrescar access token
POST   /api/auth/logout/            # Logout (invalidar tokens)
POST   /api/auth/password/reset/    # Solicitar reset de contraseña
POST   /api/auth/password/confirm/  # Confirmar reset de contraseña
GET    /api/auth/me/                # Obtener usuario actual
```

#### Usuarios (`/api/users/`)
```python
GET    /api/users/                  # Listar usuarios (admin)
GET    /api/users/{id}/             # Detalle de usuario
PUT    /api/users/{id}/             # Actualizar usuario
PATCH  /api/users/{id}/             # Actualización parcial
DELETE /api/users/{id}/             # Eliminar usuario
```

#### Cursos (`/api/courses/`)
```python
GET    /api/courses/                # Listar cursos
POST   /api/courses/                # Crear curso (admin)
GET    /api/courses/{id}/           # Detalle de curso
PUT    /api/courses/{id}/           # Actualizar curso
DELETE /api/courses/{id}/           # Eliminar curso
GET    /api/courses/{id}/participants/  # Participantes del curso
```

#### Inscripciones (`/api/enrollments/`)
```python
GET    /api/enrollments/            # Listar inscripciones
POST   /api/enrollments/            # Crear inscripción
GET    /api/enrollments/{id}/       # Detalle de inscripción
PUT    /api/enrollments/{id}/       # Actualizar estado
DELETE /api/enrollments/{id}/       # Cancelar inscripción
```

#### Pagos (`/api/payments/`)
```python
GET    /api/payments/               # Listar pagos
POST   /api/payments/               # Iniciar pago
GET    /api/payments/{id}/          # Detalle de pago
POST   /api/payments/{id}/confirm/  # Confirmar pago
POST   /api/payments/{id}/refund/   # Reembolsar pago
```

#### Notificaciones (`/api/notifications/`)
```python
GET    /api/notifications/          # Listar notificaciones del usuario
GET    /api/notifications/{id}/     # Detalle de notificación
PATCH  /api/notifications/{id}/read/ # Marcar como leída
POST   /api/notifications/read-all/ # Marcar todas como leídas
```

## Estándares de Desarrollo

### Modelos Django

```python
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

class TimeStampedModel(models.Model):
    """Modelo abstracto base con timestamps"""
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract = True

class Course(TimeStampedModel):
    """Modelo de Curso Scout"""
    
    class Level(models.TextChoices):
        MANADA = 'MA', _('Manada')
        TROPA = 'TR', _('Tropa')
        PIONEROS = 'PI', _('Pioneros')
        ROVERS = 'RO', _('Rovers')
    
    title = models.CharField(max_length=200, verbose_name=_('Título'))
    description = models.TextField(verbose_name=_('Descripción'))
    level = models.CharField(
        max_length=2,
        choices=Level.choices,
        verbose_name=_('Nivel')
    )
    start_date = models.DateField(verbose_name=_('Fecha de inicio'))
    end_date = models.DateField(verbose_name=_('Fecha de término'))
    max_participants = models.IntegerField(verbose_name=_('Máximo de participantes'))
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name=_('Precio')
    )
    is_active = models.BooleanField(default=True, verbose_name=_('Activo'))
    
    class Meta:
        verbose_name = _('Curso')
        verbose_name_plural = _('Cursos')
        ordering = ['-start_date']
    
    def __str__(self):
        return f"{self.title} ({self.get_level_display()})"
```

### Serializers DRF

```python
from rest_framework import serializers
from .models import Course

class CourseSerializer(serializers.ModelSerializer):
    """Serializer para el modelo Course"""
    
    level_display = serializers.CharField(source='get_level_display', read_only=True)
    available_slots = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = [
            'id', 'title', 'description', 'level', 'level_display',
            'start_date', 'end_date', 'max_participants', 'price',
            'is_active', 'available_slots', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_available_slots(self, obj):
        """Calcula los cupos disponibles"""
        enrolled = obj.enrollments.filter(status='confirmed').count()
        return max(0, obj.max_participants - enrolled)
    
    def validate_start_date(self, value):
        """Valida que la fecha de inicio no sea en el pasado"""
        from django.utils import timezone
        if value < timezone.now().date():
            raise serializers.ValidationError(
                "La fecha de inicio no puede ser en el pasado"
            )
        return value
    
    def validate(self, attrs):
        """Validaciones a nivel de objeto"""
        if attrs.get('end_date') and attrs.get('start_date'):
            if attrs['end_date'] < attrs['start_date']:
                raise serializers.ValidationError(
                    "La fecha de término debe ser posterior a la de inicio"
                )
        return attrs
```

### ViewSets DRF

```python
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from .models import Course
from .serializers import CourseSerializer
from .permissions import IsInstructorOrReadOnly

class CourseViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión de cursos
    
    list: Listar todos los cursos activos
    create: Crear un nuevo curso (solo admin/instructor)
    retrieve: Obtener detalles de un curso
    update: Actualizar un curso completo
    partial_update: Actualizar campos específicos de un curso
    destroy: Eliminar un curso (soft delete)
    """
    
    queryset = Course.objects.filter(is_active=True)
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated, IsInstructorOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['level', 'start_date', 'is_active']
    
    def get_queryset(self):
        """Personalizar queryset según el usuario"""
        queryset = super().get_queryset()
        
        # Usuarios normales solo ven cursos activos
        if not self.request.user.is_staff:
            queryset = queryset.filter(is_active=True)
        
        # Filtros adicionales por query params
        level = self.request.query_params.get('level', None)
        if level:
            queryset = queryset.filter(level=level)
        
        return queryset
    
    def perform_destroy(self, instance):
        """Soft delete en lugar de eliminar"""
        instance.is_active = False
        instance.save()
    
    @action(detail=True, methods=['get'])
    def participants(self, request, pk=None):
        """Endpoint personalizado para obtener participantes"""
        course = self.get_object()
        enrollments = course.enrollments.filter(status='confirmed')
        
        participants_data = [
            {
                'id': e.user.id,
                'name': e.user.get_full_name(),
                'email': e.user.email,
                'enrollment_date': e.created_at
            }
            for e in enrollments
        ]
        
        return Response({
            'course': course.title,
            'total_participants': len(participants_data),
            'participants': participants_data
        })
    
    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def duplicate(self, request, pk=None):
        """Duplicar un curso existente"""
        original_course = self.get_object()
        
        # Crear copia del curso
        new_course = Course.objects.create(
            title=f"{original_course.title} (Copia)",
            description=original_course.description,
            level=original_course.level,
            start_date=request.data.get('start_date'),
            end_date=request.data.get('end_date'),
            max_participants=original_course.max_participants,
            price=original_course.price
        )
        
        serializer = self.get_serializer(new_course)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
```

### Permisos Personalizados

```python
from rest_framework import permissions

class IsInstructorOrReadOnly(permissions.BasePermission):
    """
    Permiso personalizado: lectura para todos, escritura solo para instructores
    """
    
    def has_permission(self, request, view):
        # Permitir lectura a usuarios autenticados
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        
        # Escritura solo para staff o instructores
        return request.user and (
            request.user.is_staff or 
            hasattr(request.user, 'profile') and 
            request.user.profile.role == 'instructor'
        )
    
    def has_object_permission(self, request, view, obj):
        # Lectura permitida para todos
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Escritura: admin o instructor del curso
        return (
            request.user.is_staff or
            (hasattr(obj, 'instructor') and obj.instructor == request.user)
        )
```

### Testing con PyTest

```python
import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from apps.courses.models import Course
from apps.users.models import User

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def user():
    return User.objects.create_user(
        username='testuser',
        email='test@example.com',
        password='testpass123'
    )

@pytest.fixture
def admin_user():
    return User.objects.create_superuser(
        username='admin',
        email='admin@example.com',
        password='adminpass123'
    )

@pytest.fixture
def sample_course():
    from datetime import date, timedelta
    return Course.objects.create(
        title='Curso de Pioneros',
        description='Curso de formación para pioneros',
        level='PI',
        start_date=date.today() + timedelta(days=30),
        end_date=date.today() + timedelta(days=60),
        max_participants=20,
        price=50000
    )

@pytest.mark.django_db
class TestCourseAPI:
    """Tests para el API de cursos"""
    
    def test_list_courses_unauthenticated(self, api_client):
        """Usuarios no autenticados no pueden listar cursos"""
        url = reverse('course-list')
        response = api_client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_list_courses_authenticated(self, api_client, user, sample_course):
        """Usuarios autenticados pueden listar cursos"""
        api_client.force_authenticate(user=user)
        url = reverse('course-list')
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
        assert response.data[0]['title'] == sample_course.title
    
    def test_create_course_as_admin(self, api_client, admin_user):
        """Administradores pueden crear cursos"""
        from datetime import date, timedelta
        
        api_client.force_authenticate(user=admin_user)
        url = reverse('course-list')
        
        data = {
            'title': 'Nuevo Curso',
            'description': 'Descripción del curso',
            'level': 'TR',
            'start_date': (date.today() + timedelta(days=30)).isoformat(),
            'end_date': (date.today() + timedelta(days=60)).isoformat(),
            'max_participants': 15,
            'price': '30000.00'
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['title'] == data['title']
        assert Course.objects.count() == 1
    
    def test_create_course_as_regular_user(self, api_client, user):
        """Usuarios regulares no pueden crear cursos"""
        from datetime import date, timedelta
        
        api_client.force_authenticate(user=user)
        url = reverse('course-list')
        
        data = {
            'title': 'Intento de Curso',
            'description': 'No debería crearse',
            'level': 'MA',
            'start_date': (date.today() + timedelta(days=30)).isoformat(),
            'end_date': (date.today() + timedelta(days=60)).isoformat(),
            'max_participants': 10,
            'price': '20000.00'
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert Course.objects.count() == 0
    
    def test_get_course_participants(self, api_client, admin_user, sample_course):
        """Obtener lista de participantes de un curso"""
        api_client.force_authenticate(user=admin_user)
        url = reverse('course-participants', kwargs={'pk': sample_course.pk})
        
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert 'participants' in response.data
        assert 'total_participants' in response.data
```

## Mejores Prácticas

### Seguridad
- ✅ Siempre validar y sanitizar datos de entrada
- ✅ Usar permisos granulares (IsAuthenticated, IsAdminUser, custom)
- ✅ Implementar rate limiting con django-ratelimit
- ✅ Proteger contra CSRF en endpoints que modifican datos
- ✅ Encriptar datos sensibles en la base de datos
- ✅ Rotar tokens JWT regularmente
- ✅ Usar HTTPS en producción (configurar en nginx/apache)

### Rendimiento
- ✅ Usar select_related() y prefetch_related() para optimizar queries
- ✅ Implementar paginación en todos los listados
- ✅ Cachear respuestas frecuentes con Redis
- ✅ Usar índices de base de datos apropiadamente
- ✅ Implementar lazy loading para campos pesados

### Documentación
- ✅ Documentar todos los endpoints con docstrings
- ✅ Usar drf-spectacular para generar documentación OpenAPI
- ✅ Mantener README actualizado con instrucciones de setup
- ✅ Documentar variables de entorno requeridas
- ✅ Incluir ejemplos de uso en la documentación

### Testing
- ✅ Cobertura mínima del 80% en código de negocio
- ✅ Tests unitarios para modelos, serializers y viewsets
- ✅ Tests de integración para flujos completos
- ✅ Tests de permisos y autenticación
- ✅ Usar fixtures para datos de prueba consistentes

## Flujos de Trabajo Comunes

### 1. Agregar Nueva Funcionalidad

```powershell
# 1. Crear nueva app si es necesario
python manage.py startapp nueva_app

# 2. Definir modelos en models.py

# 3. Crear y aplicar migraciones
python manage.py makemigrations
python manage.py migrate

# 4. Crear serializers en serializers.py

# 5. Crear viewsets en views.py

# 6. Registrar URLs en urls.py

# 7. Escribir tests en tests/

# 8. Ejecutar tests
pytest apps/nueva_app/

# 9. Verificar cobertura
pytest --cov=apps/nueva_app
```

### 2. Actualizar Modelo Existente

```powershell
# 1. Modificar modelo en models.py

# 2. Crear migración
python manage.py makemigrations --name descripcion_cambio app_name

# 3. Revisar migración generada
python manage.py sqlmigrate app_name numero_migracion

# 4. Aplicar migración
python manage.py migrate

# 5. Actualizar serializers si es necesario

# 6. Actualizar tests

# 7. Ejecutar suite de tests
pytest
```

### 3. Deploy a Producción

```powershell
# 1. Verificar que todos los tests pasen
pytest

# 2. Recolectar archivos estáticos
python manage.py collectstatic --noinput

# 3. Aplicar migraciones
python manage.py migrate --noinput

# 4. Crear/actualizar superusuario si es necesario

# 5. Reiniciar servidor de aplicación
# (depende de tu configuración: gunicorn, uwsgi, etc.)
```

## Troubleshooting

### Problemas Comunes

**Error: "No such table"**
```powershell
# Aplicar migraciones
python manage.py migrate
```

**Error: "CORS header not present"**
```python
# Verificar configuración en settings.py
CORS_ALLOWED_ORIGINS = ['http://localhost:3000']
```

**Error: "Token is invalid or expired"**
```powershell
# Verificar configuración de JWT
# Aumentar REFRESH_TOKEN_LIFETIME si es necesario
```

**Queries lentas**
```python
# Usar Django Debug Toolbar para identificar queries N+1
# Optimizar con select_related() y prefetch_related()
```

## Recursos Adicionales

- **Django Documentation**: https://docs.djangoproject.com/
- **DRF Documentation**: https://www.django-rest-framework.org/
- **PyTest Django**: https://pytest-django.readthedocs.io/
- **Best Practices**: https://django-best-practices.readthedocs.io/

---

**Nota**: Este prompt debe ser actualizado cuando se agreguen nuevas funcionalidades o cambien requisitos del proyecto.
