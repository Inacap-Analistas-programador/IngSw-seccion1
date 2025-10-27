# Guía Rápida de Inicio - SGICS

## Setup Rápido (5 minutos)

### 1. Clonar y configurar
```bash
# Clonar repositorio
git clone https://github.com/Inacap-Analistas-programador/IngSw-seccion1.git
cd IngSw-seccion1

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones locales
```

### 2. Con Docker (Recomendado)
```bash
# Levantar todo el stack
docker-compose -f docker-compose.dev.yml up --build

# En otra terminal - aplicar migraciones
docker-compose -f docker-compose.dev.yml exec backend python manage.py migrate

# Crear usuario admin
docker-compose -f docker-compose.dev.yml exec backend python manage.py createsuperuser
```

**URLs disponibles:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Django Admin: http://localhost:8000/admin
- Base de datos MySQL: localhost:3306

### 3. Sin Docker (Desarrollo local)
```bash
# Backend
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Frontend (nueva terminal)
cd frontend
npm install
npm run dev
```

## Comandos Esenciales

### Backend Django
```bash
# Aplicar migraciones
python manage.py makemigrations
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Correr tests
pytest

# Recolectar archivos estáticos
python manage.py collectstatic
```

### Frontend Vue.js
```bash
# Instalar dependencias
npm install

# Servidor desarrollo
npm run dev

# Build producción
npm run build

# Tests
npm run test

# Linting y formato
npm run lint
npm run format
```

### Base de Datos MySQL
```sql
-- Crear base de datos local
CREATE DATABASE sgics_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'sgics_user'@'localhost' IDENTIFIED BY 'sgics_pass';
GRANT ALL PRIVILEGES ON sgics_dev.* TO 'sgics_user'@'localhost';
FLUSH PRIVILEGES;
```

## Por Módulo - Dónde Trabajar

### Grupo A - LOGIN Y AUTENTICACIÓN
**Integrantes**: Nicolas Irribarra, Lucas Guerrero, Axel Villa
```bash
# Backend
backend/apps/authentication/
├── models.py          # Modelos User, Role, Permission
├── views.py           # JWT login/logout APIs
├── serializers.py     # Validación auth
├── permissions.py     # Control de roles RBAC
└── urls.py            # Rutas autenticación

# Frontend  
frontend/src/views/auth/
├── LoginForm.vue      # Formulario de login
├── UserProfile.vue    # Perfil de usuario
└── RoleManagement.vue # Gestión de roles
```

### Grupo B - QA, PAGOS Y STATS
**Integrantes**: Nicolas Gonzalez, Juan Herrera, Camilo Colivoro
```bash
# Backend
backend/apps/payments/
├── models.py          # Payment, PaymentGroup, Stats
├── views.py           # APIs pagos y estadísticas
├── services.py        # Lógica de negocio QA
└── reports.py         # Generación reportes

# Frontend
frontend/src/views/payments/
├── PaymentDashboard.vue  # Dashboard pagos
├── PaymentStats.vue      # Estadísticas
├── QualityAssurance.vue  # Control de calidad
└── UserManagement.vue    # Gestión usuarios
```

### Grupo C - GESTIÓN PERSONAS Y DEVOPS
**Integrantes**: Giovanni Pacheco, Ricardo Sanhueza, Ricardo Henriquez
```bash
# Backend
backend/apps/courses/     # Maestros y personas
├── models.py          # Person, Scout, Leader
├── views.py           # APIs gestión personas
└── services.py        # Lógica maestros

# DevOps
├── docker-compose.dev.yml
├── .github/workflows/
└── deployment/        # Scripts despliegue
```

### Grupo H - PREINSCRIPCIONES Y ARCHIVOS
**Integrantes**: Miguel Contreras, Juan Orrego, Leonardo Lopez
```bash
# Backend
backend/apps/preinscriptions/
├── models.py          # Preinscription, Step
├── views.py           # Wizard APIs
└── validators.py      # Validación RUT

backend/apps/files/
├── models.py          # File, FileValidation
├── views.py           # Upload/Download APIs
└── validators.py      # Validación archivos

# Frontend
frontend/src/views/preinscriptions/
├── PreinscriptionWizard.vue
├── FileUpload.vue
└── FileValidation.vue
```

### Grupo i - PERFILES
**Integrantes**: Marisol Saez, Lucas Betanzo, Rodrigo Jara, Josue Vasquez
```bash
# Backend
backend/apps/profiles/
├── models.py          # UserProfile, PersonalData
├── views.py           # Profile management APIs
└── serializers.py     # Profile validation

# Frontend
frontend/src/views/profiles/
├── ProfileView.vue       # Vista de perfil
├── ProfileEdit.vue       # Editar perfil
├── PersonalData.vue      # Datos personales
└── ProfileSettings.vue   # Configuración
```

## Estructura de URLs

### Backend APIs (Django)
```
http://localhost:8000/api/
├── auth/                    # JWT login/refresh
│   ├── login/              # POST - Login
│   └── refresh/            # POST - Refresh token
├── preinscriptions/        # Preinscripciones
│   ├── search-rut/         # GET - Búsqueda por RUT
│   └── wizard-step1/       # POST - Primer paso wizard
├── payments/               # Pagos
│   ├── groups/             # GET/POST - Grupos pago
│   └── reports/            # GET - Reportes
├── files/                  # Archivos
│   ├── upload/             # POST - Subir archivo
│   └── download/{id}/      # GET - Descargar
└── courses/                # Cursos
    ├── dashboard/          # GET - KPIs dashboard
    └── traffic-light/      # GET - Semáforo por curso
```

### Frontend Routes (Vue Router)
```
http://localhost:3000/
├── /login                  # Login página
├── /dashboard              # Dashboard principal
├── /preinscriptions        # Gestión preinscripciones
│   └── /wizard             # Wizard paso a paso
├── /payments               # Gestión pagos
│   └── /reports            # Reportes pagos
├── /files                  # Gestión archivos
└── /courses                # Gestión cursos
```

## Testing Rápido

### Verificar que todo funciona
```bash
# Backend - Health check
curl http://localhost:8000/healthz/

# Frontend - Build exitoso
cd frontend && npm run build

# Base datos - Conectividad
python manage.py dbshell
```

### Tests automatizados
```bash
# Backend
cd backend
pytest --verbose

# Frontend  
cd frontend
npm run test
```

## Problemas Comunes

### Puerto ocupado
```bash
# Matar procesos en puerto 3000/8000
taskkill /F /PID $(netstat -ano | findstr :3000)  # Windows
lsof -ti:3000 | xargs kill -9  # Linux/Mac
```

### Migraciones conflicto
```bash
# Reset migraciones (SOLO desarrollo)
python manage.py migrate --fake-initial
python manage.py migrate --fake apps.authentication zero
python manage.py migrate
```

### Dependencias npm
```bash
# Limpiar cache npm
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Permisos Docker
```bash
# Windows - Ejecutar PowerShell como Administrador
# Linux/Mac - Agregar usuario a grupo docker
sudo usermod -aG docker $USER
```

## Ayuda Rápida

- **Configuración**: Ver `.env.example`
- **API Docs**: http://localhost:8000/api/docs/
- **Errores Django**: Ver `logs/django.log`  
- **Errores Frontend**: Consola del navegador (F12)
- **Docker Issues**: `docker-compose logs [service]`

## Próximos Pasos

1. **Setup completo** → Continúa
2. **Leer Epic asignado** → `docs/epics/`
3. **Crear branch feature** → `git checkout -b feature/SGICS-XXX-desc`
4. **Empezar a desarrollar** → Usa tu carpeta de módulo
5. **Escribir tests** → Asegura calidad
6. **Crear PR** → Sigue guía Git workflow

**¿Todo listo? ¡A programar!**