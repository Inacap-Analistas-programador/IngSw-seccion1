# Epic: Tests & QA (SGICS-E-QA)

Tags: epic, qa, tests, backend, frontend, sprint2

## Detalles del Epic
- **Impulsor:** Equipo de QA y Desarrollo
- **Aprobador:** @RICARDO CRISTOBAL SANHUEZA ACUNA
- **Personas informadas:** Todos los equipos ()
- **Objetivo:** Implementar tests para endpoints críticos y componentes clave frontend, estableciendo proceso de QA documentado.
- **Fecha de vencimiento:** 24 de octubre del 2025
- **Principales resultados:** Suite de tests críticos implementada, cobertura mínima asegurada y proceso de QA documentado.
- **Estado:** En Progreso

## Planteamiento del problema
Actualmente el proyecto carece de una suite de tests comprehensiva que garantice la calidad y estabilidad del código tanto en backend como en frontend. Esta ausencia genera riesgos de regresiones, dificulta la refactorización segura y complica la detección temprana de bugs. Además, la falta de un proceso de QA documentado impide que el equipo tenga criterios claros de calidad y procedimientos estandarizados para validar funcionalidades.

El alcance de este epic se centra en implementar tests críticos para endpoints y componentes principales, establecer cobertura mínima y documentar procesos de QA. No incluye tests de performance avanzados ni automatización completa de testing en esta fase.

## Planteamiento del problema y el alcance
### Debe tener:
- Tests unitarios e integración para endpoints críticos (courses, preinscription, payments).
- Tests frontend con Vitest para componentes Dashboard y PreinscriptionStep1.
- Fixtures y mocks configurados para tests reproducibles.
- Cobertura mínima reportada y integrada en CI.
- Documentación del proceso de QA y criterios de aceptación.

### Podría tener:
- Tests de carga básicos para endpoints principales.
- Tests de regresión visual para componentes críticos.
- Generación automática de reportes de coverage con tendencias.
- Integración con herramientas de análisis de calidad de código.

### Fuera del alcance:
- Tests end-to-end completos con navegador.
- Tests de performance avanzados y benchmarking.
- Automatización completa de testing de UI.
- Integración con herramientas de testing externas complejas.

## Resumen
Este epic cubre la creación de tests críticos y la integración del plan de QA: pytest en backend y Vitest en frontend. Debe asegurar que endpoints y componentes claves tengan cobertura mínima y que el proceso de QA esté documentado.

Objetivo: Implementar tests para endpoints críticos (courses list, preinscription submit, payments) y dos componentes clave en frontend (Dashboard, Wizard step).

Prioridad: Alta
Riesgo: Medio

---

## Historias incluidas
| Key | Título | Assignee | Story Points | Estado |
|---|---|---:|---:|---:|
| SGICS-601 | Backend tests critical | Nicolas Gonzalez | 5 | To Do |
| SGICS-602 | Frontend tests | Juan Herrera | 3 | To Do |

---

## Detalle de historias / Acceptance Criteria

### SGICS-601 — Backend tests critical
- Descripción: Tests unitarios e integración para `courses list`, `preinscription submit` y `payments`.
- Acceptance criteria:
  - Tests cubren happy path y al menos 1 caso borde por endpoint.
  - Los tests pasan en CI.
- Subtasks sugeridos:
  - Crear fixtures y datos de test.
  - Tests para endpoints con pytest-django.

### SGICS-602 — Frontend tests
- Descripción: Tests Vitest para Dashboard y Preinscription wizard step.
- Acceptance criteria:
  - 2 componentes con tests y coverage reportado.
  - Tests corren en CI.
- Subtasks sugeridos:
  - Crear tests con testing-library/vue y mocks de API.
  - Documentar ejecución de tests localmente.

---

## Dependencias
- Endpoints implementados y accesibles para pruebas (mocks o test DB).
- CI ejecutando pytest/vitest.

---

## Riesgos y mitigaciones
- Riesgo: flaky tests por dependencias externas.
  - Mitigación: usar fixtures y mocks, controlar tiempos y resets de DB entre tests.

---

## Hitos y plazos

| Hito | Fecha objetivo | Criterios |
|---|---:|---|
| Hito 1: Tests backend críticos implementados | 2025-10-18 | Tests para endpoints courses, preinscription y payments funcionales; fixtures creados; tests pasando en CI. |
| Hito 2: Tests frontend y proceso QA documentado | 2025-10-22 | Tests Vitest para Dashboard y PreinscriptionStep1 implementados; proceso de QA documentado; coverage reportado. |
| Hito 3: Epic completo y integrado | 2025-10-24 | Todos los tests integrados en pipeline; coverage mínimo alcanzado; documentación completa; Definition of Done cumplida. |

---

## DoD
- Tests implementados y pasan en pipeline; coverage report disponible como artifact.
- Proceso de QA documentado con criterios claros de aceptación.
- Fixtures y mocks configurados para tests reproducibles.

---

## Cómo probar
- Ejecutar suite completa de tests; verificar que todos pasen y coverage sea reportado.
- Introducir cambios que rompan tests; verificar que CI detecte fallos correctamente.

Historial: 2025-10-07: creado.