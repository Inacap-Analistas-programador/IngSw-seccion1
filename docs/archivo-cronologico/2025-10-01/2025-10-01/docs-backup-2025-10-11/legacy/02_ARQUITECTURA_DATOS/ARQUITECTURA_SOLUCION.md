# Arquitectura de la Solución

> Versión: 0.1 (Borrador)  
> Fecha: 2025-09-23  
> Alcance: Plataforma de Preinscripción, Pagos y Gestión (Scouts)  

---
## 1. Resumen Ejecutivo
La solución soporta el ciclo completo: Preinscripción → Validaciones → Pagos → Confirmación → Acreditación → Comunicación y Seguimiento. Se adopta arquitectura modular basada en servicios (monolito modular evolutivo a microservicios) con capas bien definidas, alta trazabilidad (audit & communication logs) y diseño preparado para escalar horizontalmente.

## 2. Objetivos Arquitectónicos
- Time-to-market rápido (primer release funcional tras Sprints 1–3) con base técnica sostenible.
- Seguridad y cumplimiento (control de acceso por rol y ámbito, protección de datos sensibles, trazabilidad completa).
- Escalabilidad progresiva (de 200–500 usuarios concurrentes previstos a picos estacionales mayores).
- Observabilidad desde el inicio (logs estructurados, métricas, trazas distribuidas).
- Migración segura de datos históricos (plan ETL versionado y auditable).
- Minimizar riesgo de vendor lock-in (uso de estándares abiertos: ANSI SQL sobre Microsoft SQL Server, OpenTelemetry, JWT, S3-compatible storage).

## 3. Alcance Funcional (Resumen Dominios)
| Dominio | Descripción | Entidades Clave |
|---------|-------------|-----------------|
| Identidad & Cuentas | Registro/login, recuperación, roles | users, roles, role_assignments, sessions |
| Perfil / Persona | Datos personales y salud | personas, health_info |
| Preinscripciones | Alta, edición, estados, adjuntos | preinscripciones, preinscripcion_estado_hist |
| Pagos | Registro individual y batch | pagos, group_payment_batches, payment_errors |
| Confirmación | Reglas automáticas por pago | configuraciones, preinscripciones |
| Validación Territorial | Aprobaciones por ámbito (grupo/distrito) | validation_tasks, audit_logs |
| Archivos | Gestión documental (ficha médica, comprobantes) | archivos, archivo_versiones |
| Comunicación | Registro de envíos/campañas | communication_logs, campaign_defs |
| Auditoría | Trazabilidad acciones | audit_logs |
| Acreditación | Asistencia y verificación presencial | acreditaciones |
| Dashboard & Reportes | KPIs para gestión | views/materialized dashboards |
| Migración | Inventario y carga desde XLSM | migration_jobs, migration_mappings, migration_errors |

## 4. Requisitos No Funcionales (RNF) (Inferidos)
| Área | Objetivo | Métrica Inicial |
|------|----------|----------------|
| Disponibilidad | Operativa en horario laboral extendido | >= 99.5% (fase inicial) |
| Rendimiento | Crear preinscripción | < 2s p95 |
| Seguridad | Protección datos personales/salud | Cifrado en tránsito + campos sensibles en reposo |
| Escalabilidad | Incrementar 2× usuarios sin rediseño | Horizontal stateless API |
| Observabilidad | Trazabilidad completa acción→audit | 100% endpoints generan entry audit |
| Backup & DR | RPO 24h / RTO 8h inicial | Backups diarios + pruebas trimestrales |
| Mantenibilidad | Despliegue automatizado | Pipeline CI/CD completo Sprint 2 |

## 5. Arquitectura Lógica por Capas
```
[Presentación]
  Web SPA (React/Vue) + Public Landing
[API Gateway / Edge]
  Nginx / Traefik (TLS, rate limiting básico)
[Capa Aplicación]
  Backend Monolito Modular (Node.js / NestJS o Java Spring Boot) -> Dominios separados por bounded contexts
[Capa Servicios de Soporte]
  Auth (JWT), RBAC, File Service, Payment Import Service, Notification Logging
[Capa Persistencia]
  Microsoft SQL Server (OLTP) + Redis (cache de sesiones & lookups) + Almacenamiento Objetos (S3/MinIO)
[Integraciones / Infra]
  Servicio de correo (SMTP/API), Antivirus (clamd / servicio externo), Herramienta ETL
[Observabilidad]
  Prometheus / Grafana, Loki (logs) / ELK (alternativa), Jaeger (trazas)
```

### 5.1 Estrategia Evolutiva
- Fase 1 (Sprints 1–3): Monolito modular (carpetas: auth, preinscripcion, pagos, archivos, validacion, reporting) + DB única.
- Fase 2 (Sprints 4–5): Extraer Payment Import y File Processing como microservicios si la carga o SLAs lo justifican.
- Fase 3 (Post-GoLive): Segregar Reporting (OLAP / Data Warehouse ligero con replicación lógica).

## 6. Diagrama de Componentes (Descripción Textual)
- Frontend SPA: Consume API REST JSON (JWT Bearer). Administra estado en local storage / memory.
- Backend API: Exposición REST + futura GraphQL/Events. Autenticación (JWT), autorización (middleware RBAC scope-aware).
- File Service: Endpoints presign (PUT) + validación AV + metadata DB.
- Payment Batch Processor: Cola de jobs (RabbitMQ opcional; si no, tabla jobs + workers) para procesar XLSX → staging → validaciones → commit transaccional.
- Notification Logger: Interceptor que registra intentos de envío (no envía masivo directamente en fase inicial).
- Audit Logger: Middleware transversal; persistencia asincrónica (queue) para no impactar latencia.

## 7. Modelo de Datos (Resumen Entidades PowerDesigner)
El `.pdg` oficial define un modelo normalizado con dominios agrupados. Resumen de tablas principales:

- **Geografía:** `REGION`, `PROVINCIA`, `COMUNA` (catálogos jerárquicos con `REG_VIGENTE`, `PRO_VIGENTE`, `COM_VIGENTE`).
- **Organización Scout:** `ZONA`, `DISTRITO`, `GRUPO`, `RAMA`, `NIVEL`, `CARGO`, `ROL`.
- **Cursos:** `CURSO`, `CURSO_SECCION`, `CURSO_FECHA`, `CURSO_COORDINADOR`, `CURSO_FORMADOR`, `CURSO_CUOTA`, `CURSO_ALIMENTACION`.
- **Personas:** `PERSONA`, `PERSONA_CURSO`, `PERSONA_GRUPO`, `PERSONA_NIVEL`, `PERSONA_FORMADOR`, `PERSONA_INDIVIDUAL`, `PERSONA_ESTADO_CURSO`, `PERSONA_VEHICULO`.
- **Finanzas:** `PAGO_PERSONA`, `PAGO_CAMBIO_PERSONA`, `PREPAGO`, `COMPROBANTE_PAGO`, `PAGO_COMPROBANTE`, `CONCEPTO_CONTABLE`, `PROVEEDOR`.
- **Archivos y catálogos auxiliares:** `ARCHIVO`, `ARCHIVO_CURSO`, `ARCHIVO_PERSONA`, `TIPO_ARCHIVO`, `TIPO_RENDICION`, `TIPO_DOCTO_RENDICION`, `TIPO_MATERIALES`, `ALIMENTACION`.

Todas las claves primarias son numéricas (`numeric(10)`), las banderas de vigencia utilizan `bit`, y las relaciones están explícitamente definidas mediante claves foráneas (`FK_`).

### 7.1 Consideraciones
- Índices sugeridos: `PERSONA(PER_RUN, PER_DV)`, `CURSO(CUR_ESTADO, CUR_FECHA_HORA)`, `PAGO_PERSONA(CUR_ID, PER_ID)`, `PERSONA_ESTADO_CURSO(PEC_ID, PEU_FECHA_HORA DESC)`.
- Sin particionamiento inicial; considerar partición por año en tablas de auditoría (`PERSONA_ESTADO_CURSO`, `PAGO_PERSONA`) a futuro mediante `PARTITION SCHEME`.
- Campos sensibles (salud, emergencia) gestionados con cifrado transparente: Always Encrypted o Column Encryption Keys.

## 8. Flujos Críticos (Resumen)
1. Preinscripción: Usuario → Wizard → Validaciones de formulario → Persistencia → Estado: BORRADOR → ENVIADA.
2. Subida Ficha Médica: Solicitud URL prefirmada → Upload → AV Scan → Estado archivo VALIDADO/RECHAZADO.
3. Pago Individual: Buscar por RUT → Registrar → Evaluar regla confirmar_con_primer_pago → Actualizar estado + audit + communication.
4. Import Batch Pagos: Subir XLSX → Staging → Validaciones (RUT, duplicados, montos) → Commit → Resumen errores.
5. Validación Territorial: Lista pendientes por ámbito → Aprobación/Observación → Historial estado.
6. Confirmación Automática: Trigger por pago elegible (event handler o hook DB) → Cambia estado + email.

## 9. Arquitectura Física / Despliegue
### 9.1 Ambientes
| Ambiente | Propósito | Branch Fuente | URL |
|----------|-----------|---------------|-----|
| Dev | Integración continua | develop | dev.example.org |
| Staging | QA / UAT | main (tag pre-release) | staging.example.org |
| Prod Piloto | Go-live controlado | release/* | app.example.org |

### 9.2 Infraestructura (Inicial)
- Servidor Principal (Dell PowerEdge) Virtualizado (Hyper-V / Proxmox) con 2–3 VMs.
- Alternativa Cloud (si se decide): AWS Lightsail / EC2 T-series + S3 + RDS.

### 9.3 Topología Inicial (On-Prem / Híbrido)
```
[Internet]
  | HTTPS (443)
[Reverse Proxy / LB]
  |--> VM API (Docker: api, worker, file-service)
  |--> VM Frontend (Nginx + archivos estáticos SPA)
  |--> VM DB & Storage (Microsoft SQL Server, Redis, MinIO) *Separar DB en fase 2
```

### 9.4 Red y Seguridad
- Segmentos: DMZ (Proxy/Frontend), App (API/Workers), Data (DB/Storage). Firewalls restringen puerto 1433 solo a App.
- TLS obligatorio extremo a extremo. Certificados renovados (Let's Encrypt / ACME client).

## 10. Dimensionamiento Hardware (Estimación Inicial)
| Componente | vCPU | RAM | Almacenamiento | Notas |
|------------|------|-----|----------------|-------|
| Frontend + Proxy | 1–2 | 1–2 GB | 10 GB | Estático + Nginx, baja carga CPU |
| API / Worker | 2–4 | 4–6 GB | 40 GB | Node/Spring; CPU-bound en importaciones |
| DB SQL Server | 4 | 12 GB | 150 GB (SSD) | Crecimiento audit + adjuntos en storage separado |
| Redis Cache | (compartido) | 512 MB | - | Persistencia AOF opcional |
| MinIO / S3 | 2 | 4 GB | 200 GB | Archivos (fichas, comprobantes). Escalable |
| Antivirus (clamd) | 1 | 1 GB | 5 GB | Puede convivir en API VM fase inicial |

Escalado: API horizontal (réplicas detrás de reverse proxy). DB vertical/future read replica.

## 11. Seguridad y Cumplimiento
- Autenticación: JWT (HS256 dev / RS256 prod con rotación y endpoint JWKS futuro).
- Autorización: Middleware RBAC + filtros por scope (grupo, distrito).
- Protección Datos: Cifrado en tránsito (TLS), cifrado selectivo de campos sensibles (salud) + hashing fuerte (argon2id) de contraseñas.
- Validación Entrada: Librería central (sanitización, rate limit por IP en endpoints sensibles).
- Gestión Secretos: Variables entorno + vault (fase 2). No exponer en repositorios.
- Backups: SQL Server nightly (`BACKUP DATABASE` + `BACKUP LOG`) → repositorio cifrado offsite; MinIO replicado semanal.
- Antivirus: Escaneo de ficheros (clamd) + restricción MIME/size + hash SHA-256.
- Auditoría: 100% endpoints mutativos crean audit_logs (asíncrono). Retención 24 meses; archivado frío posterior.

## 12. Observabilidad y Operaciones
| Área | Herramienta | Métricas Clave |
|------|-------------|----------------|
| Logs | Loki / ELK | Errores p95, timeouts, eventos seguridad |
| Métricas | Prometheus | RPS, latencias, errores, uso DB, colas jobs |
| Trazas | OpenTelemetry + Jaeger | Flujo pago, importaciones |
| Alertas | Grafana Alerting | Latencia API > 2s p95, errores 5xx > 2%, espacio disco < 20% |
| CI/CD y Calidad | GitHub Actions + SonarQube | Build, test, análisis estático, quality gate obligatorio |
| Gestión Ágil | Jira Software | Planificación Sprints, tableros Kanban, trazabilidad commit→issue |

## 13. Estrategia CI/CD (Sprint 2 Objetivo)
Pipeline (main & develop):
1. **Integridad código:** lint + unit tests (`pytest`, `npm test`) enlazados a issues Jira (convención `PROY-###`).
2. **Análisis SonarQube:** ejecución de `sonar-scanner` con Quality Gate (cobertura ≥ 80 %, cero vulnerabilidades críticas). Si falla, se bloquea el job siguiente y se notifica al tablero Jira.
3. **Build & Container Security:** construir imágenes Docker (tag + commit SHA) y escanear con Trivy.
4. **Deploy automatizado:** Dev/staging automáticos tras aprobar Quality Gate. Producción requiere release + aprobación dual registrada como Deployment en Jira.
5. **Migraciones DB:** aplicar migraciones automatizadas tras smoke-test en staging; resultados se adjuntan al issue correspondiente en Jira.

## 14. Gestión de Datos y Migración
La estrategia de migración se implementa mediante un subsistema desacoplado que opera en modo batch controlado.

### 14.1 Inventario y Mapeo
Fuente principal: `Curso Medio 2025_06.xlsm`, `Pagos CM 2025.xlsx`, `PreRegistro CM - Zona Biobío_EXCEL.xlsx`.
El archivo `mappings.yml` define por cada fuente: columnas origen → campos normalizados, claves naturales y reglas de normalización (RUT, email, teléfono).

### 14.2 Staging Layer
Tablas creadas (ver `schema_extension.sql`):
```
migration_batch(id, source_name, file_hash, total_rows, inserted_at)
stg_preinscripciones(..., _errores, _batch_id FK)
stg_pagos(..., _errores, _batch_id FK)
```
Reglas:
- Prefijo `stg_` reservado a ingestiones temporales.
- Cada fila registra `_errores` para clasificación (no se descarta automáticamente salvo error crítico en consolidación).
- Índices sobre RUT y referencia de pago para conciliación.

### 14.3 Proceso ETL (Versión 0.1)
1. Validación existencia archivo y lectura (pandas).
2. Cálculo hash SHA-256 para idempotencia (skip si file_hash ya existe para la misma fuente salvo `--force`).
3. Normalización: RUT (formato sin puntos, con DV), email lowercase, teléfono dígitos.
4. Validaciones mínimas (RUT y email) → anotación en `_errores`.
5. Inserción staging + registro en `migration_batch` (transacción).
6. (Pendiente) Consolidación hacia entidades finales (`users`, `preinscripciones`, `pagos`).

### 14.4 Consolidación (Planificada)
Algoritmo (preinscripciones):
```
FOR each stg_preinscripciones WHERE _errores = '' OR solo_warnings:
  UPSERT usuario (clave: rut)
  RESOLVER curso (si existe Course) -> crear si no
  UPSERT preinscripcion (rut + curso)
  LOG cambios en audit_logs
```
Pagos:
```
MATCH por referencia (si existe) ELSE (rut + fecha_pago + monto ± tolerancia)
CREATE pago si no duplicado
SI regla curso.confirmar_con_primer_pago => actualizar estado preinscripcion
```

### 14.5 Calidad y Reglas
Errores críticos: RUT inválido, monto <= 0, fecha fuera de rango. Criterio abortar batch: > 5% filas críticas.
Warnings: email inválido, comuna/region desconocida (normalización heurística), teléfono corto.

### 14.6 Auditoría e Idempotencia
- `migration_batch` garantiza tracking por fuente & hash.
- Re-ejecución controlada con flag `--force` (crea nuevo batch, no borra histórico).
- Futuro: tabla `migration_errors` detallada por fila y código.

### 14.7 Roadmap Migración
| Fase | Entregable | Estado |
|------|------------|--------|
| 1 | Staging + batch log + script extracción | Completo |
| 2 | Consolidación upsert entidades destino | Pendiente |
| 3 | Reporte reconciliación + métricas | Pendiente |
| 4 | Comando Django + RBAC `DATA_ADMIN` | Pendiente |
| 5 | Automatización CI (dry-run) | Pendiente |
| 6 | Limpieza staging + archivado | Pendiente |

### 14.8 Riesgos Específicos Migración
| Riesgo | Mitigación |
|--------|------------|
| Duplicados múltiples RUT+curso | Estrategia first-win + reporte divergencias |
| Pagos sin preinscripción asociada | Generar cola de resolución manual |
| Cambios de esquema en nuevos Excel | Validación esquema previo + versionado mapping |
| Alto % errores críticos | Abort batch y análisis previo de reglas |

---

## 15. Riesgos y Mitigaciones
| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Carga no estimada en import batch | Degradación API | Job en worker aislado + colas + throttling |
| Falta de antivirus operativo | Riesgo seguridad | Healthcheck clamd y bloqueo si no disponible |
| Campos sensibles exposición | Incumplimiento | Cifrado + revisión manual campos antes go-live |
| Falta de backups verificados | Pérdida datos | Restauraciones de prueba trimestrales |
| Escalada requisitos reporting | Penaliza OLTP | Replicación lógica a DB reporting fase 2 |

## 16. Roadmap Técnico Vinculado a Sprints
| Sprint | Entregables Arquitectónicos |
|--------|----------------------------|
| 1 | DRS final, ERD base, Plan Migración, Prototipos UX |
| 2 | Repos + CI/CD, Auth + RBAC base, CRUD Preinscripciones (MVP), Subida archivos básica |
| 3 | Pagos batch + reglas confirmación, Panel Finanzas, Panel Admin habilitación |
| 4 | Dashboards, Panel Validadores, Acreditación, Comunicación logs |
| 5 | Pruebas carga, Endurecimiento seguridad, Refactor modular avanzado |
| 6 | Despliegue piloto, Formación, Plan Operación continua |

## 17. Cobertura de Requisitos (Mapa)
| Requisito / Feature | Componente | Estado (Objetivo) |
|---------------------|-----------|-------------------|
| Registro/Login | Auth Service/API | Sprint 2 |
| Roles & Perfiles | RBAC Middleware | Sprint 2 |
| Preinscripción Wizard | Frontend + API Preinscripciones | Sprint 2–3 |
| Adjuntar Ficha Médica | File Service + Antivirus | Sprint 2–3 |
| Pagos Individuales | API Pagos | Sprint 3 |
| Import Batch Pagos | Payment Batch Processor | Sprint 3 |
| Confirmación Automática | Rule Engine (configuraciones) | Sprint 3 |
| Validación Territorial | Validation Module | Sprint 4 |
| Dashboards | Reporting / Materialized Views | Sprint 4 |
| Acreditación | Acreditación Module | Sprint 4 |
| Comunicación Masiva | Communication Logger | Sprint 4 |
| Auditoría Total | Audit Logger | Sprint 2 (baseline) |
| Migración Datos XLSM | Migration Subsystem | Sprint 3 (ejecución) |
| Pruebas Carga | Performance Suite | Sprint 5 |
| Despliegue Piloto | Infra + Operaciones | Sprint 6 |

## 18. Próximos Pasos Inmediatos (Sprint 2)
1. Ajustar ERD definitivo y generar migraciones iniciales.
2. Inicializar repos (frontend/backend) con pipeline y convenciones de código.
3. Implementar módulo Auth (registro/login/forgot password) + hashing argon2.
4. Implementar RBAC (roles, asignación, middleware) + endpoints de prueba.
5. CRUD preinscripciones (create/read/update estados controlados) + audit logs.
6. Servicio de Upload con pre-signed URL (o endpoint directo) + scan stub (mock hasta clamd real).
7. Definir estructura de logs y tracer provider (OpenTelemetry). 

---
## 19. Aprobaciones
| Rol | Nombre | Fecha | Firma |
|-----|--------|-------|-------|
| Product Owner | | | |
| Tech Lead | | | |
| Coordinación | | | |

---
Documento generado automáticamente como base inicial. Actualizar versión al aprobar.
