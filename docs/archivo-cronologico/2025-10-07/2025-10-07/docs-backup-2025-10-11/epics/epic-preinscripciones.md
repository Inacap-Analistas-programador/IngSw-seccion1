# Epic: Preinscripciones (SGICS-E-PREINS)

Tags: epic, preinscriptions, backend, frontend, sprint2

## Detalles del Epic
- **Impulsor:** Equipo de Desarrollo
- **Aprobador:** @RICARDO CRISTOBAL SANHUEZA ACUNA
- **Personas informadas:** GRUPO A ()
- **Objetivo:** Entregar el primer paso del wizard (selección de curso + búsqueda por RUT) y el endpoint de creación de preinscripción en estado `draft`.
- **Fecha de vencimiento:** 24 de octubre del 2025
- **Principales resultados:** Implementación del flujo de preinscripción con wizard frontend y endpoints backend para crear y consultar preinscripciones, búsqueda por RUT para autocompletar datos.
- **Estado:** En Progreso

## Planteamiento del problema
Actualmente el sistema carece de un flujo de preinscripción digitalizado que permita a los usuarios registrarse de forma guiada y eficiente. La ausencia de este flujo obliga a procesos manuales que generan demoras, errores de captura de datos y dificultades para validar información de participantes. Además, la falta de integración con datos existentes (búsqueda por RUT) provoca duplicación de esfuerzos y inconsistencias en la base de datos de personas.

El alcance de este epic se centra en implementar un wizard frontend paso a paso y los endpoints backend necesarios para crear preinscripciones en estado draft, incluyendo la búsqueda y autocompletado de datos por RUT. No incluye pasos avanzados del wizard ni la confirmación final de preinscripciones en esta fase.

## Planteamiento del problema y el alcance
### Debe tener:
- Endpoint POST /api/preinscriptions/ para crear preinscripciones en estado draft.
- Endpoint GET /api/persons/search/?rut= para búsqueda y autocompletado por RUT.
- Componente frontend PreinscriptionStep1 con selección de curso y campo RUT.
- Validaciones de RUT y campos obligatorios en backend y frontend.
- Tests unitarios para endpoints y componente frontend.

### Podría tener:
- Integración con datos legacy para autocompletado más completo.
- Validación en tiempo real de disponibilidad de cupos por curso.
- Guardado automático de progreso en el wizard (draft state).
- Notificaciones por email de preinscripción creada.

### Fuera del alcance:
- Pasos adicionales del wizard (datos familiares, archivos, pagos).
- Confirmación final y cambio de estado a 'submitted'.
- Interfaz de administración para gestionar preinscripciones.
- Reportes detallados o dashboard de preinscripciones.

## Resumen
Este Epic abarca la implementación del flujo de preinscripción: un wizard guiado en frontend y endpoints backend para crear y consultar preinscripciones, con búsqueda por RUT para autocompletar datos de personas existentes.

Objetivo: Entregar el primer paso del wizard (selección de curso + búsqueda por RUT) y el endpoint de creación de preinscripción en estado `draft`.

Prioridad: Alta
Riesgo: Medio

---

## Historias incluidas
| Key | Título | Assignee | Story Points | Estado |
|---|---|---:|---:|---:|
| SGICS-401 | API crear preinscripción + búsqueda por RUT | Miguel Contreras | 5 | To Do |
| SGICS-401b | Wizard frontend: paso 1 (select course + RUT autocomplete) | Juan Orrego | 3 | To Do |

---

## Detalle de historias / Acceptance Criteria

### SGICS-401 — API crear preinscripción + búsqueda por RUT
- Descripción: Endpoint `POST /api/preinscriptions/` y `GET /api/persons/search/?rut=...`.
- Acceptance criteria:
  - `GET /api/persons/search/?rut=<rut>` retorna 200 con datos si existe persona.
  - `POST /api/preinscriptions/` crea un recurso con `person_id`, `course_id` y estado `draft`.
  - Validaciones: rut válido, curso existente, campos obligatorios.
  - Tests: crear con persona existente y nueva.
- Subtasks sugeridos:
  - Model/migration `Preinscription`.
  - Serializers & views.
  - Tests backend.
  - Documentación de API.

### SGICS-401b — Wizard frontend: paso 1
- Descripción: Implementar paso 1 del wizard: seleccionar curso y buscar RUT.
- Acceptance criteria:
  - Select muestra cursos activos (vía API `/api/courses/`).
  - Input RUT llama a `GET /api/persons/search/` y autopopula campos si hay match.
  - UX: validaciones instantáneas de RUT y mensajes claros.
- Subtasks sugeridos:
  - Component: `PreinscriptionStep1.vue` con Vee-Validate + yup.
  - Integración con Pinia store para datos temporales.
  - Tests (Vitest) para el componente.

---

## Dependencias
- Endpoint `/api/courses/` (listar cursos activos).
- Modelo Person (exists) para autocompletar datos.
- Service de archivos (si se sube ficha médica en pasos posteriores).

---

## Riesgos y mitigaciones
- Riesgo: inconsistencia en RUT format/normalization.
  - Mitigación: usar utilitario `validate_rut` y normalizar RUT en backend y frontend.
- Riesgo: falta de datos en legacy para autocompletar.
  - Mitigación: permitir creación de persona desde wizard (guardar partial) y marcar como `needs-verification`.

---

## Hitos y plazos

| Hito | Fecha objetivo | Criterios |
|---|---:|---|
| Hito 1: Endpoints backend implementados y probados | 2025-10-15 | POST /api/preinscriptions/ y GET /api/persons/search/ funcionales; tests pasando; validaciones implementadas. |
| Hito 2: Componente frontend paso 1 implementado | 2025-10-20 | PreinscriptionStep1.vue funcional; integración con Pinia store; tests Vitest pasando. |
| Hito 3: Epic completo y mergeado | 2025-10-24 | Integración completa; documentación actualizada; PR aprobado; Definition of Done cumplida. |

---

## DoD
- Endpoints funcionando con tests (pytest); migrations aplicadas; documentación en `docs/`.
- Wizard paso 1 implementado con tests (Vitest); integración con store temporal.
- PR aprobado y mergeado a develop.

---

## Cómo probar
- Crear preinscripción de prueba; POST /api/preinscriptions/ con person_id y course_id válidos.
- Backend: `pytest` en `codigo/backend` para pruebas del endpoint.
- Frontend: `npm run test` en `codigo/frontend` para componente.

Historial: 2025-10-07: creado.