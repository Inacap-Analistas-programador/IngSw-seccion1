# Backend repair checklist & Demo guide (Ricardo Sanhueza)

Fecha: 2025-10-25

Este documento centraliza los pasos técnicos para arreglar el backend en producción/Docker, el checklist de la demo de Ricardo y las guías por grupo para avanzar en el sprint.

## Resumen rápido — Qué necesitamos ahora

- Docker Desktop funcionando en tu máquina (Windows).
- Imagen Docker `sgics-backend` reconstruida con `DJANGO_SETTINGS_MODULE=scouts_platform.settings.production`.
- Contenedor corriendo y migraciones aplicadas.
- Superuser creado y datos de ejemplo insertados.
- `collectstatic` ejecutado y `staticfiles/` con los assets del admin presentes (verificado en repo).
- Acceso al admin y comprobación de estilos (abrir DevTools para ver 404/403).

## Paso a paso: Arreglar el backend (rápido)

1. Inicia Docker Desktop en Windows.
2. En PowerShell, ve al directorio `IngSw-seccion1/backend` y reconstruye la imagen:

```powershell
cd C:\Users\Ricardo\project\IngSw-seccion1\backend
docker build -t sgics-backend -f Dockerfile .
```

3. Ejecuta el contenedor (mapear puertos y exponer variables si quieres):

```powershell
docker run -d --name sgics-backend-test -p 8000:8000 \
  -e DJANGO_SETTINGS_MODULE=scouts_platform.settings.production \
  sgics-backend
```

4. Ejecuta migraciones dentro del contenedor y crea superuser:

```powershell
docker exec -it sgics-backend-test python manage.py migrate --noinput
docker exec -it sgics-backend-test python manage.py createsuperuser --username admin --email admin@local
```

5. (Opcional) Forzar collectstatic si necesitas regenerar:

```powershell
docker exec -it sgics-backend-test python manage.py collectstatic --noinput
```

6. Abre en tu navegador `http://localhost:8000/admin/`.
   - Si el admin sale sin estilos: abre DevTools (F12) > Network y revisa 404 en rutas `/static/admin/...`.
   - Si ves 404, confirma que `STATIC_ROOT` dentro del contenedor contiene `/app/staticfiles/admin/...`.

7. Logs y diagnósticos:

```powershell
docker logs sgics-backend-test --tail 200
```

Si ves errores TypeError/ImportError: revisa `docker build` output, `pip install` logs y `requirements.txt`.

## Checklist de la demo 

Objetivo: demo funcional (5 min) del flujo: login → crear curso → preinscribir → pagar → dashboard.

Prioridad: alta.

Tareas (marcar cuando esté listo):

1. Entorno listo (container corriendo y admin accesible).
   - Criterio: puedo hacer login en `/admin/` con superuser.
2. Datos de ejemplo cargados o script para crear datos:
   - Script mínimo `scripts/seed_demo.py` (crear 1 curso, 1 usuario alumno, 1 pago simulado).
3. Script paso a paso para la demo (comandos y clicks):
   - Login en admin → Crear course (titulo, rama, cupo) → API: preinscripcion (POST) → Simular pago (POST a /api/payments/) → Ver dashboard.
4. Crear un superuser de demo con credenciales cortas y seguras temporalmente.
5. Preparar slides (3-5) con: objetivo demo, pasos, problemas conocidos y mitigaciones.
6. Grabar un video local de 5 minutos (opcional) y guardar en `docs/demo/`.

Criterios de aceptación de la demo:

- Login exitoso.
- Curso creado y visible en la lista de cursos.
- Preinscripción creada y reflejada en la base de datos.
- Pago marcado como completado y el dashboard muestra la inscripción.

## Guía por grupos (1–2 semanas, entregables y prioridades)

Lista de grupos (según asignación sprint):

- GRUPO I — Usuarios y Roles (RBAC)
- GRUPO A — Cursos y Catálogo Territorial
- GRUPO B — Pagos y Dashboard
- GRUPO H — Preinscripciones y Archivos
- GRUPO C — DevOps, Personas, Infra

Para cada grupo: objetivo corto, dependencias y checklist mínimo.

### GRUPO I — Usuarios y Roles

Objetivo 1–2 semanas: Modelo User/Role/RoleAssignment y endpoints CRUD.

Checklist:
- Modelos implementados + migraciones.
- Serializers y ViewSets list/create/update/delete.
- Tests (pytest) para endpoints principales.
- Documentación OpenAPI mínima.

Dependencias: ninguno crítico, pero integrarse con auth frontend.

### GRUPO A — Cursos y Catálogo Territorial

Objetivo: Modelo Course completo, endpoints y UI básica.

Checklist:
- Modelo con estados DRAFT/ACTIVE/INACTIVE/ARCHIVED.
- ViewSet con acciones custom `activate` y `archive`.
- Endpoint de catálogo territorial con filtros jerárquicos.
- Tests y datos seed.

Dependencias: GRUPO I (usuarios para asignar coordinadores).

### GRUPO B — Pagos y Dashboard

Objetivo: Integrar pasarela (simulada) y dashboard con KPIs.

Checklist:
- Endpoint para recibir notificaciones de pago (webhook simulado).
- Modelo de transacción y conciliación básica.
- Dashboard API agregada (inscripciones, ingresos por periodo).
- Tests de integración para simulación de pago.

Dependencias: GRUPO H (preinscripciones) y GRUPO A (cursos).

### GRUPO H — Preinscripciones y Archivos

Objetivo: Wizard de preinscripción 3 pasos y gestión de archivos.

Checklist:
- Endpoints para creación paso a paso y validación.
- Upload seguro de archivos (Pillow, validaciones extensión/tamaño).
- Tests y políticas de limpieza de archivos temporales.

Dependencias: GRUPO A (cursos), GRUPO B (pagos para completar flujo).

### GRUPO C — DevOps, Personas e Infra

Objetivo: Infra robusta para el sprint: CI, imagen Docker estable, backups.

Checklist:
- CI que ejecute pytest y linter en PRs (ya hay workflows en `.github/workflows`).
- Dockerfile optimizado y reproducible (ya modificado para settings.production).
- Despliegue local con `docker-compose.dev.yml` para pruebas integradas.

Dependencias: Todos los grupos (soporte infra y despliegue).

## Reglas generales y coordinación

- Cada PR debe tener: descripción corta, issue/ID del ticket, pasos para probar y checklist de QA.
- Tests: PRs que afectan lógica backend deben incluir al menos 1 unit test y pasar CI.
- Branch naming: `feature/<grupo>-<descripcion>`, `fix/<issue>`, `hotfix/<descripcion>`.
- Revisiones: al menos 1 reviewer obligatorio antes de merge.
