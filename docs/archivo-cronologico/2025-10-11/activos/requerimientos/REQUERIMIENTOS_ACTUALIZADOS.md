# Requerimientos SGICS# Requerimientos Actualizados



**Fecha**: 02-10-2025 | **Estado**: Validado PO | **Actualización**: Optimizada 11-10-2025Fecha: 02-10-2025  

Proyecto: SGICS — Sistema de Gestión de Inscripciones, Cursos y Scouts  

## 🎯 ContextoEstado: Borrador para validación del PO

- **Backend**: Django/DRF + endpoints `/api/legacy/*` (SQL Server fuente verdad)  

- **Frontend**: Vue 3 + Pinia + Vite + Vitest---

- **Seguridad**: JWT + control acceso + RBAC

- **6 módulos**: Dashboard, Cursos, Preinscripciones, Pagos, Archivos, Notificaciones## 1. Resumen ejecutivo

Este documento consolida los requerimientos funcionales y no funcionales vigentes del sistema, alineados a:

---- UI con 6 módulos (Dashboard, Cursos, Preinscripciones, Pagos, Archivos, Notificaciones).

- Patrón de integración legacy-first con endpoints `/api/legacy/*`.

## 📋 RF - Requerimientos Funcionales- Seguridad mediante JWT y control de acceso en frontend.



### RF-01 Dashboard## 2. Supuestos y restricciones

- **RF-01.1**: KPIs generales (preinscripciones, pagos, actividad)- SQL Server 2019 es la fuente de verdad para datos operativos.

- **RF-01.2**: Panel "Cursos vigentes" (capacidad, pagos, equipo, semáforo)  - El backend (Django/DRF) expone endpoints `/api/legacy/*` para información derivada de SQL Server.

- **RF-01.3**: "Recaudado vs Esperado" por curso- Se mantiene compatibilidad con endpoints DRF locales como fallback.

- **RF-01.4**: "Próximas fechas" (60 días)- UI con Vue 3 + Pinia + Vite. Pruebas con Vitest.



### RF-02 Cursos  ---

- **RF-02.1**: Lista + búsqueda + filtro rama

- **RF-02.2**: Columnas pagos (%, semáforo, cupos)## 3. Requerimientos funcionales (RF)

- **RF-02.3**: Detalle curso + resumen equipo  

- **RF-02.4**: CRUD curso (cuando no legacy)RF-01 Dashboard — KPIs y resúmenes

- RF-01.1: Mostrar KPIs generales (preinscripciones, pagos, actividad).

### RF-03 Preinscripciones- RF-01.2: Panel “Cursos vigentes” con capacidad, pagos al día, equipo y semáforo.

- **RF-03.1**: Wizard paso 1: selección curso- RF-01.3: Indicador por curso “Recaudado vs Esperado”.

- **RF-03.2**: Búsqueda RUT → autocompletado  - RF-01.4: Lista de “Próximas fechas” de cursos a 60 días.

- **RF-03.3**: Registro + validaciones negocio

- **RF-03.4**: Consulta estado + actualización (permisos)RF-02 Cursos — Gestión y consulta

- RF-02.1: Listar cursos con búsqueda y filtro por rama.

### RF-04 Pagos- RF-02.2: Mostrar columnas de pagos (al día/%), semáforo y cupos disponibles.

- **RF-04.1**: Lista + filtros (estado, método, fecha)- RF-02.3: Ver detalle de curso con resumen de equipo y estado (si aplica).

- **RF-04.2**: Búsqueda grupo (legacy first + fallback `/api/payments`)- RF-02.4: Crear/editar curso (cuando no esté gobernado por legacy), respetando reglas de negocio.

- **RF-04.3**: Registro manual (monto, método, referencia, notas)

- **RF-04.4**: Comprobante/recibo descargaRF-03 Preinscripciones — Flujo guiado

- **RF-04.5**: Cuotas + vencimientos- RF-03.1: Selección de curso en primer paso del wizard.

- RF-03.2: Búsqueda de persona por RUT para autocompletado.

### RF-05 Archivos  - RF-03.3: Registro de preinscripción con validaciones de negocio.

- **RF-05.1**: Carga/descarga autorizados por usuario- RF-03.4: Consulta de estado y actualización (según permisos).

- **RF-05.2**: Validación tipos permitidos + antivirus básico

- **RF-05.3**: Asociación archivos → preinscripciones/pagosRF-04 Pagos — Registro y consulta

- **RF-05.4**: Historial cambios + auditoría accesos- RF-04.1: Listado y filtrado por estado, método y fecha.

- RF-04.2: Búsqueda por grupo con preferencia por endpoint legacy y fallback a `/api/payments`.

### RF-06 Notificaciones- RF-04.3: Registro de pago manual (monto, método, referencia, notas).

- **RF-06.1**: Envío email masivo por grupo/curso- RF-04.4: Generación de comprobante/recibo (descarga). 

- **RF-06.2**: Templates personalizables- RF-04.5: Gestión de cuotas e indicadores de vencimiento.

- **RF-06.3**: Seguimiento entrega + métricas apertura

- **RF-06.4**: Cola procesamiento + retry automáticoRF-05 Archivos — Gestión documental

- RF-05.1: Carga/descarga de archivos autorizados por usuario.

---- RF-05.2: Versionado simple o control de reemplazo.

- RF-05.3: Metadatos básicos (tipo, tamaño, autor, fecha).

## ⚙️ RNF - Requerimientos No Funcionales

RF-06 Notificaciones — Comunicaciones

### RNF-01 Performance- RF-06.1: Centro de notificaciones internas.

- **Tiempo respuesta**: <200ms APIs críticas- RF-06.2: Envío de correos masivos (según perfiles y filtros).

- **Carga página**: <3seg first load  - RF-06.3: Registro de actividad (auditoría ligera) asociado a estas acciones.

- **Concurrent users**: 100+ simultáneos

- **Cache**: Redis 15min para métricasRF-07 Seguridad y acceso

- RF-07.1: Autenticación JWT; rutas privadas en frontend.

### RNF-02 Seguridad  - RF-07.2: Autorización por rol/perfil para operaciones sensibles.

- **Autenticación**: JWT (15min access, 7d refresh)- RF-07.3: Auditoría de eventos clave (alta, baja, cambios críticos).

- **Autorización**: RBAC granular por módulo

- **Datos sensibles**: Cifrado AES-256 en reposo---

- **Audit logs**: Todas las acciones críticas

## 4. Requerimientos no funcionales (RNF)

### RNF-03 Disponibilidad

- **Uptime**: 99.5% (4h downtime/mes máx)Calidad y desempeño

- **Backup**: Diario automático + 30 días retención- RNF-01: Tiempo de respuesta p95 de endpoints críticos < 500 ms en condiciones nominales.

- **Recovery**: <4h RTO, <1h RPO- RNF-02: Disponibilidad objetivo >= 99.5% mensual para APIs públicas internas.

- **Monitoring**: Health checks + alertas automáticas- RNF-03: Paginación/limites en listados (por defecto 25, máximo 100) para evitar respuestas excesivas.



### RNF-04 UsabilidadSeguridad

- **Responsive**: Mobile-first design- RNF-04: Tokens JWT con expiración corta y refresh tokens seguros; almacenamiento en memoria/secure storage (no en localStorage cuando aplique políticas organizacionales).

- **Accesibilidad**: WCAG 2.1 AA básico- RNF-05: TLS en tránsito; protección CSRF cuando aplique (rutas web clásicas).

- **Loading states**: Spinners + progress bars- RNF-06: Cumplimiento de principios mínimos de privilegio y registro de auditoría.

- **Error handling**: Mensajes claros + recovery paths

Confiabilidad y pruebas

### RNF-05 Integraciones- RNF-07: Pruebas unitarias y de integración para backend y frontend; ejecución en CI.

- **SQL Server**: Read-only conexión legacy- RNF-08: Contratos estables para endpoints `/api/legacy/*` con pruebas de contrato o mocks.

- **Email**: SMTP + templates HTML- RNF-09: Mecanismo de fallback en frontend cuando el endpoint legacy no esté disponible.

- **Files**: Storage local + URLs firmadas  

- **APIs**: RESTful + OpenAPI docsOperación y despliegue

- RNF-10: Contenedores Docker reproducibles para frontend y backend.

---- RNF-11: Logs estructurados y endpoints de health/readiness/metrics.

- RNF-12: Configuración por entorno vía variables (sin secretos en código).

## 🔄 Priorización Sprint 2

Mantenibilidad

### 🔥 Crítico (Oct 15)- RNF-13: Documentación actualizada en `docs/` con índice en `README.md` y actas asociadas.

- RF-03 (Preinscripciones wizard paso 1)- RNF-14: Versionado semántico en documentación y releases de app.

- RF-04.3 (Registro pagos manual)  - RNF-15: Linting/format en CI, convenciones de código y estilos definidos.

- RNF-02 (JWT + RBAC básico)

Accesibilidad y UX

### 📈 Alto (Oct 20)  - RNF-16: Cumplir con buenas prácticas de contraste y semántica; navegación clara entre 6 módulos.

- RF-01.2 (Dashboard cursos)- RNF-17: Estados de carga/errores visibles; feedback inmediato en acciones clave.

- RF-05.1 (Carga archivos)

- RNF-01 (Performance APIs)---



### 📋 Medio (Oct 25)## 5. Criterios de aceptación (muestra)

- RF-06.1 (Notificaciones básicas)  - Dado que el backend de legacy no responde, cuando el frontend consulte pagos por grupo, entonces el sistema debe intentar el endpoint estándar `/api/payments` y mostrar resultados o un mensaje claro de “sin datos”.

- RF-02.4 (CRUD cursos)- Dado un curso con `price` y `enrollment_count`, cuando se muestre “Recaudado vs Esperado”, entonces el valor esperado será `price * enrollment_count` y el recaudado estimado será `price * payment_status_summary.al_dia` hasta contar con el agregado real del backend.

- RNF-03 (Monitoring básico)- Dado que un usuario autenticado busca por RUT en Preinscripciones, cuando exista coincidencia, entonces los campos de nombre y correo se autocompletan.



------



## ✅ Criterios Aceptación Global## 6. Trazabilidad

- RF-01 y RF-02 enlazan con `src/views/Dashboard.vue` y `src/views/Courses.vue`.

1. **Todos los RF críticos** implementados + tests- RF-03 enlaza con `src/views/PreinscripcionWizard.vue` y backend `users/views.py` (search-by-rut).

2. **Performance RNF-01** cumplida en APIs críticas  - RF-04 enlaza con `src/views/Pagos.vue` y backend de pagos (próximo endpoint legacy by-group).

3. **Seguridad RNF-02** JWT + RBAC funcional- RNF-07/08/09 se validan mediante Vitest, pytest-django y/o mocks/fallbacks.

4. **Documentación** OpenAPI + README actualizado

5. **Deploy staging** automático desde main---



---## 7. Pendientes y notas

- Recaudado real por curso desde SQL Server (agregado backend) para reemplazar el estimado.

*Documento optimizado: eliminadas redundancias, mantenida información crítica*  - Endpoint `/api/legacy/payments/by-group/` en backend.

*Próxima revisión: Post Sprint 2 (26-10-2025)*- Diagrama actualizado de integraciones (añadir a `docs/assets`).
