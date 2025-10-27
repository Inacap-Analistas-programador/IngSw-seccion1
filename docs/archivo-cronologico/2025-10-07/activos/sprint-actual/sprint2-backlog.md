# Sprint 2 - Backlog (SGICS)

Duración: 2 semanas
Prioridad: Infra/Autenticación, Preinscripciones, Dashboard, Pagos, Archivos

## Epics y Stories (resumen)

### Grupo A — Auth, roles, login
- SGICS-201: authEndpoints — Implementar endpoints auth (login, refresh, logout) con SimpleJWT. (5 pts)
  - Acceptance: POST /api/auth/login => retorna access+refresh; refresh rota; tests.
- SGICS-202: jwtSecurity — Verificación JWT y protección de rutas. (3 pts)
- SGICS-203: roleManagement — CRUD de roles y asignación a usuarios; permiso DRF. (5 pts)

### Grupo B — QA, Pagos, Stats, Docs, Usuarios
- SGICS-501: paymentsAPI — POST /api/payments/ y GET con filtros (by-group). (5 pts)
- SGICS-601: backendTests — Suite pytest-django; coverage objetivo. (5 pts)
- SGICS-602: frontendTests — Vitest para Dashboard y Wizard (3 pts)

### Grupo C — Personas, maestros, DevOps
- SGICS-101: ciCdSetup — GitHub Actions CI (python/node). (5 pts)
- SGICS-102: dockerCompose/Sonar — Sonar + compose tweaks. (3 pts)
- SGICS-103: infraHealthMetrics — /healthz /readyz endpoints. (2 pts)

### Grupo H — Preinscripciones y archivos
- SGICS-401: preinscriptionWizard — Backend + frontend wizard (5 pts)
- SGICS-402: fileManager — Upload/download + metadata (3 pts)
- SGICS-403: validationFiles — Basic validations (2 pts)

### Ingeniería — Perfiles UI
- SGICS-301: uiSetupVue — Vue + Pinia + Tailwind setup (3 pts)
- SGICS-302: designSystem — Base components (3 pts)
- SGICS-303: layoutNav — App layout and navigation (3 pts)
- SGICS-304: dashboardUI — Dashboard component & semáforo (5 pts)

## Tareas transversales
- SGICS-701: branchPolicy & PRGuide — document (1 pt)
- SGICS-702: singletonFactoryGuides — examples and docs (2 pts)
- SGICS-703: quickScreens — wireframes textuales (2 pts)

---

## Notas de estimación y criterios de aceptación
- Historias pequeñas (1-2 pts) deben poder cerrarse en 1-2 días. Historias 5 pts son completas: backend+frontend+tests.
- Todas las historias deben enlazarse a un issue Jira con la key SGICS-### y tener subtareas si afectan ambos lados (FE/BE).

## Cómo importar a Jira
- Exportar este archivo como CSV (cada story: Summary, Description, Issue Type=Story, Estimate, Labels)
- O usar API de Jira para crear issues en lote (token requerido)

---

## Entregables Sprint
- Endpoints: /api/auth, /api/courses, /api/preinscriptions, /api/payments
- UI: Dashboard mínimo, preinscription wizard (1 paso funcional), login skeleton
- CI: Workflow CI que corre tests y sube coverage
- Docs: README rápido con cómo correr el proyecto en Windows (PowerShell)