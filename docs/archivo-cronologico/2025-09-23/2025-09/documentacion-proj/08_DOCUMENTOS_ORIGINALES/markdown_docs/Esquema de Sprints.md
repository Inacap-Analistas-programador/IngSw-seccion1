# Esquema de Sprints

## Prioridad Inmediata (poner primero)

### Finalizar DRS (Documento de Requerimientos)
- **Descripción:** Consolidar RF 01–26, RNF, flujos, tablas y migración en un único DRS final.
- **Criterio de aceptación:** Documento completo en el lienzo con firma/versión; aprobado por cliente/coord.
- **Sprint sugerido:** Sprint 1.

### Definir metodología y plan de sprints
- **Descripción:** Decidir duración de sprint, roles (Scrum Master, Product Owner), y calendario inicial.
- **Criterio de aceptación:** Roadmap de sprints 1–6 publicado y compartido.
- **Sprint sugerido:** Sprint 1.

### Modelo de datos preliminar (ERD)
- **Descripción:** Diseñar ERD con tablas: users, personas, preinscripciones, pagos, group_payment_batches, archivos, audit_logs, communication_logs, etc.
- **Criterio de aceptación:** ERD revisado por al menos 1 dev backend y 1 coordinador; disponible en repo/wiki.
- **Sprint sugerido:** Sprint 1.

### Plan y script de migración (inventario XLSM)
- **Descripción:** Inventario de hojas/columnas del Curso Medio 2025_06.xlsm, mapping columna→campo BD y plan ETL.
- **Criterio de aceptación:** Plantilla de mapeo entregada; plan de migración con fases y backups.
- **Sprint sugerido:** Sprint 1.

### Prototipo UX: Landing + Hero + CTA (wireframe final)
- **Descripción:** Convertir wireframe a prototipo (alta fidelidad) del landing con CTA “Realizar Preinscripción”.
- **Criterio de aceptación:** Mockup aprobado por organización; link o PNG disponible.
- **Sprint sugerido:** Sprint 1.

### Prototipo UX: Wizard de preinscripción (pantallas clave)
- **Descripción:** Mockups de pasos críticos: Datos personales, Salud, Adjuntar ficha, Revisión.
- **Criterio de aceptación:** Flujos de navegación, validaciones y mensajes de error definidos en prototipo.
- **Sprint sugerido:** Sprint 1.

## Prioridad Alta (para arrancar desarrollo después de documentación)

### Configurar repositorios y CI/CD básico
- **Descripción:** Crear repositorios frontend/backend, pipeline básico (lint, tests), entornos dev/staging/prod.
- **Criterio de aceptación:** Push inicial con README y pipeline que corre (al menos lint).
- **Sprint sugerido:** Sprint 2.

### Autenticación y gestión de usuarios (esqueleto API)
- **Descripción:** Endpoints auth (register/login/forgot), creación de cuenta al preinscribir.
- **Criterio de aceptación:** Registro/login funcional en entorno dev; token JWT válido.
- **Sprint sugerido:** Sprint 2.

### Implementar esquema de roles (RBAC) base y asignación por Admin
- **Descripción:** Roles (Admin, Coordinador, Validador Grupo/Distrito, Finanzas, Participante) y control de ámbito.
- **Criterio de aceptación:** Middleware de autorización y panel simple para asignar roles.
- **Sprint sugerido:** Sprint 2.

### API y CRUD base para Preinscripciones
- **Descripción:** Crear endpoints para crear/leer/editar preinscripciones, con estados y audit logging.
- **Criterio de aceptación:** Crear una preinscripción desde Postman y ver entry en audit_logs.
- **Sprint sugerido:** Sprint 2–3.

### Subida segura de archivos (ficha médica) y storage
- **Descripción:** Endpoints y UI para upload; integración con escaneo AV o flag de validación.
- **Criterio de aceptación:** Archivo subido, metadata en DB, rechazo por tipo/size.
- **Sprint sugerido:** Sprint 2–3.

## Prioridad Media (funcionalidades operativas)

### Importador de pagos grupales (batch) + validaciones
- **Descripción:** UI y backend para subir CSV/XLSX, mapear columnas, preview, ejecutar y revertir.
- **Criterio de aceptación:** Subida de lote de prueba con 100 filas; report de errores y posibilidad de undo.
- **Sprint sugerido:** Sprint 3.

### Panel Finanzas: registro de pago individual (búsqueda por RUT)
- **Descripción:** UI para buscar por RUT y registrar pagos, adjuntar comprobantes.
- **Criterio de aceptación:** Pago registrado aparece en DB y actualiza dashboard.
- **Sprint sugerido:** Sprint 3.

### Regla de confirmación por pago (configurable)
- **Descripción:** Implementar parametro admin confirmar_con_primer_pago que actualiza estado a Confirmado.
- **Criterio de aceptación:** Al registrar pago que cumple regla, preinscripción pasa a Confirmado y envía correo.
- **Sprint sugerido:** Sprint 3.

### Panel Admin: Habilitación / Selección Manual + Export de correos
- **Descripción:** Interfaz multiselección para marcar habilitado, exportar lista de emails y logear el envío.
- **Criterio de aceptación:** Export contiene columnas requeridas y la marcación queda registrada.
- **Sprint sugerido:** Sprint 3.

## Prioridad Baja (completar y pulir)

### Dashboards iniciales (KPIs básicos)
- **Descripción:** Tarjetas y filtros: inscritos totales, pagos vs pendientes, fichas sin adjunto.
- **Criterio de aceptación:** Dashboard muestra datos reales en staging.
- **Sprint sugerido:** Sprint 4.

### Panel de Validadores (Group/District) — lista y acciones
- **Descripción:** Ver cola por ámbito, aprobar/observar/rechazar con comentarios.
- **Criterio de aceptación:** Acción cambia estado y notifica al participante; log en audit.
- **Sprint sugerido:** Sprint 4.

### Panel Acreditación Manual
- **Descripción:** Checklist verificaciones y marcar asistencia.
- **Criterio de aceptación:** Registro de acreditación manual por staff.
- **Sprint sugerido:** Sprint 4.

### Comunicación: registrar envíos masivos y cobranza (logs)
- **Descripción:** UI para marcar envíos externos y registrar campañas de cobranza.
- **Criterio de aceptación:** Envíos listados en communication_logs con filtros y export.
- **Sprint sugerido:** Sprint 4.

### Pruebas (unitarias/integración) y pruebas de carga
- **Descripción:** Definir casos de prueba críticos y escenario de carga (200–500 usuarios).
- **Criterio de aceptación:** Suite de tests automatizados en CI; resultado de carga documentado.
- **Sprint sugerido:** Sprint 5.

### Despliegue piloto y formación
- **Descripción:** Deploy a producción piloto, manuales y sesión de capacitación.
- **Criterio de aceptación:** Go-live en ventana acordada y usuarios clave entrenados.
- **Sprint sugerido:** Sprint 6.