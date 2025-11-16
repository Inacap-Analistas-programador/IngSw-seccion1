# Guía de Testing de Seguridad GIC

## Descripción
Esta guía proporciona tests manuales y automatizados para verificar las correcciones de seguridad implementadas.

## Prerrequisitos
- Backend ejecutándose en http://localhost:8000
- Frontend ejecutándose en http://localhost:5173
- curl instalado para tests de API
- Navegador web con DevTools

---

## Tests Backend

### 1. Test de Headers de Seguridad

Verificar que los headers de seguridad están presentes:

```bash
# Test en desarrollo (DEBUG=True)
curl -I http://localhost:8000/api/

# Debe incluir:
# Content-Security-Policy
# X-Frame-Options: DENY
# X-Content-Type-Options: nosniff
# X-XSS-Protection: 1; mode=block
# Referrer-Policy: strict-origin-when-cross-origin
```

### 2. Test de Rate Limiting en Login

Verificar que el rate limiting funciona (máximo 5 intentos por minuto):

```bash
#!/bin/bash
# test_rate_limiting.sh

echo "Testing login rate limiting..."
for i in {1..6}; do
  echo "Attempt $i:"
  curl -X POST http://localhost:8000/api/auth/login/ \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}' \
    -w "\nHTTP Status: %{http_code}\n\n" \
    -s -o /dev/null
  sleep 1
done

# Intentos 1-5: Deben retornar 401 (credenciales inválidas)
# Intento 6: Debe retornar 429 (Too Many Requests)
```

### 3. Test de Validación de Email

```bash
# Email válido - debe procesar
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@test.com","password":"password123"}'

# Email inválido - debe retornar error
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"invalido","password":"password123"}'
# Esperado: {"error": "Formato de email inválido"}

# Email con intento de XSS - debe ser sanitizado
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test<script>alert(1)</script>@test.com","password":"pass"}'
# Esperado: {"error": "Formato de email inválido"}
```

### 4. Test de Protección XSS en Query Params

```bash
# Intento de XSS en parámetros GET
curl "http://localhost:8000/api/personas/?search=<script>alert('xss')</script>"
# Esperado: {"error": "Contenido peligroso detectado en la solicitud"}

curl "http://localhost:8000/api/personas/?search=javascript:alert(1)"
# Esperado: {"error": "Contenido peligroso detectado en la solicitud"}
```

### 5. Test de Permisos en ViewSets

```bash
# Sin token - debe retornar 401
curl http://localhost:8000/api/personas/
# Esperado: {"detail": "Authentication credentials were not provided."}

# Con token inválido - debe retornar 401
curl -H "Authorization: Bearer token_invalido" \
  http://localhost:8000/api/personas/
# Esperado: {"detail": "Given token not valid for any token type"}

# Con token válido - debe retornar datos
# (Primero hacer login para obtener token)
TOKEN=$(curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"Admin123!"}' \
  -s | jq -r '.accessToken')

curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/personas/
# Esperado: Lista de personas
```

### 6. Test de CORS

```bash
# Request desde origen permitido (localhost:5173)
curl -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: GET" \
  -X OPTIONS http://localhost:8000/api/personas/
# Esperado: Access-Control-Allow-Origin presente

# Request desde origen no permitido
curl -H "Origin: http://malicious-site.com" \
  -H "Access-Control-Request-Method: GET" \
  -X OPTIONS http://localhost:8000/api/personas/
# Esperado: Sin Access-Control-Allow-Origin (en producción)
```

---

## Tests Frontend

### 1. Test de Almacenamiento de Tokens

Abrir DevTools → Application → Session Storage

```javascript
// Después de login exitoso, verificar:
sessionStorage.getItem('gic_auth_token')      // Debe existir
sessionStorage.getItem('gic_refresh_token')   // Debe existir
sessionStorage.getItem('gic_user_data')       // Debe existir

// Los tokens deben tener formato JWT: xxxxx.yyyyy.zzzzz
```

### 2. Test de Timeout de Sesión

```javascript
// En consola del navegador:
// 1. Hacer login
// 2. Esperar 15 minutos sin actividad
// 3. Verificar que se redirige a login automáticamente

// Para testing rápido, modificar SESSION_TIMEOUT temporalmente:
// En authService.js cambiar: const SESSION_TIMEOUT = 15 * 60 * 1000;
// A: const SESSION_TIMEOUT = 30 * 1000; // 30 segundos
```

### 3. Test de Protección contra Intentos Fallidos

```javascript
// En página de login:
// 1. Intentar login con password incorrecta 5 veces
// 2. En el 5to intento debe mostrar mensaje de bloqueo
// 3. Verificar que no permite más intentos por 1 hora

// Para verificar en consola:
const email = 'test@test.com';
console.log('Login attempts:', sessionStorage.getItem(`login_attempts_${email}`));
console.log('Lockout until:', sessionStorage.getItem(`lockout_${email}`));
```

### 4. Test de Validación de Input

```javascript
// Verificar que el sanitizer funciona
import { sanitizeText, containsXSS } from '@/utils/inputSanitizer';

// Test 1: XSS básico
const xss1 = '<script>alert("xss")</script>';
console.log(containsXSS(xss1)); // debe ser true
console.log(sanitizeText(xss1)); // debe estar limpio

// Test 2: Event handlers
const xss2 = '<img src=x onerror=alert(1)>';
console.log(containsXSS(xss2)); // debe ser true
console.log(sanitizeText(xss2)); // debe estar limpio

// Test 3: JavaScript protocol
const xss3 = '<a href="javascript:alert(1)">Click</a>';
console.log(containsXSS(xss3)); // debe ser true
console.log(sanitizeText(xss3)); // debe estar limpio
```

### 5. Test de Conexión a API Real

```javascript
// Verificar que NO hay código mock
// En authService.js no debe existir:
// - mockLogin()
// - generateMockToken()

// Login debe llamar al backend real:
// Abrir DevTools → Network → intentar login
// Debe haber request POST a: http://localhost:8000/api/auth/login/
```

---

## Tests de Configuración

### 1. Variables de Entorno Backend

```bash
# Verificar que settings.py lee variables de entorno
cd backend

# Test DEBUG
export DJANGO_DEBUG=False
python -c "from scout_project.settings import DEBUG; print(f'DEBUG={DEBUG}')"
# Esperado: DEBUG=False

# Test SECRET_KEY
export DJANGO_SECRET_KEY="test-secret-key-12345"
python -c "from scout_project.settings import SECRET_KEY; print('SECRET_KEY configurada' if SECRET_KEY == 'test-secret-key-12345' else 'Error')"

# Test ALLOWED_HOSTS
export DJANGO_ALLOWED_HOSTS="example.com,www.example.com"
python -c "from scout_project.settings import ALLOWED_HOSTS; print(f'ALLOWED_HOSTS={ALLOWED_HOSTS}')"
# Esperado: ALLOWED_HOSTS=['example.com', 'www.example.com']
```

### 2. Verificar Archivo .env.example

```bash
cd backend
test -f .env.example && echo "✓ .env.example existe" || echo "✗ .env.example falta"

# Verificar que contiene las variables necesarias
grep -q "DJANGO_SECRET_KEY" .env.example && echo "✓ DJANGO_SECRET_KEY" || echo "✗ DJANGO_SECRET_KEY"
grep -q "DJANGO_DEBUG" .env.example && echo "✓ DJANGO_DEBUG" || echo "✗ DJANGO_DEBUG"
grep -q "DJANGO_ALLOWED_HOSTS" .env.example && echo "✓ DJANGO_ALLOWED_HOSTS" || echo "✗ DJANGO_ALLOWED_HOSTS"
```

---

## Tests de Producción

### 1. Checklist Pre-Despliegue

```bash
#!/bin/bash
# production_security_check.sh

echo "=== GIC Production Security Checklist ==="

# 1. DEBUG debe ser False
if grep -q "DEBUG = True" backend/scout_project/settings.py; then
    echo "✗ WARNING: DEBUG is hardcoded to True"
else
    echo "✓ DEBUG is configurable"
fi

# 2. SECRET_KEY no debe estar hardcodeada
if grep -q "SECRET_KEY = \"django-insecure" backend/scout_project/settings.py; then
    echo "⚠ WARNING: Using default SECRET_KEY (OK for dev only)"
else
    echo "✓ SECRET_KEY is configurable"
fi

# 3. Permisos en ViewSets
echo "Checking ViewSets permissions..."
for file in backend/*/views.py; do
    if grep -q "permission_classes" "$file"; then
        echo "✓ $file has permissions"
    else
        echo "⚠ $file may be missing permissions"
    fi
done

# 4. No código mock en frontend
if grep -q "mockLogin" frontend/src/services/authService.js; then
    echo "✗ ERROR: Mock code found in authService.js"
else
    echo "✓ No mock code in authService.js"
fi

echo "=== Checklist Complete ==="
```

### 2. Test de Headers HTTPS

```bash
# Después de desplegar a producción:
curl -I https://tu-dominio.com/api/

# Debe incluir TODOS estos headers:
# Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
# X-Frame-Options: DENY
# X-Content-Type-Options: nosniff
# Content-Security-Policy: ...
# Referrer-Policy: strict-origin-when-cross-origin
```

### 3. SSL/TLS Test

```bash
# Verificar configuración SSL
openssl s_client -connect tu-dominio.com:443 -servername tu-dominio.com

# O usar herramientas online:
# https://www.ssllabs.com/ssltest/
# https://securityheaders.com/
```

---

## Tests Automatizados

### Python Tests (Backend)

```python
# backend/usuarios/test/test_security.py

from django.test import TestCase, Client
from django.contrib.auth.models import User
from usuarios.models import Usuario
import time

class SecurityTestCase(TestCase):
    def setUp(self):
        self.client = Client()
    
    def test_rate_limiting(self):
        """Verificar que rate limiting funciona"""
        for i in range(6):
            response = self.client.post('/api/auth/login/', {
                'email': 'test@test.com',
                'password': 'wrong'
            })
            if i < 5:
                self.assertIn(response.status_code, [400, 401])
            else:
                self.assertEqual(response.status_code, 429)
    
    def test_xss_protection(self):
        """Verificar protección XSS en query params"""
        response = self.client.get('/api/personas/?search=<script>alert(1)</script>')
        self.assertEqual(response.status_code, 400)
        self.assertIn('peligroso', str(response.content))
    
    def test_email_validation(self):
        """Verificar validación de email"""
        response = self.client.post('/api/auth/login/', {
            'email': 'invalid-email',
            'password': 'password123'
        })
        self.assertEqual(response.status_code, 400)
        self.assertIn('email', str(response.content).lower())
    
    def test_permissions_required(self):
        """Verificar que endpoints requieren autenticación"""
        endpoints = [
            '/api/personas/',
            '/api/cursos/',
            '/api/pagos/',
        ]
        for endpoint in endpoints:
            response = self.client.get(endpoint)
            self.assertEqual(response.status_code, 401)
```

### JavaScript Tests (Frontend)

```javascript
// frontend/src/test/security.test.js

import { describe, it, expect } from 'vitest';
import { sanitizeText, containsXSS, validatePassword } from '@/utils/inputSanitizer';

describe('Input Sanitization', () => {
  it('should detect XSS attempts', () => {
    expect(containsXSS('<script>alert(1)</script>')).toBe(true);
    expect(containsXSS('javascript:alert(1)')).toBe(true);
    expect(containsXSS('normal text')).toBe(false);
  });
  
  it('should sanitize dangerous input', () => {
    const xss = '<script>alert("xss")</script>';
    const sanitized = sanitizeText(xss);
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).not.toContain('alert');
  });
  
  it('should validate password strength', () => {
    const weak = validatePassword('12345678');
    expect(weak.valid).toBe(false);
    
    const strong = validatePassword('Strong@Pass123');
    expect(strong.valid).toBe(true);
  });
});

describe('Authentication Service', () => {
  it('should not have mock functions', async () => {
    const authService = await import('@/services/authService');
    expect(authService.default.mockLogin).toBeUndefined();
    expect(authService.default.generateMockToken).toBeUndefined();
  });
});
```

---

## Comandos Útiles

### Ejecutar todos los tests

```bash
# Backend
cd backend
python manage.py test usuarios.test.test_security

# Frontend
cd frontend
npm run test -- src/test/security.test.js
```

### Limpiar datos de prueba

```bash
# Limpiar sessionStorage en navegador
sessionStorage.clear();

# Resetear base de datos de test
cd backend
python manage.py flush --no-input
```

### Generar reporte de seguridad

```bash
# Usar bandit para análisis de seguridad Python
pip install bandit
cd backend
bandit -r . -f json -o security_report.json

# Usar npm audit para frontend
cd frontend
npm audit --json > security_audit.json
```

---

## Contacto

Para reportar problemas de seguridad encontrados durante testing:
- Email: security@gic.scouts.cl
- Seguir política de Responsible Disclosure

---

**Última actualización:** 2025-11-15
**Versión:** 1.0.0
