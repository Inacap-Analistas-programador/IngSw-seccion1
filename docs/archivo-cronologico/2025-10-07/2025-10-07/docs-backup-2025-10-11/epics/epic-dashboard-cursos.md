# Epic: Dashboard y Cursos (SGICS-E-DASH)

Tags: epic, dashboard, frontend, backend, sprint2

## Detalles del Epic
- **Impulsor:** Equipo de Desarrollo
- **Aprobador:** @RICARDO CRISTOBAL SANHUEZA ACUNA
- **Personas informadas:** GRUPO H ()
- **Objetivo:** Entregar un dashboard mínimo con lista de cursos y semáforo, y componentes base para ampliaciones posteriores.
- **Fecha de vencimiento:** 24 de octubre del 2025
- **Principales resultados:** Dashboard con KPIs, lista de cursos vigentes, semáforo por curso y componentes base para futuras ampliaciones.
- **Estado:** En Progreso

## Planteamiento del problema
Actualmente los usuarios no tienen una vista centralizada que les permita visualizar el estado general de los cursos, sus KPIs principales y el progreso de preinscripciones y pagos de forma clara y accesible. Esta ausencia dificulta la toma de decisiones rápidas, el monitoreo del estado de cada curso y la identificación de posibles problemas o cuellos de botella en el proceso de inscripción. Además, la falta de un semáforo visual impide identificar rápidamente qué cursos requieren atención inmediata.

El alcance de este epic se centra en crear un dashboard funcional que muestre los cursos vigentes con sus métricas principales y un sistema de semáforo que indique visualmente el estado de cada curso. No incluye reportes detallados ni funcionalidades avanzadas de análisis en esta fase.

## Planteamiento del problema y el alcance
### Debe tener:
- Dashboard principal con lista de cursos vigentes y sus métricas.
- Semáforo visual por curso basado en reglas de negocio definidas.
- KPIs principales: total preinscripciones, pagos totales, próximos eventos.
- Componentes reutilizables (CourseCard, KPI cards) para futuras ampliaciones.
- Tests unitarios para lógica de semáforo y componentes.

### Podría tener:
- Filtros por estado de curso, fecha o equipo responsable.
- Gráficos de tendencias de preinscripciones en el tiempo.
- Notificaciones de cursos que requieren atención.
- Exportación de datos del dashboard a Excel/PDF.

### Fuera del alcance:
- Reportes financieros detallados o análisis avanzados.
- Gestión directa de cursos desde el dashboard.
- Dashboard personalizable por usuario o roles.
- Integración con sistemas externos de BI.

## Resumen
Epic encargado de mostrar KPIs, lista de cursos vigentes y semáforo por curso. Debe proporcionar una vista inicial que permita a los usuarios visualizar estado de pagos, capacidad y equipo responsable del curso.

Objetivo: Entregar un dashboard mínimo con lista de cursos y semáforo, y componentes base para ampliaciones posteriores.

Prioridad: Alta
Riesgo: Medio

---

## Historias incluidas
| Key | Título | Assignee | Story Points | Estado |
|---|---|---:|---:|---:|
| SGICS-304 | Dashboard: lista cursos y semáforo | Rodrigo Jara | 5 | To Do |

---

## Detalle de historias / Acceptance Criteria

### SGICS-304 — Dashboard: lista cursos y semáforo
- Descripción: Componente que muestra cursos vigentes con columnas `name`, `enrollment_count`, `paid_count`, `statusTrafficLight`.
- Acceptance criteria:
  - Lista muestra todos los cursos vigentes.
  - Semáforo calculado según reglas: verde (equipo completo y pagos >=90%), amarillo (60-90% o equipo incompleto), rojo (<60% o equipo incompleto bajo).
  - KPIs: total preinscripciones, pagos totales, próximos eventos (60 días).
  - Tests: lógica de semáforo y snapshot del componente.
- Subtasks sugeridos:
  - Backend: agregar agregados necesarios si faltan (payments summary).
  - Frontend: `Dashboard.vue`, `CourseCard.vue`, KPI cards.
  - Tests: vitest para componente y lógica.

---

## Dependencias
- Endpoints: `/api/courses/`, `/api/payments/summary/` (o agregados similares).
- Datos de equipo por curso (formadores / coordinadores).

---

## Riesgos y mitigaciones
- Riesgo: cálculos de pagos no precisos por falta de agregado en backend.
  - Mitigación: usar estimado `price * enrollment_count` hasta agregar real.
- Riesgo: performance si la lista es grande.
  - Mitigación: paginación y lazy-loading en frontend.

---

## Hitos y plazos

| Hito | Fecha objetivo | Criterios |
|---|---:|---|
| Hito 1: Endpoints backend y lógica de agregados implementados | 2025-10-16 | Endpoints /api/courses/ y /api/payments/summary/ funcionales; agregados necesarios disponibles; tests pasando. |
| Hito 2: Componentes frontend y lógica de semáforo implementados | 2025-10-21 | Dashboard.vue y CourseCard.vue funcionales; lógica de semáforo implementada; tests Vitest pasando. |
| Hito 3: Epic completo y mergeado | 2025-10-24 | Integración completa; revisión de accesibilidad y responsive; PR aprobado; Definition of Done cumplida. |

---

## DoD
- Componentes con tests y documentación; agregados backend o endpoints provisionales disponibles.
- Revisión de accesibilidad y responsive completada.
- Tests unitarios para lógica de semáforo y componentes pasando.

---

## Cómo probar
- Crear datos de prueba con cursos y métricas variadas.
- Backend: ejecutar `pytest` en endpoints relacionados.
- Frontend: `npm run dev` y revisar `http://localhost:3000/dashboard`.

Historial: 2025-10-07: creado.