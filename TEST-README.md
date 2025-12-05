# Tests E2E de Preinscripción

Scripts para probar el flujo completo de preinscripción (backend y frontend).

## Requisitos

```bash
npm install axios form-data
```

## Configuración

Asegúrate de que tanto el backend como el frontend estén corriendo:

```bash
# Terminal 1 - Backend
cd backend
python manage.py runserver

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

## Ejecución

### Test Completo E2E

```bash
# Desde la raíz del proyecto
node test-preinscripcion-e2e.js
```

### Con URLs personalizadas

```bash
BACKEND_URL=http://localhost:8000 FRONTEND_URL=http://localhost:5173 node test-preinscripcion-e2e.js
```

## Lo que prueba

### 1. Backend - API de Personas
- ✓ Crear nueva persona
- ✓ Buscar persona por RUT
- ✓ Obtener persona por ID
- ✓ Actualizar datos de persona

### 2. Backend - API de Preinscripción
- ✓ Crear preinscripción
- ✓ Listar preinscripciones
- ✓ Obtener preinscripción por ID
- ✓ Actualizar estado de preinscripción

### 3. Integración
- ✓ Frontend accesible
- ✓ Ruta de preinscripción disponible

### 4. Limpieza
- ✓ Eliminar datos de prueba

## Salida Esperada

```
============================================================
  SCRIPT DE TESTEO E2E - PREINSCRIPCIÓN
============================================================

ℹ Backend URL: http://localhost:8000
ℹ Frontend URL: http://localhost:5173

=== TESTEO DE BACKEND - API DE PERSONAS ===

→ Test: Crear nueva persona en backend
✓ PASS: Crear nueva persona en backend

→ Test: Buscar persona por RUT
✓ PASS: Buscar persona por RUT

...

============================================================
  RESUMEN DE TESTS
============================================================
  Total:  10
  Passed: 10
  Failed: 0
============================================================
```

## Troubleshooting

### Backend no responde
- Verifica que el servidor Django esté corriendo en el puerto 8000
- Revisa los logs del servidor

### Frontend no accesible
- Verifica que Vite esté corriendo en el puerto 5173
- Revisa la configuración de CORS

### Tests fallan en crear persona
- Verifica que la base de datos esté configurada correctamente
- Revisa que todos los campos requeridos estén en el modelo
