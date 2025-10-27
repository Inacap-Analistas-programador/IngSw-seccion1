## Sprint N2 — Calendario y Guía Git/PR

Fecha del Sprint:
- Duración: 2 semanas (10 días laborables)
- Inicio: lunes 2025-10-13
- Fin: viernes 2025-10-24
- Demo / Revisión: lunes 2025-10-27
- Retrospectiva: martes 2025-10-28

### Objetivo del Sprint
Entregar el flujo mínimo de preinscripciones (SGICS-401): API para crear preinscripciones en estado `draft` y el primer paso del wizard en frontend (selección de curso + búsqueda por RUT). Adicionalmente, avanzar en endpoints de pagos básicos si hay capacidad.

### Prioridades (ordenadas)
1. SGICS-401 — API crear preinscripción + búsqueda por RUT (Backend + Frontend step 1).
2. Endpoint `/api/courses/` para listar cursos activos.
3. Utilitarios de normalización/validación de RUT (backend y frontend).
4. Integración temporal Pinia store para wizard y tests básicos (Vitest + pytest).
5. Endpoints de Pagos mínimos si tiempo (SGICS-501/502).

### Plan recomendado por días
- Día 1 (Kickoff): configurar ramas, revisar backlog, crear branches feature. Implementar modelo `Preinscription` (migrations).
- Día 2-4: API `GET /api/persons/search/?rut=...` y `POST /api/preinscriptions/` con validaciones; tests backend básicos.
- Día 5-7: Frontend `PreinscriptionStep1.vue`, Pinia store temporal, RUT autocomplete UX y tests Vitest.
- Día 8: Lint, fixes, integración local de CI checks, preparar PRs.
- Día 9-10: Correcciones por review, merge a `develop`, preparar demo.

### Entregables del Sprint
- PR(s) mergeados en `develop` con: modelo + endpoints + componente frontend paso 1.
- Tests unitarios para los cambios (pytest y Vitest) con ejecución local exitosa.
- Documentación mínima en `docs/` con ejemplos de request/response.

## Guía práctica de Git (convenciones y comandos PowerShell)

Convenciones principales:
- Ramas features: `feature/SGICS-<ticket>-shortCamelCase` (ej: `feature/SGICS-401-preinscriptionApi`).
- Ramas por equipo: `team/<group>-sprint2` para sincronizaciones mayores.
- Prefijo en commits: `SGICS-<ticket>: <breve descripción>` (ej: `SGICS-401: add preinscription model and migration`).
- PR title: `[SGICS-401] Título corto`.

Requisitos en repo:
- Proteger `main` y `develop` con branch protection rules: require PR approval (min 1), CI green, no force pushes.

Ejemplo de flujo (PowerShell):
```powershell
# Clonar y preparar
git clone https://github.com/<org>/<repo>.git
cd project

# Crear branch desde develop
git checkout develop
git pull origin develop
git checkout -b feature/SGICS-401-preinscriptionApi

# Hacer cambios, tests y commits
git add .
git commit -m "SGICS-401: add Preinscription model, serializer and tests"

# Rebase/merge latest develop (recomendado rebase)
git fetch origin
git rebase origin/develop

# Push de la feature
git push -u origin feature/SGICS-401-preinscriptionApi
```

Si usan `gh` (GitHub CLI) para crear PRs:
```powershell
gh pr create --base develop --head feature/SGICS-401-preinscriptionApi --title "[SGICS-401] API crear preinscripción" --body "Revisar endpoints: POST /api/preinscriptions/ and GET /api/persons/search/. Tests included."
```

### Mensajes de commit recomendados
- Formato: `SGICS-<ticket>: <acción> <breve descripción>`
- Ejemplos:
  - `SGICS-401: add Preinscription model and migration`
  - `SGICS-401: implement persons search by RUT`
  - `SGICS-401: add frontend PreinscriptionStep1 and store`

## Checklist mínima para Pull Requests (DoD)
- [ ] Title incluye ticket (SGICS-XXX).
- [ ] PR description: resumen + endpoints y ejemplos request/response.
- [ ] Tests: unitarios nuevos o actualizados y passing.
- [ ] Lint/format aplicados (black/isort, prettier/eslint según corresponda).
- [ ] No secretos ni credenciales en el diff.
- [ ] Migrations incluidas si hubo cambios en modelos.
- [ ] Documentación breve en `docs/` (ej. ejemplo CURL o JSON de muestra).
- [ ] Asignado reviewer (Ricardo) y al menos 1 approver.

## Comandos rápidos para validar antes de crear PR

Backend (PowerShell — en `codigo/backend`):
```powershell
cd codigo/backend
python -m venv .venv; .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
pytest -q
```

Frontend (PowerShell — en `codigo/frontend`):
```powershell
cd codigo/frontend
npm ci
npm run lint
npm run test
```

## Ejemplo paso a paso para SGICS-401 (resumido)
1. Desde `develop` crear branch `feature/SGICS-401-preinscriptionApi`.
2. Backend:
   - Crear modelo `Preinscription` con fields `person (FK)`, `course (FK)`, `status` (draft/submitted), `created_at`.
   - Serializers, ViewSet/endpoint `POST /api/preinscriptions/` y `GET /api/persons/search/?rut=`.
   - Tests: crear preinscripción con persona existente y nueva; validar rut.
3. Frontend:
   - Component `PreinscriptionStep1.vue` con select de cursos y campo RUT.
   - Store temporal (Pinia) para guardar datos entre pasos.
   - Tests (Vitest) para el componente.
4. Ejecutar tests, fix, push y abrir PR.

## Notas y recomendaciones
- Mantener PRs atómicos por ticket cuando sea posible; si un ticket requiere cambios backend+frontend, puede haber 2 PRs enlazados entre sí.
- Para cambios en DB, revisar impacto en migraciones y coordinar merges para evitar conflictos de migra.
- Añadir utilitarios de validación RUT en `codigo/backend/utils/rut.py` y en `codigo/frontend/src/utils/rut.ts`.

---

Archivo creado: `docs/sprint-schedule-and-git-guide.md` — 2025-10-07
