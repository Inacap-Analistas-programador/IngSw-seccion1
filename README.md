# SGICS — Sistema de Gestión Integral de Cursos Scout

Estructura principal
--------------------
- `IngSw-seccion1/` — principal subproyecto con frontend y backend:
  - `frontend/` — aplicación Vue 3 + TypeScript + Vite.
  - `backend/` — proyecto Django con REST API y endpoints JWT.
- `docs/` — documentación, guías y archivos históricos.

Requisitos (desarrollo)
-----------------------
- Windows 10/11 (PowerShell)
- Python 3.10+ (se usa 3.14 en el equipo de desarrollo)
- Node.js 16+ and npm/yarn/pnpm
- Git

Entrar al directorio del proyecto
-------------------------------
Abre PowerShell en la carpeta raíz del repo:

```powershell
cd C:\Users\Ricardo\project\IngSw-seccion1
```

Configurar entorno Python (recomendado)
-------------------------------------
El proyecto usa un entorno virtual `.venv` en el nivel de `IngSw-seccion1`.

Si no existe, crea y activa el entorno (PowerShell):

```powershell
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install --upgrade pip
pip install -r backend\requirements.txt
```

Nota: el script `run-dev.ps1` intenta usar `.venv` preferentemente pero también cae
en un intérprete configurado por VS Code o `py -3` si no encuentra `.venv`.

Iniciar servidores en desarrollo
-------------------------------
Se proporciona un script PowerShell para levantar backend + frontend en ventanas separadas.

```powershell
.\run-dev.ps1
```

Qué hace el script
- Crea/usa `.venv` (si no existe, lo crea con `py -3`)
- Lanza el backend Django (manage.py runserver) en una ventana
- Espera un momento y lanza el frontend Vite en otra ventana

Frontend (desarrollo)
---------------------
Desde `IngSw-seccion1/frontend`:

```powershell
# si no instalaste paquetes
npm install
# o pnpm install
npm run dev
```

El frontend sirve en `http://localhost:3000` (puede variar según configuración de Vite).

Backend (desarrollo)
--------------------
Desde `IngSw-seccion1/backend` (con `.venv` activado):

```powershell
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

Endpoints importantes
- `POST /api/auth/login/` — TokenObtainPairView (espera `username` + `password` y devuelve `access` y `refresh`).
- `/api/files/` — Endpoints del módulo archivos (backend).

Problemas comunes y soluciones rápidas
------------------------------------
- El frontend no puede solicitar al backend → asegúrate de que el backend corre en :8000 y que CORS está habilitado.
- Token no guardado / no redirige tras login → localStorage usa la clave `access_token`. Si ves que no se guarda, revisa `frontend/src/stores/auth.ts`.
- `No match found for location with path "/reset-request"` → es una advertencia del router cuando una ruta no existe; revisa `frontend/src/router/index.ts`.
- Si ves errores de TypeScript por `@/lib/utils` faltante, crea `frontend/src/lib/utils.ts` con un helper `cn()` (ya incluido en el repo reciente).

Contribuir
---------
- Haz fork y PR hacia la rama `main` del repo.
- Sigue las convenciones en `docs/` y agrega descripciones en los PRs.

Contacto
-------
Para dudas técnicas, abre un issue en el repositorio o revisa `docs/README.md`.

----

## Actualización de Django — Nov 2025

Resumen rápido
- Versión objetivo: Django 5.2.7 (ultima estable al 2025-11-03).
- Estado: actualizado e instalado en el entorno virtual del proyecto.
- Migraciones: generadas/verificadas y aplicadas correctamente (SQLite para dev/tests).
- Pruebas: se ejecutaron checks de sistema y smoke tests mínimos; la suite de tests funcionales está deshabilitada en `_tests_disabled/` y no se ejecuta por defecto.

que hice
1) Investigacion de version
  - Se verificó en PyPI que la ultima version estable es Django 5.2.7.
  - El archivo `backend/requirements.txt` ya estaba fijado a `Django==5.2.7`, por lo que no fue necesario cambiar el pin.

2) Instalacion/actualización de dependencias
  - Se uso el entorno virtual `.venv` y se instalo todo con `pip install -r backend/requirements.txt`.
  - # Nota: `setuptools` ≥81 emite una advertencia por `pkg_resources` (de `simplejwt`). si quieren ustedes, se puede fijar `setuptools<81` temporalmente.

3) Migraciones y verificacion
  - Se creo el directorio `backend/logs/` para evitar errores del logger al iniciar Django.
  - Se ejecut0 `python manage.py makemigrations` (sin cambios pendientes) y `python manage.py migrate` usando `DJANGO_SETTINGS_MODULE=scouts_platform.settings.base` (SQLite por simplicidad local). Todas las migraciones aplicaron OK.
  - `python manage.py check` no reportó problemas.

4) Ajustes de testing
  - Se agrego `scouts_platform/settings/testing.py` que hereda de `base`, usa SQLite y acelera hashing para pruebas.
  - Se corrigió `backend/pytest.ini` para eliminar rutas inexistentes y medir cobertura sobre los paquetes reales del proyecto.
  - Se corrigió `backend/conftest.py` (import obsoleto `apps.payments` → `payments`).
  - Importante: actualmente no hay tests activos (los archivos `tests.py` de apps están vacíos). Por eso, cuando ejecutamos `pytest` no ingresan los casos y falla lo de la cobertura (80%).

Como correr verificación rápida
```powershell
# Desde la carpeta backend con .venv activo
$env:DJANGO_SETTINGS_MODULE="scouts_platform.settings.base"; python manage.py migrate
$env:DJANGO_SETTINGS_MODULE="scouts_platform.settings.base"; python manage.py check

# Para pruebas con settings de testing
$env:DJANGO_SETTINGS_MODULE="scouts_platform.settings.testing"; python -m pytest -q
```

Bitacora de cambios
- Install: Django 5.2.7 instalado.
- Nuevos archivos: `backend/scouts_platform/settings/testing.py`.
- Cambios: `backend/pytest.ini` (rutas/cobertura), `backend/conftest.py` (imports), creación de `backend/logs/`.

## Auditoría y optimización de consultas (Django Debug Toolbar)

Objetivo
- Identificar N+1 y consultas ineficientes; medir tiempos y número de queries por vista.

Lo que se habilitó
- Se añadió `django-debug-toolbar` (solo desarrollo) y se integró en `settings.development`:
  - `INSTALLED_APPS += ['debug_toolbar']`
  - `MIDDLEWARE = ['debug_toolbar.middleware.DebugToolbarMiddleware', ...]`
  - `INTERNAL_IPS = ['127.0.0.1']`
  - URLs condicionales en `scouts_platform/urls.py` para `__debug__/` cuando `DEBUG=True`.
- Logging SQL en desarrollo: `LOGGING['loggers']['django.db.backends']` a `DEBUG` (muestra consultas y tiempos en consola).

Cómo usar
```powershell
# 1) Activar el venv raíz
& "C:\Users\PC\Desktop\IngSw-seccion1-main (1)\.venv\Scripts\Activate.ps1"

# 2) Ejecutar backend con settings de desarrollo (requiere variables DB_* en .env)
$env:DJANGO_SETTINGS_MODULE="scouts_platform.settings.development"; python manage.py runserver

# 3) Abrir el panel en el navegador al navegar por cualquier vista
#    La barra aparecerá a la derecha; también puedes entrar a: http://127.0.0.1:8000/__debug__/
```

Optimización aplicada
- Se añadieron `select_related()` en viewsets de `payments` y `personas` para evitar N+1 en listados y detalle.
  - Payments: `PagoPersona`, `PagoCambioPersona`, `Prepago`, `ComprobantePago`, `PagoComprobante`.
  - Personas: `Persona`, `PersonaIndividual`, `PersonaNivel`, `PersonaFormador`.

Sugerencias para continuar
- En vistas con relaciones many-to-many o reverse FK grandes, agregar `prefetch_related()` con `Prefetch` selectivo.
- Revisar panel SQL de Debug Toolbar por vistas “calientes” y agregar índices donde aplique (en MySQL, revisar EXPLAIN).
- Para perfiles más detallados, se puede integrar `django-silk` como opción adicional.
