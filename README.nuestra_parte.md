# Lo que hicimos (para portar a otro proyecto)

Este paquete reúne solo "nuestra parte" para que puedas copiarla a otro repo.

## CI / Sonar
- CI/sonarqube.yml → workflow de GitHub Actions que analiza backend y frontend, y bloquea PRs con Quality Gate.
- sonar/backend.sonar-project.properties → config Sonar del backend (Django) con projectKey.
- sonar/frontend.sonar-project.properties → config Sonar del frontend (Vue) con projectKey.

Secrets requeridos en el repo:
- SONAR_HOST_URL (ej. https://sonarcloud.io)
- SONAR_TOKEN (token de proyecto/usuario)

## Backend (Django)
- backend/settings_ci.py → settings para CI con SQLite (sin MySQL en CI).
- backend/settings.additions.py → snippets para settings.py: variables de entorno, CORS y DATABASES (MySQL por env vars).
- backend/tests/test_smoke.py → prueba mínima para tener cobertura.

Correr tests con cobertura en Windows PowerShell:
```powershell
# en la raíz del repo
python -m pip install coverage
coverage run SystemScoutsApi\manage.py test --settings=SystemScoutsApi.settings_ci
coverage xml -o SystemScoutsApi\coverage.xml
```

## Frontend (Vue + Vite)
- frontend/vite.config.js → vitest config con jsdom y devtools off en test.
- frontend/package.additions.json → scripts y devDependencies que se agregan al package.json existente.
- frontend/src/App.spec.js → smoke test.

Tests y cobertura (PowerShell):
```powershell
cd SystemScoutsClient
npm run test:coverage
```

## Paso a paso para portar
1) Copia CI/sonarqube.yml a .github/workflows/sonarqube.yml
2) Copia los sonar/*.properties a las carpetas de backend/frontend respectivas.
3) En Django, integra backend/settings.additions.py dentro de tu settings.py y añade backend/settings_ci.py.
4) Copia backend/tests/test_smoke.py a tu app de tests.
5) En el cliente, reemplaza o adapta vite.config.js; fusiona frontend/package.additions.json con tu package.json (scripts y devDependencies) e incorpora frontend/src/App.spec.js.

## Comandos útiles (PowerShell)
```powershell
# Activar venv (si procede)
py -3.13 -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt

# Backend: arrancar server
cd SystemScoutsApi
python manage.py runserver

# Frontend: dev server
cd ..\SystemScoutsClient
npm ci || npm install
npm run dev
```
