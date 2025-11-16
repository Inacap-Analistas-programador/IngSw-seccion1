# 📚 Documentación de APIs - GIC Sistema Scout

## Tabla de Contenidos
1. [Autenticación](#autenticación)
2. [Geografía](#geografía)
3. [Personas](#personas)
4. [Cursos](#cursos)
5. [Pagos](#pagos)
6. [Maestros](#maestros)
7. [Proveedores](#proveedores)

---

## Autenticación

### Login
Obtener tokens JWT para autenticación.

**Endpoint:** `POST /api/auth/login/`

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@scouts.cl"
  }
}
```

### Refresh Token
Obtener nuevo access token usando refresh token.

**Endpoint:** `POST /api/auth/token/refresh/`

**Request:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Usuario Actual
Obtener información del usuario autenticado.

**Endpoint:** `GET /api/auth/me/`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@scouts.cl"
}
```

---

## Geografía

### Regiones

#### Listar Regiones
**Endpoint:** `GET /api/geografia/regiones/`

**Response:**
```json
{
  "count": 16,
  "next": null,
  "previous": null,
  "results": [
    {
      "reg_id": 1,
      "reg_descripcion": "Arica y Parinacota",
      "reg_vigente": true
    },
    {
      "reg_id": 2,
      "reg_descripcion": "Tarapacá",
      "reg_vigente": true
    }
  ]
}
```

#### Crear Región
**Endpoint:** `POST /api/geografia/regiones/`

**Request:**
```json
{
  "reg_descripcion": "Magallanes",
  "reg_vigente": true
}
```

**Response:**
```json
{
  "reg_id": 16,
  "reg_descripcion": "Magallanes",
  "reg_vigente": true
}
```

#### Obtener Región
**Endpoint:** `GET /api/geografia/regiones/{reg_id}/`

**Response:**
```json
{
  "reg_id": 7,
  "reg_descripcion": "Metropolitana de Santiago",
  "reg_vigente": true
}
```

#### Actualizar Región
**Endpoint:** `PUT /api/geografia/regiones/{reg_id}/`

**Request:**
```json
{
  "reg_descripcion": "Metropolitana de Santiago (Actualizada)",
  "reg_vigente": true
}
```

#### Eliminar Región
**Endpoint:** `DELETE /api/geografia/regiones/{reg_id}/`

**Response:** `204 No Content`

---

### Provincias

#### Listar Provincias
**Endpoint:** `GET /api/geografia/provincias/`

**Query Parameters:**
- `reg_id`: Filtrar por región (ej: `/api/geografia/provincias/?reg_id=7`)

**Response:**
```json
{
  "count": 6,
  "next": null,
  "previous": null,
  "results": [
    {
      "pro_id": 1,
      "pro_descripcion": "Santiago",
      "pro_vigente": true,
      "reg_id": 7
    }
  ]
}
```

#### Crear Provincia
**Endpoint:** `POST /api/geografia/provincias/`

**Request:**
```json
{
  "reg_id": 7,
  "pro_descripcion": "Cordillera",
  "pro_vigente": true
}
```

---

### Comunas

#### Listar Comunas
**Endpoint:** `GET /api/geografia/comunas/`

**Query Parameters:**
- `pro_id`: Filtrar por provincia (ej: `/api/geografia/comunas/?pro_id=1`)

**Response:**
```json
{
  "count": 33,
  "next": "http://localhost:8000/api/geografia/comunas/?page=2",
  "previous": null,
  "results": [
    {
      "com_id": 1,
      "com_descripcion": "Santiago",
      "com_vigente": true,
      "pro_id": 1
    },
    {
      "com_id": 2,
      "com_descripcion": "Providencia",
      "com_vigente": true,
      "pro_id": 1
    }
  ]
}
```

#### Crear Comuna
**Endpoint:** `POST /api/geografia/comunas/`

**Request:**
```json
{
  "pro_id": 1,
  "com_descripcion": "Las Condes",
  "com_vigente": true
}
```

---

### Zonas Scout

#### Listar Zonas
**Endpoint:** `GET /api/geografia/zonas/`

**Response:**
```json
{
  "count": 5,
  "results": [
    {
      "zon_id": 1,
      "zon_descripcion": "Zona Metropolitana",
      "zon_unilateral": false,
      "zon_vigente": true
    }
  ]
}
```

---

### Distritos Scout

#### Listar Distritos
**Endpoint:** `GET /api/geografia/distritos/`

**Query Parameters:**
- `zon_id`: Filtrar por zona (ej: `/api/geografia/distritos/?zon_id=1`)

**Response:**
```json
{
  "count": 5,
  "results": [
    {
      "dis_id": 1,
      "dis_descripcion": "Distrito Santiago Centro",
      "dis_vigente": true,
      "zon_id": 1
    }
  ]
}
```

---

### Grupos Scout

#### Listar Grupos
**Endpoint:** `GET /api/geografia/grupos/`

**Query Parameters:**
- `dis_id`: Filtrar por distrito (ej: `/api/geografia/grupos/?dis_id=1`)

**Response:**
```json
{
  "count": 3,
  "results": [
    {
      "gru_id": 1,
      "gru_descripcion": "Grupo Scout N°1 San Jorge",
      "gru_vigente": true,
      "dis_id": 1
    }
  ]
}
```

#### Crear Grupo Scout
**Endpoint:** `POST /api/geografia/grupos/`

**Request:**
```json
{
  "dis_id": 1,
  "gru_descripcion": "Grupo Scout N°42 Baden Powell",
  "gru_vigente": true
}
```

---

## Maestros

Catálogos y tablas maestras del sistema.

### Ramas Scout

#### Listar Ramas
**Endpoint:** `GET /api/maestros/ramas/`

**Response:**
```json
{
  "count": 5,
  "results": [
    {
      "ram_id": 1,
      "ram_descripcion": "Castores",
      "ram_edad_minima": 5,
      "ram_edad_maxima": 7,
      "ram_vigente": true
    },
    {
      "ram_id": 2,
      "ram_descripcion": "Lobatos",
      "ram_edad_minima": 8,
      "ram_edad_maxima": 10,
      "ram_vigente": true
    }
  ]
}
```

### Niveles

#### Listar Niveles
**Endpoint:** `GET /api/maestros/niveles/`

**Response:**
```json
{
  "count": 4,
  "results": [
    {
      "niv_id": 1,
      "niv_descripcion": "Nivel Básico",
      "niv_vigente": true
    }
  ]
}
```

### Cargos

#### Listar Cargos
**Endpoint:** `GET /api/maestros/cargos/`

**Response:**
```json
{
  "count": 6,
  "results": [
    {
      "car_id": 1,
      "car_descripcion": "Dirigente",
      "car_vigente": true
    }
  ]
}
```

---

## Personas

### Listar Personas
**Endpoint:** `GET /api/personas/personas/`

**Response:**
```json
{
  "count": 0,
  "next": null,
  "previous": null,
  "results": []
}
```

### Crear Persona
**Endpoint:** `POST /api/personas/personas/`

**Request:**
```json
{
  "per_nombres": "Juan Carlos",
  "per_apelpat": "González",
  "per_apellmat": "Pérez",
  "per_rut": "12345678-9",
  "per_fec_nac": "1990-05-15",
  "per_nacionalidad": "Chilena",
  "per_telefono": "+56912345678",
  "per_email": "juan.gonzalez@example.com"
}
```

---

## Cursos

### Listar Cursos
**Endpoint:** `GET /api/cursos/cursos/`

**Response:**
```json
{
  "count": 0,
  "next": null,
  "previous": null,
  "results": []
}
```

### Crear Curso
**Endpoint:** `POST /api/cursos/cursos/`

**Request:**
```json
{
  "cur_codigo": "C2024-001",
  "cur_descripcion": "Curso de Formación Básica",
  "tcu_id": 1,
  "cur_modalidad": 1,
  "cur_tipo_curso": 1,
  "cur_cuota_con_almuerzo": 50000,
  "cur_cuota_sin_almuerzo": 40000,
  "cur_estado": 1
}
```

---

## Pagos

### Listar Pagos
**Endpoint:** `GET /api/pagos/pagos/`

**Response:**
```json
{
  "count": 0,
  "next": null,
  "previous": null,
  "results": []
}
```

---

## Proveedores

### Listar Proveedores
**Endpoint:** `GET /api/proveedores/proveedores/`

**Response:**
```json
{
  "count": 0,
  "next": null,
  "previous": null,
  "results": []
}
```

### Crear Proveedor
**Endpoint:** `POST /api/proveedores/proveedores/`

**Request:**
```json
{
  "prv_razon_social": "Proveedor Scout Ltda.",
  "prv_rut": "76123456-7",
  "prv_direccion": "Av. Providencia 1234",
  "prv_telefono": "+56223456789",
  "prv_email": "contacto@proveedorscout.cl",
  "prv_vigente": true
}
```

---

## Paginación

Todos los endpoints de listado usan paginación automática con 20 items por página.

**Ejemplo de respuesta paginada:**
```json
{
  "count": 45,
  "next": "http://localhost:8000/api/geografia/comunas/?page=2",
  "previous": null,
  "results": [...]
}
```

Para navegar:
- `?page=2` - Segunda página
- `?page_size=50` - Cambiar tamaño de página

---

## Filtros y Búsqueda

Muchos endpoints soportan filtrado via query parameters:

### Ejemplos:
```
GET /api/geografia/provincias/?reg_id=7
GET /api/geografia/comunas/?pro_id=1
GET /api/geografia/distritos/?zon_id=1
GET /api/geografia/grupos/?dis_id=1
```

---

## Códigos de Estado HTTP

- `200 OK` - Solicitud exitosa (GET, PUT, PATCH)
- `201 Created` - Recurso creado exitosamente (POST)
- `204 No Content` - Eliminación exitosa (DELETE)
- `400 Bad Request` - Datos inválidos en la solicitud
- `401 Unauthorized` - No autenticado
- `403 Forbidden` - No autorizado
- `404 Not Found` - Recurso no encontrado
- `500 Internal Server Error` - Error del servidor

---

## Documentación Interactiva

Para explorar la API de forma interactiva:

- **Swagger UI**: http://localhost:8000/api/docs/
- **ReDoc**: http://localhost:8000/api/redoc/
- **Schema JSON**: http://localhost:8000/swagger.json

---

## Ejemplos con cURL

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

### Listar Regiones
```bash
curl -X GET http://localhost:8000/api/geografia/regiones/ \
  -H "Authorization: Bearer <access_token>"
```

### Crear Comuna
```bash
curl -X POST http://localhost:8000/api/geografia/comunas/ \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "pro_id": 1,
    "com_descripcion": "Las Condes",
    "com_vigente": true
  }'
```

---

## Rate Limiting

La API tiene límites de tasa configurados:
- **Usuarios anónimos**: 100 requests/hora
- **Usuarios autenticados**: 1000 requests/hora

Si excedes el límite, recibirás un error `429 Too Many Requests`.
