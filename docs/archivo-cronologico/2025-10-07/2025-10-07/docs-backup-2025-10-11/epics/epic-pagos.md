# Epic: Pagos (SGICS-E-PAY)
Tags: epic, payments, backend, sprint2

## Detalles del Epic
- **Impulsor:** Equipo de Desarrollo
- **Aprobador:** @RICARDO CRISTOBAL SANHUEZA ACUNA
- **Personas informadas:** GRUPO B ()
- **Objetivo:** Proveer endpoints para crear y consultar pagos y facilitar la asociación con preinscripciones para posteriores conciliaciones y generación de comprobantes.
- **Fecha de vencimiento:** 13 de octubre del 2025
- **Principales resultados:** Implementación de endpoints de pagos, asociación automática a preinscripciones, lógica de autoconfirmación y listado filtrado por grupo.
- **Estado:** En Progreso

## Planteamiento del problema
Actualmente el sistema carece de una capa centralizada para la gestión de pagos que permita registrar comprobantes, asociarlos de forma confiable a preinscripciones y consultar el historial por criterios como grupo territorial o formulario. Esta ausencia obliga a procesos manuales que generan demoras en la conciliación financiera, riesgo de duplicados y dificultad para generar comprobantes automáticos. Además, la falta de endpoints estandarizados impide que otros módulos (dashboard, preinscripciones) consuman datos de pagos de forma confiable para cálculos de disponibilidad y reportes.

El alcance de este epic se centra en habilitar los endpoints backend necesarios para la gestión de pagos, garantizar la integridad y la asociación con preinscripciones, y proporcionar tests que aseguren la correcta implementación. No incluye desarrollo de UI de gestión ni integración con gateways externos en esta fase.

## Planteamiento del problema y el alcance
### Debe tener:
- Implementación de endpoints REST para creación y consulta de pagos.
- Asociación automática de pagos a preinscripciones existentes.
- Lógica de autoconfirmación basada en configuraciones del curso.
- Validaciones mínimas para comprobantes y referencias únicas.
- Tests unitarios e integración para los endpoints.

### Podría tener:
- Integración con servicios de almacenamiento para subida de comprobantes.
- Fallback a endpoints legacy para compatibilidad.
- Filtrado avanzado por grupo territorial o formulario.
- Generación automática de comprobantes post-conciliación.

### Fuera del alcance:
- Desarrollo de interfaz de usuario para gestión de pagos.
- Integración con sistemas de pago externos (ej. gateways).
- Gestión de reembolsos o anulaciones de pagos.
- Reportes financieros detallados o dashboards.

## Resumen
Este epic cubre la implementación de la gestión de pagos: registro manual, listado por grupo, asociación a preinscripciones y la lógica de autoconfirmación cuando aplique.

Objetivo: Proveer endpoints para crear y consultar pagos y facilitar la asociación con preinscripciones para posteriores conciliaciones y generación de comprobantes.

Prioridad: Alta
Riesgo: Alto-medio

---

## Historias incluidas
| Key | Título | Assignee | Story Points | Estado |
|---|---|---:|---:|---:|
| SGICS-501 | Payments API: POST /api/payments/ | Camilo Colivoro | 5 | To Do |
| SGICS-502 | Payments GET by-group | Nicolas Gonzalez | 3 | To Do |

---

## Detalle de historias / Acceptance Criteria

### SGICS-501 — POST /api/payments/
- Descripción: Endpoint para registrar un pago con validación mínima de comprobante y asociación a `preinscription_id`.
- Acceptance criteria:
  - `POST /api/payments/` crea un registro con campos: `preinscription_id`, `amount`, `method`, `reference`, `date`, `status`.
  - Si la opción `autoConfirm` del curso está activa, el sistema cambia el estado de la preinscripción a `Cupo Asignado` o similar.
  - Tests de creación y asociación.
- Subtasks sugeridos:
  - Model Payment + migration.
  - Serializer + view + url.
  - Tests y documentación.

### SGICS-502 — GET /api/payments/?group=...
- Descripción: Listar pagos filtrados por `group` (un grupo territorial o de formulario), con fallback a endpoint legacy.
- Acceptance criteria:
  - Filtrado por parámetro `group` devuelve pagos relevantes.
  - Si no hay datos, el backend intenta `/api/legacy/payments/by-group/` y devuelve resultados o un mensaje claro.
  - Tests para filtro y fallback.

---

## Dependencias
- Modelo `Preinscription` y su integridad.
- Storage/file service para comprobantes (si se suben).
- Legacy endpoints (opcional) para fallback.

---

## Riesgos y mitigaciones
- Riesgo: errores en conciliación financiera o duplicados.
  - Mitigación: validar referencias únicas y agregar deduplicación por referencia y monto/fecha.
- Riesgo: conflictos con legacy data.
  - Mitigación: adaptar factories y pruebas de contract.

---

## Hitos y plazos

| Hito | Fecha objetivo | Criterios |
|---|---:|---|
| Hito 1: Completar implementación y tests de SGICS-501 | 2025-10-15 | POST /api/payments/ funcional; asociación a preinscripciones implementada; lógica de autoconfirmación; tests pasando. |
| Hito 2: Completar implementación y tests de SGICS-502 | 2025-10-20 | GET /api/payments/?group= funcional; fallback a legacy implementado; tests de filtrado pasando. |
| Hito 3: Integración completa y validación de autoconfirmación | 2025-10-25 | Epic integrado; validaciones de duplicados funcionando; PR mergeado; Definition of Done cumplida. |

---

## DoD
- Endpoints con tests; migrations aplicadas; documentación en `docs/`.

---

## Cómo probar
- Crear preinscripción de prueba; POST /api/payments/ con `preinscription_id` y verificar estado.

Historial: 2025-10-07: creado.
