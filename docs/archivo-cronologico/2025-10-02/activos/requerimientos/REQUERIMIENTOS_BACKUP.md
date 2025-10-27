# Requerimientos Actualizados

Fecha: 02-10-2025  
Proyecto: SGICS — Sistema de Gestión de Inscripciones, Cursos y Scouts  
Estado: Borrador para validación del PO

---

## 1. Resumen ejecutivo
Este documento consolida los requerimientos funcionales y no funcionales vigentes del sistema, alineados a:
- UI con 6 módulos (Dashboard, Cursos, Preinscripciones, Pagos, Archivos, Notificaciones).
- Patrón de integración legacy-first con endpoints `/api/legacy/*`.
- Seguridad mediante JWT y control de acceso en frontend.

## 2. Supuestos y restricciones
- SQL Server 2019 es la fuente de verdad para datos operativos.
- El backend (Django/DRF) expone endpoints `/api/legacy/*` para información derivada de SQL Server.
- Se mantiene compatibilidad con endpoints DRF locales como fallback.
- UI con Vue 3 + Pinia + Vite. Pruebas con Vitest.

---

## 3. Requerimientos funcionales (RF)

RF-01 Dashboard — KPIs y resúmenes
- RF-01.1: Mostrar KPIs generales (preinscripciones, pagos, actividad).
- RF-01.2: Panel “Cursos vigentes” con capacidad, pagos al día, equipo y semáforo.
- RF-01.3: Indicador por curso “Recaudado vs Esperado”.
- RF-01.4: Lista de “Próximas fechas” de cursos a 60 días.

RF-02 Cursos — Gestión y consulta
- RF-02.1: Listar cursos con búsqueda y filtro por rama.
- RF-02.2: Mostrar columnas de pagos (al día/%), semáforo y cupos disponibles.
- RF-02.3: Ver detalle de curso con resumen de equipo y estado (si aplica).
- RF-02.4: Crear/editar curso (cuando no esté gobernado por legacy), respetando reglas de negocio.

RF-03 Preinscripciones — Flujo guiado
- RF-03.1: Selección de curso en primer paso del wizard.
- RF-03.2: Búsqueda de persona por RUT para autocompletado.
- RF-03.3: Registro de preinscripción con validaciones de negocio.
- RF-03.4: Consulta de estado y actualización (según permisos).

RF-04 Pagos — Registro y consulta
- RF-04.1: Listado y filtrado por estado, método y fecha.
- RF-04.2: Búsqueda por grupo con preferencia por endpoint legacy y fallback a `/api/payments`.
- RF-04.3: Registro de pago manual (monto, método, referencia, notas).
- RF-04.4: Generación de comprobante/recibo (descarga). 
- RF-04.5: Gestión de cuotas e indicadores de vencimiento.

RF-05 Archivos — Gestión documental
- RF-05.1: Carga/descarga de archivos autorizados por usuario.
- RF-05.2: Versionado simple o control de reemplazo.
- RF-05.3: Metadatos básicos (tipo, tamaño, autor, fecha).

RF-06 Notificaciones — Comunicaciones
- RF-06.1: Centro de notificaciones internas.
- RF-06.2: Envío de correos masivos (según perfiles y filtros).
- RF-06.3: Registro de actividad (auditoría ligera) asociado a estas acciones.

RF-07 Seguridad y acceso
- RF-07.1: Autenticación JWT; rutas privadas en frontend.
- RF-07.2: Autorización por rol/perfil para operaciones sensibles.
- RF-07.3: Auditoría de eventos clave (alta, baja, cambios críticos).

---

## 4. Requerimientos no funcionales (RNF)

Calidad y desempeño
- RNF-01: Tiempo de respuesta p95 de endpoints críticos < 500 ms en condiciones nominales.
- RNF-02: Disponibilidad objetivo >= 99.5% mensual para APIs públicas internas.
- RNF-03: Paginación/limites en listados (por defecto 25, máximo 100) para evitar respuestas excesivas.

Seguridad
- RNF-04: Tokens JWT con expiración corta y refresh tokens seguros; almacenamiento en memoria/secure storage (no en localStorage cuando aplique políticas organizacionales).
- RNF-05: TLS en tránsito; protección CSRF cuando aplique (rutas web clásicas).
- RNF-06: Cumplimiento de principios mínimos de privilegio y registro de auditoría.

Confiabilidad y pruebas
- RNF-07: Pruebas unitarias y de integración para backend y frontend; ejecución en CI.
- RNF-08: Contratos estables para endpoints `/api/legacy/*` con pruebas de contrato o mocks.
- RNF-09: Mecanismo de fallback en frontend cuando el endpoint legacy no esté disponible.

Operación y despliegue
- RNF-10: Contenedores Docker reproducibles para frontend y backend.
- RNF-11: Logs estructurados y endpoints de health/readiness/metrics.
- RNF-12: Configuración por entorno vía variables (sin secretos en código).

Mantenibilidad
- RNF-13: Documentación actualizada en `docs/` con índice en `README.md` y actas asociadas.
- RNF-14: Versionado semántico en documentación y releases de app.
- RNF-15: Linting/format en CI, convenciones de código y estilos definidos.

Accesibilidad y UX
- RNF-16: Cumplir con buenas prácticas de contraste y semántica; navegación clara entre 6 módulos.
- RNF-17: Estados de carga/errores visibles; feedback inmediato en acciones clave.

---

## 5. Criterios de aceptación (muestra)
- Dado que el backend de legacy no responde, cuando el frontend consulte pagos por grupo, entonces el sistema debe intentar el endpoint estándar `/api/payments` y mostrar resultados o un mensaje claro de “sin datos”.
- Dado un curso con `price` y `enrollment_count`, cuando se muestre “Recaudado vs Esperado”, entonces el valor esperado será `price * enrollment_count` y el recaudado estimado será `price * payment_status_summary.al_dia` hasta contar con el agregado real del backend.
- Dado que un usuario autenticado busca por RUT en Preinscripciones, cuando exista coincidencia, entonces los campos de nombre y correo se autocompletan.

---

## 6. Trazabilidad
- RF-01 y RF-02 enlazan con `src/views/Dashboard.vue` y `src/views/Courses.vue`.
- RF-03 enlaza con `src/views/PreinscripcionWizard.vue` y backend `users/views.py` (search-by-rut).
- RF-04 enlaza con `src/views/Pagos.vue` y backend de pagos (próximo endpoint legacy by-group).
- RNF-07/08/09 se validan mediante Vitest, pytest-django y/o mocks/fallbacks.

---

## 7. Pendientes y notas
- Recaudado real por curso desde SQL Server (agregado backend) para reemplazar el estimado.
- Endpoint `/api/legacy/payments/by-group/` en backend.
- Diagrama actualizado de integraciones (añadir a `docs/assets`).
