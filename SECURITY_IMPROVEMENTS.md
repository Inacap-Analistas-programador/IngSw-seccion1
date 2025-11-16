# 🔐 Mejoras de Seguridad - Plataforma GIC

Documento que detalla las mejoras de seguridad implementadas en la plataforma GIC.

## 📋 Tabla de Contenidos

- [Password Hashing](#password-hashing)
- [Usuarios de Prueba](#usuarios-de-prueba)
- [Permisos y Autorización](#permisos-y-autorización)
- [Recomendaciones Adicionales](#recomendaciones-adicionales)

---

## 🔒 Password Hashing

### Problema Original

Las contraseñas se almacenaban en texto plano en la base de datos, lo cual es un **riesgo crítico de seguridad**.

### Solución Implementada

✅ **Hashing de Contraseñas con Django**

Se implementó el sistema de hashing de contraseñas de Django que utiliza PBKDF2 con SHA256 por defecto.

#### Cambios en el Modelo Usuario

```python
# backend/usuarios/models.py

from django.contrib.auth.hashers import make_password, check_password

class Usuario(models.Model):
    # Password field increased to 255 chars for hashed passwords
    usu_password = models.CharField(max_length=255)
    
    def set_password(self, raw_password):
        """Hash and set the user's password"""
        self.usu_password = make_password(raw_password)
    
    def check_password(self, raw_password):
        """Check if the provided password is correct"""
        return check_password(raw_password, self.usu_password)
```

#### Migración de Base de Datos

Se creó la migración `0002_password_hashing_security.py` que:
- Aumenta el campo `usu_password` de 50 a 255 caracteres
- Hace el campo `usu_email` único
- Actualiza campos relacionados

**Para aplicar la migración:**

```bash
cd backend
python manage.py migrate usuarios
```

#### Actualización de Autenticación

Las vistas de autenticación ahora usan el método `check_password()`:

```python
# backend/usuarios/auth_views.py

# Antes (INSEGURO):
if usuario.usu_password != password:
    # ...

# Ahora (SEGURO):
if not usuario.check_password(password):
    # ...
```

#### Serializers Actualizados

Los serializers automáticamente hashean las contraseñas al crear o actualizar usuarios:

```python
# backend/usuarios/serializers.py

class UsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        usuario = Usuario(**validated_data)
        if password:
            usuario.set_password(password)  # Hashea la contraseña
        usuario.save()
        return usuario
```

---

## 👥 Usuarios de Prueba

### Comando de Gestión

Se creó un comando de gestión para crear usuarios de prueba con contraseñas hasheadas:

```bash
python manage.py create_test_users
```

### Usuarios Creados

| Usuario | Email | Password | Perfil | Descripción |
|---------|-------|----------|--------|-------------|
| `admin_test` | admin@test.com | `Admin123!` | Administrador | Usuario administrador de prueba |
| `coordinador_test` | coordinador@test.com | `Coord123!` | Coordinador | Usuario coordinador de prueba |
| `dirigente_test` | dirigente@test.com | `Dirig123!` | Dirigente | Usuario dirigente de prueba |

### Uso en Desarrollo

```bash
# Crear usuarios de prueba
cd backend
python manage.py create_test_users

# Login con curl
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"Admin123!"}'
```

### Creación Manual de Usuarios

Para crear usuarios manualmente con contraseñas hasheadas:

```python
from usuarios.models import Usuario
from maestros.models import Perfil

# Obtener perfil
perfil = Perfil.objects.get(pel_descripcion='Administrador')

# Crear usuario
usuario = Usuario(
    usu_username='nuevo_usuario',
    usu_email='nuevo@example.com',
    pel_id=perfil,
    usu_vigente=True
)

# Establecer contraseña (se hashea automáticamente)
usuario.set_password('MiContraseñaSegura123!')
usuario.save()
```

---

## 🛡️ Permisos y Autorización

### Modelo de Permisos

La plataforma GIC usa un sistema de permisos basado en:

1. **Perfiles**: Roles de usuario (Administrador, Coordinador, Dirigente)
2. **Aplicaciones**: Módulos del sistema
3. **PerfilAplicacion**: Permisos específicos por perfil y aplicación

#### Permisos por Aplicación

```python
class PerfilAplicacion(models.Model):
    pea_ingresar = models.BooleanField()     # Crear
    pea_modificar = models.BooleanField()    # Actualizar
    pea_eliminar = models.BooleanField()     # Eliminar
    pea_consultar = models.BooleanField()    # Leer
```

### Implementar Permisos en ViewSets

Para implementar permisos por rol en los ViewSets:

```python
# ejemplo: cursos/views.py

from rest_framework import viewsets, permissions

class IsCoordinadorOrReadOnly(permissions.BasePermission):
    """
    Permiso personalizado: solo coordinadores pueden modificar
    """
    def has_permission(self, request, view):
        # Lectura permitida para todos
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Escritura solo para coordinadores
        return (
            request.user.is_authenticated and 
            request.user.pel_id.pel_descripcion == 'Coordinador'
        )

class CursoViewSet(viewsets.ModelViewSet):
    queryset = Curso.objects.all()
    serializer_class = CursoSerializer
    permission_classes = [IsCoordinadorOrReadOnly]
```

### Permisos por Método

```python
class CursoViewSet(viewsets.ModelViewSet):
    def get_permissions(self):
        """
        Permisos dinámicos según el método HTTP
        """
        if self.action in ['list', 'retrieve']:
            # Solo autenticación requerida para GET
            permission_classes = [permissions.IsAuthenticated]
        elif self.action in ['create', 'update', 'partial_update']:
            # Coordinadores pueden crear/editar
            permission_classes = [IsCoordinadorOrAdmin]
        elif self.action == 'destroy':
            # Solo admins pueden eliminar
            permission_classes = [IsAdmin]
        else:
            permission_classes = [permissions.IsAuthenticated]
        
        return [permission() for permission in permission_classes]
```

### Verificar Permisos en Vistas

```python
from usuarios.models import PerfilAplicacion

def tiene_permiso(usuario, aplicacion_nombre, accion):
    """
    Verifica si un usuario tiene permiso para una acción
    
    Args:
        usuario: Instancia de Usuario
        aplicacion_nombre: Nombre de la aplicación
        accion: 'ingresar', 'modificar', 'eliminar', o 'consultar'
    
    Returns:
        bool: True si tiene permiso
    """
    try:
        permiso = PerfilAplicacion.objects.get(
            pel_id=usuario.pel_id,
            apl_id__apl_descripcion=aplicacion_nombre
        )
        
        accion_map = {
            'ingresar': permiso.pea_ingresar,
            'modificar': permiso.pea_modificar,
            'eliminar': permiso.pea_eliminar,
            'consultar': permiso.pea_consultar,
        }
        
        return accion_map.get(accion, False)
    
    except PerfilAplicacion.DoesNotExist:
        return False

# Uso en ViewSet
class CursoViewSet(viewsets.ModelViewSet):
    def create(self, request, *args, **kwargs):
        if not tiene_permiso(request.user, 'Cursos', 'ingresar'):
            return Response(
                {'error': 'No tiene permiso para crear cursos'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().create(request, *args, **kwargs)
```

---

## 📝 Recomendaciones Adicionales

### 1. Política de Contraseñas

Configurar validadores de contraseña en `settings.py`:

```python
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {
            'min_length': 8,
        }
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]
```

### 2. Rate Limiting Mejorado

Ya configurado en `nginx/prod.conf`:

```nginx
# 30 requests por minuto para API
limit_req_zone $binary_remote_addr zone=api:10m rate=30r/m;

# 5 requests por minuto para login
limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;
```

### 3. Auditoría de Accesos

Crear modelo para auditar acciones críticas:

```python
# usuarios/models.py

class AuditoriaUsuario(models.Model):
    usu_id = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    aud_accion = models.CharField(max_length=50)  # login, logout, cambio_password
    aud_ip = models.GenericIPAddressField()
    aud_fecha = models.DateTimeField(auto_now_add=True)
    aud_exitoso = models.BooleanField()
    aud_detalles = models.TextField(blank=True)
    
    class Meta:
        db_table = 'auditoria_usuario'
```

### 4. Sesiones Seguras

En `settings.py` para producción:

```python
# Solo HTTPS en producción
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_SSL_REDIRECT = True

# HSTS
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Otras configuraciones de seguridad
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = 'DENY'
```

### 5. Tokens JWT

Configuración ya implementada en `settings.py`:

```python
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
}
```

---

## ✅ Checklist de Seguridad

### Implementado ✓

- [x] Hashing de contraseñas con PBKDF2-SHA256
- [x] Migración de base de datos para campo de password
- [x] Método `set_password()` en modelo Usuario
- [x] Método `check_password()` en modelo Usuario
- [x] Actualización de vistas de autenticación
- [x] Serializers con hashing automático
- [x] Comando para crear usuarios de prueba
- [x] JWT con refresh tokens
- [x] Rate limiting en nginx
- [x] CORS configurado
- [x] CSRF protection
- [x] Headers de seguridad

### Pendiente de Implementar

- [ ] Permisos por rol en todos los ViewSets
- [ ] Sistema de auditoría completo
- [ ] Validación de contraseñas robusta
- [ ] 2FA (Two-Factor Authentication)
- [ ] Recuperación de contraseña por email
- [ ] Bloqueo de cuenta por intentos fallidos
- [ ] Notificaciones de seguridad

---

## 🔍 Testing de Seguridad

### Verificar Hashing de Contraseñas

```python
from usuarios.models import Usuario

# Crear usuario
usuario = Usuario.objects.create(
    usu_username='test',
    usu_email='test@test.com',
    pel_id=perfil,
    usu_vigente=True
)
usuario.set_password('TestPassword123!')
usuario.save()

# Verificar que la contraseña está hasheada
print(usuario.usu_password)  # Debería mostrar algo como: pbkdf2_sha256$...

# Verificar contraseña correcta
assert usuario.check_password('TestPassword123!') == True

# Verificar contraseña incorrecta
assert usuario.check_password('WrongPassword') == False
```

### Test de Login

```bash
# Test con contraseña correcta
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"Admin123!"}'

# Debería retornar tokens JWT

# Test con contraseña incorrecta
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"WrongPass"}'

# Debería retornar error 401
```

---

## 📞 Soporte

Para reportar problemas de seguridad:
- 🔒 Email: security@gic.scouts.cl
- 📚 Documentación: Ver otros archivos de seguridad en `/backend/`

---

**Fecha**: 2025-11-15  
**Versión**: 1.0.0  
**Estado**: ✅ Mejoras Críticas Implementadas
