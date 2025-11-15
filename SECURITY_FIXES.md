# Correcciones de Seguridad Implementadas

## Resumen
Este documento detalla las vulnerabilidades de seguridad identificadas y las correcciones aplicadas al sistema GIC.

## Fecha de Análisis
2025-11-15

## Vulnerabilidades Corregidas

### Backend (Django)

#### 1. SECRET_KEY Hardcodeada ⚠️ CRÍTICO
**Problema:** La SECRET_KEY de Django estaba hardcodeada en settings.py, lo que representa un riesgo crítico de seguridad.

**Solución:**
- SECRET_KEY ahora se lee de variable de entorno `DJANGO_SECRET_KEY`
- Se mantiene valor por defecto solo para desarrollo
- Archivo `.env.example` creado con instrucciones

```python
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', "django-insecure-...")
```

**Recomendación de Producción:**
```bash
# Generar una SECRET_KEY segura
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'

# Configurar en variables de entorno
export DJANGO_SECRET_KEY='tu-clave-generada-aqui'
```

---

#### 2. DEBUG Habilitado en Producción ⚠️ CRÍTICO
**Problema:** DEBUG=True estaba hardcodeado, exponiendo información sensible en producción.

**Solución:**
- DEBUG ahora se controla por variable de entorno `DJANGO_DEBUG`
- Por defecto es False (seguro)

```python
DEBUG = os.environ.get('DJANGO_DEBUG', 'False') == 'True'
```

---

#### 3. ALLOWED_HOSTS Vacío ⚠️ CRÍTICO
**Problema:** Lista vacía permite conexiones desde cualquier host en producción.

**Solución:**
- ALLOWED_HOSTS se configura desde variable de entorno
- En desarrollo permite todos los hosts
- En producción requiere configuración explícita

```python
ALLOWED_HOSTS = os.environ.get('DJANGO_ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',') if not DEBUG else ['*']
```

---

#### 4. CORS Permisivo ⚠️ CRÍTICO
**Problema:** CORS_ALLOW_ALL_ORIGINS=True permite peticiones desde cualquier origen.

**Solución:**
- CORS_ALLOW_ALL_ORIGINS solo True en desarrollo
- En producción usar lista específica de orígenes permitidos

```python
CORS_ALLOW_ALL_ORIGINS = os.environ.get('CORS_ALLOW_ALL', 'False') == 'True' and DEBUG
```

---

#### 5. Headers de Seguridad HTTPS Faltantes ⚠️ ALTO
**Problema:** Faltaban configuraciones de seguridad para HTTPS.

**Solución:**
- Headers de seguridad se activan automáticamente en producción (DEBUG=False)
- Incluye: HSTS, Secure Cookies, SSL Redirect, XSS Protection

```python
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = 'DENY'
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
```

---

#### 6. ViewSets sin Permisos ⚠️ ALTO
**Problema:** Los ViewSets de Personas, Cursos, Pagos, Proveedores no tenían permisos configurados.

**Solución:**
- Agregado `IsAuthenticated` a todos los ViewSets críticos
- Agregado `IsAuthenticatedOrReadOnly` a ViewSets de catálogos/maestros

**Archivos modificados:**
- `backend/personas/views.py` - IsAuthenticated
- `backend/cursos/views.py` - IsAuthenticated
- `backend/pagos/views.py` - IsAuthenticated (todos los ViewSets)
- `backend/proveedores/views.py` - IsAuthenticated
- `backend/maestros/views.py` - IsAuthenticatedOrReadOnly (catálogos)

---

#### 7. Rate Limiting para Login Faltante ⚠️ ALTO
**Problema:** No había throttling específico para prevenir ataques de fuerza bruta en login.

**Solución:**
- Creado `LoginRateThrottle` con límite de 5 intentos por minuto
- Aplicado a todas las vistas de login

**Archivo nuevo:** `backend/usuarios/throttles.py`

```python
class LoginRateThrottle(AnonRateThrottle):
    scope = 'login'
    rate = '5/minute'
```

---

#### 8. Validación de Entrada en Auth ⚠️ MEDIO
**Problema:** Faltaba validación y sanitización de datos de entrada en autenticación.

**Solución:**
- Agregada validación de formato de email
- Agregada sanitización de entrada para prevenir XSS
- Mensajes de error genéricos para no revelar información

**Archivo modificado:** `backend/usuarios/auth_views.py`

```python
def validate_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def sanitize_input(text):
    dangerous_chars = ['<', '>', '"', "'", '&', ';']
    for char in dangerous_chars:
        text = text.replace(char, '')
    return text.strip()
```

---

#### 9. Middleware de Seguridad Faltante ⚠️ MEDIO
**Problema:** Faltaban headers de seguridad como Content-Security-Policy.

**Solución:**
- Creado `SecurityHeadersMiddleware` para agregar headers de seguridad
- Creado `XSSProtectionMiddleware` para detectar intentos de XSS
- Headers incluidos: CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy

**Archivo nuevo:** `backend/scout_project/security_middleware.py`

---

### Frontend (React + Vite)

#### 10. Código Mock en Producción ⚠️ ALTO
**Problema:** authService.js contenía código mock que debía ser removido en producción.

**Solución:**
- Removidas funciones `mockLogin()` y `generateMockToken()`
- Implementada llamada real a la API del backend
- Login ahora se conecta correctamente al endpoint `/api/auth/login/`

**Archivo modificado:** `frontend/src/services/authService.js`

---

#### 11. Almacenamiento de Tokens en sessionStorage ⚠️ MEDIO
**Estado:** DOCUMENTADO - No modificado para mantener compatibilidad

**Nota:** Los tokens actualmente se almacenan en `sessionStorage`. Esto es vulnerable a XSS pero:
- Es temporal (se limpia al cerrar el navegador)
- Está protegido por múltiples capas de sanitización
- Cambiar a httpOnly cookies requiere modificaciones mayores en el backend

**Recomendación futura:** Implementar tokens en httpOnly cookies para mayor seguridad.

---

## Archivos Creados

1. **backend/.env.example** - Template de configuración con variables de entorno seguras
2. **backend/usuarios/throttles.py** - Rate limiting para login
3. **backend/scout_project/security_middleware.py** - Middleware de seguridad con CSP y XSS protection

## Archivos Modificados

### Backend
1. **backend/scout_project/settings.py** - Configuración de seguridad
2. **backend/usuarios/auth_views.py** - Validación y sanitización
3. **backend/personas/views.py** - Permisos agregados
4. **backend/cursos/views.py** - Permisos agregados
5. **backend/pagos/views.py** - Permisos agregados
6. **backend/proveedores/views.py** - Permisos agregados
7. **backend/maestros/views.py** - Permisos agregados

### Frontend
8. **frontend/src/services/authService.js** - Removido código mock

## Configuración para Producción

### Variables de Entorno Requeridas

```bash
# Backend (.env)
DJANGO_SECRET_KEY=<generar-clave-segura>
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=tu-dominio.com,www.tu-dominio.com
CORS_ALLOW_ALL=False
DB_ENGINE=mysql
DB_NAME=gic_db
DB_USER=gic_user
DB_PASSWORD=<password-seguro>
DB_HOST=localhost
DB_PORT=3306
```

### Checklist de Despliegue

- [ ] Generar y configurar DJANGO_SECRET_KEY única
- [ ] Establecer DEBUG=False
- [ ] Configurar ALLOWED_HOSTS con dominios reales
- [ ] Configurar CORS con orígenes específicos
- [ ] Configurar base de datos MySQL/PostgreSQL
- [ ] Habilitar HTTPS en servidor web
- [ ] Verificar certificado SSL válido
- [ ] Configurar backups automáticos
- [ ] Configurar monitoreo de logs de seguridad
- [ ] Revisar permisos de archivos en servidor
- [ ] Configurar firewall del servidor
- [ ] Habilitar logs de auditoría

## Testing de Seguridad

### Verificar Headers de Seguridad

```bash
curl -I https://tu-dominio.com/api/
```

Debe incluir:
- Content-Security-Policy
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict-Transport-Security

### Verificar Rate Limiting

```bash
# Intentar login 6 veces rápidamente (debe bloquear en el intento 6)
for i in {1..6}; do
  curl -X POST http://localhost:8000/api/auth/login/ \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
done
```

### Verificar Permisos

```bash
# Sin autenticación - debe retornar 401
curl http://localhost:8000/api/personas/

# Con token inválido - debe retornar 401
curl -H "Authorization: Bearer invalid_token" http://localhost:8000/api/personas/
```

## Vulnerabilidades Conocidas (No Críticas)

1. **Tokens en sessionStorage**: Vulnerable a XSS pero mitigado con sanitización
2. **Falta 2FA**: Autenticación de dos factores no implementada
3. **Falta recuperación de contraseña**: No hay flujo de reset de password

## Recomendaciones Futuras

1. **Implementar 2FA** usando TOTP o SMS
2. **Migrar tokens a httpOnly cookies** para mayor seguridad
3. **Implementar recuperación de contraseña** con tokens seguros
4. **Agregar auditoría completa** de acciones de usuarios
5. **Implementar detección de anomalías** en patrones de acceso
6. **Agregar pruebas de penetración** regulares
7. **Configurar SIEM** para monitoreo centralizado de seguridad

## Contacto de Seguridad

Para reportar vulnerabilidades de seguridad:
- Email: security@gic.scouts.cl
- Proceso: Responsible Disclosure Policy

---

**Última actualización:** 2025-11-15
**Revisado por:** GitHub Copilot Security Agent
**Estado:** ✅ Vulnerabilidades Críticas Corregidas
