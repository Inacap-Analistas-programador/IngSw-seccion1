# GUÍA TÉCNICA POR MÓDULOS - SISTEMA DE GESTIÓN SCOUTS

**Descripción del Proyecto:** Sistema web para gestionar inscripciones de cursos scouts  
**Infraestructura:** Windows Server PowerEdge (desarrollo) + Hostinger (producción)  
**Base de Datos:** Microsoft SQL Server (modelo relacional definido en SAP PowerDesigner)  
**Gestión y Calidad:** Jira Software (gestión ágil) + SonarQube (calidad y seguridad de código)  
**Sprint Actual:** 2 (Construcción de la base técnica del sistema)  
**Fecha de Actualización:** 28 Septiembre 2025  
**Scrum Master:** Ricardo Sanhueza

---

## ORGANIZACIÓN DE LA INFRAESTRUCTURA

### Entornos de Desarrollo y Despliegue:
- **Desarrollo Local:** Windows Server con contenedores Docker
- **Base de Datos:** Microsoft SQL Server 2019 (contenedor `mcr.microsoft.com/mssql/server` para desarrollo)
- **Producción:** VPS en Hostinger con base de datos en la nube
- **Control de Versiones:** GitHub
- **Automatización de Despliegue:** GitHub Actions + SonarQube Quality Gate + Jira Deployments

### Flujo de Trabajo de Desarrollo:
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   DESARROLLO      │    │ GITHUB ACTIONS   │    │   PRODUCCIÓN    │
│ Windows Server  │───▶│ Pruebas y construcción │───▶│  Hostinger VPS  │
│ Ambiente local  │    │ automática de código│   │ Usuarios finales│
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

---

# MÓDULO 1: INFRAESTRUCTURA Y DESPLIEGUE
**Responsables:** Ricardo Sanhueza & Giovanni Pacheco  
**Responsabilidad:** Configurar servidores, base de datos y automatizar el proceso de despliegue

## Stack Tecnológico Utilizado

### Containerización con Docker:
Docker permite mantener consistencia entre los diferentes entornos de desarrollo y producción:
```yaml
# Docker Stack
- Docker Desktop para Windows
- Docker Compose 3.8+
- Multi-stage Dockerfiles
- Layer caching strategy

# Registry y Deployment
- GitHub Container Registry
- Hostinger Docker Support
- Automated deployment scripts
```

### Pipeline de Integración y Despliegue Continuo (CI/CD):
Cada commit de código ejecuta automáticamente las siguientes tareas, integrando controles de calidad en SonarQube y sincronización con Jira:
```yaml
# GitHub Actions Workflow
name: SGICS Production Pipeline
on:
  push:
    branches: [develop]
  release:
    types: [published]

jobs:
  test:
    steps:
      - run: pytest backend/
      - run: npm test --prefix frontend
      - run: bandit -r backend

  quality:
    needs: test
    steps:
      - uses: sonarsource/sonarcloud-github-action@master
        with:
          projectKey: sgics
          organization: scouts
          args: >-
            -Dsonar.projectBaseDir=.
            -Dsonar.qualitygate.wait=true

  build:
    needs: quality
    steps:
      - run: docker build backend
      - run: docker build frontend
      - run: trivy image backend:latest

  deploy:
    needs: build
    steps:
      - run: ./scripts/deploy_staging.sh
      - run: ./scripts/deploy_prod.sh
        if: github.event_name == 'release'
      - name: Notify Jira Deployment
        uses: atlassian/gajira-deploy@v3
        with:
          environment: ${{ job.status }}
```

### Calidad continua y trazabilidad
- **SonarQube:** análisis estático, deuda técnica, duplicados y exposición de vulnerabilidades. El Quality Gate bloquea despliegues si la cobertura cae por debajo del 80% o se detectan vulnerabilidades críticas.
- **Jira Software:** backlog, tableros Kanban/Sprint, automatización de estados al completar pipelines y trazabilidad commit→issue mediante convenciones (`PROY-123`).
- **Integración GitHub ↔ Jira:** Webhooks sincronizados para actualizar tickets con eventos de PR/Deploy y generar reportes de release.

### Configuración de Base de Datos y Sistema de Monitoreo:
Configuración del clúster de Microsoft SQL Server alineado con el modelo SAP PowerDesigner:
```python
# SQL Server Configuration
DATABASE_URL = (
  "mssql+pyodbc://sgics_user:StrongPass123@hostinger_db,1433/"
  "SGICS?driver=ODBC+Driver+18+for+SQL+Server&TrustServerCertificate=yes"
)
ODBC_DRIVER = "ODBC Driver 18 for SQL Server"
MIN_POOL_SIZE = 5
MAX_POOL_SIZE = 20

# Monitoring Stack
- Prometheus + Grafana (containerized)
- Logs estructurados con loguru + envío a Application Insights
- Health checks automáticos (`/healthz`, `/readyz`)
- Alertas hacia Discord/Slack vía Azure Monitor
```

### Modelo relacional documentado en SAP PowerDesigner
El archivo `.pdg` provisto por SAP PowerDesigner define el modelo entidad-relación oficial. Los grupos principales son:

- **Georreferenciación:** `REGION`, `PROVINCIA`, `COMUNA` con claves numéricas (`numeric(10)`) y banderas de vigencia (`bit`).
- **Estructura orgánica scout:** `ZONA`, `DISTRITO`, `GRUPO`, `RAMA`, `CARGO`, `ROL`, garantizando la jerarquía territorial y de responsabilidades.
- **Cursos y planificaciones:** `CURSO`, `CURSO_FECHA`, `CURSO_SECCION`, `CURSO_FORMADOR`, `CURSO_ALIMENTACION`, `CURSO_COORDINADOR`, `CURSO_CUOTA`.
- **Personas y relaciones:** `PERSONA`, `PERSONA_CURSO`, `PERSONA_GRUPO`, `PERSONA_NIVEL`, `PERSONA_FORMADOR`, `PERSONA_INDIVIDUAL`, incorporando datos personales, asignaciones y estados.
- **Finanzas y soporte documental:** `PAGO_PERSONA`, `PREPAGO`, `COMPROBANTE_PAGO`, `PAGO_COMPROBANTE`, `CONCEPTO_CONTABLE`, `PROVEEDOR`.
- **Catálogos auxiliares:** `TIPO_CURSO`, `ALIMENTACION`, `NIVEL`, `TIPO_ARCHIVO`, `TIPO_DOCTO_RENDICION`, `TIPO_MATERIALES`, `TIPO_RENDICION`.

Cada entidad expone claves primarias (`PK_`) y foráneas (`FK_`) proporcionadas en el PDG, lo que permite generar los scripts DDL de SQL Server directamente desde PowerDesigner y versionarlos en el repositorio (`database/schema/mssql`).

### Entregables del Módulo:
1. **Archivo docker-compose.yml** - Configuración de servicios containerizados
2. **Workflows de GitHub Actions** - Automatización del proceso de despliegue
3. **Sistema de respaldos** - Automatización de backups de base de datos
4. **Panel de monitoreo** - Dashboard para supervisión del sistema
5. **Gestión de variables de entorno** - Manejo seguro de configuraciones y credenciales
6. **SonarQube + Jira Cloud** - Calidad continua y trazabilidad de despliegues con tableros ágiles

---

# MÓDULO 2: AUTENTICACIÓN Y SEGURIDAD
**Responsables:** Nicolás Irribarra, Josué Vásquez, Lucas Guerrero  
**Responsabilidad:** Implementar sistema de autenticación, control de acceso y medidas de seguridad

## Stack Tecnológico Utilizado

### Sistema de Tokens JWT (JSON Web Tokens):
Implementación de autenticación basada en tokens con duración de sesión de 1 hora:
```python
# Django JWT Configuration
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
}

# Libraries
- djangorestframework-simplejwt
- django-redis (token blacklisting)
- django-ratelimit
- django-cors-headers
```

### Sistema de Control de Acceso Basado en Roles (RBAC):
Estructura jerárquica de 6 tipos de usuarios con permisos diferenciados:
```python
# Roles Hierarchy
ROLES = {
    'SUPERADMIN': {'level': 1, 'scope': 'GLOBAL'},
    'COORDINADOR': {'level': 2, 'scope': 'ZONA'},
    'VALIDADOR_DISTRITO': {'level': 3, 'scope': 'DISTRITO'},
    'VALIDADOR_GRUPO': {'level': 4, 'scope': 'GRUPO'},
    'FINANZAS': {'level': 5, 'scope': 'TRANSVERSAL'},
    'PARTICIPANTE': {'level': 6, 'scope': 'PERSONAL'}
}

# Permission Decorators
@require_role(['COORDINADOR', 'SUPERADMIN'])
@require_scope('ZONA', allow_higher=True)
def coordinador_view(request):
    pass
```

### Medidas de Seguridad y Protección:
Implementación de múltiples capas de seguridad para protección del sistema:
```python
# Input Sanitization
import bleach
from django.utils.html import escape

# Rate Limiting con Redis
@ratelimit(key='ip', rate='5/m', method='POST')
def login_view(request):
    pass

# Security Headers
SECURE_SSL_REDIRECT = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
```

### Entregables del Módulo:
1. **Sistema de autenticación completo** (registro, login, logout, renovación de sesión)
2. **Modelos de usuarios y roles** (definición de entidades y permisos)
3. **Middleware de seguridad** (rate limiting, validación de entrada)
4. **Sistema de auditoría** - Registro de actividades para trazabilidad
5. **Políticas de contraseñas** - Validación robusta de credenciales

---

# MÓDULO 3: INTERFAZ DE USUARIO Y GESTIÓN DE PERFILES
**Responsables:** Lucas Betanzos, Marisol Saez, Rodrigo Jara  
**Responsabilidad:** Desarrollar interfaces de usuario y funcionalidades de gestión de perfiles

## Stack Tecnológico Utilizado

### Framework Frontend Vue 3:
Tecnología principal para el desarrollo de interfaces de usuario:
```javascript
// Core Stack
- Vue 3.3+ (Composition API)
- Vite 4+ (build tool)
- Vue Router 4
- Pinia (state management)
- TypeScript support

// UI/UX Libraries
- Tailwind CSS 3+
- Headless UI Vue
- Vue Icons (Heroicons)
- Vue Toasted (notifications)
```

### **Form Management & Validation:**
```javascript
// Form Libraries
- VeeValidate 4+ (form validation)
- Yup schemas (validation schemas)
- Vue Use (composition utilities)

// Component Architecture
components/
├── base/
│   ├── BaseInput.vue
│   ├── BaseSelect.vue
│   ├── BaseFileUpload.vue
│   └── BaseCard.vue
├── forms/
│   ├── UserProfileForm.vue
│   ├── ScoutDataForm.vue
│   └── MedicalInfoForm.vue
└── layouts/
    ├── DashboardLayout.vue
    └── AuthLayout.vue
```

### **API Integration & State Management:**
```javascript
// HTTP Client
- Axios with interceptors
- JWT token automatic refresh
- Request/response logging
- Error handling centralized

// Pinia Store Structure
stores/
├── auth.js (authentication state)
├── user.js (user profile data)
├── notifications.js (toast messages)
└── app.js (global app state)
```

### Entregables del Módulo:
1. **Librería de componentes base** reutilizables (inputs, selects, cards)
2. **Formularios de perfil de usuario** con validación en tiempo real
3. **Sistema de diseño** temático scout implementado con Tailwind
4. **Capa de integración con API** utilizando axios y manejo de errores
5. **Dashboards responsivos** optimizados según roles de usuario

---

# MÓDULO 4: PREINSCRIPCIONES Y FORMULARIOS
**Responsables:** Miguel Contreras, Juan Orrego, Leonardo López  
**Responsabilidad:** Implementar el proceso de preinscripción mediante formularios multi-paso

## Stack Tecnológico Utilizado

### Máquina de Estados para Preinscripciones:
Implementación de flujo de estados para el seguimiento de preinscripciones:
```python
# Django State Machine
from django_fsm import FSMField, transition
from enum import Enum

class PreinscripcionEstado(models.TextChoices):
    BORRADOR = 'BORRADOR', 'Borrador'
    ENVIADO = 'ENVIADO', 'Enviado'
    EN_REVISION = 'EN_REVISION', 'En Revisión'
    VALIDADO = 'VALIDADO', 'Validado'
    CUPO_ASIGNADO = 'CUPO_ASIGNADO', 'Cupo Asignado'
    RECHAZADO = 'RECHAZADO', 'Rechazado'
    CANCELADO = 'CANCELADO', 'Cancelado'

# Business Rules Engine
- Django Rules para validaciones
- Celery para tasks asíncronas
- Django Signals para state transitions
```

### **File Management:**
```python
# File Upload & Storage
- django-storages (cloud storage)
- Pillow (image processing)
- python-magic (file type validation)
- django-cleanup (orphaned files)

# MinIO Object Storage (Hostinger compatible)
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
AWS_S3_ENDPOINT_URL = 'https://hostinger-s3.com'
AWS_S3_FILE_OVERWRITE = False
```

### **Frontend Multi-step Wizard:**
```javascript
// Vue Router para steps
const routes = [
  {
    path: '/preinscripcion/:step',
    component: PreinscripcionWizard,
    props: true,
    beforeEnter: validateStep
  }
]

// Wizard State Management
const wizardStore = defineStore('wizard', {
  state: () => ({
    currentStep: 1,
    formData: {
      personal: {},
      scout: {},
      medical: {},
      documents: {}
    },
    validationErrors: {}
  }),
  actions: {
    nextStep() { ... },
    saveData() { ... },
    validateStep() { ... }
  }
})
```

### Entregables del Módulo:
1. **Modelos de máquina de estados** con 7 estados y transiciones definidas
2. **Wizard multi-paso en Vue** con validación progresiva
3. **Sistema de carga de archivos** con funcionalidad drag/drop y previsualizaciones
4. **Motor de reglas de negocio** para validaciones complejas
5. **Funcionalidad de auto-guardado** y recuperación de borradores

---

# MÓDULO 5: PAGOS Y GESTIÓN FINANCIERA
**Responsable:** Camilo Colivoro (Desarrollador individual)  
**Responsabilidad:** Implementar sistema de procesamiento de pagos y reportes financieros

## Stack Tecnológico Utilizado

### Sistema de Procesamiento de Pagos:
Estructura de datos para el registro y seguimiento de transacciones financieras:
```python
# Payment Models
class Pago(models.Model):
    preinscripcion = models.ForeignKey(Preinscripcion)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    metodo_pago = models.CharField(choices=METODOS_PAGO)
    estado = models.CharField(choices=ESTADOS_PAGO)
    comprobante = models.FileField(upload_to='comprobantes/')
    fecha_pago = models.DateTimeField()

# Integration Libraries
- pandas (Excel processing)
- openpyxl (Excel read/write)
- xlrd/xlsxwriter (Excel manipulation)
```

### **Batch Import System:**
```python
# Excel Processing Pipeline
import pandas as pd

def process_payment_batch(file_path):
    df = pd.read_excel(file_path)
    
    # Validation pipeline
    errors = validate_payment_data(df)
    if errors:
        return {'status': 'error', 'errors': errors}
    
    # Bulk create payments
    payments = create_payments_from_df(df)
    trigger_auto_confirmations.delay(payments)
    
    return {'status': 'success', 'count': len(payments)}
```

### **Financial Dashboard:**
```javascript
// Chart.js Integration
- Chart.js 4+ (financial charts)
- Vue Chart.js wrapper
- Real-time data updates
- Export functionality (PDF/Excel)

// KPI Dashboard Structure
components/
├── KPICard.vue (individual metrics)
├── PaymentChart.vue (temporal data)
├── PaymentList.vue (recent payments)
└── BatchImport.vue (file upload)
```

### Entregables del Módulo:
1. **Modelos de pagos** con estados y registro de auditoría
2. **Sistema de importación en lotes** para archivos Excel/CSV con validación
3. **Lógica de confirmación automática** con reglas de negocio
4. **Dashboard financiero** con integración Chart.js
5. **Endpoints de API** para operaciones CRUD de pagos

---

# MÓDULO 6: CONTROL DE CALIDAD Y DOCUMENTACIÓN
**Responsables:** Nicolás González, Juan Herrera  
**Responsabilidad:** Implementar pruebas automatizadas y generar documentación técnica

## Stack Tecnológico Utilizado

### Framework de Pruebas Backend:
Herramientas para testing automatizado del servidor:
```python
# Testing Stack
- pytest-django
- factory_boy (test data generation)
- pytest-cov (coverage reporting)
- pytest-mock (mocking)
- django-test-plus

# Test Structure
tests/
├── unit/
│   ├── test_models.py
│   ├── test_serializers.py
│   └── test_utils.py
├── integration/
│   ├── test_api_endpoints.py
│   ├── test_auth_flow.py
│   └── test_payment_flow.py
└── e2e/
    ├── test_user_journey.py
    └── test_admin_workflow.py
```

### **Frontend Testing:**
```javascript
// Testing Stack
- Vitest (test runner)
- @testing-library/vue (component testing)
- @vue/test-utils (Vue testing utilities)
- MSW (Mock Service Worker - API mocking)
- Playwright (E2E testing)

// Test Structure
tests/
├── unit/
│   ├── components/
│   ├── stores/
│   └── utils/
├── integration/
│   ├── forms/
│   └── workflows/
└── e2e/
    ├── user-flows/
    └── admin-flows/
```

### **Documentation Automation:**
```python
# API Documentation
- drf-spectacular (OpenAPI/Swagger)
- Sphinx (technical documentation)
- MkDocs (user documentation)

# Automated Documentation
docs/
├── api/ (auto-generated from code)
├── technical/ (architecture, setup)
├── user/ (role-specific guides)
└── deployment/ (infrastructure guides)
```

### Entregables del Módulo:
1. **Suites de pruebas completas** (unitarias, integración, end-to-end)
2. **Configuración de reportes de cobertura** con objetivo del 70% mínimo
3. **Documentación de API auto-generada** utilizando Swagger
4. **Manuales de usuario** específicos por rol con capturas de pantalla
5. **Integración de pruebas en CI** con GitHub Actions

---

# MÓDULO 7: COMUNICACIONES MASIVAS
**Responsable:** A Asignar  
**Responsabilidad:** Sistema de envío de correos masivos y gestión de comunicaciones

## Stack Tecnológico Utilizado

### Sistema de Email Masivo:
```python
# Email Backend
- Django Email Backend (SMTP)
- Celery para envío asíncrono
- Redis como broker de mensajes
- django-templated-email

# Email Templates
class EmailTemplate(models.Model):
    nombre = models.CharField(max_length=100)
    subject = models.CharField(max_length=200)
    body = models.TextField()
    variables = models.JSONField()  # {{nombre}}, {{curso}}
    
# Bulk Send
@shared_task
def send_bulk_emails(course_id, subject, body, recipient_ids):
    recipients = Preinscripcion.objects.filter(
        curso_id=course_id,
        id__in=recipient_ids
    )
    for recipient in recipients:
        send_mail(
            subject=subject,
            message=render_template(body, recipient),
            recipient_list=[recipient.persona.email]
        )
```

---

## CRONOGRAMA DE IMPLEMENTACIÓN

### Primera Semana: Establecimiento de Fundaciones Técnicas
```
Días 1-2: Módulo 1 (Infraestructura y Base de Datos)
├── Configuración de Docker para consistencia entre entornos
├── Instalación y configuración de Microsoft SQL Server
├── Implementación de pipeline de despliegue automático básico
└── Configuración de herramientas de monitoreo del sistema

Días 3-4: Módulo 2 (Sistema de Autenticación)
├── Desarrollo de endpoints de autenticación (registro, login, logout)
├── Implementación de modelos de usuario y roles básicos
├── Configuración de middleware de seguridad básico
└── Implementación de rate limiting para prevenir ataques
```

### Segunda Semana: Desarrollo de Interfaces y Lógica de Negocio
```
Días 5-7: Módulo 3 (Interfaces de Usuario)
├── Configuración inicial del proyecto Vue 3 frontend
├── Desarrollo de librería de componentes base reutilizables
├── Implementación del sistema de diseño visual
└── Desarrollo de formularios de perfil de usuario

Días 8-10: Módulo 4 (Sistema de Preinscripciones)
├── Implementación de máquina de estados con 7 estados
├── Desarrollo de los primeros 2 pasos del wizard (datos personales + scout)
├── Implementación de sistema de carga de archivos básico
└── Configuración de transiciones de estado funcionales
```

### Tercera Semana: Integración Financiera y Aseguramiento de Calidad
```
Días 11-12: Módulo 5 (Sistema de Pagos)
├── Desarrollo de modelos de datos y API para pagos
├── Implementación de registro de pagos individuales
├── Desarrollo de dashboard financiero básico
└── Implementación de lógica de confirmación automática

Días 13-14: Módulo 6 (Control de Calidad y Documentación)
├── Configuración de suites de pruebas automatizadas
├── Generación automática de documentación de API
├── Creación de manual de usuario básico
└── Validación del funcionamiento del proceso de despliegue
```

---

## CRITERIOS DE ACEPTACIÓN POR MÓDULO

| Módulo | Tecnología Principal | Objetivo del Sprint 2 | Validación de Funcionamiento |
|--------|------------------|------------------|----------|
| **1. Infraestructura** | Docker + GitHub Actions | Pipeline funcional + BD estable | Tiempo de despliegue menor a 3 minutos |
| **2. Autenticación** | Django JWT + Redis | 6 roles definidos + protección activa | Superación de pruebas de seguridad |
| **3. Frontend** | Vue 3 + Tailwind | Componentes funcionales + responsive | Compatibilidad web cross-browser |
| **4. Formularios** | Máquina de estados + wizard | 7 estados + 4 pasos implementados | Validación de reglas de negocio |
| **5. Pagos** | Pandas + Chart.js | Procesamiento + dashboard funcional | Confirmación automática operativa |
| **6. Calidad** | pytest + Vitest | Cobertura >70% + documentación | Ejecución exitosa de todas las pruebas |

---

## COMANDOS DE DESARROLLO POR MÓDULO

### Módulo 1 - Configuración de Infraestructura:
```powershell
# Levantar la base de datos y Redis
docker-compose up -d db redis
python manage.py migrate
python manage.py createsuperuser

# Probar despliegue a producción
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

### Módulo 2 - Desarrollo del Sistema de Autenticación:
```powershell
# Ejecución de pruebas del sistema de autenticación
python manage.py test apps.auth.tests
python manage.py shell
>>> from apps.auth.models import User
>>> user = User.objects.create_user('test@example.com', 'password123')
```

### Módulo 3 - Desarrollo Frontend:
```powershell
# Entorno de desarrollo de interfaces de usuario
cd frontend
npm run dev
npm run build
npm run test:unit
npm run test:e2e
```

### Módulos 4-6 - Pruebas de Integración:
```powershell
# Ejecución de pruebas completas del sistema
python manage.py test
cd frontend && npm test
docker-compose exec backend python manage.py test
docker-compose exec frontend npm run test:coverage
```

---

**Documento:** Guía Técnica Especializada por Módulos  
**Fecha de Actualización:** 28 Septiembre 2025  
**Infraestructura:** Windows Server PowerEdge + Hostinger + Microsoft SQL Server  
**Scrum Master:** Ricardo Sanhueza  
**Proyecto:** Sistema de Gestión Integral para Cursos Scouts (SGICS)