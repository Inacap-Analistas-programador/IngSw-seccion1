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
