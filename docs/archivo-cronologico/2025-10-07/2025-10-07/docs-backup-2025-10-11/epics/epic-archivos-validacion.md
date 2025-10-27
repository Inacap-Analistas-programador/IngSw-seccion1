# Epic: Archivos & Validación (SGICS-E-FILES)

Tags: epic, files, backend, sprint2

## Detalles del Epic
- **Impulsor:** Equipo de Desarrollo
- **Aprobador:** @RICARDO CRISTOBAL SANHUEZA ACUNA
- **Personas informadas:** GRUPO C ()
- **Objetivo:** Implementar un endpoint seguro para upload/download de archivos y almacenar metadatos esenciales.
- **Fecha de vencimiento:** 24 de octubre del 2025
- **Principales resultados:** Sistema de gestión documental con endpoints seguros para subida/descarga y validaciones de tipo y tamaño.
- **Estado:** En Progreso

## Planteamiento del problema
Actualmente el sistema no cuenta con una gestión centralizada y segura de archivos que permita la subida, almacenamiento y descarga de documentos críticos como fichas médicas, comprobantes de pago y otros archivos sensibles. Esta ausencia genera riesgos de seguridad, dificultades en la trazabilidad de documentos y procesos manuales ineficientes para el manejo de archivos. Además, la falta de validaciones automatizadas puede permitir la subida de archivos no válidos o potencialmente peligrosos.

El alcance de este epic se centra en implementar endpoints seguros para la gestión básica de archivos con metadatos esenciales y validaciones de seguridad. No incluye funcionalidades avanzadas de procesamiento de documentos ni integración con sistemas externos de almacenamiento en esta fase.

## Planteamiento del problema y el alcance
### Debe tener:
- Endpoint POST para subida de archivos con validaciones de tipo y tamaño.
- Endpoint GET para descarga segura de archivos por ID.
- Almacenamiento de metadatos (tipo, tamaño, usuario, fecha, asociación).
- Validaciones de tipos permitidos (pdf, jpg, png) y tamaño máximo configurable.
- Tests unitarios para subida, descarga y validaciones.

### Podría tener:
- Integración con servicios de almacenamiento en la nube (MinIO/S3).
- Versionado de archivos y control de duplicados.
- Compresión automática de imágenes grandes.
- Escaneado de virus para archivos subidos.

### Fuera del alcance:
- Procesamiento avanzado de documentos (OCR, extracción de datos).
- Interfaz de usuario completa para gestión de archivos.
- Integración con sistemas de firma digital.
- Workflow de aprobación de documentos.

## Resumen
Este epic cubre la gestión documental básica: subida, metadatos, descarga y reglas de validación (tipo/size). Priorizar la seguridad y la trazabilidad de archivos sensibles como fichas médicas y comprobantes.

Objetivo: Implementar un endpoint seguro para upload/download de archivos y almacenar metadatos esenciales.

Prioridad: Media
Riesgo: Medio

---

## Historias incluidas
| Key | Título | Assignee | Story Points | Estado |
|---|---|---:|---:|---:|
| SGICS-402 | File upload basic | Leonardo Lopez | 3 | To Do |

---

## Detalle de historias / Acceptance Criteria

### SGICS-402 — File upload basic
- Descripción: Endpoint para subir archivos asociados a persona o preinscripción con metadatos (tipo, size, uploaded_by, uploaded_at).
- Acceptance criteria:
  - El endpoint guarda metadata y permite descargar archivos por id.
  - Validaciones: tipos permitidos (pdf, jpg, png), tamaño máximo configurable (ej: 10MB).
  - Tests de subida/descarga y metadatos.
- Subtasks sugeridos:
  - Model File + migration.
  - Endpoint upload/download.
  - Policy de validación y tests.

---

## Dependencias
- Storage: local en dev (media/uploads), MinIO/S3 para producción.
- Integración con personas/preinscripciones.

---

## Riesgos y mitigaciones
- Riesgo: exposición de datos sensibles.
  - Mitigación: usar almacenamiento seguro, ACLs, y revisar permisos en endpoints.
- Riesgo: upload de archivos maliciosos.
  - Mitigación: validar mime types y usar escáner si disponible.

---

## Hitos y plazos

| Hito | Fecha objetivo | Criterios |
|---|---:|---|
| Hito 1: Modelo y endpoints básicos implementados | 2025-10-17 | Modelo File creado; endpoints de upload/download funcionales; validaciones básicas implementadas. |
| Hito 2: Seguridad y tests implementados | 2025-10-22 | ACLs y permisos configurados; tests de seguridad y validación pasando; documentación completa. |
| Hito 3: Epic completo y mergeado | 2025-10-24 | Integración completa; revisión de seguridad aprobada; PR mergeado; Definition of Done cumplida. |

---

## DoD
- Endpoints con tests; migrations aplicadas; documentación en `docs/`.
- Validaciones de seguridad implementadas y probadas.
- Ejemplo de request/response documentado.

---

## Cómo probar
- Subir archivo de prueba; verificar metadatos almacenados y capacidad de descarga.
- Intentar subir archivos no válidos; verificar que las validaciones funcionen correctamente.

Historial: 2025-10-07: creado.