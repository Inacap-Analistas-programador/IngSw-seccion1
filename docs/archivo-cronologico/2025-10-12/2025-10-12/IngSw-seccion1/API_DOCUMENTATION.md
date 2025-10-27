# Documentación de APIs - SGICS

## Enlaces de la API

### Desarrollo Local
- **API Base URL:** `http://localhost:8000/api/`
- **Panel de Admin:** `http://localhost:8000/admin/`
- **Health Check:** `http://localhost:8000/healthz/`

### Autenticación

La API utiliza **JWT (JSON Web Tokens)** para autenticación:

```bash
# 1. Obtener tokens de acceso
POST /api/auth/login/
{
  "username": "admin",
  "password": "admin123"
}

# Respuesta:
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}

# 2. Usar token en requests
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...

# 3. Renovar token cuando expire
POST /api/auth/refresh/
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

## Endpoints Principales

### Autenticación - `/api/auth/`

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| POST   | `/login/` | Iniciar sesión con credenciales | Público |
| POST   | `/refresh/` | Renovar token de acceso | Token refresh válido |
| POST   | `/logout/` | Cerrar sesión (blacklist token) | Autenticado |
| GET    | `/users/` | Listar usuarios | Admin/Coordinador |
| POST   | `/users/` | Crear nuevo usuario | Admin |
| GET    | `/users/{id}/` | Detalle de usuario | Propietario o Admin |
| PUT    | `/users/{id}/` | Actualizar usuario completo | Propietario o Admin |
| PATCH  | `/users/{id}/` | Actualizar usuario parcial | Propietario o Admin |
| DELETE | `/users/{id}/` | Eliminar usuario | Admin |
| GET    | `/roles/` | Listar roles disponibles | Autenticado |

### Cursos - `/api/courses/`

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| GET    | `/` | Listar cursos disponibles | Autenticado |
| POST   | `/` | Crear nuevo curso | Coordinador/Admin |
| GET    | `/{id}/` | Detalle de curso | Autenticado |
| PUT    | `/{id}/` | Actualizar curso | Instructor propietario |
| DELETE | `/{id}/` | Eliminar curso | Admin |
| GET    | `/categories/` | Listar categorías de cursos | Autenticado |
| POST   | `/{id}/inscribir/` | Inscribirse a un curso | Scout/Participante |

### Preinscripciones - `/api/preinscriptions/`

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| GET    | `/` | Listar mis preinscripciones | Propietario |
| POST   | `/` | Crear nueva preinscripción | Scout/Participante |
| GET    | `/{id}/` | Detalle de preinscripción | Propietario o Coordinador |
| PATCH  | `/{id}/` | Actualizar estado | Coordinador |
| POST   | `/{id}/aprobar/` | Aprobar preinscripción | Coordinador |
| POST   | `/{id}/rechazar/` | Rechazar preinscripción | Coordinador |

### Pagos - `/api/payments/`

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| GET    | `/` | Listar mis pagos | Propietario |
| POST   | `/` | Registrar nuevo pago | Scout/Participante |
| GET    | `/{id}/` | Detalle de pago | Propietario o Admin |
| POST   | `/{id}/confirmar/` | Confirmar pago recibido | Coordinador |
| GET    | `/cuotas/` | Listar cuotas pendientes | Propietario |

### Archivos - `/api/files/`

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| GET    | `/` | Listar archivos accesibles | Según permisos |
| POST   | `/upload/` | Subir nuevo archivo | Autenticado |
| GET    | `/{id}/` | Descargar archivo | Según permisos |
| DELETE | `/{id}/` | Eliminar archivo | Propietario o Admin |

### Health Checks - `/healthz/`

| Método | Endpoint | Descripción | Uso |
|--------|----------|-------------|-----|
| GET    | `/healthz/` | Estado básico del servicio | Load balancers, monitoreo |
| GET    | `/healthz/ready/` | Servicio listo (DB conectada) | Deployment, orchestrators |
| GET    | `/healthz/live/` | Aplicación funcionando | Kubernetes liveness probe |

#### Ejemplos de Health Checks:

```bash
# Health check básico
curl http://localhost:8000/healthz/
# Respuesta:
{
  "status": "ok",
  "service": "SGICS Backend API", 
  "version": "1.0.0",
  "timestamp": 1696881600
}

# Readiness check (deployment)
curl http://localhost:8000/healthz/ready/
# Respuesta exitosa:
{
  "status": "ready",
  "database": "connected",
  "timestamp": 1696881600
}

# Respuesta con fallo (HTTP 503):
{
  "status": "not_ready",
  "error": "database connection failed",
  "timestamp": 1696881600
}
```

## Filtros y Búsquedas

Todos los endpoints de listado soportan filtros y búsquedas:

```bash
# Filtros por campo
GET /api/courses/?categoria=formacion-basica&estado=activo

# Búsqueda de texto
GET /api/courses/?search=primeros+auxilios

# Ordenamiento
GET /api/courses/?ordering=-fecha_inicio

# Paginación
GET /api/courses/?page=2&page_size=10
```

## Códigos de Respuesta

| Código | Significado | Cuándo ocurre |
|--------|-------------|---------------|
| 200    | OK | Operación exitosa |
| 201    | Created | Recurso creado exitosamente |
| 400    | Bad Request | Datos inválidos enviados |
| 401    | Unauthorized | Token faltante o inválido |
| 403    | Forbidden | Sin permisos para la operación |
| 404    | Not Found | Recurso no encontrado |
| 409    | Conflict | Conflicto (ej: RUT duplicado) |
| 422    | Unprocessable Entity | Reglas de negocio no cumplidas |
| 500    | Internal Server Error | Error del servidor |

## Testing con cURL

```bash
# Obtener token
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'

# Usar token para acceder a API
TOKEN="tu_token_aqui"
curl -X GET http://localhost:8000/api/courses/ \
  -H "Authorization: Bearer $TOKEN"

# Crear nuevo curso
curl -X POST http://localhost:8000/api/courses/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "nombre": "Primeros Auxilios Básicos",
  "descripcion": "Curso de primeros auxilios para scouts",
  "categoria": 1,
  "precio": 15000
  }'
```

## Notas Importantes

1. **Tokens JWT:** Expiran en 1 hora, usar refresh token para renovar
2. **Fechas:** Usar formato ISO 8601 (YYYY-MM-DDTHH:MM:SS.fffffZ)
3. **Archivos:** Máximo 10MB por archivo
4. **Rate Limiting:** Máximo 1000 requests por hora por usuario
5. **CORS:** Solo permite origen desde `http://localhost:3000` en desarrollo
