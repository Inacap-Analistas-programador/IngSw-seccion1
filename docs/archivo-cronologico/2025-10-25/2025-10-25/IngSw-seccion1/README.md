# SGICS - Sistema de Gestión Integral de Cursos Scout

Sistema web completo para la gestión de cursos, preinscripciones, pagos y archivos para la organización de Guías y Scouts de Chile, Zona Biobío.

## Stack Tecnológico

### Backend
- **Django 5.0** + **Django REST Framework**
- **JWT Authentication** (SimpleJWT)
- **MySQL 8.0** (Base de datos principal)
- **Celery** + **Redis** (Background tasks)

### Frontend  
- **Vue 3** + **TypeScript**
- **Pinia** (State Management)
- **Vite** (Build Tool)
- **Tailwind CSS** (Styling)
- **Vee-Validate** + **Yup** (Form Validation)

### DevOps & Testing
- **Docker** + **Docker Compose**
- **GitHub Actions** (CI/CD)
- **pytest** (Backend Testing)
- **Vitest** (Frontend Testing)

## Funcionalidades Principales

### Sprint N2 (Oct 13-24, 2025)
- **Autenticación JWT** + Control de Roles (RBAC)
- **Preinscripciones** - Wizard paso 1 con búsqueda por RUT
- **Gestión de Pagos** - Registro y consulta por grupo
- **Gestión de Archivos** - Upload/download seguro
- **Dashboard** - KPIs y semáforo por curso
- **CI/CD Pipeline** - Tests automáticos y calidad

## Arquitectura del Proyecto

```
IngSw-seccion1/
├── backend/                    # Django Backend
│   ├── scouts_platform/       # Configuración principal
│   ├── apps/                  # Módulos de la aplicación
│   │   ├── authentication/    # JWT + RBAC
│   │   ├── preinscriptions/   # Gestión de preinscripciones
│   │   ├── payments/          # Gestión de pagos
│   │   ├── files/            # Upload/download archivos
│   │   └── courses/          # Gestión de cursos
│   ├── utils/                # Utilidades compartidas
│   └── tests/                # Tests backend
├── frontend/                  # Vue.js Frontend
│   ├── src/
│   │   ├── components/       # Componentes Vue
│   │   ├── views/           # Páginas principales
│   │   ├── stores/          # Pinia stores
│   │   └── utils/           # Utilidades frontend
│   └── tests/               # Tests frontend
├── infrastructure/           # Docker, deployment
├── docs/                    # Documentación y epics
└── .github/                # GitHub Actions workflows
```

## Inicio Rápido

### Prerrequisitos
- **Python 3.11+**
- **Node.js 18+**
- **Docker** & **Docker Compose** (opcional)
- **Git**

### 1. Clonar el repositorio
```bash
git clone https://github.com/Inacap-Analistas-programador/IngSw-seccion1.git
cd IngSw-seccion1
```

### 2. Configuración Backend (Django)
```bash
cd backend

# Crear entorno virtual
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar migraciones
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Ejecutar servidor de desarrollo
python manage.py runserver
```

### 3. Configuración Frontend (Vue)
```bash
cd frontend

# Instalar dependencias
npm ci

# Ejecutar servidor de desarrollo
npm run dev
```

### 4. Usando Docker (Recomendado)
```bash
# Ejecutar todo el stack
docker-compose -f docker-compose.dev.yml up --build

# Aplicar migraciones (primera vez)
docker-compose -f docker-compose.dev.yml exec backend python manage.py migrate
```

## Testing

### Backend (pytest)
```bash
cd backend
pytest                          # Ejecutar todos los tests
pytest --cov=.                 # Con coverage
pytest apps/authentication/    # Tests específicos
```

### Frontend (Vitest)
```bash
cd frontend
npm run test                    # Ejecutar tests
npm run test:coverage          # Con coverage
```

### CI Pipeline
```bash
# El pipeline se ejecuta automáticamente en PRs
# Incluye: linting, tests, coverage, security scan
```

## Convenciones de Desarrollo

### Git Workflow
- **Branches**: `feature/SGICS-XXX-shortDescription`
- **Commits**: `SGICS-XXX: description`
- **PRs**: `[SGICS-XXX] Title`

### Código
- **Backend**: `snake_case`, Black formatting
- **Frontend**: `camelCase`, Prettier formatting
- **Tests**: Mínimo 80% backend, 70% frontend

## Scripts Útiles

### Desarrollo
```bash
# Backend
python manage.py makemigrations
python manage.py migrate
python manage.py collectstatic
python manage.py shell

# Frontend  
npm run lint                   # Linting
npm run format                # Formatting
npm run build                 # Build para producción
```

### Calidad de Código
```bash
# Backend
black .                       # Formatting
isort .                       # Import sorting
flake8                        # Linting

# Frontend
npm run lint                  # ESLint
npm run format               # Prettier
```

## Equipos y Responsabilidades

- **Grupo A**: Login, Autenticación y Control de Roles (Nicolas I., Lucas G., Axel V.)
- **Grupo B**: QA, Pagos, Stats y Documentación (Nicolas G., Juan H., Camilo C.)
- **Grupo C**: Gestión Personas, Maestros y DevOps (Giovanni P., Ricardo S., Ricardo H.)
- **Grupo H**: Preinscripciones y Archivos (Miguel C., Juan O., Leonardo L.)
- **Grupo I**: Perfiles de Usuario (Marisol S., Lucas B., Rodrigo J., Josue V.)

## Configuración de Entornos

### Desarrollo
- Database: MySQL 8.0 / SQLite (local)
- Debug: Enabled
- CORS: Allow all origins

### Staging/Producción  
- Database: MySQL 8.0
- Debug: Disabled
- CORS: Specific origins only
- SSL/HTTPS: Required

## Roadmap

- **Sprint N2** (Oct 13-24): MVP Core Features
- **Sprint N3** (Oct 27-Nov 7): Advanced Features & UX
- **Sprint N4** (Nov 10-21): Performance & Security
- **Release** (Nov 24): Production Launch

## Contribución

1. Fork el proyecto
2. Crear branch feature (`git checkout -b feature/SGICS-XXX-description`)
3. Commit cambios (`git commit -m 'SGICS-XXX: add new feature'`)
4. Push al branch (`git push origin feature/SGICS-XXX-description`)
5. Abrir Pull Request

## Licencia

Este proyecto es de uso interno para Guías y Scouts de Chile, Zona Biobío.

## Contacto

- **Scrum Master**: Ricardo Cristóbal Sanhueza Acuña
- **Repositorio**: [GitHub](https://github.com/Inacap-Analistas-programador/IngSw-seccion1)
- **Jira**: [Project Board](https://inacapmail-team-z3fibirj.atlassian.net/jira/for-you)

---
