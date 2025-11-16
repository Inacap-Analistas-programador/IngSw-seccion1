# Guía de Población de Datos en Base de Datos

## Resumen de Cambios

El frontend ha sido actualizado para trabajar **exclusivamente con datos reales de la base de datos** a través de la API REST del backend. Se han eliminado todos los datos mock y los fallbacks a localStorage.

## ¿Qué se eliminó?

1. **Archivo de datos mock**: `/frontend/src/data/samplePersonas.js` - Contenía 5 personas de ejemplo
2. **Fallbacks a localStorage**: Se eliminaron de 19 funciones en `/frontend/src/lib/api.js`
3. **Lógica de sincronización offline**: Función `syncOffline()` que intentaba sincronizar datos locales con la API

## Población de Datos en el Backend

### Opción 1: Seeding Automático (Desarrollo)

El backend incluye un comando de Django para poblar la base de datos con datos de prueba:

```bash
cd backend
python manage.py seed_database
```

Este comando crea:
- ✅ Datos maestros (estados civiles, cargos, niveles, ramas, roles, etc.)
- ✅ Geografía de Chile (regiones, provincias, comunas, zonas, distritos, grupos)
- ✅ Usuarios de prueba (admin, coordinador, dirigente)
- ✅ Personas de ejemplo
- ✅ Cursos de prueba
- ✅ Preinscripciones de ejemplo

**Credenciales creadas:**
- Admin: `admin` / `admin123`
- Coordinador: `coordinador` / `coord123`
- Dirigente: `dirigente` / `dirigente123`

### Opción 2: Script de Inicialización Completa

El repositorio incluye un script que limpia, migra y puebla la base de datos:

```bash
./scripts/init-database.sh
```

Este script:
1. Elimina la base de datos SQLite existente (si existe)
2. Crea y aplica todas las migraciones
3. Ejecuta el seeding de datos iniciales
4. Verifica la instalación

### Opción 3: Datos en Producción

Para producción con MySQL, se recomienda:

1. **Migrar el esquema:**
```bash
cd backend
python manage.py migrate
```

2. **Poblar datos maestros esenciales:**
```bash
python manage.py seed_database --clear
```

3. **Cargar datos reales** desde archivos CSV, JSON o importación manual a través de:
   - Django Admin (`/admin/`)
   - API REST con autenticación (`/api/`)

## Flujo de Datos Actual

```
┌─────────────────────────────────────────────┐
│           Frontend React                    │
│  - NO más localStorage para datos          │
│  - API REST exclusivamente                  │
│  - Errores mostrados al usuario             │
└─────────────────────────────────────────────┘
                    ↕ HTTP
┌─────────────────────────────────────────────┐
│       Backend Django REST API               │
│  - Endpoints CRUD completos                 │
│  - Validaciones de negocio                  │
│  - Autenticación JWT                        │
└─────────────────────────────────────────────┘
                    ↕ ORM
┌─────────────────────────────────────────────┐
│          Base de Datos                      │
│  - SQLite (desarrollo)                      │
│  - MySQL (producción)                       │
│  - Datos persistentes reales                │
└─────────────────────────────────────────────┘
```

## Endpoints API Principales

### Personas
- `GET /api/personas/` - Lista todas las personas
- `POST /api/personas/` - Crear nueva persona
- `GET /api/personas/{id}/` - Obtener persona específica
- `PUT /api/personas/{id}/` - Actualizar persona
- `DELETE /api/personas/{id}/` - Eliminar persona

### Cursos
- `GET /api/cursos/` - Lista todos los cursos
- `POST /api/cursos/` - Crear nuevo curso
- `GET /api/cursos/{id}/` - Obtener curso específico
- `PUT /api/cursos/{id}/` - Actualizar curso

### Preinscripciones
- `GET /api/preinscripciones/` - Lista preinscripciones
- `POST /api/preinscripciones/` - Crear preinscripción

### Pagos
- `GET /api/pagos/pagopersonas/` - Lista pagos
- `POST /api/pagos/pagopersonas/` - Registrar pago
- `GET /api/pagos/comprobantes/` - Lista comprobantes
- `POST /api/pagos/comprobantes/` - Crear comprobante

### Maestros (Datos Catálogo)
- `GET /api/maestros/estados-civiles/`
- `GET /api/maestros/cargos/`
- `GET /api/maestros/niveles/`
- `GET /api/maestros/ramas/`
- `GET /api/maestros/roles/`
- `GET /api/maestros/tipos-curso/`
- `GET /api/maestros/conceptos-contables/`

### Geografía
- `GET /api/geografia/regiones/`
- `GET /api/geografia/provincias/`
- `GET /api/geografia/comunas/`
- `GET /api/geografia/zonas/`
- `GET /api/geografia/distritos/`
- `GET /api/geografia/grupos/`

## Manejo de Errores

El frontend ahora maneja los errores de API de forma explícita:

```javascript
// Antes (con localStorage fallback)
try {
  const response = await api.get('/personas/');
  return response.data;
} catch (err) {
  console.warn('API falló, usando localStorage', err);
  return JSON.parse(localStorage.getItem('personas') || '[]');
}

// Ahora (solo API)
try {
  const response = await api.get('/personas/');
  return response.data;
} catch (error) {
  console.error('Error fetching personas:', error);
  throw error; // El componente maneja el error
}
```

Los componentes muestran mensajes de error apropiados:
- Alertas al usuario sobre problemas de conexión
- Redirección a páginas de error cuando es necesario
- Mensajes claros sobre qué salió mal

## Verificación

Para verificar que el sistema funciona correctamente con datos reales:

1. **Backend debe estar corriendo:**
```bash
cd backend
python manage.py runserver
```

2. **Frontend debe estar corriendo:**
```bash
cd frontend
npm run dev
```

3. **Verificar datos en la base de datos:**
```bash
cd backend
python manage.py shell
>>> from personas.models import Persona
>>> Persona.objects.count()  # Debe mostrar número de personas
```

4. **Probar endpoints en el navegador:**
- API Docs: http://localhost:8000/api/docs/
- Personas: http://localhost:8000/api/personas/
- Cursos: http://localhost:8000/api/cursos/

## Migración de Datos Existentes

Si tienes datos en localStorage que necesitas migrar:

1. Los datos en localStorage del navegador permanecen pero **no se usan**
2. Usa el Django Admin para importar manualmente: http://localhost:8000/admin/
3. O crea un script de migración personalizado usando la API REST

## Soporte

Para más información:
- Ver documentación de API: `/API_DOCUMENTATION.md`
- Ver guía de deployment: `/DEPLOYMENT_GUIDE.md`
- Ver estructura del proyecto: `/ESTRUCTURA_PROYECTO.md`
