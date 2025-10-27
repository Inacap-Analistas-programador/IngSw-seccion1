# Comandos de Testing y CI - SGICS

## Comandos Pre-Commit (Ejecutar antes de PR)

### Backend Testing
```powershell
# Navegar al backend
cd backend

# Activar entorno virtual (si no usas Docker)
.\venv\Scripts\Activate.ps1

# Ejecutar todos los tests
pytest --verbose --tb=short

# Tests con coverage
pytest --cov=. --cov-report=html --cov-report=term

# Tests específicos por app
pytest apps/authentication/tests/
pytest apps/preinscriptions/tests/
pytest apps/payments/tests/
pytest apps/files/tests/
pytest apps/courses/tests/

# Linting y formato
black . --check
isort . --check-only
flake8 .

# Aplicar formato automático
black .
isort .
```

### Frontend Testing
```powershell
# Navegar al frontend
cd frontend

# Instalar dependencias (si es primera vez)
npm ci

# Ejecutar todos los tests
npm run test

# Tests con coverage
npm run test:coverage

# Tests en modo watch
npm run test:watch

# Build para verificar compilación
npm run build

# Linting
npm run lint

# Aplicar formato
npm run format

# Type checking
npm run type-check
```

## Comandos CI/CD Pipeline

### Verificación Local Completa
```powershell
# Script completo de verificación pre-commit
# Ejecutar desde la raíz del proyecto

# Backend
Write-Host "=== BACKEND TESTING ===" -ForegroundColor Green
cd backend
pytest --cov=. --cov-report=term-missing
if ($LASTEXITCODE -ne 0) { 
    Write-Host "❌ Backend tests failed" -ForegroundColor Red
    exit 1 
}

black . --check
if ($LASTEXITCODE -ne 0) { 
    Write-Host "❌ Backend formatting failed" -ForegroundColor Red
    exit 1 
}

isort . --check-only
if ($LASTEXITCODE -ne 0) { 
    Write-Host "❌ Backend import sorting failed" -ForegroundColor Red
    exit 1 
}

flake8 .
if ($LASTEXITCODE -ne 0) { 
    Write-Host "❌ Backend linting failed" -ForegroundColor Red
    exit 1 
}

# Frontend
Write-Host "=== FRONTEND TESTING ===" -ForegroundColor Green
cd ..\frontend
npm run test:coverage
if ($LASTEXITCODE -ne 0) { 
    Write-Host "❌ Frontend tests failed" -ForegroundColor Red
    exit 1 
}

npm run lint
if ($LASTEXITCODE -ne 0) { 
    Write-Host "❌ Frontend linting failed" -ForegroundColor Red
    exit 1 
}

npm run build
if ($LASTEXITCODE -ne 0) { 
    Write-Host "❌ Frontend build failed" -ForegroundColor Red
    exit 1 
}

Write-Host "✅ All checks passed!" -ForegroundColor Green
```

### Con Docker
```powershell
# Testing completo con Docker
docker-compose -f docker-compose.dev.yml up -d

# Backend tests
docker-compose -f docker-compose.dev.yml exec backend pytest --cov=. --cov-report=term

# Frontend tests  
docker-compose -f docker-compose.dev.yml exec frontend npm run test:coverage

# Linting backend
docker-compose -f docker-compose.dev.yml exec backend black . --check
docker-compose -f docker-compose.dev.yml exec backend flake8 .

# Linting frontend
docker-compose -f docker-compose.dev.yml exec frontend npm run lint

# Cleanup
docker-compose -f docker-compose.dev.yml down
```

## GitHub Actions Workflow

### Estructura esperada (.github/workflows/ci.yml)
```yaml
name: SGICS CI Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: root
          MYSQL_DATABASE: sgics_test
        options: --health-cmd="mysqladmin ping" --health-interval=10s --health-timeout=5s --health-retries=3

    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Python
      uses: actions/setup-python@v3
      with:
        python-version: '3.11'
        
    - name: Install dependencies
      run: |
        cd backend
        pip install -r requirements.txt
        
    - name: Run tests
      run: |
        cd backend
        pytest --cov=. --cov-report=xml
        
    - name: Upload coverage
      uses: codecov/codecov-action@v3

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: |
        cd frontend
        npm ci
        
    - name: Run tests
      run: |
        cd frontend
        npm run test:coverage
        
    - name: Build
      run: |
        cd frontend
        npm run build
```

## Umbrales de Calidad

### Coverage Mínimo
- **Backend**: 80% coverage mínimo
- **Frontend**: 70% coverage mínimo

### Linting
- **Backend**: Black + isort + flake8 sin errores
- **Frontend**: ESLint + Prettier sin errores

### Performance
- **Build tiempo**: < 5 minutos
- **Tests tiempo**: < 3 minutos

## Comandos por Grupo

### Grupo A (Autenticación)
```powershell
# Tests específicos
cd backend
pytest apps/authentication/ -v
pytest apps/authentication/tests/test_jwt.py
pytest apps/authentication/tests/test_roles.py

cd frontend  
npm run test -- --testPathPattern="auth"
```

### Grupo B (Pagos)
```powershell
# Tests específicos
cd backend
pytest apps/payments/ -v
pytest apps/payments/tests/test_payment_processing.py

cd frontend
npm run test -- --testPathPattern="payment"
```

### Grupo C (Personas/DevOps)
```powershell
# Tests específicos + CI/CD
cd backend
pytest apps/courses/ -v

# Verificar Docker
docker-compose -f docker-compose.dev.yml config
docker-compose -f docker-compose.dev.yml build --no-cache
```

### Grupo H (Preinscripciones/Archivos)
```powershell
# Tests específicos
cd backend
pytest apps/preinscriptions/ -v
pytest apps/files/ -v

cd frontend
npm run test -- --testPathPattern="preinscription|file"
```

### Grupo Z (Perfiles)
```powershell
# Tests específicos
cd backend
pytest apps/profiles/ -v

cd frontend
npm run test -- --testPathPattern="profile"
```

## Troubleshooting

### Tests fallan
```powershell
# Ver logs detallados
pytest -vvv --tb=long

# Ejecutar un test específico
pytest apps/authentication/tests/test_models.py::TestUserModel::test_create_user -vvv
```

### Coverage bajo
```powershell
# Ver qué líneas faltan
pytest --cov=. --cov-report=html
# Abrir htmlcov/index.html en navegador
```

### Build falla
```powershell
# Limpiar cache
cd frontend
rm -rf node_modules dist .vite
npm ci
npm run build
```

---
**Recuerda**: Siempre ejecutar estos comandos antes de hacer push y crear PR.