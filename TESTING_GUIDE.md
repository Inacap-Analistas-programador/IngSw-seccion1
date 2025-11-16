# 🧪 Guía de Testing - GIC Sistema Scout

## Tabla de Contenidos
1. [Configuración](#configuración)
2. [Testing Backend](#testing-backend)
3. [Testing Frontend](#testing-frontend)
4. [Estrategia de Testing](#estrategia-de-testing)
5. [Cobertura de Código](#cobertura-de-código)
6. [CI/CD](#cicd)

---

## Configuración

### Backend (pytest)

#### Instalación
```bash
cd backend
pip install -r requirements.txt
```

#### Estructura de Tests
```
backend/
├── conftest.py                    # Fixtures globales
├── pytest.ini                     # Configuración pytest
├── archivos/test/
│   └── test_archivos_model.py
├── cursos/test/
│   └── test_cursos_model.py
├── geografia/
│   └── test_api.py               # Tests de API
├── maestros/test/
│   └── test_maestros_model.py
├── pagos/test/
│   └── test_pagos_model.py
├── personas/test/
│   └── test_personas_model.py
├── proveedores/test/
│   └── test_proveedores_model.py
└── usuarios/test/
    └── test_usuarios_model.py
```

### Frontend (vitest)

#### Instalación
```bash
cd frontend
npm install
```

#### Estructura de Tests
```
frontend/src/
├── test/
│   ├── setup.js                  # Configuración vitest
│   ├── useAuth.test.js           # Tests de hooks
│   ├── useForm.test.js
│   └── Breadcrumb.test.jsx       # Tests de componentes
└── vite.config.js                # Configuración vitest
```

---

## Testing Backend

### Ejecutar Tests

#### Todos los tests
```bash
cd backend
pytest
```

#### Tests con verbosidad
```bash
pytest -v
```

#### Tests específicos
```bash
# Por archivo
pytest geografia/test_api.py

# Por clase
pytest geografia/test_api.py::TestRegionAPI

# Por test específico
pytest geografia/test_api.py::TestRegionAPI::test_list_regiones

# Por marcador
pytest -m unit
pytest -m integration
```

#### Tests con cobertura
```bash
pytest --cov=. --cov-report=html
```

Esto genera un reporte en `htmlcov/index.html`

### Fixtures Disponibles

#### `api_client`
Cliente API sin autenticación.

```python
def test_list_regiones(api_client):
    response = api_client.get('/api/geografia/regiones/')
    assert response.status_code == 200
```

#### `authenticated_client`
Cliente API autenticado.

```python
def test_create_region(authenticated_client):
    data = {'reg_descripcion': 'Test', 'reg_vigente': True}
    response = authenticated_client.post('/api/geografia/regiones/', data)
    assert response.status_code == 201
```

#### `test_user`
Usuario Django para autenticación.

```python
def test_user_exists(test_user):
    assert test_user.username == 'testuser'
```

#### `test_usuario`
Usuario custom del sistema.

```python
def test_usuario_custom(test_usuario):
    assert test_usuario.usu_username == 'testuser'
```

### Escribir Tests de API

#### Ejemplo Completo
```python
import pytest
from rest_framework import status
from geografia.models import Region

@pytest.mark.django_db
class TestRegionAPI:
    """Tests para el endpoint de regiones"""
    
    def test_list_regiones(self, api_client):
        """Test listar regiones"""
        # Arrange - Crear datos de prueba
        Region.objects.create(
            reg_descripcion="Región Test",
            reg_vigente=True
        )
        
        # Act - Ejecutar acción
        response = api_client.get('/api/geografia/regiones/')
        
        # Assert - Verificar resultado
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) >= 1
    
    def test_create_region(self, authenticated_client):
        """Test crear región"""
        data = {
            'reg_descripcion': 'Nueva Región',
            'reg_vigente': True
        }
        
        response = authenticated_client.post(
            '/api/geografia/regiones/',
            data
        )
        
        assert response.status_code == status.HTTP_201_CREATED
        assert Region.objects.filter(
            reg_descripcion='Nueva Región'
        ).exists()
    
    def test_update_region(self, authenticated_client):
        """Test actualizar región"""
        region = Region.objects.create(
            reg_descripcion="Original",
            reg_vigente=True
        )
        
        data = {
            'reg_descripcion': 'Actualizada',
            'reg_vigente': False
        }
        
        response = authenticated_client.put(
            f'/api/geografia/regiones/{region.reg_id}/',
            data
        )
        
        assert response.status_code == status.HTTP_200_OK
        region.refresh_from_db()
        assert region.reg_descripcion == 'Actualizada'
        assert region.reg_vigente == False
    
    def test_delete_region(self, authenticated_client):
        """Test eliminar región"""
        region = Region.objects.create(
            reg_descripcion="A Eliminar",
            reg_vigente=True
        )
        
        response = authenticated_client.delete(
            f'/api/geografia/regiones/{region.reg_id}/'
        )
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Region.objects.filter(
            reg_id=region.reg_id
        ).exists()
```

### Tests de Integración

```python
@pytest.mark.integration
@pytest.mark.django_db
class TestGeografiaIntegration:
    """Tests de integración para geografía"""
    
    def test_complete_hierarchy(self, authenticated_client):
        """Test crear jerarquía completa"""
        # Crear región
        region_response = authenticated_client.post(
            '/api/geografia/regiones/',
            {'reg_descripcion': 'Test', 'reg_vigente': True}
        )
        region_id = region_response.data['reg_id']
        
        # Crear provincia
        provincia_response = authenticated_client.post(
            '/api/geografia/provincias/',
            {
                'reg_id': region_id,
                'pro_descripcion': 'Test',
                'pro_vigente': True
            }
        )
        provincia_id = provincia_response.data['pro_id']
        
        # Crear comuna
        comuna_response = authenticated_client.post(
            '/api/geografia/comunas/',
            {
                'pro_id': provincia_id,
                'com_descripcion': 'Test',
                'com_vigente': True
            }
        )
        
        # Verificar
        assert region_response.status_code == 201
        assert provincia_response.status_code == 201
        assert comuna_response.status_code == 201
```

### Tests de Modelos

```python
@pytest.mark.unit
@pytest.mark.django_db
def test_region_creation():
    """Test creación de región"""
    region = Region.objects.create(
        reg_descripcion="Test Region",
        reg_vigente=True
    )
    
    assert region.reg_id is not None
    assert region.reg_descripcion == "Test Region"
    assert region.reg_vigente == True
    assert str(region) == "Test Region"
```

---

## Testing Frontend

### Ejecutar Tests

#### Todos los tests
```bash
cd frontend
npm test
```

#### Tests en modo watch
```bash
npm test -- --watch
```

#### Tests con UI interactiva
```bash
npm test:ui
```

#### Tests con cobertura
```bash
npm run test:coverage
```

### Escribir Tests de Componentes

#### Ejemplo Básico
```javascript
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/Button'

describe('Button', () => {
  test('renders button with text', () => {
    render(<Button>Click me</Button>)
    
    const button = screen.getByText(/click me/i)
    expect(button).toBeInTheDocument()
  })
  
  test('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    
    const button = screen.getByText(/click/i)
    button.click()
    
    expect(handleClick).toHaveBeenCalledOnce()
  })
})
```

#### Test de Componente con Router
```javascript
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Breadcrumb } from '@/components/Breadcrumb'

describe('Breadcrumb', () => {
  test('renders breadcrumb items', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard/settings']}>
        <Breadcrumb />
      </MemoryRouter>
    )
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })
})
```

### Tests de Hooks

```javascript
import { renderHook, act } from '@testing-library/react'
import { useForm } from '@/hooks/useForm'

describe('useForm', () => {
  test('initializes with initial values', () => {
    const { result } = renderHook(() => 
      useForm({ name: '', email: '' })
    )
    
    expect(result.current.values).toEqual({
      name: '',
      email: ''
    })
  })
  
  test('updates field value', () => {
    const { result } = renderHook(() => 
      useForm({ name: '' })
    )
    
    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'John' }
      })
    })
    
    expect(result.current.values.name).toBe('John')
  })
})
```

### Tests de Servicios

```javascript
import { vi } from 'vitest'
import { authService } from '@/services/authService'
import axios from 'axios'

vi.mock('axios')

describe('authService', () => {
  test('login makes POST request', async () => {
    const mockResponse = {
      data: {
        access: 'token123',
        user: { id: 1, username: 'test' }
      }
    }
    
    axios.post.mockResolvedValue(mockResponse)
    
    const result = await authService.login('test', 'pass')
    
    expect(axios.post).toHaveBeenCalledWith(
      '/api/auth/login/',
      { username: 'test', password: 'pass' }
    )
    expect(result.access).toBe('token123')
  })
})
```

---

## Estrategia de Testing

### Pirámide de Testing

```
        E2E Tests (10%)
       ─────────────────
      Integration Tests (20%)
     ─────────────────────────
    Unit Tests (70%)
   ─────────────────────────────
```

### Qué Testear

#### ✅ SÍ Testear
- Lógica de negocio
- Validaciones
- Transformaciones de datos
- Flujos críticos de usuario
- Manejo de errores
- Integraciones con APIs

#### ❌ NO Testear
- Implementación interna de librerías
- Código generado automáticamente
- Configuración simple
- Estilos CSS puros

### Nomenclatura de Tests

```python
# Backend - pytest
def test_should_create_region_successfully()
def test_should_return_404_when_region_not_found()
def test_should_validate_required_fields()

# Frontend - vitest
test('should render component with props')
test('should call callback on button click')
test('should display error message on validation failure')
```

---

## Cobertura de Código

### Objetivos de Cobertura

- **Backend**: ≥ 80% líneas, ≥ 75% ramas
- **Frontend**: ≥ 80% líneas, ≥ 75% ramas
- **Funciones críticas**: 100% coverage

### Generar Reportes

#### Backend
```bash
cd backend
pytest --cov=. --cov-report=html --cov-report=term-missing
# Abrir htmlcov/index.html en navegador
```

#### Frontend
```bash
cd frontend
npm run test:coverage
# Abrir coverage/index.html en navegador
```

### Interpretar Reportes

- **Verde**: Líneas cubiertas por tests
- **Rojo**: Líneas NO cubiertas
- **Amarillo**: Ramas parcialmente cubiertas

---

## Buenas Prácticas

### 1. Tests Independientes
```python
# ✅ Bien - Cada test crea sus propios datos
def test_list_regiones(api_client):
    Region.objects.create(reg_descripcion="Test", reg_vigente=True)
    response = api_client.get('/api/geografia/regiones/')
    assert len(response.data['results']) >= 1

# ❌ Mal - Depende de datos de otros tests
def test_list_regiones(api_client):
    response = api_client.get('/api/geografia/regiones/')
    assert len(response.data['results']) == 5  # ¿De dónde vienen los 5?
```

### 2. Tests Descriptivos
```python
# ✅ Bien
def test_should_return_404_when_region_not_found(api_client):
    response = api_client.get('/api/geografia/regiones/999/')
    assert response.status_code == 404

# ❌ Mal
def test_region(api_client):
    response = api_client.get('/api/geografia/regiones/999/')
    assert response.status_code == 404
```

### 3. Arrange-Act-Assert
```python
def test_update_region(authenticated_client):
    # Arrange - Preparar
    region = Region.objects.create(
        reg_descripcion="Original",
        reg_vigente=True
    )
    data = {'reg_descripcion': 'Updated', 'reg_vigente': True}
    
    # Act - Ejecutar
    response = authenticated_client.put(
        f'/api/geografia/regiones/{region.reg_id}/',
        data
    )
    
    # Assert - Verificar
    assert response.status_code == 200
    region.refresh_from_db()
    assert region.reg_descripcion == 'Updated'
```

---

## CI/CD

### GitHub Actions

Ejemplo de workflow (`.github/workflows/tests.yml`):

```yaml
name: Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.12'
      - run: |
          cd backend
          pip install -r requirements.txt
          pytest --cov=. --cov-report=xml
      - uses: codecov/codecov-action@v3
        with:
          file: ./backend/coverage.xml
  
  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: |
          cd frontend
          npm ci
          npm run test:coverage
      - uses: codecov/codecov-action@v3
        with:
          file: ./frontend/coverage/coverage-final.json
```

---

## Estado Actual de Tests

### Backend: 76/76 tests pasando ✅

```
archivos/test/             3 tests
cursos/test/               9 tests
emails/                   15 tests
geografia/test_api.py     18 tests
maestros/test/            15 tests
pagos/test/                5 tests
personas/test/             6 tests
proveedores/test/          1 test
usuarios/test/             4 tests
────────────────────────────────
Total:                    76 tests
```

### Frontend: 14/14 tests pasando ✅

```
useAuth.test.js           4 tests
useForm.test.js           6 tests
Breadcrumb.test.jsx       4 tests
────────────────────────────────
Total:                   14 tests
```

---

## Comandos Rápidos

```bash
# Backend
cd backend
pytest                                    # Todos los tests
pytest -v                                 # Verbose
pytest --cov=. --cov-report=html         # Con cobertura
pytest -m unit                            # Solo unit tests
pytest -k "region"                        # Tests que contengan "region"
pytest --lf                               # Reejecutar tests fallidos

# Frontend
cd frontend
npm test                                  # Todos los tests
npm run test:ui                           # UI interactiva
npm run test:coverage                     # Con cobertura
npm test -- --watch                       # Modo watch
npm test -- Breadcrumb                    # Test específico
```

---

## Recursos Adicionales

- [Pytest Documentation](https://docs.pytest.org/)
- [Django Testing](https://docs.djangoproject.com/en/5.2/topics/testing/)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Test Driven Development](https://testdriven.io/)
