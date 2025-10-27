# Evaluación Sumativa 3
## Interfaces, Codificación, Base de Datos y Configuración del Entorno
Versión: 0.1 (Borrador)  
Fecha: 2025-09-23  
Proyecto: Plataforma de Preinscripción y Gestión Scouts  

---
## 1. Introducción
Este informe documenta la construcción de interfaces, la codificación base de la solución, la implementación de la base de datos y la configuración del entorno que soportará la aplicación. Se continúa el trabajo de la Evaluación 1 aplicando correcciones pendientes y consolidando el stack tecnológico definitivo.

## 2. Stack Tecnológico Seleccionado
| Capa | Tecnología | Justificación | Alternativas Evaluadas |
|------|------------|---------------|------------------------|
| Frontend SPA | Vue 3 + Vite + Tailwind CSS + Pinia + Vue Router | Performance en desarrollo (Vite), composición modular (Composition API), estilos consistentes (Tailwind), estado centralizado moderno (Pinia). | React + Next.js, Vue 2 + Webpack |
| Validación Formularios | VeeValidate + Yup | Reglas declarativas, integración nativa con Composition API. | FormKit, custom validators |
| Backend API | Django 5.x + Django REST Framework | Productividad alta, ORM robusto, ecosistema maduro, autenticación y permisos integrables. | FastAPI (alternativa ligera), Node/NestJS |
| ORM / Acceso Datos | Django ORM | Cohesión con DRF y migraciones integradas. | SQLAlchemy, Tortoise ORM |
| Autenticación API | JWT (SimpleJWT) + Django AllAuth (opcional para flujos sociales) | Estándar para SPAs, refresh tokens controlados. | Session Auth, OAuth externo (Auth0) |
| BD Principal | PostgreSQL 15 | Integridad relacional, JSONB para campos flexibles, extensiones (pgcrypto). | MySQL/MariaDB, MongoDB (NoSQL) |
| Almacenamiento Archivos | S3 compatible (MinIO en dev, bucket remoto en prod) | Escalabilidad, separación de concerns, presigned URLs. | FileSystem local, Azure Blob |
| Cache / Rate Limit | Redis | Sesiones, throttling login, colas ligeras. | Memcached |
| Procesamiento Asíncrono | Celery + Redis broker | Jobs de importación y antivirus. | RQ, Dramatiq |
| Escaneo Antivirus | ClamAV (clamd) | Open source y scriptable. | Servicio comercial |
| Observabilidad | OpenTelemetry + Prometheus + Grafana + Loki | Métricas, trazas y logs integrados. | ELK stack solo, Datadog (SaaS) |
| Contenedores | Docker / Docker Compose | Paridad entornos, despliegue reproducible. | Podman, no-containers (VM manual) |
| CI/CD | GitHub Actions | Integración rápida con repos y secretos. | GitLab CI, Jenkins |
| Infra Hosting | Hostinger VPS (Ubuntu 22.04) | Costo accesible + control root; posibilidad de escalar. | AWS EC2, DigitalOcean |

### 2.1 Racional de No Usar Solo FastAPI
FastAPI es rápido para prototipado, pero DRF + Django ofrece administración integrada, ORM y ecosistema maduro (auth, permisos, migraciones) acelerando entregables tempranos críticos (Sprint 2–3). Se mantiene opción de microservicio FastAPI específico futuro (por ejemplo, OCR o procesamiento batch) si surge necesidad.

## 3. Arquitectura de Código (Visión)
Frontend desacoplado (SPA) consume API REST JSON. Backend Django estructurado en apps modulares por dominio:
```
backend/
  manage.py
  core/           # settings, config, security hardening
  users/          # auth, perfiles, roles
  preinscriptions/
  payments/
  files/
  validation/
  communications/
  accreditation/
  audit/
  config/
```
Principios: Single Responsibility, separación lectura/escritura donde aplique (servicios), validación centralizada, DTOs/serializers DRF.

## 4. Interfaces de Usuario (Mapa)
| Código | Pantalla | Descripción | Rol Primario | Requerimientos Cubiertos |
|--------|----------|-------------|--------------|--------------------------|
| UI-01 | Landing + CTA | Acceso a registro / login y explicación proceso | Público | Registro inicial |
| UI-02 | Registro Usuario | Formulario creación cuenta | Público | HU-Auth-001 |
| UI-03 | Login | Inicio sesión y recuperación | Usuario | HU-Auth-002 |
| UI-04 | Dashboard Usuario | Resumen estado preinscripción y acciones pendientes | Participante | Estado flujo |
| UI-05 | Wizard Preinscripción (Pasos) | Datos Personales → Salud → Documentos → Revisión → Enviar | Participante | HU-Pre-* |
| UI-06 | Subida Ficha Médica | Selección archivo y estado validación | Participante | HU-File-001 |
| UI-07 | Administración Usuarios/Roles | Asignar roles, ver usuarios | Admin | HU-Auth-003 / RBAC |
| UI-08 | Lista Preinscripciones (Admin) | Filtro por estado, búsqueda | Admin/Coordinador | Gestión |
| UI-09 | Validación Territorial | Aprobación/Observación | Validador | Validación |
| UI-10 | Registro Pago Individual | Buscar por RUT y registrar | Finanzas | Pagos |
| UI-11 | Importar Pagos Batch | Subir XLSX, preview, errores | Finanzas | Batch |
| UI-12 | Panel Confirmaciones | Config regla confirmación | Admin | Confirmación |
| UI-13 | Comunicación Logs | Lista de envíos/campañas | Admin | Communication |
| UI-14 | Acreditación | Marcar asistencia | Staff Acreditación | Acreditación |
| UI-15 | Dashboard KPIs | KPIs y filtros | Dirección | Reporting |

Wireframes basados en prototipos previos; Tailwind + componentes reutilizables (botones, formularios, modales, alertas).

## 5. Guía de Estilo Frontend
- Colores: Paleta basada en identidad Scouts (primario verde #1B6B34, acento amarillo #F2C94C, neutros grises).
- Tipografía: Inter / fallback system-ui.
- Escalas: Spacing 4px, breakpoints Tailwind default.
- Componentes Base: `<AppButton/>`, `<AppCard/>`, `<FormField/>`, `<StateBadge/>`, `<DataTable/>`.
- Accesibilidad: Contraste WCAG AA, labels asociados, focus rings visibles.

## 6. Seguridad de Codificación
| Riesgo | Mitigación |
|--------|-----------|
| Inyección SQL | ORM + queries parametrizadas |
| XSS | Escapado by default + sanitización entrada (bleach para rich text si aplica) |
| CSRF | Tokens CSRF en endpoints form-based (solo si SSR parcial); SPA usa JWT (no cookies) |
| Broken Auth | JWT expiración corta + refresh + bloqueo intentos |
| Directory Traversal (archivos) | Validar rutas y usar storage aislado |
| Upload malicioso | ClamAV + validación MIME + tamaño |
| Exposición datos sensibles | Serializers controlados + cifrado campos salud |

## 7. Base de Datos (Modelo y Normalización)
Nivel 3FN excepto logs (desnormalizados para performance). Uso de JSONB para flexibilidad mínima (salud, metadata archivo).

Tablas clave (resumen) ya descritas en `02_ARQUITECTURA_DATOS/ARQUITECTURA_SOLUCION.md`. Este informe incluye script inicial (ver Anexo A).

## 8. Procedimientos / Funciones Almacenadas (Inicial)
| Código | Propósito | Tipo |
|--------|-----------|------|
| fn_calcula_estado_confirmacion(preinscripcion_id) | Determina si pasa a CONFIRMADO según pagos | FUNCTION |
| sp_registra_pago(preinscripcion_id, monto, medio, user_id) | Inserta pago + evalúa confirmación | PROCEDURE |
| sp_import_batch_finalize(batch_id) | Consolida staging a pagos definitivos | PROCEDURE |
| fn_kpi_preinscripciones(resumen_json) | Retorna totals por estado | FUNCTION |
| fn_search_persona(term) | Búsqueda flexible RUT/nombre | FUNCTION |

## 9. Entorno y Configuración
### 9.1 Entorno Local
Docker Compose servicios: postgres, redis, minio, clamd, backend, frontend.
Variables: `.env` (APP_ENV, DB_*, REDIS_URL, MINIO_*, JWT_SECRET / KEYS, ENABLE_AV_SCAN=false dev).

### 9.2 Staging / Producción (Hostinger VPS)
- Sistema: Ubuntu 22.04 LTS
- Reverse Proxy: Nginx (TLS Let's Encrypt certbot cron)
- Backend: Gunicorn + Uvicorn workers (ASGI) / o WSGI clásico (decidir según websockets futuros)
- Supervisor/PM2: systemd units para gunicorn + celery worker + beat.
- Almacenamiento: MinIO local (fase inicial) → migración a bucket externo si crecimiento.
- Backups: pg_dump nightly + sync objetos (rclone) → almacenamiento remoto cifrado.

### 9.3 Configuración Seguridad Servidor
- Fail2Ban SSH + rate limit Nginx auth endpoints.
- Actualizaciones automáticas de seguridad (unattended-upgrades).
- Firewall (ufw): 22, 80, 443 (internos: 5432 sólo localhost o red privada).

## 10. Pipeline CI/CD
Eventos: PR → Lint/Test; Merge develop → Build + Deploy Dev; Tag `v*` → Deploy Staging; Aprobación manual → Prod.
Etapas: Install deps → Lint (flake8 + black check) → Tests (pytest + coverage) → Build Docker → Scan (Trivy) → Push Registry → Run migrations → Deploy.

Convención Ramas: main (stable), develop, feature/*, hotfix/*.
Versionado SemVer (Mayor.Menor.Patch). Migraciones atómicas con fallback.

## 11. Riesgos Específicos Evaluación 2
| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Retraso interfaz Wizard | Bloquea pruebas flujo | Dividir en pasos incrementales (solo datos básicos primero) |
| Falta AV operativo | Vulnerabilidad archivos | Flag feature + cola diferida |
| Under/Over Engineering microservicios | Retraso | Mantener monolito modular hasta carga exige separar |
| Lenta importación pagos | Mal UX | Procesar asíncrono + feedback progreso |
| Configuración host insegura | Brecha | Checklist endurecimiento + escaneo nmap interno |

## 12. Plan de Validación Interna (Previo a Evaluación 4)
Smoke: Registro → Login → Crear → Enviar → Subir Ficha.  
Unit Tests objetivo: ≥70% módulos core (users, preinscriptions).  
Integración: 3 escenarios pagos (confirmación, parcial, error).  

## 13. Métricas de Código
- Coverage global
- Tiempo promedio PR (apertura→merge)
- Errores 5xx p95
- Latencia endpoints críticos

## 14. Trazabilidad Resumida
| Requerimiento | Sección | Implementación |
|---------------|---------|---------------|
| Construir interfaces | 4,5 | Vue SPA + componentes base |
| Codificación solución | 3,6,10 | Django + DRF + pipeline CI |
| Implementar base datos | 7,8 | PostgreSQL + scripts migración |
| Configurar entorno | 9,10 | Docker local + Hostinger VPS |

## 15. Próximos Pasos
1. Completar script SQL inicial (Anexo A).  
2. Implementar base repos y pipeline.  
3. Crear componentes UI prioritarios (Registro, Login, Wizard Paso 1).  
4. Añadir pruebas unitarias iniciales.  
5. Preparar importación batch (esqueleto Celery).  

---
## Anexo A – Script SQL Inicial (Borrador)
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email CITEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  estado VARCHAR(20) DEFAULT 'ACTIVO',
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE personas (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  rut VARCHAR(15) UNIQUE NOT NULL,
  nombres VARCHAR(120) NOT NULL,
  apellidos VARCHAR(160) NOT NULL,
  fecha_nacimiento DATE,
  salud_json JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(40) UNIQUE NOT NULL,
  descripcion VARCHAR(160)
);
CREATE TABLE role_assignments (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  role_id INT REFERENCES roles(id) ON DELETE CASCADE,
  scope_type VARCHAR(30),
  scope_id INT,
  UNIQUE (user_id, role_id, scope_type, scope_id)
);
CREATE TABLE preinscripciones (
  id SERIAL PRIMARY KEY,
  persona_id INT REFERENCES personas(id) ON DELETE CASCADE,
  estado VARCHAR(20) NOT NULL DEFAULT 'BORRADOR',
  origen VARCHAR(30),
  confirmado_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE preinscripcion_estado_hist (
  id SERIAL PRIMARY KEY,
  preinscripcion_id INT REFERENCES preinscripciones(id) ON DELETE CASCADE,
  estado_anterior VARCHAR(20),
  estado_nuevo VARCHAR(20) NOT NULL,
  changed_by INT REFERENCES users(id),
  changed_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE archivos (
  id SERIAL PRIMARY KEY,
  owner_type VARCHAR(30) NOT NULL,
  owner_id INT NOT NULL,
  tipo VARCHAR(30) NOT NULL,
  filename TEXT NOT NULL,
  mime VARCHAR(120),
  size_bytes INT,
  hash_sha256 CHAR(64),
  estado VARCHAR(20) DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY,
  actor_user_id INT REFERENCES users(id),
  accion VARCHAR(80) NOT NULL,
  entidad VARCHAR(60) NOT NULL,
  entidad_id INT,
  payload_json JSONB,
  ip INET,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_audit_entidad ON audit_logs(entidad, entidad_id, created_at DESC);
```

---
## 16. Aprobaciones
| Rol | Nombre | Fecha | Firma |
|-----|--------|-------|-------|
| Jefe de Proyecto | | | |
| Docente / Revisor | | | |

---
Documento generado automáticamente (v0.1). Completar campos faltantes y actualizar versión tras revisión.
