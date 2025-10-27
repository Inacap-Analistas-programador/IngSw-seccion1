# Epics, Historias y Roadmap — SGICS (Sprint N2)

Fecha: 2025-10-07
Autor: Equipo Técnico (documento generado automáticamente)

## Objetivo del documento
Definir claramente qué es un Epic, una Historia (Story) y una Tarea (Task) para el proyecto SGICS, proponer el camino (roadmap) para el Sprint N2 y mapear Epics/Stories a los grupos de trabajo. Este documento servirá como fuente para crear los issues en Jira.

---

## 1) Definiciones (estándar usado)
- Epic: Un gran cuerpo de trabajo que agrupa varias historias relacionadas y que entrega un área funcional completa (por ejemplo: "Autenticación y control de roles"). Un epic puede tardar varias iteraciones.
- Historia (Story): Unidad de trabajo que aporta valor al usuario; suele completarse en 1-5 días (estimación 1-5 puntos). Describe una funcionalidad desde la perspectiva del usuario y tiene criterios de aceptación claros. Ejemplo: "Como admin quiero crear roles para otorgar permisos".
- Tarea (Task): Trabajo técnico o subparte de una Story (ej: escribir tests, crear migración, crear componente UI). Pueden ser asignadas a desarrolladores individuales.
- Bug: Comportamiento incorrecto que debe solucionarse; se prioriza según severidad.

Regla general: 1 Story ≈ 1-2 jornadas; evitar historias demasiado grandes (dividir en subtareas o subtories si >5 pts).

---

## 2) Camino propuesto (decisión de MVP y alcance Sprint N2)
Decisión técnica: Priorizar infraestructura y flujo mínimo viable para preinscripciones + autenticación + dashboard informativo. Esto maximiza la trazabilidad y permite que otros equipos integren sobre una base estable.

MVP (qué debe estar listo al final del Sprint N2):
- Autenticación JWT con login/refresh y RBAC básico.
- Endpoint y UI del wizard de preinscripción (paso 1 funcional: selección de curso + búsqueda por RUT y guardado parcial).
- Dashboard mínimo que muestre cursos vigentes y semáforo (verde/amarillo/rojo) y KPIs básicos.
- Endpoint de registro de pagos (POST /api/payments/) con asociación a preinscripción (stub comprobante).
- CI básico: GitHub Actions que corra tests backend y frontend.

Motivación: Estos ítems permiten al equipo validar flujo principal preinscripción→pago→dashboard y habilitan integraciones posteriores (archivos, notificaciones, acreditación).

---

## 3) Epics propuestos (alto nivel) — mapeo a grupos
Cada Epic contiene stories; debajo incluyo ejemplos mínimos de historias (Stories) para Sprint N2.

Epic: Autenticación y Control de Roles (Grupo A)
- SGICS-E-AUTH
  - Story: SGICS-201 - Implementar login JWT (SimpleJWT) (Story, 5 pts)
    - Criterios de aceptación: POST /api/auth/login devuelve access+refresh; tests de login success & fail
  - Story: SGICS-202 - Refresh y logout (Story, 2 pts)
  - Task: Crear permiso DRF `IsRoleAllowed` y mapping roles->permissions (Task, 2 pts)

Epic: Preinscripciones (Grupo H)
- SGICS-E-PREINS
  - Story: SGICS-401 - API crear preinscripción + búsqueda por RUT (Story, 5 pts)
    - Criterios: búsqueda por RUT devuelve persona si existe; crear preinscripción asociada a persona o creación parcial.
  - Story: SGICS-401b - Wizard frontend: paso 1 (select course + RUT autocomplete) (Story, 3 pts)
  - Task: Tests backend para endpoint preinscripción (Task, 2 pts)

Epic: Dashboard y Cursos (Grupo Ingeniería / UI)
- SGICS-E-DASH
  - Story: SGICS-304 - Mostrar lista de cursos con KPI y semáforo (Story, 5 pts)
  - Story: SGICS-302 - Componentes base (cards, table) (Task, 3 pts)

Epic: Pagos (Grupo B)
- SGICS-E-PAY
  - Story: SGICS-501 - Endpoint POST /api/payments/ con validación y asociación (Story, 5 pts)
  - Task: Endpoint GET /api/payments/?group=... (Task, 3 pts)

Epic: Archivos & Validación (Grupo H)
- SGICS-E-FILES
  - Story: SGICS-402 - Upload ficha médica/comprobante (Story, 3 pts)
  - Task: Validaciones de filetype/size (Task, 2 pts)

Epic: CI / Calidad / DevOps (Grupo C)
- SGICS-E-CI
  - Story: SGICS-101 - GitHub Actions CI con pytest/vitest (Story, 5 pts)
  - Task: SonarQube integration (Task, 3 pts)

Epic: Tests & QA (Grupo B)
- SGICS-E-QA
  - Story: SGICS-601 - Tests backend críticos (Story, 5 pts)
  - Story: SGICS-602 - Tests frontend (Vitest) (Story, 3 pts)

---

## 4) Historias detalladas (ejemplos con criterios de aceptación)
A continuación ejemplos de Stories listas para crear como issues Jira. Cada historia debe añadirse a Jira con la key sugerida.

Story: SGICS-201 - Implementar login JWT (SimpleJWT)
- Tipo: Story
- Epic: Autenticación
- Estimación: 5 pts
- Descripción breve: Implementar endpoint `POST /api/auth/login/` que acepte `username`/`password` y devuelva `access` y `refresh` tokens.
- Criterios de Aceptación:
  - Dado un usuario válido, cuando hace POST a `/api/auth/login/`, entonces recibe `access` y `refresh` JWT.
  - Tokens tienen expiración configurable a través de settings.
  - Tests: login válido y login inválido (credenciales incorrectas).

Story: SGICS-401 - API crear preinscripción + búsqueda por RUT
- Tipo: Story
- Epic: Preinscripciones
- Estimación: 5 pts
- Descripción breve: Endpoint `POST /api/preinscriptions/` para crear preinscripción; `GET /api/persons/search/?rut=...` para autocompletar.
- Criterios de aceptación:
  - Búsqueda por RUT retorna la persona si existe.
  - Creación de preinscripción guarda `person_id` y `course_id`, estado inicial `draft`.
  - Tests: crear preinscripción con persona existente y con persona nueva.

Story: SGICS-304 - Dashboard: lista cursos y semáforo
- Tipo: Story
- Epic: Dashboard
- Estimación: 5 pts
- Descripción breve: Vista que lista cursos vigentes con columnas: `name`, `enrollment_count`, `paid_count`, `statusTrafficLight`.
- Criterios:
  - Semáforo verde: equipo completo y pagos >= 90%
  - Amarillo: pagos entre 60% y 90% o equipo incompleto
  - Rojo: pagos < 60% o curso con menos del 50% del equipo
  - Tests FE: component snapshot + lógica de semáforo

---

## 5) Tasks técnicas (ejemplos)
- Crear migración para `Preinscription` con campos base.
- Añadir endpoint `/healthz` y `/readyz`.
- Crear utilitario `validate_rut` y tests unitarios.
- Añadir integración stub para comprobante de pago (aceptar imagen/pdf) y guardar metadata.

---

## 6) Priorización para Sprint N2 (lista ordenada)
1. SGICS-201 - Login JWT (Autenticación)
2. SGICS-101 - CI (GitHub Actions)
3. SGICS-401 - Preinscripción API + RUT search
4. SGICS-304 - Dashboard UI mínimo
5. SGICS-501 - Payments API (crear)
6. SGICS-402 - File upload básico
7. SGICS-601 - Tests backend críticos

Explicación: La autenticación y CI son básicos para proteger y validar el trabajo; la preinscripción es el flujo de negocio central; dashboard y pagos permiten feedback visual y conciliación.

---

## 7) Mapping de Epics/Stories a Grupos y Responsabilidades
- Grupo A (Auth): SGICS-E-AUTH → SGICS-201, SGICS-202, SGICS-203
- Grupo B (Payments & QA): SGICS-E-PAY & SGICS-E-QA → SGICS-501, SGICS-601, SGICS-602
- Grupo C (DevOps & Personas): SGICS-E-CI → SGICS-101, SGICS-102, SGICS-103
- Grupo H (Preinscr & Files): SGICS-E-PREINS & SGICS-E-FILES → SGICS-401, SGICS-402, SGICS-403
- Grupo Ingeniería (UI): SGICS-E-DASH → SGICS-301, SGICS-302, SGICS-303, SGICS-304

---

## 8) Cómo convertir esto en issues en Jira (recomendación rápida)
1. Crear Epics en Jira con los códigos `SGICS-E-*` y títulos.
2. Crear Stories con las keys propuestas (SGICS-201...) y enlazarlas al Epic correspondiente.
3. Añadir estimates y labels: sprint2, backend/frontend, grupoX.
4. Crear subtasks técnicos (tests, migrations, docs) bajo cada Story.

---

## 9) Recomendaciones operativas
- Mantener stories pequeñas (<=5 pts).
- Hacer daily merges a `team/<grupo>-sprint2` para integrar trabajo del equipo.
- Revisión cross-team para endpoints shared (auth, payments, persons).

---

## 10) Siguientes pasos (acción inmediata)
- Exportar este archivo a CSV para import a Jira o crear issues vía API.
- Crear plantilla CSV si quieres que la genere ahora.

---

Fin del documento.