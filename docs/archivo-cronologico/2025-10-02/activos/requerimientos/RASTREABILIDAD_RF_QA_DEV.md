# Rastreabilidad de Requerimientos (RF → QA/Dev)

Fecha: 02-10-2025  
Versión: 0.1 (Inicial para revisión)

---

## Alcance
Esta matriz vincula Requerimientos Funcionales (RF) con:
- Implementación Frontend (vistas/componentes)
- Implementación Backend (endpoints/servicios)
- Pruebas (unitarias/integración/E2E)

Leyenda de estado: Hecho (✓), Parcial (~), Pendiente (✗)

---

## Matriz RF → Frontend / Backend

| RF | Descripción corta | Frontend (vistas/componentes) | Backend (endpoints/servicios) | Estado |
|---|---|---|---|---|
| RF-01 | Dashboard KPIs y resúmenes | `src/views/Dashboard.vue` | `/api/legacy/dashboard/kpis/` (LE), `/api/legacy/courses/` (LE) | ~ |
| RF-01.3 | Recaudado vs Esperado | `src/views/Dashboard.vue` (gauge) | Agregado real pendiente en MSSQL (LE) | ~ |
| RF-01.4 | Próximas fechas | `src/components/CourseUpcomingList.vue` | `/api/legacy/courses/` (fechas) | ✓ |
| RF-02 | Listado de cursos + filtros | `src/views/Courses.vue` | `/api/legacy/courses/` (LE) con fallback DRF | ✓ |
| RF-02.2 | Pagos al día y semáforo | `src/views/Courses.vue` | Agregados de pagos por curso (LE/DRF) | ~ |
| RF-03 | Wizard Preinscripciones | `src/views/PreinscripcionWizard.vue` (planificado) | `/api/users/search-by-rut`, `/api/preinscripciones/*` | ✗ |
| RF-04 | Pagos: búsqueda por grupo | `src/views/Pagos.vue` | `/api/legacy/payments/by-group` (LE) con fallback `/api/payments` | ~ |
| RF-05 | Gestión de archivos | `src/views/Archivos.vue` (planificado) | `/api/files/*` | ✗ |
| RF-06 | Notificaciones | `src/views/Notificaciones.vue` (planificado) | `/api/notifications/*` | ✗ |
| RF-07 | Seguridad y acceso | Rutas protegidas, guards | SimpleJWT `/api/token/*`, permisos DRF | ~ |

Notas:
- (LE) indica endpoint proxy a SQL Server legacy bajo `/api/legacy/*`.
- Fallback: el frontend utiliza endpoints DRF si falla el legacy.

---

## Matriz RF → Pruebas

| RF | Prueba(s) sugeridas | Tipo | Archivo(s) objetivo | Estado |
|---|---|---|---|---|
| RF-01.1 | KPIs se muestran con datos válidos/fallback | Unit/Integration | `frontend/src/views/Dashboard.vue` (Vitest), mocks fetch | ~ |
| RF-01.3 | Cálculo Recaudado vs Esperado | Unit | `Dashboard.vue` helpers | ~ |
| RF-01.4 | Próximas fechas (<=60 días) | Unit | `CourseUpcomingList.vue` | ✓ |
| RF-02.1 | Filtro por rama y búsqueda | Unit | `Courses.vue` | ✓ |
| RF-02.2 | Semáforo y pagos al día | Unit | `Courses.vue` helpers | ~ |
| RF-03 | Búsqueda por RUT en wizard | Integration/E2E | Wizard + endpoint `/api/users/search-by-rut` | ✗ |
| RF-04.2 | Fallback pagos por grupo | Integration | `Payments.vue` con mock de error legacy | ~ |
| RF-05 | Carga/descarga de archivos | Integration/E2E | Vista Archivos + `/api/files/*` | ✗ |
| RF-06 | Envío y centro de notificaciones | Integration/E2E | Vista Notificaciones + backend | ✗ |
| RF-07 | Rutas privadas y roles | Integration | Guards + SimpleJWT + roles | ~ |

---

## Próximos pasos de QA
- Añadir pruebas unitarias para el cálculo de “recaudado vs esperado” y el helper de semáforo.
- Prueba de contrato para `/api/legacy/payments/by-group` con escenarios de error y fallback.
- Esqueleto de E2E (Playwright) para el wizard de Preinscripción con búsqueda por RUT.

---

## Cambios requeridos de backend
- Endpoint agregado real “recaudado por curso” en MSSQL (vista o procedimiento) y exposición en `/api/legacy/courses/revenue/`.
- Implementar `/api/legacy/payments/by-group` con normalización consistente con `/api/payments`.

---

Responsables: PO/QA para validación de cobertura; Líder técnico para mantener esta matriz sincronizada con `REQUERIMIENTOS_ACTUALIZADOS.md`.
