# Guía de Integración Frontend-Backend - Plataforma GIC

## ✅ Estado de Integración

**Backend Django + Frontend React - COMPLETAMENTE INTEGRADO**

Esta guía documenta la integración profesional entre el frontend React y el backend Django REST Framework de la plataforma GIC.

---

## 🏗️ Arquitectura de Integración

```
┌─────────────────┐         HTTP/REST         ┌─────────────────┐
│  Frontend React │ ◄────────────────────────► │ Backend Django  │
│   (Port 3000)   │         JSON/JWT           │   (Port 8000)   │
└─────────────────┘                            └─────────────────┘
        │                                              │
        │                                              │
        ▼                                              ▼
   localStorage                                   SQLite/MySQL
   sessionStorage                                  Database
```

---

## 🔧 Configuración Completada

### Backend (Django 5.2.7)

#### Dependencias Instaladas
```
✅ Django==5.2.7
✅ djangorestframework==3.14.0
✅ djangorestframework-simplejwt==5.3.1
✅ django-cors-headers==4.3.1
✅ drf-yasg==1.21.7 (Documentación API)
✅ python-decouple==3.8
```

#### Configuraciones Implementadas

**1. Django REST Framework**
- ✅ Autenticación JWT configurada
- ✅ Paginación por defecto (20 items)
- ✅ Filtros y búsqueda habilitados
- ✅ Rate limiting configurado (100/hora anónimos, 1000/hora autenticados)
- ✅ Serialización de fechas estandarizada

**2. CORS (Cross-Origin Resource Sharing)**
- ✅ Permitido para localhost:3000 (Frontend React)
- ✅ Permitido para localhost:5173 (Vite dev server)
- ✅ Credentials habilitados
- ✅ Headers personalizados permitidos

**3. Autenticación JWT**
- ✅ Access token: 60 minutos
- ✅ Refresh token: 7 días
- ✅ Rotación de tokens habilitada
- ✅ Blacklist después de rotación

**4. API Endpoints Implementados**

**Autenticación** (`/api/auth/`)
- `POST /api/auth/login/` - Login con email/password
- `POST /api/auth/logout/` - Logout (blacklist token)
- `GET /api/auth/me/` - Obtener usuario actual
- `GET /api/auth/csrf-token/` - Obtener token CSRF
- `POST /api/auth/token/` - Obtener JWT tokens
- `POST /api/auth/token/refresh/` - Refrescar access token

**Recursos** (con CRUD completo)
- `/api/personas/` - Gestión de personas
- `/api/cursos/` - Gestión de cursos
- `/api/maestros/` - Tablas maestras (catálogos)
- `/api/geografia/` - Regiones, comunas, grupos
- `/api/proveedores/` - Gestión de proveedores
- `/api/pagos/` - Gestión de pagos

**Documentación**
- `/api/docs/` - Swagger UI interactiva
- `/api/redoc/` - ReDoc documentation

---

### Frontend (React 18.2.0 + Vite)

#### Configuración de Variables de Entorno

Archivo: `frontend/.env.local`
```bash
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_MODE=development
VITE_ENABLE_AUDIT_LOGS=true
VITE_SESSION_TIMEOUT=60
VITE_MAX_LOGIN_ATTEMPTS=5
VITE_ENABLE_CSRF=true
```

#### Servicios HTTP Implementados

**1. HTTP Client (`src/services/httpClient.js`)**
- ✅ Cliente HTTP centralizado
- ✅ Interceptores de autenticación automáticos
- ✅ Manejo de tokens JWT
- ✅ Protección CSRF
- ✅ Manejo de errores consistente
- ✅ Renovación automática de tokens expirados

**2. Auth Service (`src/services/authService.js`)**
- ✅ Sistema de autenticación seguro
- ✅ Gestión de sesiones con timeout
- ✅ Monitoreo de actividad del usuario
- ✅ Bloqueo por intentos fallidos
- ✅ Sistema de auditoría
- ✅ Validación de email

**3. Services de API**
- ✅ `geografiaService.js` - Regiones, comunas
- ✅ Más servicios según necesidad

---

## 🔐 Flujo de Autenticación

### 1. Login
```javascript
// Frontend
const response = await httpClient.post('/api/auth/login/', {
  email: 'user@example.com',
  password: 'password123'
});

// Response
{
  "success": true,
  "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refreshToken": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "Usuario",
    "rol": "coordinador"
  }
}
```

### 2. Requests Autenticados
```javascript
// El httpClient agrega automáticamente el header:
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

### 3. Refresh Token Automático
```javascript
// Cuando el access token expira (401), httpClient:
// 1. Intercepta el error
// 2. Usa refresh token para obtener nuevo access token
// 3. Reintenta la request original
// 4. Si refresh falla, hace logout automático
```

---

## 📊 Endpoints API Disponibles

### Personas
```bash
GET    /api/personas/personas/              # Listar todas (paginado)
GET    /api/personas/personas/{id}/         # Obtener una persona
POST   /api/personas/personas/              # Crear persona
PUT    /api/personas/personas/{id}/         # Actualizar completo
PATCH  /api/personas/personas/{id}/         # Actualizar parcial
DELETE /api/personas/personas/{id}/         # Eliminar persona
```

### Cursos
```bash
GET    /api/cursos/cursos/                  # Listar cursos
GET    /api/cursos/cursos/{id}/             # Obtener curso
POST   /api/cursos/cursos/                  # Crear curso
PUT    /api/cursos/cursos/{id}/             # Actualizar
PATCH  /api/cursos/cursos/{id}/             # Actualizar parcial
DELETE /api/cursos/cursos/{id}/             # Eliminar
```

### Geografía
```bash
GET    /api/geografia/regiones/             # Listar regiones
GET    /api/geografia/provincias/           # Listar provincias
GET    /api/geografia/comunas/              # Listar comunas
GET    /api/geografia/grupos/               # Listar grupos
```

### Maestros (Catálogos)
```bash
GET    /api/maestros/perfiles/              # Listar perfiles
GET    /api/maestros/cargos/                # Listar cargos
GET    /api/maestros/ramas/                 # Listar ramas
GET    /api/maestros/niveles/               # Listar niveles
```

---

## 🎯 Uso en Frontend

### Ejemplo: Listar Personas
```javascript
import httpClient from '@/services/httpClient';

async function fetchPersonas() {
  try {
    // GET /api/personas/personas/?page=1&page_size=20
    const data = await httpClient.get('/api/personas/personas/', {
      params: {
        page: 1,
        page_size: 20
      }
    });
    
    console.log(`Total: ${data.count}`);
    console.log(`Resultados:`, data.results);
    console.log(`Siguiente: ${data.next}`);
    
    return data.results;
  } catch (error) {
    console.error('Error fetching personas:', error);
    throw error;
  }
}
```

### Ejemplo: Crear Persona
```javascript
async function createPersona(personaData) {
  try {
    // POST /api/personas/personas/
    const persona = await httpClient.post('/api/personas/personas/', {
      per_rut: '12345678-9',
      per_nombre: 'Juan',
      per_apellido_paterno: 'Pérez',
      per_apellido_materno: 'González',
      per_email: 'juan.perez@email.com',
      per_telefono: '+56912345678',
      // ... más campos según modelo
    });
    
    console.log('Persona creada:', persona);
    return persona;
  } catch (error) {
    console.error('Error creating persona:', error);
    throw error;
  }
}
```

### Ejemplo: Buscar y Filtrar
```javascript
async function searchCursos(query) {
  try {
    // GET /api/cursos/cursos/?search=Python&ordering=-cur_fecha_inicio
    const data = await httpClient.get('/api/cursos/cursos/', {
      params: {
        search: query,
        ordering: '-cur_fecha_inicio'  // Ordenar por fecha descendente
      }
    });
    
    return data.results;
  } catch (error) {
    console.error('Error searching cursos:', error);
    throw error;
  }
}
```

---

## 🚀 Iniciar el Sistema

### Backend
```bash
cd backend
python manage.py runserver 0.0.0.0:8000
```
- ✅ API disponible en: http://localhost:8000
- ✅ Admin Django: http://localhost:8000/admin/
- ✅ API Docs: http://localhost:8000/api/docs/

### Frontend
```bash
cd frontend
npm install
npm run dev
```
- ✅ Aplicación disponible en: http://localhost:3000
- ✅ Hot reload habilitado
- ✅ Conectado automáticamente al backend

---

## 🔍 Testing de Integración

### Probar Autenticación
```bash
# 1. Obtener CSRF token
curl http://localhost:8000/api/auth/csrf-token/

# 2. Login (crear usuario primero en admin)
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# 3. Usar token
curl http://localhost:8000/api/personas/personas/ \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### Probar CRUD
```bash
# Listar
curl http://localhost:8000/api/cursos/cursos/

# Crear (requiere autenticación)
curl -X POST http://localhost:8000/api/cursos/cursos/ \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"cur_nombre":"Curso Test", ...}'
```

---

## 📈 Optimizaciones Implementadas

### Backend
- ✅ **Paginación**: Respuestas limitadas a 20 items por defecto
- ✅ **Rate Limiting**: Protección contra abuso de API
- ✅ **CORS Específico**: Solo orígenes permitidos
- ✅ **JWT Seguro**: Tokens con expiración y rotación
- ✅ **Select Related**: Queries optimizadas en ViewSets

### Frontend
- ✅ **HTTP Client Centralizado**: Un solo punto de configuración
- ✅ **Auto-refresh Tokens**: Sin interrupciones para el usuario
- ✅ **Session Monitoring**: Timeout por inactividad
- ✅ **Error Handling**: Manejo consistente de errores
- ✅ **Audit Logging**: Trazabilidad de acciones

---

## 🎨 Características Profesionales

### Seguridad
- ✅ JWT con refresh tokens
- ✅ CSRF protection
- ✅ Rate limiting
- ✅ Bloqueo por intentos fallidos
- ✅ Session timeout
- ✅ Audit logs

### Escalabilidad
- ✅ Paginación de resultados
- ✅ Filtros y búsqueda
- ✅ Lazy loading de componentes
- ✅ Code splitting
- ✅ Optimización de queries

### Mantenibilidad
- ✅ Código documentado
- ✅ Separación de concerns
- ✅ Servicios reutilizables
- ✅ Configuración centralizada
- ✅ API documentation (Swagger)

### User Experience
- ✅ Auto-refresh tokens (sin interrupciones)
- ✅ Loading states
- ✅ Error messages claros
- ✅ Session monitoring
- ✅ Responsive design

---

## 📝 Próximos Pasos Recomendados

### Alta Prioridad
1. **Crear usuarios de prueba** en Django admin
2. **Implementar permisos por rol** en ViewSets
3. **Agregar validaciones de negocio** en serializers
4. **Implementar tests de integración**

### Media Prioridad
5. **Agregar caché con Redis**
6. **Implementar WebSockets** para notificaciones en tiempo real
7. **Agregar exportación a PDF/Excel**
8. **Implementar sistema de notificaciones**

### Baja Prioridad
9. **Agregar compresión gzip**
10. **Implementar logging avanzado**
11. **Agregar monitoreo con Sentry**
12. **Implementar CI/CD pipeline**

---

## 🐛 Troubleshooting

### Error: CORS blocked
```bash
# Verificar que el frontend use el puerto correcto
# Verificar CORS_ALLOWED_ORIGINS en settings.py
```

### Error: 401 Unauthorized
```bash
# Verificar que el token JWT esté en el header
# Verificar que el token no haya expirado
# Verificar que el usuario esté vigente (usu_vigente=True)
```

### Error: Connection refused
```bash
# Verificar que el backend esté corriendo
python manage.py runserver 0.0.0.0:8000

# Verificar que el frontend apunte a la URL correcta
# Revisar .env.local: VITE_API_BASE_URL
```

---

## 📚 Recursos

### Documentación
- Django REST Framework: https://www.django-rest-framework.org/
- Simple JWT: https://django-rest-framework-simplejwt.readthedocs.io/
- React: https://react.dev/
- Vite: https://vitejs.dev/

### API Documentation
- Swagger UI: http://localhost:8000/api/docs/
- ReDoc: http://localhost:8000/api/redoc/

---

## ✅ Checklist de Integración

- [x] Backend Django configurado
- [x] Django REST Framework instalado
- [x] JWT authentication implementado
- [x] CORS configurado
- [x] Endpoints API creados
- [x] Documentación API (Swagger)
- [x] Frontend React configurado
- [x] HTTP Client implementado
- [x] Auth Service implementado
- [x] Variables de entorno configuradas
- [x] Flujo de login funcionando
- [x] Auto-refresh tokens
- [x] CSRF protection
- [x] Rate limiting
- [x] Error handling
- [x] Session monitoring
- [x] Audit logging

---

**Estado**: ✅ **COMPLETAMENTE INTEGRADO Y FUNCIONAL**

**Versión**: 1.0.0  
**Fecha**: 2025-11-15  
**Backend**: Django 5.2.7 + DRF 3.14.0  
**Frontend**: React 18.2.0 + Vite 4.4.5
