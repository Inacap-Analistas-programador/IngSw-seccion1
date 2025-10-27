# **SPRINT 2 BACKLOG - SGICS**

## **SPRINT GOAL: "BASE OPERATIVA FUNCIONAL"**
*"Establecer una plataforma mínima operativa donde un usuario pueda registrarse, autenticarse, crear preinscripción completa, subir documentos, con control de roles y auditoría funcionando bajo pipeline automatizado"*

---

## 📅 **INFORMACIÓN DEL SPRINT**

- **Sprint:** #2 "Base Operativa"
- **Duración:** 29 Septiembre - 13 Octubre 2025 (2 semanas)
- **Equipo:** 18 developers en 6 módulos especializados
- **Story Points Total:** 185 pts
- **Velocity Target:** 15-20 pts/developer
- **Demo Date:** 11 Octubre 2025

---

## 🏗️ **MÓDULO 1: ARQUITECTURA & DEVOPS** 
**Team:** Giovanni Pacheco (Lead), Ricardo Sanhueza  
**Sprint Points:** 40 pts (25% del total)

### **🚀 EPIC 1.1: CI/CD Pipeline (15 pts)**

#### **US-1.1.1: Configurar GitHub Actions Pipeline Completo** 
**Story Points:** 5 | **Priority:** Critical | **Assignee:** Giovanni Pacheco

**📋 Descripción:**
Como DevOps Engineer, quiero un pipeline CI/CD completamente automatizado para que el equipo pueda deployar código con confianza y detectar errores tempranamente.

**✅ Acceptance Criteria:**
- [ ] Pipeline ejecuta tests automáticos backend (pytest + coverage)
- [ ] Pipeline ejecuta tests frontend (Vitest + E2E Playwright) 
- [ ] Build de imágenes Docker exitoso para backend/frontend
- [ ] Deploy automático a ambiente staging tras merge a main
- [ ] Notificaciones Discord en fallo/éxito de pipeline
- [ ] Pipeline falla si coverage <70% o tests fallan
- [ ] Build time <10 minutos total
- [ ] Artifacts guardados 7 días para rollback

**📝 Tasks:**
- [ ] Configurar workflow .github/workflows/ci.yml
- [ ] Setup test runners paralelos backend/frontend  
- [ ] Configurar Docker multi-stage builds
- [ ] Setup staging environment AWS/Azure
- [ ] Configurar Discord webhook notifications
- [ ] Documentar pipeline en README.md

**🔗 Dependencies:** Ninguna
**⚠️ Risks:** Configuración AWS/Azure puede tomar tiempo extra

---

#### **US-1.1.2: Docker Compose para Desarrollo Local**
**Story Points:** 5 | **Priority:** Critical | **Assignee:** Ricardo Sanhueza

**📋 Descripción:**
Como Developer, quiero un ambiente de desarrollo local completamente containerizado para que la configuración sea idéntica entre todos los miembros del equipo.

**✅ Acceptance Criteria:**
- [ ] docker-compose.yml con PostgreSQL + Redis + MinIO + Django + Vue
- [ ] Hot-reload funciona para backend/frontend sin rebuild
- [ ] Health checks para todos los servicios
- [ ] Variables de entorno documentadas en .env.example
- [ ] Script setup one-command: ./dev-setup.sh
- [ ] Volumes persistentes para data PostgreSQL/Redis
- [ ] Todos los puertos mapeados y documentados
- [ ] Network isolation entre servicios

**📝 Tasks:**
- [ ] Escribir docker-compose.yml completo
- [ ] Configurar Dockerfiles optimizados backend/frontend
- [ ] Setup PostgreSQL con init scripts
- [ ] Configurar Redis para cache/sessions/queues
- [ ] Setup MinIO con buckets automáticos
- [ ] Escribir scripts helper (dev-up.ps1, dev-down.ps1)
- [ ] Documentar troubleshooting común

**🔗 Dependencies:** Ninguna
**⚠️ Risks:** Windows compatibility issues con volúmenes Docker

---

#### **US-1.1.3: Monorepo Setup y Git Strategy**
**Story Points:** 5 | **Priority:** High | **Assignee:** Giovanni + Ricardo

**📋 Descripción:**
Como Team Lead, quiero una estrategia Git clara y estructura de monorepo para que el equipo trabaje ordenadamente sin conflictos.

**✅ Acceptance Criteria:**
- [ ] Estructura monorepo /backend /frontend /docs /scripts
- [ ] GitFlow implementado: main/develop/feature/hotfix branches
- [ ] Branch protection rules en main/develop
- [ ] PR template con checklist DoD
- [ ] Conventional commits configurado (feat, fix, docs, etc.)
- [ ] Pre-commit hooks para linting/formatting
- [ ] .gitignore completo para Python/Node/IDE files
- [ ] CONTRIBUTING.md con workflow documentado

**📝 Tasks:**
- [ ] Reestructurar directorios según monorepo pattern
- [ ] Configurar branch protection GitHub
- [ ] Setup conventional commits + commitizen
- [ ] Escribir PR template detallado
- [ ] Configurar pre-commit hooks (black, eslint, etc.)
- [ ] Documentar Git workflow team

**🔗 Dependencies:** Ninguna
**⚠️ Risks:** Learning curve para team con Git avanzado

---

### **🗄️ EPIC 1.2: Base de Datos y Observabilidad (25 pts)**

#### **US-1.2.1: PostgreSQL con Migraciones Django Completas**
**Story Points:** 8 | **Priority:** Critical | **Assignee:** Ricardo Sanhueza

**📋 Descripción:**
Como Backend Developer, quiero todas las apps Django inicializadas con modelos completos para que podamos comenzar desarrollo inmediato.

**✅ Acceptance Criteria:**
- [ ] Apps Django: users, preinscriptions, payments, files, audit, courses
- [ ] Modelos base con foreign keys y constraints correctos
- [ ] Migration inicial ejecutable sin errores
- [ ] Fixtures con datos de prueba (10 cursos, 50 users, roles)
- [ ] Custom User model con AbstractUser
- [ ] Database indexes en campos de búsqueda frecuente
- [ ] Signals configurados para audit logging automático
- [ ] Management commands para setup inicial

**📝 Tasks:**
- [ ] Crear apps Django con startapp
- [ ] Implementar modelos según DRS especificación
- [ ] Escribir migration inicial completa
- [ ] Crear fixtures con factory_boy
- [ ] Setup custom User model
- [ ] Configurar database indexes
- [ ] Implementar audit signals
- [ ] Escribir management commands

**🔗 Dependencies:** US-1.1.2 (Docker PostgreSQL)
**⚠️ Risks:** Complejidad relaciones entre modelos

---

#### **US-1.2.2: Observabilidad Básica con Prometheus/Grafana**
**Story Points:** 10 | **Priority:** Medium | **Assignee:** Giovanni Pacheco

**📋 Descripción:**
Como DevOps Engineer, quiero observabilidad básica del sistema para detectar problemas de performance y disponibilidad tempranamente.

**✅ Acceptance Criteria:**
- [ ] Logging estructurado con loguru en backend
- [ ] Prometheus metrics endpoint /metrics
- [ ] Grafana dashboard básico con metrics sistema
- [ ] Alertas email para errores críticos (>5 errors/min)
- [ ] Metrics custom: requests/s, response time, active users
- [ ] Log aggregation centralizado
- [ ] Health check endpoints para cada servicio
- [ ] Retention policy logs 30 días local

**📝 Tasks:**
- [ ] Configurar loguru con structured logging
- [ ] Setup django-prometheus para metrics
- [ ] Configurar Prometheus server
- [ ] Crear dashboard Grafana básico
- [ ] Setup email alerting SMTP
- [ ] Configurar log rotation
- [ ] Escribir health check views
- [ ] Documentar observability runbook

**🔗 Dependencies:** US-1.1.2 (Docker setup)
**⚠️ Risks:** Configuración SMTP puede fallar inicialmente

---

#### **US-1.2.3: Backup y Recovery Strategy**
**Story Points:** 7 | **Priority:** Medium | **Assignee:** Ricardo Sanhueza

**📋 Descripción:**
Como DevOps Engineer, quiero una estrategia de backup automático para que podamos recuperar data rápidamente ante fallas.

**✅ Acceptance Criteria:**
- [ ] Script backup PostgreSQL automatizado diario
- [ ] Backup archivos MinIO semanal
- [ ] Retención 7 días development, 30 días staging
- [ ] Proceso restore documentado y testado
- [ ] Backup compresión para optimizar espacio
- [ ] Verificación integridad backups automática
- [ ] Alertas si backup falla
- [ ] Recovery time <30 minutos para development

**📝 Tasks:**
- [ ] Escribir script backup PostgreSQL con pg_dump
- [ ] Configurar backup MinIO con mc client
- [ ] Setup cron jobs para automation
- [ ] Implementar compresión backups
- [ ] Escribir script restore
- [ ] Configurar alertas fallo backup
- [ ] Documentar recovery procedures
- [ ] Testing backup/restore process

**🔗 Dependencies:** US-1.2.1 (PostgreSQL setup)
**⚠️ Risks:** Windows cron equivalent (Task Scheduler) complexity

---

## 🔐 **MÓDULO 2: AUTH & SECURITY**
**Team:** Josué Vásquez (Lead), Nicolás Irribarra, Lucas Guerrero  
**Sprint Points:** 35 pts (22% del total)

### **🔑 EPIC 2.1: JWT Authentication System (15 pts)**

#### **US-2.1.1: User Registration Sistema Completo**
**Story Points:** 5 | **Priority:** Critical | **Assignee:** Josué Vásquez

**📋 Descripción:**
Como nuevo usuario, quiero registrarme en el sistema fácilmente para poder acceder a funcionalidades de preinscripción.

**✅ Acceptance Criteria:**
- [ ] Endpoint POST /api/auth/register/ funcional
- [ ] Validación email único y formato válido
- [ ] Password policy: min 8 chars, mayús, números, símbolos
- [ ] Crea User + Persona automáticamente al registrarse
- [ ] Email verification opcional (configurable)
- [ ] Rate limiting 5 registrations/IP/hour
- [ ] Tests unitarios >90% coverage
- [ ] Response con JWT tokens inmediato

**📝 Tasks:**
- [ ] Implementar serializer RegistrationSerializer
- [ ] Crear view RegistrationView con validaciones
- [ ] Configurar password policy validators
- [ ] Setup email verification flow (opcional)
- [ ] Configurar rate limiting con django-ratelimit
- [ ] Escribir tests unitarios completos
- [ ] Integrar con User/Persona models
- [ ] Documentar API en OpenAPI

**🔗 Dependencies:** US-1.2.1 (User models)
**⚠️ Risks:** Email service configuration puede fallar

---

#### **US-2.1.2: Login/Logout con Rate Limiting**
**Story Points:** 5 | **Priority:** Critical | **Assignee:** Nicolás Irribarra

**📋 Descripción:**
Como usuario registrado, quiero hacer login de forma segura para acceder a mis funcionalidades según mi rol.

**✅ Acceptance Criteria:**
- [ ] Endpoint POST /api/auth/login/ con JWT response
- [ ] Rate limiting 5 intentos fallidos/IP/15min
- [ ] JWT access token 1h, refresh token 7 días
- [ ] Token blacklisting en logout
- [ ] Failed attempts tracking con Redis
- [ ] Account lockout tras 10 intentos fallidos
- [ ] Audit logging todos los login attempts
- [ ] Response include user info y permisos

**📝 Tasks:**
- [ ] Implementar LoginView con SimpleJWT
- [ ] Configurar rate limiting con Redis backend
- [ ] Implementar token blacklisting
- [ ] Setup failed attempts counter
- [ ] Implementar account lockout logic
- [ ] Configurar audit logging signals
- [ ] Escribir tests security scenarios
- [ ] Integrar con RBAC permissions

**🔗 Dependencies:** US-2.2.1 (RBAC system)
**⚠️ Risks:** Redis connectivity issues en development

---

#### **US-2.1.3: Password Reset y Refresh Tokens**
**Story Points:** 5 | **Priority:** High | **Assignee:** Lucas Guerrero

**📋 Descripción:**
Como usuario, quiero poder resetear mi password de forma segura y mantener mi sesión activa sin re-login frecuente.

**✅ Acceptance Criteria:**
- [ ] Endpoint POST /api/auth/password-reset/ envía email
- [ ] Secure tokens con expiración 1 hora
- [ ] Endpoint POST /api/auth/password-reset-confirm/
- [ ] Refresh token endpoint /api/auth/token/refresh/
- [ ] Access tokens 1h, refresh tokens 7 días
- [ ] Token cleanup job con Celery daily
- [ ] Email templates profesionales
- [ ] Rate limiting en password reset requests

**📝 Tasks:**
- [ ] Implementar PasswordResetView
- [ ] Crear secure token generation
- [ ] Setup email templates HTML/text
- [ ] Configurar Celery task token cleanup
- [ ] Implementar refresh token logic
- [ ] Configurar rate limiting password reset
- [ ] Escribir tests flow completo
- [ ] Setup email backend (console/SMTP)

**🔗 Dependencies:** US-1.2.1 (Celery setup), US-2.1.1 (User model)
**⚠️ Risks:** Email delivery reliability

---

### **🛡️ EPIC 2.2: RBAC System (20 pts)**

#### **US-2.2.1: 6 Roles con Scope Territorial**
**Story Points:** 8 | **Priority:** Critical | **Assignee:** Josué Vásquez

**📋 Descripción:**
Como administrador, quiero un sistema de roles jerárquico con scope territorial para controlar acceso granularmente.

**✅ Acceptance Criteria:**
- [ ] Roles: Superadmin, Coordinador, ValidadorGrupo, ValidadorDistrito, Finanzas, Participante
- [ ] RoleAssignment model con scope (grupo_id, distrito_id, zona_id)
- [ ] Hierarchical permissions (Superadmin > Coordinador > etc.)
- [ ] Fixtures roles iniciales con permissions
- [ ] Management command assign_role usuario rol scope
- [ ] API endpoints role assignment para admins
- [ ] Validation reglas de negocio roles
- [ ] Audit trail role changes

**📝 Tasks:**
- [ ] Crear Role y RoleAssignment models
- [ ] Implementar hierarchical permission system
- [ ] Escribir fixtures roles iniciales
- [ ] Crear management command role assignment
- [ ] Implementar API views role management
- [ ] Configurar business rules validation
- [ ] Setup audit logging role changes
- [ ] Escribir tests permission scenarios

**🔗 Dependencies:** US-1.2.1 (User models), US-2.1.1 (Auth system)
**⚠️ Risks:** Complejidad lógica permissions hierarchical

---

#### **US-2.2.2: Authorization Middleware**
**Story Points:** 7 | **Priority:** Critical | **Assignee:** Nicolás Irribarra

**📋 Descripción:**
Como developer, quiero middleware de autorización para proteger endpoints fácilmente con decorators basados en roles.

**✅ Acceptance Criteria:**
- [ ] Decorator @require_role(['Coordinador']) funcional
- [ ] Scope validation middleware territorial
- [ ] 403 responses con mensajes descriptivos específicos
- [ ] Audit log todos los intentos acceso denegado
- [ ] Bypass logic para Superadmin universal
- [ ] Performance optimizado (<50ms overhead)
- [ ] Exception handling robusto
- [ ] Integration con DRF permissions

**📝 Tasks:**
- [ ] Implementar require_role decorator
- [ ] Crear scope validation middleware
- [ ] Configurar custom 403 error responses
- [ ] Setup audit logging access denied
- [ ] Implementar Superadmin bypass logic
- [ ] Optimizar queries permission checking
- [ ] Escribir exception handlers
- [ ] Integrar con DRF permission classes

**🔗 Dependencies:** US-2.2.1 (RBAC models)
**⚠️ Risks:** Performance impact si queries permissions mal optimizadas

---

#### **US-2.2.3: Security Hardening**
**Story Points:** 5 | **Priority:** High | **Assignee:** Lucas Guerrero

**📋 Descripción:**
Como Security Engineer, quiero el sistema endurecido contra ataques comunes para proteger datos sensibles usuarios.

**✅ Acceptance Criteria:**
- [ ] Input validation y sanitization global
- [ ] CORS configuration restrictiva
- [ ] Security headers (CSP, HSTS, X-Frame-Options)
- [ ] File upload validation (tipos, tamaños, malware scan)
- [ ] SQL injection protection verificada
- [ ] XSS protection implementada
- [ ] CSRF tokens funcionando
- [ ] Security audit checklist completado

**📝 Tasks:**
- [ ] Configurar input validation middleware
- [ ] Setup CORS policy restrictiva
- [ ] Implementar security headers middleware
- [ ] Configurar file upload validation
- [ ] Verificar SQL injection protection ORM
- [ ] Setup XSS protection headers
- [ ] Configurar CSRF tokens Django
- [ ] Ejecutar security audit con tools

**🔗 Dependencies:** US-2.1.1 (Auth system)
**⚠️ Risks:** Over-restrictive security puede romper functionality

---

## 👤 **MÓDULO 3: USERS & PROFILES**
**Team:** Marisol Sáez (Lead), Lucas Betanzos, Rodrigo Jara  
**Sprint Points:** 30 pts (19% del total)

### **🔧 EPIC 3.1: Backend User Management (12 pts)**

#### **US-3.1.1: Modelo Persona Scout Completo**
**Story Points:** 8 | **Priority:** Critical | **Assignee:** Marisol Sáez

**📋 Descripción:**
Como Backend Developer, quiero modelos User/Persona completos para almacenar toda la información scout requerida según DRS.

**✅ Acceptance Criteria:**
- [ ] Campos: rut, nombres, apellidos, fecha_nacimiento, sexo, telefono, email
- [ ] Info scout: zona, distrito, grupo, rama, años_experiencia
- [ ] JSON field info_medica (encrypted) para alergias, medicamentos
- [ ] Validaciones: RUT chileno formato, email único
- [ ] Soft delete implementado
- [ ] Audit trail cambios información
- [ ] Custom managers para queries comunes
- [ ] Serializers completos con validaciones

**📝 Tasks:**
- [ ] Extender User model con Persona OneToOne
- [ ] Implementar validador RUT chileno
- [ ] Configurar JSON field encryption info médica
- [ ] Implementar soft delete manager
- [ ] Setup audit logging model changes
- [ ] Crear custom managers (por zona, distrito, etc.)
- [ ] Implementar serializers con validaciones
- [ ] Escribir tests modelos y validaciones

**🔗 Dependencies:** US-1.2.1 (Base models)
**⚠️ Risks:** Encryption key management complexity

---

#### **US-3.1.2: API Búsqueda y Filtros**
**Story Points:** 4 | **Priority:** High | **Assignee:** Lucas Betanzos

**📋 Descripción:**
Como Frontend Developer, quiero API endpoints robusta para buscar y filtrar usuarios para interfaces de administración.

**✅ Acceptance Criteria:**
- [ ] Endpoint GET /api/personas/ con filtros query params
- [ ] Búsqueda por RUT, nombre completo, email (icontains)
- [ ] Filtros: zona, distrito, grupo, rama, activo/inactivo
- [ ] Paginación 20 items por página
- [ ] Ordenamiento por fecha_registro, nombre, etc.
- [ ] Response include total count
- [ ] Permission-based filtering (territorial scope)
- [ ] Performance <500ms con 10,000 users

**📝 Tasks:**
- [ ] Implementar PersonaViewSet con filtros
- [ ] Configurar DjangoFilterBackend
- [ ] Setup search functionality múltiples campos
- [ ] Implementar paginación customizada
- [ ] Configurar ordenamiento options
- [ ] Optimizar queries con select_related
- [ ] Implementar territorial scope filtering
- [ ] Escribir tests performance y functionality

**🔗 Dependencies:** US-3.1.1 (Persona model), US-2.2.2 (Authorization)
**⚠️ Risks:** Performance queries con large datasets

---

### **🎨 EPIC 3.2: Frontend Components (18 pts)**

#### **US-3.2.1: UserProfile Component con Tabs**
**Story Points:** 10 | **Priority:** Critical | **Assignee:** Rodrigo Jara

**📋 Descripción:**
Como Usuario, quiero editar mi perfil en interfaz intuitiva con tabs para organizar información personal, scout y médica.

**✅ Acceptance Criteria:**
- [ ] Tabs: Personal, Scout, Médica navegables
- [ ] Formularios reactivos Vue 3 Composition API
- [ ] Validación tiempo real con Vee-Validate + Yup schemas
- [ ] Auto-save draft cada 30 segundos en localStorage
- [ ] Loading states durante save/update
- [ ] Error handling con mensajes descriptivos
- [ ] Web responsive design para todas las resoluciones
- [ ] Accessibility keyboard navigation

**📝 Tasks:**
- [ ] Crear UserProfile.vue component con tabs
- [ ] Implementar forms reactivos composables
- [ ] Setup Vee-Validate + Yup validation
- [ ] Implementar auto-save functionality
- [ ] Configurar loading/error states
- [ ] Aplicar responsive design Tailwind
- [ ] Implementar accessibility features
- [ ] Escribir tests unitarios component

**🔗 Dependencies:** US-3.2.2 (Component library), US-3.1.2 (API endpoints)
**⚠️ Risks:** Complejidad validation cross-tab dependencies

---

#### **US-3.2.2: Component Library Reutilizable**
**Story Points:** 5 | **Priority:** High | **Assignee:** Lucas Betanzos

**📋 Descripción:**
Como Frontend Developer, quiero biblioteca componentes reutilizables para mantener consistencia UI y acelerar development.

**✅ Acceptance Criteria:**
- [ ] BaseInput, BaseSelect, BaseFileUpload components
- [ ] BaseCard, BaseButton con variants (primary, secondary, danger)
- [ ] LoadingSpinner, ErrorMessage, SuccessMessage
- [ ] Props validation con PropTypes
- [ ] Storybook documentation cada component
- [ ] TypeScript interfaces/types definidos
- [ ] CSS variables para theming
- [ ] Unit tests cada component

**📝 Tasks:**
- [ ] Crear base components library
- [ ] Implementar variants system
- [ ] Setup Storybook documentation
- [ ] Configurar TypeScript interfaces
- [ ] Implementar CSS variables theming
- [ ] Escribir tests unitarios Vue Test Utils
- [ ] Crear usage examples
- [ ] Documentar component API

**🔗 Dependencies:** US-3.2.3 (Design system)
**⚠️ Risks:** Over-engineering components early

---

#### **US-3.2.3: Design System Scout-Themed**
**Story Points:** 3 | **Priority:** Medium | **Assignee:** Marisol Sáez

**📋 Descripción:**
Como UX Designer, quiero design system coherente con branding scout para mantener identidad visual consistente.

**✅ Acceptance Criteria:**
- [ ] Color palette scout: azul (#1f4e79), verde (#228B22), amarillo (#FFD700)
- [ ] Typography scale con Google Fonts (Roboto/Open Sans)
- [ ] Spacing system 4px grid (4, 8, 12, 16, 20, 24, 32, 48, 64)
- [ ] WCAG 2.1 AA compliance verificado
- [ ] Figma design system documentado
- [ ] Tailwind config customizado colores/spacing
- [ ] CSS custom properties definidas
- [ ] Dark mode support básico

**📝 Tasks:**
- [ ] Definir color palette completa
- [ ] Configurar typography scale
- [ ] Setup spacing system 4px grid
- [ ] Verificar accessibility WCAG 2.1 AA
- [ ] Crear Figma design system
- [ ] Customizar Tailwind config
- [ ] Implementar CSS custom properties
- [ ] Setup dark mode básico

**🔗 Dependencies:** Ninguna
**⚠️ Risks:** Design decisions pueden cambiar durante development

---

## 📝 **MÓDULO 4: PREINSCRIPTIONS**
**Team:** Miguel Contreras (Lead), Juan Orrego, Leonardo López  
**Sprint Points:** 35 pts (22% del total)

### **⚙️ EPIC 4.1: State Machine y Backend API (15 pts)**

#### **US-4.1.1: Modelo con 7 Estados State Machine**
**Story Points:** 8 | **Priority:** Critical | **Assignee:** Miguel Contreras

**📋 Descripción:**
Como Business Analyst, quiero state machine precisa para controlar flujo preinscripciones según reglas de negocio complejas.

**✅ Acceptance Criteria:**
- [ ] Estados: Borrador, Enviado, EnRevisión, Validado, CupoAsignado, Rechazado, Cancelado
- [ ] Transiciones válidas según reglas negocio documentadas
- [ ] PreinscripcionEstadoHist para auditoría cambios
- [ ] Django FSM implementado correctamente
- [ ] Signals automáticos logging cambios estado
- [ ] Business rules validation transiciones
- [ ] Bulk state transitions para coordinadores
- [ ] Performance queries optimizadas

**📝 Tasks:**
- [ ] Implementar Preinscripcion model con FSM
- [ ] Definir transiciones permitidas según roles
- [ ] Crear PreinscripcionEstadoHist model
- [ ] Setup Django FSM package
- [ ] Configurar signals logging automático
- [ ] Implementar business rules validation
- [ ] Crear bulk operations coordinadores
- [ ] Optimizar queries con indexes

**🔗 Dependencies:** US-1.2.1 (Base models), US-2.2.1 (RBAC)
**⚠️ Risks:** Complejidad state machine rules

---

#### **US-4.1.2: CRUD API con Filtros**
**Story Points:** 7 | **Priority:** Critical | **Assignee:** Juan Orrego

**📋 Descripción:**
Como Frontend Developer, quiero API completa preinscripciones para implementar todas las funcionalidades UI requeridas.

**✅ Acceptance Criteria:**
- [ ] PreinscripcionViewSet con autorización por rol
- [ ] Filtros: estado, fecha, persona, curso, zona/distrito
- [ ] Bulk operations para coordinadores (aprobar/rechazar múltiples)
- [ ] Soft delete con recuperación (undelete)
- [ ] Export CSV/Excel para reportes
- [ ] Paginación y ordenamiento
- [ ] Performance <1s con 50,000 records
- [ ] OpenAPI documentation completa

**📝 Tasks:**
- [ ] Implementar PreinscripcionViewSet completa
- [ ] Configurar filtros DjangoFilterBackend
- [ ] Implementar bulk operations actions
- [ ] Setup soft delete con restore functionality
- [ ] Agregar export CSV/Excel endpoints
- [ ] Configurar paginación customizada
- [ ] Optimizar queries performance
- [ ] Documentar API OpenAPI

**🔗 Dependencies:** US-4.1.1 (State machine), US-2.2.2 (Authorization)
**⚠️ Risks:** Performance con large datasets, complejidad bulk operations

---

### **🎪 EPIC 4.2: Multi-Step Wizard Frontend (20 pts)**

#### **US-4.2.1: Wizard 4 Pasos Completo**
**Story Points:** 12 | **Priority:** Critical | **Assignee:** Leonardo López

**📋 Descripción:**
Como Participante, quiero completar preinscripción en wizard intuitivo 4 pasos para enviar toda información requerida fácilmente.

**✅ Acceptance Criteria:**
- [ ] Paso 1: Datos Personales (RUT, nombres, apellidos, fecha nac, contacto)
- [ ] Paso 2: Info Scout (zona, distrito, grupo, rama, años experiencia)
- [ ] Paso 3: Información Salud (alimentación, alergias, medicamentos, limitaciones)
- [ ] Paso 4: Documentos (ficha médica PDF, info vehículo si aplica)
- [ ] Progress stepper visual con steps completados
- [ ] Validación por paso antes continuar
- [ ] Save draft automático cada paso
- [ ] Navigation libre entre steps (back/forward)

**📝 Tasks:**
- [ ] Crear PreinscripcionWizard.vue component
- [ ] Implementar 4 step components separados
- [ ] Setup progress stepper visual
- [ ] Configurar validación por step
- [ ] Implementar save draft functionality
- [ ] Setup navigation between steps
- [ ] Integrar con file upload component
- [ ] Escribir tests E2E wizard completo

**🔗 Dependencies:** US-3.2.1 (Form components), US-4.2.2 (File upload)
**⚠️ Risks:** Complejidad validación cross-step, UX navigation

---

#### **US-4.2.2: File Upload con Drag & Drop**
**Story Points:** 5 | **Priority:** High | **Assignee:** Juan Orrego

**📋 Descripción:**
Como Usuario, quiero subir archivos fácilmente con drag & drop para adjuntar documentos requeridos sin fricciones.

**✅ Acceptance Criteria:**
- [ ] FileUpload component con drag & drop zone
- [ ] Validación: PDF/JPG/PNG, max 5MB per file
- [ ] Progress bar durante upload
- [ ] Preview thumbnails archivos subidos
- [ ] Error handling con mensajes descriptivos
- [ ] Multiple file selection
- [ ] Integration /api/files/ backend endpoint
- [ ] Drag & drop upload interface intuitivo

**📝 Tasks:**
- [ ] Crear FileUpload.vue component
- [ ] Implementar drag & drop functionality
- [ ] Setup file validation client-side
- [ ] Configurar progress bar upload
- [ ] Implementar preview thumbnails
- [ ] Setup error handling robusto
- [ ] Integrar con backend API
- [ ] Optimización web responsive

**🔗 Dependencies:** Backend files API (Módulo 6), US-3.2.2 (Base components)
**⚠️ Risks:** Browser compatibility drag & drop, file size limits

---

#### **US-4.2.3: Business Rules y Notificaciones**
**Story Points:** 3 | **Priority:** Medium | **Assignee:** Miguel Contreras

**📋 Descripción:**
Como Business Owner, quiero business rules automáticas y notificaciones para mantener integridad datos y comunicación fluida.

**✅ Acceptance Criteria:**
- [ ] Validación: 1 preinscripción activa por persona por curso
- [ ] Verificación cupos disponibles antes envío
- [ ] Email automático cambios estado (enviado, validado, rechazado)
- [ ] Queue Celery para envío asíncrono emails
- [ ] Templates email profesionales HTML
- [ ] Notification preferences usuario
- [ ] Retry logic failed notifications
- [ ] Unsubscribe functionality

**📝 Tasks:**
- [ ] Implementar business rules validation
- [ ] Setup verificación cupos disponibles
- [ ] Configurar email templates HTML
- [ ] Implementar Celery tasks notifications
- [ ] Setup notification preferences
- [ ] Configurar retry logic failed emails
- [ ] Implementar unsubscribe functionality
- [ ] Escribir tests business rules

**🔗 Dependencies:** US-4.1.1 (State machine), Celery setup (Módulo 1)
**⚠️ Risks:** Email delivery reliability, spam filters

---

## 💳 **MÓDULO 5: PAYMENTS & FINANCE**
**Team:** Camilo Colivoro (Solo Developer)  
**Sprint Points:** 20 pts (12% del total)

### **💰 EPIC 5.1: Payment System Core (12 pts)**

#### **US-5.1.1: Modelos de Datos Pagos**
**Story Points:** 4 | **Priority:** Critical | **Assignee:** Camilo Colivoro

**📋 Descripción:**
Como Financial Manager, quiero modelos datos completos para tracking preciso todos los pagos y cuotas del sistema.

**✅ Acceptance Criteria:**
- [ ] Modelos: Pago, Cuota, GroupPaymentBatch, PaymentError
- [ ] Estados pago: Pendiente, Confirmado, Rechazado, Reembolsado
- [ ] Relación Pago → Preinscripcion (OneToOne)
- [ ] Fields: monto, fecha_pago, metodo_pago, comprobante, observaciones
- [ ] Soft delete para audit trail
- [ ] Constraints: monto > 0, fecha <= hoy
- [ ] Audit logging cambios pagos
- [ ] Currency support (CLP por defecto)

**📝 Tasks:**
- [ ] Crear Payment models completos
- [ ] Implementar estado transitions FSM
- [ ] Configurar constraints database
- [ ] Setup audit logging payments
- [ ] Implementar soft delete manager
- [ ] Configurar currency handling
- [ ] Escribir fixtures test data
- [ ] Tests unitarios models

**🔗 Dependencies:** US-4.1.1 (Preinscripcion model)
**⚠️ Risks:** Complejidad relaciones payment/preinscripcion

---

#### **US-5.1.2: API Endpoints Pagos**
**Story Points:** 4 | **Priority:** Critical | **Assignee:** Camilo Colivoro

**📋 Descripción:**
Como Developer, quiero API endpoints robusta pagos para integrar con frontend y sistemas externos.

**✅ Acceptance Criteria:**
- [ ] POST /api/pagos/ registro individual pago
- [ ] GET /api/pagos/ con filtros fecha, persona, estado, curso
- [ ] PUT /api/pagos/{id}/ update estado pago
- [ ] Permissions: rol finanzas required para modificaciones
- [ ] Validation: monto format, fecha lógica, RUT válido
- [ ] Response includes preinscripcion info
- [ ] Error handling descriptivo
- [ ] Rate limiting para registros masivos

**📝 Tasks:**
- [ ] Implementar PagoViewSet completa
- [ ] Configurar filtros y búsqueda
- [ ] Setup permissions rol finanzas
- [ ] Implementar validaciones business
- [ ] Configurar serializers completos
- [ ] Setup error handling robusto
- [ ] Configurar rate limiting
- [ ] Documentar API OpenAPI

**🔗 Dependencies:** US-5.1.1 (Payment models), US-2.2.2 (RBAC permissions)
**⚠️ Risks:** Security validations payment data

---

#### **US-5.1.3: Confirmación Automática Cupos**
**Story Points:** 4 | **Priority:** High | **Assignee:** Camilo Colivoro

**📋 Descripción:**
Como Coordinador, quiero confirmación automática cupos tras pago válido para optimizar tiempo gestión manual.

**✅ Acceptance Criteria:**
- [ ] Parámetro configurable por curso: auto_confirm_payment
- [ ] Signal trigger al registrar pago válido
- [ ] Update estado preinscripción → "CupoAsignado" automático
- [ ] Notification automática email participante
- [ ] Validation cupos disponibles antes confirmación
- [ ] Audit log confirmaciones automáticas
- [ ] Rollback mechanism si error confirmación
- [ ] Manual override para coordinadores

**📝 Tasks:**
- [ ] Implementar signal post_save Payment
- [ ] Configurar auto-confirm por curso
- [ ] Setup validation cupos disponibles
- [ ] Implementar notification automática
- [ ] Configurar audit logging
- [ ] Implementar rollback mechanism
- [ ] Crear manual override functionality
- [ ] Tests scenarios confirmación

**🔗 Dependencies:** US-4.1.1 (State machine), US-4.2.3 (Notifications)
**⚠️ Risks:** Race conditions múltiples pagos simultáneos

---

### **📊 EPIC 5.2: Dashboard Financiero (8 pts)**

#### **US-5.2.1: Panel Finanzas Básico**
**Story Points:** 5 | **Priority:** High | **Assignee:** Camilo Colivoro

**📋 Descripción:**
Como Finance Manager, quiero dashboard financiero para monitoring tiempo real ingresos y métricas conversión.

**✅ Acceptance Criteria:**
- [ ] KPIs: total recaudado, pagos pendientes, tasa conversión
- [ ] Lista pagos con filtros fecha/estado/curso
- [ ] Búsqueda rápida por RUT participante
- [ ] Charts visualización ingresos por mes
- [ ] Export CSV reportes financieros
- [ ] Real-time updates con WebSockets (opcional)
- [ ] Responsive design mobile/desktop
- [ ] Permission-based filtering territorial

**📝 Tasks:**
- [ ] Crear FinanceDashboard.vue component
- [ ] Implementar KPIs calculations backend
- [ ] Setup ChartJS integration gráficos
- [ ] Configurar filtros y búsqueda
- [ ] Implementar export CSV functionality
- [ ] Aplicar responsive design
- [ ] Configurar real-time updates
- [ ] Integrar territorial permissions

**🔗 Dependencies:** US-5.1.2 (API endpoints), US-3.2.2 (Chart components)
**⚠️ Risks:** Performance cálculos KPIs con large datasets

---

#### **US-5.2.2: Prototipo Batch Import Excel**
**Story Points:** 3 | **Priority:** Medium | **Assignee:** Camilo Colivoro

**📋 Descripción:**
Como Finance Coordinator, quiero importar pagos masivamente desde Excel para migración datos históricos eficiente.

**✅ Acceptance Criteria:**
- [ ] Upload Excel/CSV files
- [ ] Preview datos pre-confirmación
- [ ] Validación RUT format, montos, fechas
- [ ] Error reporting detallado por fila
- [ ] Dry-run mode para testing
- [ ] Progress bar import masivo
- [ ] Rollback partial imports
- [ ] Template Excel download ejemplo

**📝 Tasks:**
- [ ] Crear BatchImport.vue component
- [ ] Implementar Excel parsing backend
- [ ] Setup preview functionality
- [ ] Implementar validaciones por fila
- [ ] Configurar error reporting
- [ ] Setup dry-run mode
- [ ] Implementar progress tracking
- [ ] Crear template Excel download

**🔗 Dependencies:** US-5.1.1 (Payment models), File upload (Módulo 4)
**⚠️ Risks:** Excel format variations, memory usage large files

---

## 🧪 **MÓDULO 6: QA & DOCUMENTATION**
**Team:** Nicolás González (Lead), Juan Herrera  
**Sprint Points:** 25 pts (16% del total)

### **🔬 EPIC 6.1: Testing Automatizado (15 pts)**

#### **US-6.1.1: Backend Test Suite Completo**
**Story Points:** 8 | **Priority:** Critical | **Assignee:** Nicolás González

**📋 Descripción:**
Como QA Engineer, quiero test suite completa backend para garantizar código quality y prevenir regressions.

**✅ Acceptance Criteria:**
- [ ] pytest + Django test client configurado
- [ ] Tests: models, serializers, views, permissions
- [ ] Factory Boy para test data generation
- [ ] Coverage report >70% todas las apps
- [ ] Integration tests API endpoints
- [ ] Mocking external services (email, etc.)
- [ ] Performance tests queries críticas
- [ ] CI integration con GitHub Actions

**📝 Tasks:**
- [ ] Setup pytest configuration
- [ ] Crear factories con Factory Boy
- [ ] Escribir tests unitarios models
- [ ] Tests serializers validaciones
- [ ] Tests views y permissions
- [ ] Configurar coverage reporting
- [ ] Implementar integration tests
- [ ] Setup mocking external services

**🔗 Dependencies:** Todos los módulos backend
**⚠️ Risks:** Time-consuming escribir tests comprehensivos

---

#### **US-6.1.2: Frontend Testing Suite**
**Story Points:** 4 | **Priority:** High | **Assignee:** Juan Herrera

**📋 Descripción:**
Como Frontend Developer, quiero testing automatizado frontend para confidence deployments y component reliability.

**✅ Acceptance Criteria:**
- [ ] Vue Test Utils + Vitest configurado
- [ ] Component unit tests principales
- [ ] E2E smoke tests con Playwright
- [ ] Mock service worker para API testing
- [ ] Visual regression testing básico
- [ ] Accessibility testing automated
- [ ] Coverage >60% components
- [ ] CI integration frontend tests

**📝 Tasks:**
- [ ] Configurar Vitest + Vue Test Utils
- [ ] Escribir tests unitarios components
- [ ] Setup Playwright E2E tests
- [ ] Configurar MSW API mocking
- [ ] Implementar visual regression tests
- [ ] Setup accessibility testing
- [ ] Configurar coverage frontend
- [ ] Integrar con CI pipeline

**🔗 Dependencies:** US-3.2.2 (Components), US-4.2.1 (Wizard)
**⚠️ Risks:** Complexity E2E tests setup

---

#### **US-6.1.3: CI Integration Testing**
**Story Points:** 3 | **Priority:** High | **Assignee:** Nicolás González

**📋 Descripción:**
Como DevOps Engineer, quiero tests integrados CI pipeline para automation complete testing workflow.

**✅ Acceptance Criteria:**
- [ ] Tests automáticos en GitHub Actions
- [ ] Parallel backend/frontend testing
- [ ] Coverage reports comentarios PRs
- [ ] Branch protection required tests passing
- [ ] Test artifacts retention 7 días
- [ ] Slack notifications test failures
- [ ] Performance benchmarks tracking
- [ ] Flaky tests detection y reporting

**📝 Tasks:**
- [ ] Configurar GitHub Actions test workflows
- [ ] Setup parallel test execution
- [ ] Configurar coverage reporting PRs
- [ ] Setup branch protection rules
- [ ] Configurar artifacts retention
- [ ] Setup Slack notifications
- [ ] Implementar performance benchmarks
- [ ] Configurar flaky tests detection

**🔗 Dependencies:** US-6.1.1 (Backend tests), US-6.1.2 (Frontend tests)
**⚠️ Risks:** CI pipeline complexity, build time optimization

---

### **📚 EPIC 6.2: Documentation Comprehensive (10 pts)**

#### **US-6.2.1: API Documentation Swagger**
**Story Points:** 4 | **Priority:** Critical | **Assignee:** Juan Herrera

**📋 Descripción:**
Como API Consumer, quiero documentación API completa para integration fácil y understanding endpoints.

**✅ Acceptance Criteria:**
- [ ] OpenAPI/Swagger generado automáticamente
- [ ] drf-spectacular configurado correctamente
- [ ] Endpoint examples con request/response
- [ ] Authentication flow documentado
- [ ] Error codes y messages documentados
- [ ] Interactive API explorer funcional
- [ ] Postman collection export
- [ ] Versioning API documentado

**📝 Tasks:**
- [ ] Configurar drf-spectacular
- [ ] Documentar todos endpoints
- [ ] Agregar examples request/response
- [ ] Documentar authentication flow
- [ ] Setup interactive API explorer
- [ ] Crear Postman collection
- [ ] Configurar API versioning
- [ ] Setup auto-generation CI

**🔗 Dependencies:** Todos API endpoints módulos
**⚠️ Risks:** Maintenance documentation actualizada

---

#### **US-6.2.2: Technical Documentation**
**Story Points:** 3 | **Priority:** High | **Assignee:** Nicolás González

**📋 Descripción:**
Como New Developer, quiero documentación técnica completa para onboarding rápido y understanding architecture.

**✅ Acceptance Criteria:**
- [ ] README.md setup instructions completas
- [ ] CONTRIBUTING.md guidelines desarrollo
- [ ] Architecture Decision Records (ADRs)
- [ ] Troubleshooting guide issues comunes
- [ ] Code style guidelines enforzadas
- [ ] Database schema documentation
- [ ] Deployment instructions detalladas
- [ ] Security guidelines documented

**📝 Tasks:**
- [ ] Escribir README comprehensive
- [ ] Crear CONTRIBUTING guidelines
- [ ] Documentar ADRs importantes
- [ ] Crear troubleshooting guide
- [ ] Documentar code style guidelines
- [ ] Generar database schema docs
- [ ] Escribir deployment instructions
- [ ] Documentar security guidelines

**🔗 Dependencies:** US-1.1.1 (CI/CD), Architecture decisions
**⚠️ Risks:** Documentation rapidamente outdated

---

#### **US-6.2.3: User Manual Básico**
**Story Points:** 3 | **Priority:** Medium | **Assignee:** Juan Herrera

**📋 Descripción:**
Como End User, quiero manual usuario básico para understanding funcionalidades disponibles según mi rol.

**✅ Acceptance Criteria:**
- [ ] Screenshots principales user flows
- [ ] FAQ preguntas frecuentes users
- [ ] Onboarding guide step-by-step
- [ ] Role-specific instructions
- [ ] Video tutorials básicos (opcional)
- [ ] Glossary términos técnicos
- [ ] Contact information support
- [ ] Multilingual support (Spanish primary)

**📝 Tasks:**
- [ ] Capturar screenshots user flows
- [ ] Compilar FAQ common questions
- [ ] Escribir onboarding guide
- [ ] Crear instructions por rol
- [ ] Grabar video tutorials básicos
- [ ] Crear glossary términos
- [ ] Setup support contact info
- [ ] Preparar Spanish translation

**🔗 Dependencies:** US-4.2.1 (User flows), US-5.2.1 (Dashboard)
**⚠️ Risks:** Screenshots outdated con UI changes

---

## 📋 **CRITERIOS ACCEPTANCE GENERALES**

### **Definition of Done Sprint 2:**
- ✅ **Code Quality:** Peer reviewed (mínimo 1 approval)
- ✅ **Testing:** Unit tests >70% coverage, integration tests passing
- ✅ **Documentation:** API documented, README updated
- ✅ **Security:** Security checklist completed, no critical vulnerabilities
- ✅ **Performance:** Response times <2s, database queries optimized
- ✅ **Accessibility:** WCAG 2.1 AA compliance básica
- ✅ **CI/CD:** Build passing, linting errors resolved
- ✅ **Demo:** End-to-end user flow functional

### **Acceptance Criteria Templates:**
- **Funcionalidad:** Feature funciona según especificación
- **Performance:** Response time acceptable (<2s)
- **Security:** No vulnerabilities críticas
- **Usability:** UI intuitiva, error messages claros
- **Accessibility:** Navegación keyboard, screen reader compatible
- **Mobile:** Responsive design functional
- **Browser:** Compatible Chrome, Firefox, Safari, Edge
- **Error Handling:** Graceful degradation, recovery mechanisms

---

## 🎯 **DISTRIBUCIÓN STORY POINTS**

```
📊 SPRINT 2 BREAKDOWN (185 total points):

🏗️ Módulo 1 (Arquitectura): 40 pts (22%) - Giovanni, Ricardo
🔐 Módulo 2 (Auth/Security): 35 pts (19%) - Josué, Nicolás I., Lucas G.  
👤 Módulo 3 (Users/Profiles): 30 pts (16%) - Marisol, Lucas B., Rodrigo
📝 Módulo 4 (Preinscriptions): 35 pts (19%) - Miguel, Juan O., Leonardo
💳 Módulo 5 (Payments): 20 pts (11%) - Camilo
🧪 Módulo 6 (QA/Docs): 25 pts (14%) - Nicolás G., Juan H.

VELOCITY TARGET: 15-20 points per developer
ESTIMATED COMPLETION: 85-90% (factoring learning curve)
```

---

## 🚀 **SPRINT CEREMONIES**

### **📅 Sprint Planning (29 Sept):**
- **Duration:** 2 hours
- **Participants:** All 18 team members
- **Agenda:** 
  - Sprint goal review
  - Story point estimation consensus
  - Task breakdown y assignments
  - Definition of Done agreement
  - Risk identification y mitigation

### **🗣️ Daily Standups:**
- **Time:** 9:00 AM daily
- **Duration:** 15 minutes
- **Format:** What did you do? What will you do? Any blockers?
- **Special:** Technical standups Tue/Thu 10:30 AM cross-module

### **📊 Sprint Review (11 Oct):**
- **Duration:** 1 hour  
- **Participants:** Team + Stakeholders
- **Demo:** End-to-end user flows functional
- **Metrics:** Velocity, burndown, quality metrics

### **🔄 Sprint Retrospective (11 Oct):**
- **Duration:** 45 minutes
- **Focus:** What went well? What improve? Action items Sprint 3

---

## ⚡ **SUCCESS METRICS SPRINT 2**

### **Delivery Metrics:**
- **Story Points Completed:** Target >157 pts (85% of 185)
- **Velocity:** 15-20 pts per developer achieved
- **Quality:** >70% test coverage, <5 critical bugs
- **Performance:** <2s response time key endpoints

### **Team Metrics:**
- **Sprint Completion Rate:** >85%
- **PR Review Time:** <24h average
- **Build Success Rate:** >95%
- **Team Satisfaction:** Survey >4/5

### **Technical Metrics:**
- **Code Coverage:** Backend >70%, Frontend >60%
- **Security:** 0 critical vulnerabilities
- **Performance:** All APIs <2s response
- **Accessibility:** WCAG 2.1 AA compliance key flows

---

**🎉 SPRINT 2 READY FOR EXECUTION!**

Este backlog proporciona roadmap detallado para establishment successful de la base operativa SGICS. Cada user story está designed para maximum team productivity y minimum inter-module dependencies.

**🚀 Next Steps:**
1. **Review completo** este documento con team leads
2. **Sprint Planning** confirmation 29 September 
3. **Environment setup** verification todos developers
4. **Kickoff meeting** y team communication channels
5. **Daily execution** con disciplined Scrum ceremonies

*¡Excelente Sprint 2 incoming, Team! 🏆*

---

## EPIC 7: MÓDULO DE COMUNICACIONES MASIVAS (25 pts)

### US-7.1: Backend Email System (12 pts)
**Como** coordinador  
**Quiero** enviar correos masivos a participantes  
**Para** comunicar información importante del curso

**Tareas:**
- [ ] Crear modelo EmailTemplate (3 pts)
- [ ] Crear modelo EmailLog (2 pts)
- [ ] Endpoint POST /api/emails/send-bulk/ (4 pts)
- [ ] Endpoint GET /api/emails/templates/ (1 pt)
- [ ] Endpoint GET /api/emails/recipients/:courseId (2 pts)

**Criterios de Aceptación:**
- Templates reutilizables con variables
- Envío asíncrono con Celery
- Log completo de envíos
- Manejo de errores de envío

### US-7.2: Frontend Email Composer (8 pts)
**Como** coordinador  
**Quiero** interfaz intuitiva para redactar correos  
**Para** facilitar comunicación con participantes

**Tareas:**
- [ ] Componente MassEmails.vue (ya existe) (2 pts)
- [ ] Integración con API backend (2 pts)
- [ ] Sistema de plantillas (2 pts)
- [ ] Exportación a TXT (1 pt)
- [ ] Checklist de enviados (1 pt)

### US-7.3: Email Export & Tracking (5 pts)
**Como** coordinador  
**Quiero** exportar lista de emails y trackear envíos  
**Para** llevar control externo

**Tareas:**
- [ ] Función exportEmails() (2 pts)
- [ ] Generación de archivo TXT (1 pt)
- [ ] Sistema de marcado (sent/pending) (2 pts)

---

## EPIC 8: SISTEMA DE NOTIFICACIONES (20 pts)

### US-8.1: Notification Backend (10 pts)
**Como** sistema  
**Quiero** generar notificaciones automáticas  
**Para** alertar usuarios de eventos importantes

**Tareas:**
- [ ] Modelo Notification (3 pts)
- [ ] Django Signals para eventos (4 pts)
- [ ] Endpoint GET /api/notifications/ (2 pts)
- [ ] Endpoint PATCH /api/notifications/:id/read/ (1 pt)

**Triggers:**
- Cambio estado preinscripción
- Pago pendiente (3 días antes)
- Pago vencido
- Documentación faltante
- Modificación de curso

### US-8.2: Notification UI (10 pts)
**Como** usuario  
**Quiero** ver mis notificaciones  
**Para** estar informado

**Tareas:**
- [ ] Componente NotificationBell.vue (3 pts)
- [ ] Componente NotificationPanel.vue (3 pts)
- [ ] Integración con Notifications.vue existente (2 pts)
- [ ] Push notifications (2 pts)

---

## EPIC 9: GESTOR DE ARCHIVOS (18 pts)

### US-9.1: File Management Backend (10 pts)
**Como** sistema  
**Quiero** gestionar archivos de forma centralizada  
**Para** organizar documentación

**Tareas:**
- [ ] Modelo FileCategory (2 pts)
- [ ] Modelo Archivo con versionado (4 pts)
- [ ] Endpoint POST /api/files/upload/ (2 pts)
- [ ] Endpoint GET /api/files/ con filtros (2 pts)

### US-9.2: File Management Frontend (8 pts)
**Como** usuario  
**Quiero** subir y organizar archivos  
**Para** mantener documentación ordenada

**Tareas:**
- [ ] Componente FileManager.vue (4 pts)
- [ ] Drag & drop upload (2 pts)
- [ ] Previsualización de archivos (2 pts)

---

## EPIC 10: SISTEMA DE ACREDITACIÓN (22 pts)

### US-10.1: QR Generation Backend (12 pts)
**Como** sistema  
**Quiero** generar QR únicos por participante  
**Para** facilitar acreditación presencial

**Tareas:**
- [ ] Modelo Acreditacion (3 pts)
- [ ] Modelo AcreditacionLog (2 pts)
- [ ] Generación de QR con qrcode library (3 pts)
- [ ] Endpoint GET /api/accreditation/:inscripcionId (2 pts)
- [ ] Endpoint POST /api/accreditation/scan/ (2 pts)

### US-10.2: QR Verification Frontend (10 pts)
**Como** coordinador  
**Quiero** escanear QR y verificar estado  
**Para** acreditar participantes

**Tareas:**
- [ ] Componente QRDisplay.vue (3 pts)
- [ ] Componente QRScanner.vue (4 pts)
- [ ] Vista AccreditationDashboard.vue (3 pts)

---

## EPIC 11: MEJORAS A MÓDULOS EXISTENTES (30 pts)

### US-11.1: Dashboard con Semáforo (10 pts)
**Como** coordinador  
**Quiero** ver estado visual de cursos  
**Para** identificar problemas rápidamente

**Tareas:**
- [ ] Propiedad semaforo_status en Course model (3 pts)
- [ ] Lógica de cálculo de semáforo (4 pts)
- [ ] Visualización en Dashboard.vue (3 pts)

**Reglas de Semáforo:**
- 🟢 Verde: equipo completo + 100% pagos + docs completas
- 🟡 Amarillo: equipo parcial O 80-99% pagos
- 🔴 Rojo: sin equipo O <80% pagos O docs faltantes

### US-11.2: Cursos con Ramas (8 pts)
**Como** coordinador  
**Quiero** organizar cursos por ramas  
**Para** categorizar por edades

**Tareas:**
- [ ] Campo rama en Course model (1 pt)
- [ ] Filtro por rama en frontend (2 pts)
- [ ] Actualizar CourseManagement.vue (3 pts)
- [ ] Migración de datos (2 pts)

### US-11.3: Búsqueda por RUT en Preinscripción (6 pts)
**Como** participante  
**Quiero** autocompletar datos con mi RUT  
**Para** agilizar inscripción

**Tareas:**
- [ ] Endpoint GET /api/users/search-by-rut/:rut (3 pts)
- [ ] Autocompletado en PreinscripcionWizard.vue (3 pts)

### US-11.4: Gestión Avanzada de Pagos (6 pts)
**Como** coordinador de finanzas  
**Quiero** CRUD completo de pagos  
**Para** corregir errores

**Tareas:**
- [ ] Endpoint PUT /api/pagos/:id (2 pts)
- [ ] Endpoint DELETE /api/pagos/:id (1 pt)
- [ ] Búsqueda por grupo (3 pts)