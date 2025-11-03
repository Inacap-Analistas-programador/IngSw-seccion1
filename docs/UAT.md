# Pruebas de Aceptación de Usuario (UAT)

Este documento guía la validación manual de los flujos críticos del sistema SGICS desde la perspectiva del negocio. Está pensado para ejecutarse en entorno de desarrollo local.

## Alcance y criterios de aceptación

- Cobertura mínima de flujos:
  - Autenticación (login y refresh JWT)
  - Salud del sistema (health checks)
  - Personas (búsqueda y listado)
  - Cursos (listado y navegación)
  - Preinscripciones (alta básica)
  - Pagos (listado; alta opcional si cuentas con datos relacionados)
  - Archivos (subida y listado)
- Criterios de aceptación generales:
  - Respuestas HTTP correctas (2xx para casos felices, 4xx/5xx manejados con mensajes comprensibles).
  - UI carga sin errores en consola y muestra estados vacíos o datos esperados.
  - No hay bloqueos de permisos inesperados para usuarios con rol adecuado.

## Preparación del entorno

1) Backend
- Activar entorno virtual y dependencias:
  - Windows PowerShell
  - Ejecutar desde la carpeta `backend/`:
    - `pip install -r requirements.txt`
- Migrar base de datos:
  - `python manage.py migrate`
- Crear usuario admin (si no existe):
  - `python manage.py createsuperuser`
- Levantar servidor en desarrollo:
  - `python manage.py runserver`

2) Frontend
- Desde `frontend/`:
  - Instalar dependencias: `npm install`
  - Ejecutar: `npm run dev`
- Acceder vía navegador a la URL que indique Vite (por defecto `http://localhost:3000`).

Notas
- En desarrollo, si no configuras variables `DB_*`, el backend usa SQLite (`db.sqlite3`).
- Debug Toolbar está disponible en `http://127.0.0.1:8000/__debug__/` (solo desarrollo).

## Datos de prueba mínimos (recomendado)

Puedes crear los datos desde el admin de Django (`/admin/`) o usando los endpoints de la API (DRF).
- Usuario admin: creado con `createsuperuser`.
- Personas y Cursos: crea al menos 1 Persona y 1 Curso para probar preinscripciones y pagos.
- Conceptos contables (pagos): crea un concepto contable si vas a probar alta de comprobantes.

## Escenarios UAT (paso a paso)

A. Salud del sistema
- Paso: Abrir `http://127.0.0.1:8000/healthz/`.
- Esperado: HTTP 200 con información básica de estado.

B. Autenticación (API)
- Paso: POST `http://127.0.0.1:8000/api/auth/login/` con `username` y `password` válidos.
- Esperado: HTTP 200 con `access` y `refresh`.
- Paso: POST `http://127.0.0.1:8000/api/auth/refresh/` con `refresh` válido.
- Esperado: HTTP 200 con nuevo `access`.

C. Personas
- Paso: GET `http://127.0.0.1:8000/api/personas/`.
- Esperado: HTTP 200 con lista (vacía o con datos).
- Paso: GET `http://127.0.0.1:8000/api/personas/buscar/?rut=12345678-9` (ajusta el RUT a tus datos).
- Esperado: HTTP 200; resultados coincidentes o lista vacía sin errores.

D. Cursos
- Paso: GET `http://127.0.0.1:8000/api/cursos/`.
- Esperado: HTTP 200 con lista de cursos (vacía o con datos).

E. Preinscripciones (mínimo)
- Precondición: Tener al menos 1 Persona y 1 Curso.
- Paso: POST `http://127.0.0.1:8000/api/preinscripciones/` con los IDs de Persona y Curso requeridos por el modelo.
- Esperado: HTTP 201; el objeto queda accesible por GET.

F. Pagos
- Paso: GET `http://127.0.0.1:8000/api/pagos/` (revisa subrutas definidas en `payments/urls.py`).
- Esperado: HTTP 200 con lista (vacía o con datos).
- Opcional (si cuentas con datos relacionados): crear `PagoPersona` o `ComprobantePago` vía POST.

G. Archivos
- Paso: POST `http://127.0.0.1:8000/api/archivos/` con un archivo de prueba (multipart/form-data).
- Esperado: HTTP 201; luego GET devuelve el archivo en la lista y se puede descargar.

H. UI (frontend)
- Paso: Iniciar sesión en la app (vista de login) con credenciales válidas.
- Esperado: redirección al dashboard/página principal; no hay errores de CORS.
- Paso: Navegar a secciones Personas, Cursos, Pagos, Preinscripciones.
- Esperado: Listas cargan, filtros básicos funcionan y estados vacíos se muestran claramente.

## Lista de verificación (checklist)

- [ ] Health check OK (200)
- [ ] Login JWT OK (access y refresh)
- [ ] Personas: listado OK, búsqueda OK
- [ ] Cursos: listado OK
- [ ] Preinscripción: alta mínima OK
- [ ] Pagos: listado OK (y alta opcional)
- [ ] Archivos: subida/listado OK
- [ ] UI: navegación básica sin errores

## Registro de incidencias

Si algún paso falla, anotar:
- Paso y endpoint/vista implicada
- Datos enviados (sin credenciales sensibles)
- Respuesta (HTTP status y mensajes)
- Capturas de pantalla/logs de consola si aplica

## Notas finales

- Estas pruebas no sustituyen los tests automatizados; son un complemento para validar criterios de negocio.
- Para ambientes distintos a desarrollo (QA/producción), replica este plan ajustando URLs y credenciales, y deshabilitando Debug Toolbar.

## Resultados UAT — 2025-11-03

Contexto
- Entorno: desarrollo local con `DJANGO_SETTINGS_MODULE=scouts_platform.settings.development` y DB SQLite por defecto.
- Método: verificación con el cliente de pruebas de Django/DRF (sin necesidad de levantar servidor externo), para evitar problemas de red locales.

Resumen de resultados
- Health check: HTTP 200
- Login JWT: HTTP 200; tokens emitidos (access: 276 chars, refresh: 277 chars)
- Personas (GET /api/personas/): HTTP 200
- Cursos (GET /api/cursos/): HTTP 200

Observaciones
- Se muestra una advertencia de `pkg_resources` proveniente de `djangorestframework-simplejwt` cuando `setuptools>=81`. Es benigna; si molesta en entornos más estrictos, se puede fijar temporalmente `setuptools<81` o esperar a una versión que elimine ese import.
- El logging SQL/Debug Toolbar confirman consultas resueltas correctamente y joins esperados tras optimizaciones con `select_related()`.

Evidencia breve (log)
- health_status=200, login_status=200, personas_status=200, cursos_status=200.
