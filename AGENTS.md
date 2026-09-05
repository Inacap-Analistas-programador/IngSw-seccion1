# AGENTS.md - IngSw-seccion1 Local Orchestrator

## Purpose
- Local execution contract for `02-products/IngSw-seccion1`.
- Inherits root `AGENTS.md` and specializes rules for this repo.
- Priority order: security -> this file -> root `AGENTS.md`.

## Project Context
- System: GIC Scout platform with `backend/` (Django + DRF) and `frontend/` (React + Vite).
- Delivery focus: stability, operational clarity, and maintainable dashboard workflows.
- Visual rule: use this repo only as dashboard reference patterns for the global ecosystem.

## Memory And SDD
- Use Engram as default global memory for context and decisions.
- For significant changes, run SDD with default flow (`/sdd-init` -> `/sdd-new` -> `/sdd-continue` -> `/sdd-apply` -> `/sdd-verify` -> `/sdd-archive`).
- Default artifact persistence is `engram`; use `openspec` only when file artifacts are explicitly requested.

## Build, Lint, And Test Commands

### Backend (`backend/`)
- Install: `pip install -r requirements.txt`
- Dev server: `python manage.py runserver`
- All tests: `pytest`
- Single file: `pytest app/tests/test_example.py`
- Single test: `pytest app/tests/test_example.py::test_name -q`

### Frontend (`frontend/`)
- Install: `npm install`
- Dev: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Lint fix: `npm run lint:fix`
- Format write: `npm run format`
- Format check: `npm run format:check`
- Test: `npm run test`
- Single file: `npm run test -- src/test/GestionPagos.test.jsx`
- Single test by name: `npm run test -- -t "renderiza pagos"`
- Coverage: `npm run test:coverage`

## Visual Contract
- Keep dashboard hierarchy strong and instantly scannable.
- Prefer dark analytical surfaces with subtle grids and crisp legends.
- Keep chart semantics consistent:
  - success: green
  - warning: amber
  - alert: red
  - informative: blue/cyan
- Favor informative dashboards over decorative charts.

## Code Style
- Imports: external, then aliases/internal, then local relative.
- Avoid deep relative imports if aliases are available.
- Keep components modular and avoid huge god-components.
- Remove unused imports/exports in touched files.

## Types And Validation
- Backend enforces business validation; frontend never replaces it.
- Add type hints in edited Python business logic.
- In frontend, keep prop/state/service contracts explicit.

## Error Handling
- Never swallow critical failures.
- Surface actionable errors to the UI.
- Keep logs useful without exposing secrets.

## Quality Bar
- Every meaningful bug fix should include a regression test.
- Run narrow checks first, then broader suite before merge.
- If tests cannot run, state exactly what was not verified and why.

## Security
- No secrets in code.
- Review auth, CORS, and permission effects before shipping auth related changes.
- Treat financial and personal data flows as high risk.

## Mandatory Persistence Policy
- Start Gate (required before implementation): declare Mode A/B/C and artifact_store.mode (engram/openspec/hybrid/none).
- Engram-first rule: run an Engram context check before coding; if relevant context exists, use it instead of rediscovery.
- Default store policy: use engram by default; use openspec only when file artifacts are explicitly required; use hybrid only when both memory and file artifacts are required; use none only for intentionally ephemeral sessions.
- SDD policy by mode: Mode A can be direct execution plus Engram close note; Mode B requires SDD flow (/sdd-new -> /sdd-continue -> /sdd-apply -> /sdd-verify); Mode C requires full SDD plus review gate (GGA when risk is high).
- End Gate (required before closure): persist durable decisions (what, why, constraints, next action) to Engram or OpenSpec according to artifact_store.mode.
- Enforcement: if mode/store declaration or persistence step is missing, stop and complete those steps before proceeding.

## Personal Skills Policy
- Always check and apply relevant personal skills from 00-core/skills/catalog.md before execution.
- Core personal skills to keep active: coldev-focus-lock, coldev-weekly-momentum, coldev-sales-clarity, coldev-ux-seo-check, coldev-python-delivery.
- If a task touches focus, communication, UX/SEO, or Python delivery quality, explicitly load the matching skill and follow it.

