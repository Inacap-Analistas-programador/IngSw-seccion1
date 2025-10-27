# GUÍA INFORMATIVA COMPLETA - PROYECTO SGICS

## ÍNDICE
1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Estado Actual del Proyecto](#estado-actual-del-proyecto)
3. [Arquitectura y Tecnologías](#arquitectura-y-tecnologías)
4. [Organización del Equipo](#organización-del-equipo)
5. [Sprint N2 - Funcionalidades](#sprint-n2---funcionalidades)
6. [Estructura del Código](#estructura-del-código)
7. [Documentación Disponible](#documentación-disponible)
8. [Herramientas de Desarrollo](#herramientas-de-desarrollo)
9. [Próximos Pasos](#próximos-pasos)

---

## RESUMEN EJECUTIVO

### ¿Qué es SGICS?
**Sistema de Gestión Integral de Cursos Scout** - Una plataforma web completa desarrollada para **Guías y Scouts de Chile, Zona Biobío** que permite gestionar:

- **Preinscripciones** de participantes a cursos
- **Gestión de pagos** por grupos y cursos
- **Upload/Download seguro** de archivos
- **Dashboard de control** con KPIs y métricas
- **Sistema de autenticación** robusto con roles

### Contexto del Proyecto
- **Cliente**: Guías y Scouts de Chile - Zona Biobío
- **Institución**: INACAP - Carrera Analista Programador
- **Período**: Sprint N2 (13-24 Octubre 2025)
- **Equipo**: 15 estudiantes organizados en 5 grupos especializados
- **Metodología**: Scrum con enfoque ágil

---

## ESTADO ACTUAL DEL PROYECTO

### COMPLETADO (100%)

#### **1. Arquitectura Profesional**
- Backend Django 5.0 + DRF completamente configurado
- Frontend Vue 3 + TypeScript con tooling profesional
- Base de datos MySQL 8.0 configurada
- Docker + Docker Compose listo para desarrollo

#### **2. Repositorio Organizado**
- Estructura de carpetas profesional
- .gitignore y configuraciones optimizadas
- README completo con instrucciones
- Git inicializado con commits estructurados

#### **3. Documentación Integral**
- 26 documentos organizados en `/docs` externo
- Épicas y user stories detalladas
- Guías de desarrollo y Git workflow
- Asignación de equipos y responsabilidades

#### **4. Configuración de Desarrollo**
- Entornos de desarrollo configurados
- Scripts de automatización listos
- Pipeline CI/CD con GitHub Actions
- Testing frameworks configurados (pytest + Vitest)

### EN PROGRESO

#### **Sprint N2 Activo** (Oct 13-24, 2025)
Los 5 equipos están trabajando en sus módulos asignados:
- **Grupo A**: Autenticación JWT + RBAC
- **Grupo B**: Sistema de Pagos + QA
- **Grupo C**: Gestión de Personas + DevOps
- **Grupo H**: Preinscripciones + Archivos
- **Grupo Z**: Perfiles de Usuario

---

## ARQUITECTURA Y TECNOLOGÍAS

### STACK TECNOLÓGICO IMPLEMENTADO

#### **Backend - Django 5.0**
```
Django 5.0.1
├── Django REST Framework 3.14.0    # API REST
├── SimpleJWT 5.3.0                 # Autenticación JWT
├── django-cors-headers 4.3.1       # CORS
├── Pillow 10.1.0                   # Manejo de imágenes
├── celery 5.3.4                    # Background tasks
└── redis 5.0.1                     # Cache y message broker
```

#### **Frontend - Vue 3 + TypeScript**
```
Vue 3.4.0
├── TypeScript 5.2.2                # Tipado estático
├── Vite 5.0.8                      # Build tool moderno
├── Pinia 2.1.7                     # State management
├── Vue Router 4.2.5                # Routing
├── Tailwind CSS 3.4.0              # Styling utility-first
├── Vee-Validate 4.12.0             # Form validation
└── Axios 1.6.2                     # HTTP requests
```

#### **Base de Datos - MySQL 8.0**
```
MySQL 8.0
├── utf8mb4 charset                  # Soporte completo Unicode
├── mysql_native_password            # Autenticación nativa
└── Configuración optimizada         # Para desarrollo y producción
```

#### **DevOps y Testing**
```
Docker & Docker Compose
├── Multi-stage builds               # Optimización de imágenes
├── Development containers           # Entorno consistente
└── Volume persistence               # Datos persistentes

Testing Stack
├── pytest 7.4.3                    # Backend testing
├── pytest-cov 4.1.0                # Coverage backend
├── Vitest 1.0.4                    # Frontend testing
└── @vitest/ui 1.0.4                # UI para tests
```

### PATRONES DE ARQUITECTURA IMPLEMENTADOS

#### **Backend - Django**
- **Modular Apps**: Cada funcionalidad en app separada
- **DRF ViewSets**: APIs REST estandarizadas
- **JWT Authentication**: Token-based auth segura
- **Custom Permissions**: Control granular de acceso
- **Serializers**: Validación y transformación de datos

#### **Frontend - Vue 3**
- **Composition API**: Lógica reutilizable
- **TypeScript Strict**: Tipado fuerte
- **Pinia Stores**: Estado centralizado
- **Component Library**: Componentes reutilizables
- **Form Validation**: Validación robusta con Vee-Validate

---

## ORGANIZACIÓN DEL EQUIPO

### ESTRUCTURA DE 5 GRUPOS ESPECIALIZADOS

#### **GRUPO A - AUTENTICACIÓN Y SEGURIDAD**
**Integrantes**: Nicolas Irribarra (Lead), Lucas Guerrero, Axel Villa

**Responsabilidades**:
- Sistema de login con JWT
- Control de roles y permisos (RBAC)
- Middleware de autenticación
- Gestión de usuarios y perfiles
- Seguridad del sistema

**Módulos del código**:
- `backend/apps/authentication/`
- `frontend/src/stores/auth.ts`
- `frontend/src/views/Login.vue`

#### **GRUPO B - PAGOS Y CALIDAD**
**Integrantes**: Nicolas Gonzalez (Lead), Juan Herrera, Camilo Colivoro

**Responsabilidades**:
- Sistema de gestión de pagos
- Quality Assurance (QA) del proyecto
- Estadísticas y reportes
- Documentación técnica
- Testing y validaciones

**Módulos del código**:
- `backend/apps/payments/`
- `frontend/src/views/Payments.vue`
- Tests y validaciones generales

#### **GRUPO C - PERSONAS Y DEVOPS**
**Integrantes**: Giovanni Porfirio (Lead), Ricardo Sanhueza, Ricardo Herrera

**Responsabilidades**:
- Gestión de personas y maestros
- Configuración DevOps y CI/CD
- Infraestructura y despliegue
- Base de datos y migraciones
- Scrum Master y coordinación

**Módulos del código**:
- `backend/apps/courses/`
- `infrastructure/`
- `.github/workflows/`
- Docker y configuraciones

#### **GRUPO H - PREINSCRIPCIONES Y ARCHIVOS**
**Integrantes**: Miguel Castillo (Lead), Juan Olivares, Leonardo Lagos

**Responsabilidades**:
- Sistema de preinscripciones (wizard)
- Gestión de archivos (upload/download)
- Validación de documentos
- Búsqueda por RUT chileno
- Interfaz de registro paso a paso

**Módulos del código**:
- `backend/apps/preinscriptions/`
- `backend/apps/files/`
- `frontend/src/views/Preinscriptions.vue`

#### **GRUPO Z - PERFILES DE USUARIO**
**Integrantes**: Marisol Sepúlveda (Lead), Lucas Bustos, Rodrigo Jara, Josue Villalobos

**Responsabilidades**:
- Perfiles de usuario completos
- Dashboard personal
- Configuraciones de usuario
- Historial de actividades
- Interfaz de usuario avanzada

**Módulos del código**:
- `backend/apps/profiles/`
- `frontend/src/views/Profile.vue`
- `frontend/src/components/UserDashboard.vue`

---

## SPRINT N2 - FUNCIONALIDADES

### OBJETIVOS DEL SPRINT (Oct 13-24, 2025)

#### **MVP (Minimum Viable Product)**
Desarrollar las funcionalidades core que permitan el uso básico del sistema:

#### **1. Autenticación Completa (Grupo A)**
- Login/Logout con JWT tokens
- Control de roles (Admin, Instructor, Participante)
- Middleware de autenticación
- Gestión básica de usuarios

#### **2. Preinscripciones Funcionales (Grupo H)**
- Wizard de preinscripción paso a paso
- Búsqueda y validación por RUT chileno
- Upload de documentos requeridos
- Estados de preinscripción (pendiente, aprobada, rechazada)

#### **3. Sistema de Pagos (Grupo B)**
- Registro de pagos por participante
- Consulta de estados de pago por grupo/curso
- Dashboard de pagos con estadísticas
- Suite de tests completa (QA)

#### **4. Gestión de Archivos (Grupo H)**
- Upload seguro de documentos
- Control de acceso por roles
- Almacenamiento organizado por curso/participante
- Versionado básico de archivos

#### **5. Dashboard de Control (Grupo C + Z)**
- KPIs principales del sistema
- Semáforo de estado por curso
- Panel de usuario personalizado
- Métricas en tiempo real

#### **6. CI/CD Pipeline (Grupo C)**
- GitHub Actions configurado
- Tests automáticos en PRs
- Coverage reports
- Deploy automático a staging

### ÉPICAS PRINCIPALES IMPLEMENTADAS

```
Epic 1: Autenticación y Control de Acceso
├── SGICS-201: Sistema de Login JWT
├── SGICS-202: Control de Roles (RBAC)
└── SGICS-203: Gestión de Usuarios

Epic 2: Preinscripciones
├── SGICS-301: Wizard de Preinscripción
├── SGICS-302: Validación de RUT
└── SGICS-303: Upload de Documentos

Epic 3: Sistema de Pagos
├── SGICS-501: Registro de Pagos
├── SGICS-502: Dashboard de Pagos
└── SGICS-503: Reportes de Pagos

Epic 4: Gestión de Archivos
├── SGICS-401: Upload Seguro
├── SGICS-402: Control de Acceso
└── SGICS-403: Organización por Curso

Epic 5: Dashboard y Métricas
├── SGICS-601: Dashboard Principal
├── SGICS-602: KPIs del Sistema
└── SGICS-603: Perfiles de Usuario

Epic 6: CI/CD y DevOps
├── SGICS-701: Pipeline de CI
├── SGICS-702: Testing Automático
└── SGICS-703: Deploy Automático
```

---

## ESTRUCTURA DEL CÓDIGO

### BACKEND - DJANGO APPS MODULARES

```
backend/
├── scouts_platform/              # Configuración principal Django
│   ├── settings/                # Configuraciones por entorno
│   │   ├── __init__.py         # Configuración base
│   │   ├── base.py             # Settings base compartidos
│   │   ├── development.py      # Config desarrollo
│   │   └── production.py       # Config producción
│   ├── urls.py                  # URLs principales
│   ├── wsgi.py                  # WSGI config
│   └── asgi.py                  # ASGI config
│
├── apps/                        # Módulos de la aplicación
│   ├── authentication/          # GRUPO A - Auth & Roles
│   │   ├── __init__.py         # Inicialización del módulo
│   │   ├── models.py           # User, Role, Permission models
│   │   ├── serializers.py      # DRF serializers
│   │   ├── views.py            # Login, logout, refresh views
│   │   ├── permissions.py      # Custom permissions
│   │   ├── urls.py             # URLs del módulo
│   │   └── tests/              # Tests del módulo
│   │
│   ├── preinscriptions/         # GRUPO H - Preinscripciones
│   │   ├── __init__.py         # Inicialización del módulo
│   │   ├── models.py           # Preinscription, Participant models
│   │   ├── serializers.py      # Validation serializers
│   │   ├── views.py            # Wizard viewsets
│   │   ├── urls.py             # URLs del módulo
│   │   └── utils.py            # RUT validation utils
│   │
│   ├── payments/                # GRUPO B - Pagos
│   │   ├── __init__.py         # Inicialización del módulo
│   │   ├── models.py           # Payment, Invoice models
│   │   ├── serializers.py      # Payment serializers
│   │   ├── views.py            # Payment CRUD views
│   │   ├── urls.py             # URLs del módulo
│   │   └── reports.py          # Payment reports
│   │
│   ├── files/                   # GRUPO H - Archivos
│   │   ├── __init__.py         # Inicialización del módulo
│   │   ├── models.py           # File, Document models
│   │   ├── serializers.py      # File upload serializers
│   │   ├── views.py            # File management views
│   │   ├── urls.py             # URLs del módulo
│   │   └── storage.py          # Custom storage backend
│   │
│   └── courses/                 # GRUPO C - Cursos
│       ├── __init__.py         # Inicialización del módulo
│       ├── models.py           # Course, Instructor models
│       ├── serializers.py      # Course serializers
│       ├── views.py            # Course management views
│       └── urls.py             # URLs del módulo
│
├── utils/                       # Utilidades compartidas
│   ├── __init__.py            # Inicialización utils
│   ├── rut_validator.py       # Validador RUT chileno
│   ├── validators.py          # Custom validators
│   ├── permissions.py         # Base permissions
│   ├── pagination.py          # Custom pagination
│   └── exceptions.py          # Custom exceptions
│
├── tests/                     # Tests globales
│   ├── conftest.py            # Pytest configuration
│   ├── factories.py           # Factory Boy factories
│   └── test_integration.py    # Integration tests
│
├── logs/                      # Archivos de log
│   └── django.log             # Log principal Django
│
├── manage.py                  # Django management script
├── requirements.txt           # Dependencias Python
└── Dockerfile.dev             # Docker para desarrollo
```

### FRONTEND - VUE 3 COMPONENT ARCHITECTURE

```
frontend/
├── src/
│   ├── components/              # Componentes reutilizables
│   │   ├── common/             # Componentes base
│   │   │   ├── AppHeader.vue   # Header principal
│   │   │   ├── AppSidebar.vue  # Sidebar navegación
│   │   │   └── AppFooter.vue   # Footer
│   │   ├── forms/              # Componentes de formularios
│   │   │   ├── LoginForm.vue   # Grupo A - Login
│   │   │   ├── PreinscriptionWizard.vue  # Grupo H
│   │   │   └── PaymentForm.vue # Grupo B
│   │   └── ui/                 # UI components
│   │       ├── Button.vue      # Botón reutilizable
│   │       ├── Modal.vue       # Modal component
│   │       └── Table.vue       # Tabla de datos
│   │
│   ├── views/                   # Páginas principales
│   │   ├── Login.vue           # Página de login
│   │   ├── Dashboard.vue       # Dashboard principal
│   │   ├── Preinscriptions.vue # Gestión preinscripciones
│   │   ├── Payments.vue        # Gestión pagos
│   │   ├── Files.vue           # Gestión archivos
│   │   └── Profile.vue         # Perfil usuario
│   │
│   ├── stores/                  # Pinia stores (estado global)
│   │   ├── auth.ts             # Estado autenticación
│   │   ├── preinscriptions.ts  # Estado preinscripciones
│   │   ├── payments.ts         # Estado pagos
│   │   ├── files.ts            # Estado archivos
│   │   └── user.ts             # Estado usuario
│   │
│   ├── utils/                   # Utilidades frontend
│   │   ├── api.ts              # Cliente HTTP (Axios)
│   │   ├── validators.ts       # Validadores (RUT, email, etc.)
│   │   ├── formatters.ts       # Formatters de datos
│   │   └── constants.ts        # Constantes del sistema
│   │
│   ├── router/                  # Vue Router
│   │   └── index.ts            # Configuración rutas
│   │
│   ├── types/                   # TypeScript types
│   │   ├── auth.types.ts       # Tipos autenticación
│   │   ├── api.types.ts        # Tipos API responses
│   │   └── user.types.ts       # Tipos usuario
│   │
│   └── main.ts                  # Entrada principal Vue
│
├── tests/                      # Tests frontend
│   ├── components/             # Tests componentes
│   ├── views/                  # Tests vistas
│   ├── stores/                 # Tests Pinia stores
│   └── utils/                  # Tests utilidades
│
├── public/                     # Assets estáticos
│   ├── favicon.ico
│   └── logo.svg
│
├── package.json                # Dependencias Node.js
├── vite.config.ts              # Configuración Vite
└── Dockerfile.dev              # Docker para desarrollo
```

### INFRASTRUCTURE Y DEVOPS

```
infrastructure/
└── docker/                     # Configuraciones Docker
    ├── backend/
    │   ├── Dockerfile.dev      # Backend development
    │   └── Dockerfile.prod     # Backend production
    ├── frontend/
    │   ├── Dockerfile.dev      # Frontend development
    │   └── Dockerfile.prod     # Frontend production
    └── nginx/
        └── nginx.conf          # Nginx configuration

.github/
└── workflows/                  # GitHub Actions
    └── django.yml              # Pipeline CI/CD

docker-compose.dev.yml          # Desarrollo local
.env.example                    # Variables de entorno ejemplo
.gitignore                      # Archivos ignorados por Git
```

---

## DOCUMENTACIÓN DISPONIBLE

### DOCUMENTACIÓN TÉCNICA (26 documentos organizados)

#### **Planificación y Gestión**
- `sprint-schedule.md` - Calendario detallado Sprint N2
- `ASIGNACION_EQUIPOS_SPRINT2.md` - Responsabilidades por grupo
- `CARTA_GANTT_SGICS_COMPLETA.md` - Timeline del proyecto
- `complexity-estimates.md` - Estimaciones de complejidad

#### **Desarrollo y Códigos**
- `branching-pr-guide.md` - Workflow de Git y PRs
- `patterns-conventions.md` - Convenciones de código
- `TESTING_CI_COMMANDS.md` - Comandos de testing y CI
- `pr-checklist.md` - Checklist para Pull Requests

#### **Épicas y User Stories**
- `epics/` - Carpeta con 7 épicas detalladas:
  - `epic-authentication-control-roles.md`
  - `epic-preinscripciones.md`
  - `epic-pagos.md`
  - `epic-archivos-validacion.md`
  - `epic-dashboard-cursos.md`
  - `epic-tests-qa.md`
  - `epic-ci-devops.md`

#### **Análisis y Requerimientos**
- `REQUERIMIENTOS_ACTUALIZADOS.md` - Requerimientos funcionales
- `ANALISIS_TOMA_REQUERIMIENTOS_SGICS.md` - Análisis completo
- `RASTREABILIDAD_RF_QA_DEV.md` - Trazabilidad req → desarrollo

#### **Arquitectura y Datos**
- `DIAGRAMAS_UML_ACTUALIZADOS.md` - Diagramas del sistema
- `schema/SCHEMA_REVIEW_2025-10-01.md` - Review de BD

#### **Jira y Gestión**
- `jira-import-sprint2.csv` - Historias para importar
- `jira-import-readme.md` - Guía de importación
- `sprint2-backlog.md` - Backlog detallado

### DOCUMENTACIÓN LEGACY ORGANIZADA

#### **Carpeta `legacy/`**
Contiene toda la documentación histórica del proyecto:
- Análisis ejecutivo completo
- Carta Gantt original con Eraser
- Guía de tecnologías por módulo
- Documentos originales del cliente
- Evaluaciones y plantillas académicas
- 8 carpetas organizadas por fase del proyecto

---

## HERRAMIENTAS DE DESARROLLO

### CONFIGURACIÓN COMPLETA Y LISTA PARA USAR

#### **Backend Tools**
```bash
# Virtual Environment configurado
python -m venv venv
venv\Scripts\activate

# Dependencies instaladas
pip install -r requirements.txt

# Database migrations listas
python manage.py migrate

# Admin interface configurado
python manage.py createsuperuser

# Development server
python manage.py runserver
```

#### **Frontend Tools**
```bash
# Node.js dependencies instaladas
npm ci

# Development server con hot reload
npm run dev

# Build para producción
npm run build

# Testing con Vitest
npm run test
npm run test:coverage
```

#### **Docker Development**
```bash
# Full stack con un comando
docker-compose -f docker-compose.dev.yml up --build

# Logs en tiempo real
docker-compose -f docker-compose.dev.yml logs -f

# Ejecutar migraciones en container
docker-compose -f docker-compose.dev.yml exec backend python manage.py migrate
```

#### **Testing & Quality**
```bash
# Backend testing (pytest)
pytest                          # Todos los tests
pytest --cov=.                 # Con coverage
pytest -v                      # Verbose mode

# Frontend testing (Vitest)  
npm run test                    # Unit tests
npm run test:coverage          # Con coverage
npm run test:ui                # UI mode

# Code quality
black .                        # Python formatting
isort .                        # Import sorting
npm run lint                   # ESLint frontend
npm run format                 # Prettier formatting
```

#### **CI/CD Pipeline (GitHub Actions)**
El pipeline se ejecuta automáticamente en cada PR:
```yaml
# .github/workflows/ci.yml
- Lint y formato (Black, ESLint, Prettier)
- Tests backend (pytest + coverage)
- Tests frontend (Vitest + coverage)  
- Security scan (Bandit, npm audit)
- Build verification
- Deploy to staging (automático en main)
```

### ACCESOS Y HERRAMIENTAS EXTERNAS

#### **Jira Project Management**
- **URL**: https://inacapmail-team-z3fibirj.atlassian.net/
- **Board**: Sprint N2 - SGICS
- **Import ready**: `jira-import-sprint2.csv` listo para importar

#### **GitHub Repository**
- **URL**: https://github.com/Inacap-Analistas-programador/IngSw-seccion1
- **Branch principal**: `main`
- **Protección**: PRs requeridos, CI must pass
- **Teams**: Equipos configurados por grupo

#### **Base de Datos**
- **Desarrollo**: SQLite (local) + MySQL (Docker)
- **Producción**: MySQL 8.0
- **Migrations**: Todas aplicadas y sincronizadas

---

## PRÓXIMOS PASOS

### SEMANA ACTUAL (Oct 7-11, 2025)

#### **Preparación Final Sprint N2**
1. **Validación de equipos** - Confirmar asignaciones
2. **Setup individual** - Cada integrante configura entorno
3. **Kickoff Sprint** - Reunión de inicio (Oct 13)
4. **Definición de Definition of Done** por épica

#### **Tasks Inmediatas**
- [ ] Revisar y confirmar épicas asignadas por grupo
- [ ] Configurar entornos de desarrollo individuales
- [ ] Importar historias a Jira desde CSV
- [ ] Setup de branches por grupo
- [ ] Primera reunión de coordinación

### SPRINT N2 DEVELOPMENT (Oct 13-24, 2025)

#### **Semana 1 (Oct 13-18)**
- **Desarrollo core features** cada grupo
- **Daily standups** (lunes, miércoles, viernes)
- **PRs tempranos** para validar integración
- **Testing continuo** desde día 1

#### **Semana 2 (Oct 19-24)**  
- **Integración de módulos** entre grupos
- **Testing end-to-end** del MVP
- **Bug fixing** y refinamientos
- **Demo preparation** para Sprint Review

### POST-SPRINT N2 (Oct 25+)

#### **Sprint Review & Retrospective**
- Demo del MVP a stakeholders
- Retrospectiva de equipo
- Planificación Sprint N3
- Identificación de mejoras

#### **Preparación Sprint N3**
- Funcionalidades avanzadas
- Mejoras de UX/UI
- Performance optimization
- Security hardening

---

## RESUMEN PARA ACCIÓN INMEDIATA

### TENEMOS LISTO (100% Completo)
- **Arquitectura profesional** Django + Vue configurada
- **Repositorio organizado** con estructura limpia
- **Documentación completa** (26 documentos)
- **Equipos asignados** con responsabilidades claras
- **Herramientas configuradas** (Docker, CI/CD, Testing)
- **Base de código comentada** para fácil comprensión

### ACCIÓN INMEDIATA REQUERIDA
1. **Confirmar disponibilidad** de los 15 integrantes
2. **Validar asignaciones** de épicas por grupo
3. **Setup individual** de entornos de desarrollo
4. **Kickoff meeting** Sprint N2 (programar para Oct 13)
5. **Import Jira stories** desde CSV preparado

### CONTACTOS CLAVE
- **Scrum Master**: Ricardo Cristóbal Sanhueza Acuña
- **Repository**: https://github.com/Inacap-Analistas-programador/IngSw-seccion1
- **Documentación**: `/docs` folder con toda la información
- **Jira Board**: https://inacapmail-team-z3fibirj.atlassian.net/

### OBJETIVO SPRINT N2
**Entregar MVP funcional** con autenticación, preinscripciones básicas, pagos, gestión de archivos y dashboard, listo para demostrar a stakeholders el 24 de octubre 2025.

---

*Documento generado el 7 de octubre de 2025*  
*Estado: Proyecto listo para iniciar desarrollo Sprint N2*  
*Próxima actualización: Post Sprint Review (25 octubre 2025)*