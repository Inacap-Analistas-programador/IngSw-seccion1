# Documentación y Código del Proyecto

Este repositorio centraliza los artefactos funcionales (código) y toda la documentación de negocio y técnica.

## Estructura de carpetas
- `codigo/backend`: API Django REST Framework
- `codigo/frontend`: Aplicación Vue 3 + Vite
- `docs/`
	- `legacy/`: documentación histórica migrada (análisis, sprints, informes, etc.)
	- `assets/diagramas y interfaces`: recursos gráficos y mockups
	- `schema/`: reportes y artefactos de base de datos (por ejemplo `SCHEMA_REVIEW_2025-10-01.md`)

> Nota: Todo archivo o carpeta que no sea código debe residir bajo `docs/` para evitar ruido en la raíz.

## Pruebas (backend y frontend)

Script unificado (ubicado en `codigo/run-tests.ps1`):

- Ejecutar todo: `pwsh ./codigo/run-tests.ps1 -All`
- Solo backend: `pwsh ./codigo/run-tests.ps1 -Backend`
- Solo frontend: `pwsh ./codigo/run-tests.ps1 -Frontend`

Backend: usa `scouts_platform.settings_test` (SQLite en memoria) y prepara dependencias vía `pip install -r requirements.txt`.
Frontend: Vitest (`jsdom`) con pruebas ubicadas en `codigo/frontend/src/*.test.ts`. El build se valida con `npm run build` desde la misma carpeta.

## Quickstart (Windows PowerShell)

- Backend (Django, modo desarrollo):
  - Instalar dependencias
  - Crear/usar SQLite local para pruebas
  - Ejecutar servidor en http://localhost:8000

```powershell
# Desde la raíz del repo
cd "codigo/backend"
python -m venv .venv
. .venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

- Frontend (Vite dev server):

```powershell
cd "codigo/frontend"
npm ci
npm run dev
```

- Pruebas unificadas (scripts helper):

```powershell
# Ejecutar ambos (backend + frontend)
pwsh ./codigo/run-tests.ps1 -All

# Solo backend (pytest con coverage)
pwsh ./codigo/run-tests.ps1 -Backend

# Solo frontend (vitest con coverage)
pwsh ./codigo/run-tests.ps1 -Frontend
```

- Contenedores (opcional):

```powershell
cd "codigo"
docker compose up -d --build
```

Notas:
- Variables de entorno útiles: `DJANGO_SETTINGS_MODULE=scouts_platform.settings`, `DEBUG=1`, `ALLOWED_HOSTS=*`.
- Si usas SQL Server, aplica los scripts de `codigo/backend/db/*.sql` en tu instancia y ajusta `DATABASE_URL` en variables de entorno.

## Última verificación rápida (01 Oct 2025)
- `npm run build` en `codigo/frontend`: ✅
- `npm run test` en `codigo/frontend`: ✅
- Pendiente cuando se modifique el backend: ejecutar `pwsh ./codigo/run-tests.ps1 -Backend`
