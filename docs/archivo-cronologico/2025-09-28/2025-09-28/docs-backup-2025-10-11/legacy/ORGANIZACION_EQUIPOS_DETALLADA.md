# ORGANIZACIÓN DE EQUIPOS - 6 MÓDULOS ESPECIALIZADOS

**Proyecto:** Sistema de Gestión Integral para Cursos Scouts (SGICS)  
**Sprint:** 2 (Semanas 3-4)  
**Fecha:** 28 Septiembre 2025  
**Scrum Master:** Ricardo SanhuezaANI## RESUMEN ORGANIZACIONAL

### Filosofía de Organización:
La estructura de 6 módulos está diseñada para **maximizar paralelización** y **minimizar dependencias**, permitiendo que múltiples equipos trabajen simultáneamente sin bloquearse mutuamente.

### Métricas de Distribución:
- **Total Personas:** 18 desarrolladores
- **Módulos:** 6 especializados
- **Sprint 2 Points:** 185 pts total
- **Promedio por persona:** 10.3 pts
- **Rango recomendado:** 8-15 pts por personaQUI# MÓDULO 1: ARQUITECTURA Y DEVOPS

## Composición del Equipo:
- **Líder Técnico:** Ricardo Sanhueza
- **Co-Líder:** Giovanni Pacheco
- **Tamaño del Equipo:** 2 personas
- **Asignación Sprint 2:** 40 story points (25% del sprint)

## Especialización Principal:
**"La fundación técnica que sostiene toda la plataforma"**DULOS ESPECIALIZADOS**



**Proyecto:** Sistema de Gestión Integral para Cursos Scouts (SGICS)  
**Sprint:** 2 (Semanas 3-4)  
**Fecha:** 27 Septiembre 2025  
**Scrum Master:** Ricardo Sanhueza

---

##  **RESUMEN ORGANIZACIONAL**

### ** Filosofía de Organización:**
La estructura de 6 módulos está diseñada para **maximizar paralelización** y **minimizar dependencias**, permitiendo que múltiples equipos trabajen simultáneamente sin bloquearse mutuamente.

### ** Métricas de Distribución:**
- **Total Personas:** 18 developers
- **Módulos:** 6 especializados
- **Sprint 2 Points:** 185 pts total
- **Promedio por persona:** 10.3 pts
- **Range recomendado:** 8-15 pts por persona

---

#  **MÓDULO 1: ARQUITECTURA Y DEVOPS**

## ** Team Composition:**
- ** Technical Lead:** Ricardo Sanhueza
- ** Co-Lead:** Giovanni Pacheco
- ** Team Size:** 2 personas
- ** Sprint 2 Allocation:** 40 story points (25% del sprint)

## ** Especialización Principal:**
**"La fundación técnica que sostiene toda la plataforma"**

### ** Responsabilidades Core:**
1. **Infrastructure as Code** - Docker Compose, GitHub Actions, deployment automation
2. **Database Architecture** - PostgreSQL setup, migrations, performance optimization
3. **Observability Stack** - Logging, monitoring, metrics, alerting
4. **DevOps Pipeline** - CI/CD, testing automation, environment management
5. **Technical Standards** - Code quality, security policies, best practices

### ** Sprint 2 Epics:**

#### **Epic 1.1: CI/CD Pipeline Completo (15 pts)**
```
 Objetivo: Pipeline automatizado de desarrollo a producción

US-1.1.1: GitHub Actions Workflow (5 pts)
- Tests automáticos backend (pytest) + frontend (vitest)
- Linting y security scanning (bandit, eslint)
- Matrix strategy múltiples versiones
- Artifact generation y caching
- Notification Discord on build status

US-1.1.2: Docker Multi-stage Build (5 pts)  
- Optimized Docker images backend/frontend
- Multi-stage builds para reducir size
- Layer caching strategy
- Security scanning images
- Push to GitHub Container Registry

US-1.1.3: Automated Deployment (5 pts)
- Deploy staging automático en merge develop
- Production deploy con manual approval
- Blue/green deployment strategy (básico)
- Rollback capability
- Health checks post-deployment
```

#### **Epic 1.2: Database y Observabilidad (25 pts)**
```
 Objetivo: Base de datos robusta con visibilidad completa

US-1.2.1: PostgreSQL Production Setup (8 pts)
- Docker PostgreSQL con persistent volumes
- Connection pooling (pgbouncer)
- Initial database schema con constraints
- Backup/restore scripts automatizados
- Migration strategy documentada

US-1.2.2: Django Models Architecture (7 pts)
- Apps structure: users, preinscriptions, payments, files, audit
- Model relationships con foreign keys optimizados
- Custom managers para queries comunes
- Indexes para performance
- Data validation a nivel base de datos

US-1.2.3: Monitoring y Alerting (10 pts)
- Prometheus metrics endpoint Django
- Grafana dashboards: API performance, DB metrics, system resources
- Structured logging con loguru + JSON format
- Alert manager para notificaciones críticas
- Log retention policies
```

## ** Success Criteria Sprint 2:**
-  Pipeline CI/CD ejecutando tests automáticamente
-  Docker Compose levanta ambiente completo <3 minutos
-  Database migrations sin errores
-  Monitoring dashboards mostrando métricas reales
-  Deployment staging funcional con rollback tested

## ** Dependencies y Interfaces:**
- **Provides:** Database schema, deployment pipeline, monitoring infrastructure
- **Consumes:** Application code de otros módulos
- **Critical Path:** Módulos 2-5 dependen de database schema estable

---

#  **MÓDULO 2: AUTENTICACIÓN Y SEGURIDAD**

## ** Team Composition:**
- ** Technical Lead:** Nicolás Irribarra
- ** Security Specialist:** Josué Vásquez
- ** Auth Developer:** Lucas Guerrero
- ** Team Size:** 3 personas
- ** Sprint 2 Allocation:** 35 story points (22% del sprint)

## ** Especialización Principal:**
**"El guardián que protege datos y controla acceso a la plataforma"**

### ** Responsabilidades Core:**
1. **JWT Authentication** - Registro, login, logout, token management
2. **RBAC System** - 6 roles jerárquicos con permisos granulares
3. **Security Hardening** - Input validation, rate limiting, HTTPS enforcement
4. **Authorization Middleware** - Permission control en todas las rutas
5. **Audit Logging** - Trazabilidad completa de acciones de usuarios

### ** Sprint 2 Epics:**

#### **Epic 2.1: JWT Authentication System (15 pts)**
```
 Objetivo: Sistema de autenticación robusto y seguro

US-2.1.1: User Registration (5 pts)
Como nuevo usuario quiero registrarme para acceder al sistema
- Endpoint POST /api/auth/register/
- Validations: email único, password policy (8+ chars, 1 número)
- Auto-create User + Persona relationship
- Email verification (opcional Sprint 2)
- Response sanitizada (no password hash)

US-2.1.2: Login/Logout con Rate Limiting (5 pts)
Como usuario registrado quiero iniciar sesión segura
- JWT token generation con configuración flexible
- Rate limiting: 5 intentos fallidos por IP cada 15 minutos
- Failed attempts tracking con Redis
- Token blacklisting en logout
- Secure token storage guidelines

US-2.1.3: Password Reset y Token Refresh (5 pts) 
Como usuario quiero recuperar contraseña y mantener sesión
- Password reset con email + secure token
- Token refresh endpoint con validation
- Access token lifetime: 1 hora, refresh: 7 días  
- Celery task para email sending
- Token cleanup job automático
```

#### **Epic 2.2: RBAC (Role-Based Access Control) (20 pts)**
```
 Objetivo: Control de acceso granular por roles y scope

US-2.2.1: Modelo de Roles Jerárquico (8 pts)
Como administrador quiero asignar roles con scope territorial
- 6 Roles: SUPERADMIN, COORDINADOR, VALIDADOR_DISTRITO, 
  VALIDADOR_GRUPO, FINANZAS, PARTICIPANTE
- RoleAssignment model con scope_type/scope_id
- Territorial hierarchy: ZONA → DISTRITO → GRUPO
- Management command para setup roles iniciales
- Fixtures con datos de prueba

US-2.2.2: Authorization Middleware (7 pts)
Como developer quiero autorización automática en endpoints
- Decorator @require_role(['COORDINADOR', 'SUPERADMIN'])
- Middleware validación scope territorial
- Permission classes para DRF ViewSets
- Response 403 con mensajes descriptivos
- Integration con audit logging

US-2.2.3: Security Policies y Validation (5 pts)
Como sistema quiero prevenir ataques de seguridad
- Input sanitization con bleach (XSS prevention)
- File upload validation (tipo, tamaño, virus scan stub)
- SQL injection prevention (parametrized queries)
- CORS configuration para frontend específico
- Security headers: CSP, HSTS, X-Frame-Options
```

## ** Success Criteria Sprint 2:**
-  Usuario puede registrarse, login, logout sin errores
-  JWT tokens funcionan con refresh automático
-  6 roles implementados con permissions working
-  Rate limiting previene brute force attacks  
-  Security headers presentes en responses
-  Audit log captura todas las acciones de auth

## ** Dependencies y Interfaces:**
- **Provides:** JWT middleware, role decorators, user authentication
- **Consumes:** Database models de Módulo 1
- **Interfaces:** Authentication state para Módulos 3-5

---

#  **MÓDULO 3: USUARIOS Y PERFILES**

## ** Team Composition:**
- ** Technical Lead:** Lucas Betanzos
- ** Backend Developer:** Marisol Saez
- ** UI/UX Designer:** Rodrigo Jara
- ** Team Size:** 3 personas  
- ** Sprint 2 Allocation:** 30 story points (19% del sprint)

## ** Especialización Principal:**
**"La cara humana de la plataforma - perfiles scouts y experiencia usuario"**

### ** Responsabilidades Core:**
1. **User Profile Management** - CRUD completo datos personales y scout
2. **Frontend Components** - Component library reutilizable con Vue 3
3. **UI/UX Design System** - Scout-themed design con accessibility
4. **Form Management** - Formularios reactivos con validación
5. **Data Presentation** - Dashboards y vistas optimizadas por rol

### ** Sprint 2 Epics:**

#### **Epic 3.1: Backend User Management (12 pts)**
```
 Objetivo: API robusta para gestión de perfiles scout

US-3.1.1: Modelo Persona Scout Completo (8 pts)
Como usuario quiero mantener mi perfil scout actualizado
- Campos personales: rut, nombres, apellidos, fecha_nacimiento, sexo, teléfono
- Datos scout: zona, distrito, grupo, rama, años_experiencia  
- Información médica: JSON field encrypted para datos sensibles
- Validations: RUT chileno con dígito verificador, email único
- Audit trail para cambios de perfil

US-3.1.2: API de Búsqueda y Filtros (4 pts)
Como coordinador quiero buscar participantes eficientemente
- GET /api/personas/ con DjangoFilterBackend
- Search: RUT, nombre, apellidos, email
- Filters: zona, distrito, grupo, rama, estado
- Pagination: 20 items por página con next/previous
- Performance optimization con select_related
```

#### **Epic 3.2: Frontend Component System (18 pts)**
```
 Objetivo: Componentes Vue 3 reutilizables y design system

US-3.2.1: UserProfile Component con Tabs (10 pts)
Como usuario quiero interfaz intuitiva para mi perfil
- ProfileTabs component: Personal, Scout, Médica
- Vue 3 Composition API con reactive forms
- Vee-Validate + Yup schemas para validation
- Auto-save draft cada 30 segundos con local storage
- Loading states y error handling
- Diseño web responsive para todas las pantallas

US-3.2.2: Component Library Reutilizable (5 pts)
Como developer quiero componentes consistentes
- BaseInput con variants (text, email, tel, password)
- BaseSelect con async loading support
- BaseFileUpload con drag/drop capability
- BaseCard, BaseButton con design system
- LoadingSpinner, ErrorMessage, SuccessToast
- TypeScript interfaces para props

US-3.2.3: Design System Scout-themed (3 pts)  
Como usuario quiero interfaz atractiva y accesible
- Color palette: azul scout (#1e3a8a), verde (#16a34a), amarillo (#eab308)
- Typography scale responsive (sm, base, lg, xl, 2xl)
- Spacing system 4px grid (1, 2, 3, 4, 6, 8, 12, 16)
- Accessibility: WCAG 2.1 AA compliance
- Dark mode support (opcional)
```

## ** Success Criteria Sprint 2:**
-  Usuario puede crear y editar perfil completo
-  Búsqueda de participantes funcional con filtros
-  Component library documentado y reutilizable
-  Design system aplicado consistentemente
-  Forms con validation en tiempo real
-  Web responsive en todas las resoluciones

## ** Dependencies y Interfaces:**
- **Provides:** User management API, Vue components, design system
- **Consumes:** Authentication de Módulo 2, Database de Módulo 1
- **Interfaces:** Profile data para Módulo 4 (Preinscriptions)

---

#  **MÓDULO 4: PREINSCRIPCIONES Y FORMULARIOS**

## ** Team Composition:**
- ** Technical Lead:** Miguel Contreras
- ** Backend Developer:** Juan Orrego  
- ** Frontend Developer:** Leonardo López
- ** Team Size:** 3 personas
- ** Sprint 2 Allocation:** 35 story points (22% del sprint)

## ** Especialización Principal:**
**"El corazón del proceso - wizard de preinscripción con validaciones complejas"**

### ** Responsabilidades Core:**
1. **State Machine Complex** - 7 estados con transiciones validadas
2. **Multi-step Wizard** - 4 pasos con validación progressive
3. **Business Rules Engine** - Validaciones de negocio y cupos
4. **File Management** - Upload de fichas médicas con processing
5. **Notification System** - Emails automáticos por cambios de estado

### ** Sprint 2 Epics:**

#### **Epic 4.1: Backend State Machine (15 pts)**
```
 Objetivo: Sistema robusto de estados para preinscripciones

US-4.1.1: Modelo con 7 Estados (8 pts)
Como sistema quiero controlar flujo de preinscripción
Estados: BORRADOR → ENVIADO → EN_REVISION → VALIDADO → CUPO_ASIGNADO
         ↳ RECHAZADO, CANCELADO
- PreinscripcionEstado enum con transiciones válidas
- PreinscripcionEstadoHist para audit trail completo
- State machine validation en model clean()
- Signals automáticos para logging
- Business rules: unicidad por persona/curso activo

US-4.1.2: API CRUD con Filtros Avanzados (7 pts)
Como frontend quiero API completa para preinscripciones
- PreinscripcionViewSet con permissions por rol
- Filters: estado, fecha_creacion, persona__zona, curso
- Custom actions: change_state, bulk_approve
- Serializers con nested data (persona, curso)
- Soft delete con recovery capability
- Pagination con metadata (counts por estado)
```

#### **Epic 4.2: Frontend Multi-step Wizard (20 pts)**
```
 Objetivo: Wizard intuitivo y validado para preinscripción

US-4.2.1: Wizard 4 Pasos con Stepper (12 pts)
Como participante quiero proceso guiado para preinscripción
- Step 1: Datos Personales (RUT, nombre, contacto, fecha nacimiento)
- Step 2: Info Scout (zona, distrito, grupo, rama, experiencia)  
- Step 3: Info Salud (alimentación, alergias, limitaciones físicas)
- Step 4: Documentos (ficha médica obligatoria, info vehículo opcional)
- Vue Router con params de step
- StepperComponent visual con progress
- Validation antes de next step
- Vuex/Pinia store para state management

US-4.2.2: File Upload con Drag & Drop (5 pts)
Como usuario quiero subir documentos fácilmente  
- FileUploadComponent con drag/drop zone
- Preview de archivos subidos con thumbnails
- Validation: PDF/JPG/PNG, max 5MB por archivo
- Progress bar durante upload con cancel capability
- Integration con /api/files/ backend
- Error handling con user-friendly messages

US-4.2.3: Business Rules Frontend (3 pts)
Como usuario quiero feedback inmediato sobre eligibilidad
- Real-time validation cupos disponibles
- Age validation según rama scout
- Duplicate preinscription prevention
- Dynamic field requirements según selections
- Warning messages para edge cases
```

## ** Success Criteria Sprint 2:**
-  Wizard completo 4 pasos funcional
-  State machine con 7 estados working
-  File upload con validation funcional  
-  Business rules preventing invalid submissions
-  API CRUD con filtros avanzados
-  Auto-save y recovery de drafts

## ** Dependencies y Interfaces:**
- **Provides:** Preinscripción API, wizard components
- **Consumes:** User profiles (Módulo 3), Authentication (Módulo 2)
- **Interfaces:** Estado preinscripción para Módulo 5 (Payments)

---

# 💳 **MÓDULO 5: PAGOS Y FINANZAS**

## ** Team Composition:**
- ** Solo Technical Lead:** Camilo Colivoro
- ** Team Size:** 1 persona (módulo lightweight)
- ** Sprint 2 Allocation:** 20 story points (12% del sprint)

## ** Especialización Principal:**
**"El motor financiero - pagos individuales, batch import y confirmación automática"**

### ** Responsabilidades Core:**
1. **Payment Processing** - Registro individual de pagos con comprobantes
2. **Batch Import System** - Carga masiva desde Excel con validation
3. **Financial Dashboard** - KPIs y métricas para equipo finanzas
4. **Auto-confirmation Logic** - Reglas automáticas por pago válido
5. **Financial Reporting** - Exports y reportes básicos

### ** Sprint 2 Epics:**

#### **Epic 5.1: Core Payment System (12 pts)**
```
 Objetivo: Sistema básico de pagos funcional

US-5.1.1: Modelos de Datos Pagos (4 pts)
Como sistema quiero estructura robusta para pagos
- Pago model: preinscripcion_fk, monto, fecha_pago, metodo_pago
- Estados: PENDIENTE, CONFIRMADO, RECHAZADO, REEMBOLSADO
- Cuota model para payments en installments
- GroupPaymentBatch para imports masivos
- PaymentError para tracking errores batch
- Audit trail completo

US-5.1.2: API Endpoints Pagos (4 pts)
Como finanzas quiero registrar pagos individuales
- POST /api/pagos/ con validation monto/fecha
- GET /api/pagos/ con filters: persona, fecha, estado, metodo
- PUT /api/pagos/{id}/ para update comprobantes
- Permissions: solo rol FINANZAS puede crear/editar
- File upload integration para comprobantes
- Serializers con nested preinscripcion data

US-5.1.3: Confirmación Automática (4 pts)
Como sistema quiero confirmar preinscripciones automáticamente
- ConfiguracionModel para reglas por curso
- Signal post_save en Pago para trigger evaluation
- Auto-change estado → CUPO_ASIGNADO si elegible
- Celery task para notification email
- Audit log confirmación automática
- Override manual capability
```

#### **Epic 5.2: Financial Dashboard (8 pts)**
```
 Objetivo: Visibilidad financiera para toma de decisiones

US-5.2.1: Dashboard Finanzas Básico (5 pts)
Como finanzas quiero visibilidad del estado financiero
- KPI cards: Total recaudado, Pagos pendientes, Tasa conversión
- Chart.js integration: Pagos por día, Métodos de pago
- Lista pagos recientes con search por RUT
- Filters: fecha, estado, método, curso
- Quick actions: Registrar pago, Confirmar pendiente
- Diseño web responsive optimizado

US-5.2.2: Prototipo Batch Import (3 pts)
Como finanzas quiero importar pagos desde Excel
- File upload component para .xlsx/.csv
- Basic parsing con SheetJS/Papa Parse
- Preview table con validation highlighting
- Column mapping interface
- Error reporting por row
- Batch processing status indicator
```

## ** Success Criteria Sprint 2:**
-  Registro individual de pagos funcional
-  Dashboard con KPIs básicos displaying
-  Confirmación automática working con notification
-  Prototipo batch import validating data
-  API endpoints documentados y tested

## ** Dependencies y Interfaces:**
- **Provides:** Payment processing, financial data
- **Consumes:** Preinscripción states (Módulo 4), User data (Módulo 3)
- **Interfaces:** Payment confirmation trigger para notificaciones

---

#  **MÓDULO 6: QA Y DOCUMENTACIÓN**

## ** Team Composition:**
- ** QA Lead:** Nicolás González
- ** Documentation Specialist:** Juan Herrera
- ** Team Size:** 2 personas
- ** Sprint 2 Allocation:** 25 story points (16% del sprint)

## ** Especialización Principal:**
**"Los guardianes de la calidad - testing, documentación y deployment"**

### ** Responsabilidades Core:**
1. **Automated Testing** - Unit, integration, E2E testing strategy
2. **Quality Assurance** - Code review, performance testing, security testing
3. **Technical Documentation** - API docs, setup guides, architecture docs
4. **User Documentation** - Manuals, tutorials, troubleshooting guides
5. **Deployment Support** - Environment validation, deployment testing

### ** Sprint 2 Epics:**

#### **Epic 6.1: Testing Framework (15 pts)**
```
 Objetivo: Testing automático completo con >70% coverage

US-6.1.1: Backend Testing Suite (8 pts)
Como developer quiero confianza en estabilidad del código
- pytest + Django test framework setup
- Test categories: Unit (models, serializers), Integration (APIs), E2E
- Factory Boy para generating test data
- Coverage.py integration con reporting
- Database test isolation con transactions
- Mock external services (email, file storage)
- CI integration con GitHub Actions

US-6.1.2: Frontend Testing Suite (4 pts) 
Como frontend developer quiero tests para Vue components
- Vitest configuration para Vue 3
- @testing-library/vue para component testing  
- Unit tests: components, composables, stores
- Mock API responses con MSW (Mock Service Worker)
- E2E smoke tests con Playwright
- Visual regression testing (basic setup)

US-6.1.3: CI Testing Integration (3 pts)
Como team quiero tests automáticos en pull requests
- GitHub Actions matrix testing
- Parallel execution backend/frontend
- Test reports como PR comments
- Coverage badge generation
- Branch protection rules con required tests
- Deployment blocking si tests fail
```

#### **Epic 6.2: Documentation Ecosystem (10 pts)**
```
 Objetivo: Documentación completa para developers y usuarios

US-6.2.1: API Documentation (4 pts)
Como frontend developer quiero documentación API clara
- drf-spectacular setup para OpenAPI
- Swagger UI con interactive testing
- Authentication flow documentation
- Error codes y response examples
- Postman collection generation
- API versioning strategy documented

US-6.2.2: Technical Documentation (3 pts)
Como nuevo developer quiero setup rápido
- README.md completo con step-by-step setup
- CONTRIBUTING.md con code standards  
- Architecture Decision Records (ADRs)
- Database schema documentation
- Environment variables documentation
- Troubleshooting guide para common issues

US-6.2.3: User Manual Básico (3 pts)
Como usuario final quiero guías para usar sistema
- Role-specific user guides (Coordinador, Finanzas, Participante)
- Screenshots de pantallas principales
- FAQ section con preguntas comunes
- Video tutorial básico (screen recording)
- Onboarding checklist para nuevos usuarios
- Contact information para support
```

## ** Success Criteria Sprint 2:**
-  Test coverage >70% backend, >60% frontend
-  API documentation completa y navegable
-  Setup documentation permite new developer onboarding <1h
-  User manual cubre flujos principales
-  CI pipeline ejecuta tests automáticamente
-  Quality gates previenen deployment de código con issues

## **🔗 Dependencies y Interfaces:**
- **Provides:** Testing framework, documentation, quality assurance
- **Consumes:** Code de todos los otros módulos
- **Interfaces:** Quality feedback para todos los teams

---

##  **CROSS-MODULE COORDINATION**

### ** Integration Points Críticos:**

#### **API Contracts (Definir Día 1):**
```typescript
// Authentication Context
interface AuthUser {
  id: number;
  email: string;
  roles: string[];
  scopes: { type: string; id: string }[];
}

// Preinscripción State
interface Preinscripcion {
  id: number;
  estado: 'BORRADOR' | 'ENVIADO' | 'EN_REVISION' | 'VALIDADO' | 'CUPO_ASIGNADO';
  persona: PersonaBasic;
  curso: CursoBasic;
  created_at: string;
}

// Payment Integration  
interface Pago {
  id: number;
  preinscripcion: number;
  monto: number;
  estado: 'PENDIENTE' | 'CONFIRMADO';
  fecha_pago: string;
}
```

### ** Daily Sync Requirements:**
- **Morning Standup (9:00):** Each module reports progress y blockers
- **Technical Standup (10:30 Tue/Thu):** Cross-module technical sync
- **Integration Demo (Fri 14:00):** Weekly integration demonstration

### ** Dependency Management:**
1. **Módulo 1** → Database schema must be stable by day 3
2. **Módulo 2** → Authentication context needed by day 5  
3. **Módulo 3** → User management API needed by day 7
4. **Módulo 4** → Depends on Modules 2+3 integration
5. **Módulo 5** → Depends on Module 4 preinscripción states
6. **Módulo 6** → Tests all modules continuously

---

##  **SUCCESS METRICS POR MÓDULO**

| Módulo | Velocity Target | Quality Gate | Integration Milestone |
|--------|----------------|--------------|---------------------|
| **1. Arquitectura** | 40 pts | Pipeline passing, DB stable | Day 3: Schema locked |
| **2. Auth & Security** | 35 pts | Security scan passing | Day 5: JWT middleware |
| **3. Users & Profiles** | 30 pts | Component lib documented | Day 7: Profile API |
| **4. Preinscriptions** | 35 pts | State machine tested | Day 10: Wizard demo |
| **5. Payments** | 20 pts | Payment flow working | Day 12: Auto-confirmation |
| **6. QA & Docs** | 25 pts | >70% coverage | Day 14: Documentation complete |

---



### ** Communication Channels:**
- **General:** #scouts-general (announcements, coordination)
- **Module 1:** #architecture-devops (technical infrastructure)
- **Module 2:** #auth-security (authentication, permissions)
- **Module 3:** #users-frontend (profiles, UI/UX)
- **Module 4:** #preinscriptions (wizard, states)
- **Module 5:** #payments-finance (financial operations)
- **Module 6:** #qa-docs (testing, documentation)
- **Integration:** #cross-module-sync (technical coordination)

---



---

*Organización diseñada por: GitHub Copilot*  
*Fecha: 27 Septiembre 2025*  
*Validada contra: Mejores prácticas Scrum + Arquitectura de Software*