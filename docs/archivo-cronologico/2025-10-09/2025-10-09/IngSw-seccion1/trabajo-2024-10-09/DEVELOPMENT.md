# Script de Desarrollo - Comandos Útiles para SGICS

## Backend (Django)

### Setup inicial
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python setup_initial.py
```

### Comandos de desarrollo
```powershell
# Ejecutar servidor
python manage.py runserver

# Crear migraciones
python manage.py makemigrations

# Aplicar migraciones  
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Shell de Django
python manage.py shell

# Tests
pytest
```

## Frontend (Vue.js)

### Setup inicial
```powershell
cd frontend
npm install
```

### Comandos de desarrollo
```powershell
# Servidor de desarrollo
npm run dev

# Build de producción
npm run build

# Tests
npm run test

# Linting
npm run lint
```

## Docker (Opcional)

```powershell
# Ejecutar todo el stack
docker-compose -f docker-compose.dev.yml up --build

# Solo backend
docker-compose -f docker-compose.dev.yml up backend

# Logs
docker-compose -f docker-compose.dev.yml logs -f
```

## URLs Importantes (Desarrollo)

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api/
- **Django Admin**: http://localhost:8000/admin/
- **API Documentation**: http://localhost:8000/api/schema/swagger/

## Credenciales por Defecto

- **Admin**: admin / admin123
- **Base de datos**: sgics_dev / sgics_user / sgics_pass

## Estructura del Proyecto

```
IngSw-seccion1/
├── backend/           # Django API
├── frontend/          # Vue.js App  
├── docs/             # Documentación
└── infrastructure/   # Docker configs
```