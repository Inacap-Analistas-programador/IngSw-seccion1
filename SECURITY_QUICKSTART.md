# Guía Rápida de Seguridad para Desarrolladores GIC

## 🔒 Configuración de Entorno de Desarrollo

### Backend - Configuración Mínima

```bash
cd backend

# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus valores
nano .env

# Configuración mínima requerida:
DJANGO_SECRET_KEY=tu-clave-secreta-generada
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
```

### Generar SECRET_KEY Segura

```bash
# Método 1: Python
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'

# Método 2: OpenSSL
openssl rand -base64 50
```

---

## 🛡️ Checklist de Seguridad para Pull Requests

Antes de crear un PR, verifica:

- [ ] No hay contraseñas o tokens hardcodeados
- [ ] ViewSets tienen `permission_classes` configurados
- [ ] Validación de entrada implementada en formularios
- [ ] No hay código mock o de prueba
- [ ] Variables sensibles usan variables de entorno
- [ ] Errores no revelan información sensible del sistema
- [ ] SQL queries usan ORM (no raw SQL sin parametrizar)
- [ ] Archivos subidos se validan (tipo, tamaño)

---

## 🔐 Autenticación y Permisos

### Agregar Autenticación a un ViewSet

```python
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

class MiViewSet(viewsets.ModelViewSet):
    queryset = MiModelo.objects.all()
    serializer_class = MiSerializer
    permission_classes = [IsAuthenticated]  # ← Agregar esto
```

### Permisos Comunes

```python
from rest_framework.permissions import (
    IsAuthenticated,           # Requiere login
    IsAuthenticatedOrReadOnly, # Login para modificar, lectura pública
    AllowAny,                  # Sin restricción (usar con cuidado)
)
```

### Permisos Personalizados

```python
from rest_framework import permissions

class EsCoordinadorOSoloLectura(permissions.BasePermission):
    def has_permission(self, request, view):
        # GET, HEAD, OPTIONS permitidos para todos
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Escritura solo para coordinadores
        return (
            request.user.is_authenticated and 
            request.user.pel_id.pel_descripcion == 'Coordinador'
        )

# Uso
class CursoViewSet(viewsets.ModelViewSet):
    permission_classes = [EsCoordinadorOSoloLectura]
```

---

## 🧹 Validación y Sanitización de Entrada

### Backend (Django)

```python
import re

def validar_email(email):
    """Validar formato de email"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(pattern, email):
        raise ValidationError('Formato de email inválido')
    return email.lower().strip()

def sanitizar_texto(texto):
    """Remover caracteres peligrosos"""
    if not texto:
        return ''
    # Remover caracteres peligrosos
    peligrosos = ['<', '>', '"', "'", '&', ';']
    for char in peligrosos:
        texto = texto.replace(char, '')
    return texto.strip()
```

### Frontend (React)

```javascript
import { sanitizeText, validateEmail } from '@/utils/inputSanitizer';

function MiFormulario() {
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar y sanitizar antes de enviar
    try {
      const email = validateEmail(formData.email);
      const nombre = sanitizeText(formData.nombre);
      
      // Enviar datos limpios...
    } catch (error) {
      console.error('Error de validación:', error);
    }
  };
}
```

---

## 🚫 Anti-Patrones de Seguridad (NO HACER)

### ❌ Contraseñas Hardcodeadas

```python
# MAL - No hacer
password = "admin123"
SECRET_KEY = "my-secret-key"

# BIEN - Usar variables de entorno
import os
password = os.environ.get('ADMIN_PASSWORD')
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')
```

### ❌ DEBUG en Producción

```python
# MAL - No hacer
DEBUG = True

# BIEN - Controlar con variable de entorno
DEBUG = os.environ.get('DJANGO_DEBUG', 'False') == 'True'
```

### ❌ CORS Permisivo

```python
# MAL - No hacer en producción
CORS_ALLOW_ALL_ORIGINS = True

# BIEN - Lista específica de orígenes
CORS_ALLOWED_ORIGINS = [
    "https://tu-dominio.com",
    "https://www.tu-dominio.com",
]
```

### ❌ ViewSets Sin Permisos

```python
# MAL - Acceso sin restricción
class PersonaViewSet(viewsets.ModelViewSet):
    queryset = Persona.objects.all()
    serializer_class = PersonaSerializer

# BIEN - Requiere autenticación
class PersonaViewSet(viewsets.ModelViewSet):
    queryset = Persona.objects.all()
    serializer_class = PersonaSerializer
    permission_classes = [IsAuthenticated]
```

### ❌ SQL Injection

```python
# MAL - SQL injection vulnerable
nombre = request.GET.get('nombre')
usuarios = Usuario.objects.raw(f"SELECT * FROM usuario WHERE usu_username = '{nombre}'")

# BIEN - Usar ORM o parametrización
nombre = request.GET.get('nombre')
usuarios = Usuario.objects.filter(usu_username=nombre)
```

### ❌ XSS en Frontend

```javascript
// MAL - Permite XSS
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// BIEN - React escapa automáticamente
<div>{userInput}</div>

// O si necesitas HTML, sanitiza primero
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ 
  __html: DOMPurify.sanitize(userInput) 
}} />
```

---

## 📝 Logging y Auditoría

### No Logear Datos Sensibles

```python
# MAL - Expone contraseña en logs
logger.info(f"Login attempt: {email} with password {password}")

# BIEN - Solo información necesaria
logger.info(f"Login attempt: {email}")
```

### Niveles de Log Apropiados

```python
# ERROR: Errores que necesitan atención
logger.error(f"Failed to process payment: {error}")

# WARNING: Situaciones sospechosas
logger.warning(f"Multiple failed login attempts from {ip}")

# INFO: Eventos importantes
logger.info(f"User {user_id} created new curso")

# DEBUG: Solo en desarrollo
logger.debug(f"Query params: {request.GET}")
```

---

## 🔍 Testing de Seguridad

### Test de Permisos

```python
def test_requires_authentication(self):
    """Verificar que endpoint requiere autenticación"""
    response = self.client.get('/api/personas/')
    self.assertEqual(response.status_code, 401)

def test_with_authentication(self):
    """Verificar acceso con autenticación válida"""
    self.client.force_authenticate(user=self.user)
    response = self.client.get('/api/personas/')
    self.assertEqual(response.status_code, 200)
```

### Test de Validación

```python
def test_email_validation(self):
    """Verificar que emails inválidos son rechazados"""
    response = self.client.post('/api/auth/login/', {
        'email': 'invalid-email',
        'password': 'password123'
    })
    self.assertEqual(response.status_code, 400)
    self.assertIn('email', str(response.content).lower())
```

---

## 🚀 Despliegue Seguro

### Variables de Entorno en Producción

```bash
# .env.production (NO COMMITEAR)
DJANGO_SECRET_KEY=<generar-clave-única>
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=tu-dominio.com,www.tu-dominio.com
CORS_ALLOW_ALL=False

DB_ENGINE=mysql
DB_NAME=gic_prod
DB_USER=gic_user
DB_PASSWORD=<password-fuerte>
DB_HOST=db-server.internal
DB_PORT=3306
```

### Checklist Pre-Despliegue

```bash
# 1. Verificar DEBUG=False
grep -n "DEBUG = True" backend/scout_project/settings.py
# No debe haber resultados

# 2. Verificar SECRET_KEY no hardcodeada
grep -n "SECRET_KEY = \"django-insecure" backend/scout_project/settings.py
# Debe leer de variable de entorno

# 3. Verificar permisos en ViewSets
grep -L "permission_classes" backend/*/views.py
# Investigar archivos sin permisos

# 4. No código mock en frontend
grep -n "mock" frontend/src/services/*.js
# No debe haber resultados
```

---

## 🆘 Reportar Vulnerabilidades

Si encuentras una vulnerabilidad de seguridad:

1. **NO** crear issue público en GitHub
2. Enviar email a: **security@gic.scouts.cl**
3. Incluir:
   - Descripción de la vulnerabilidad
   - Pasos para reproducir
   - Impacto potencial
   - Sugerencias de corrección (opcional)

---

## 📚 Recursos Adicionales

- [SECURITY_FIXES.md](./SECURITY_FIXES.md) - Correcciones implementadas
- [SECURITY_TESTING.md](./SECURITY_TESTING.md) - Guía de testing
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Django Security](https://docs.djangoproject.com/en/stable/topics/security/)
- [React Security Best Practices](https://react.dev/learn/escape-hatches#security)

---

## ✅ Quick Wins de Seguridad

Cambios pequeños con gran impacto:

1. **Agregar `IsAuthenticated` a ViewSets** - 1 línea, gran protección
2. **Validar emails** - Previene muchos problemas
3. **Sanitizar inputs de usuario** - Usa funciones existentes
4. **No logear datos sensibles** - Revisa logs actuales
5. **Usar variables de entorno** - Para cualquier secreto

---

**Última actualización:** 2025-11-15
**Mantenido por:** Equipo GIC Security
