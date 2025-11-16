# Backend GIC - Configuración y Ejecución

## ✅ Estado del Backend

- **Django 5.2.7**: ✅ Instalado y funcionando
- **Django REST Framework**: ✅ Configurado
- **JWT Authentication**: ✅ Implementado
- **CORS Headers**: ✅ Configurado para frontend
- **Swagger/OpenAPI Docs**: ✅ Disponible en `/api/docs/`
- **Seguridad**: ✅ Middleware de seguridad implementado
- **Migraciones**: ✅ Todas aplicadas
- **Tests**: ✅ 38/43 pasando (88%)

## 🚀 Inicio Rápido

### 1. Instalar Dependencias

```bash
# En Linux/Mac
pip3 install -r requirements.txt

# En Windows
pip install -r requirements.txt
```

### 2. Configurar Variables de Entorno

El archivo `.env` ya está configurado para desarrollo. Para producción, edita el archivo `.env`:

```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

### 3. Aplicar Migraciones

```bash
python3 manage.py migrate
```

### 4. Ejecutar el Servidor

```bash
python3 manage.py runserver 0.0.0.0:8000
```

El backend estará disponible en: http://localhost:8000

## 📚 Documentación de API

Una vez el servidor esté corriendo, accede a:

- **Swagger UI**: http://localhost:8000/api/docs/
- **ReDoc**: http://localhost:8000/api/redoc/
- **JSON Schema**: http://localhost:8000/swagger.json

## 🔐 Endpoints de Autenticación

### Login
```bash
POST /api/auth/login/
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "password123"
}
```

### Obtener Usuario Actual
```bash
GET /api/auth/me/
Authorization: Bearer <token>
```

### Refresh Token
```bash
POST /api/auth/token/refresh/
Content-Type: application/json

{
  "refresh": "<refresh_token>"
}
```

### CSRF Token
```bash
GET /api/auth/csrf-token/
```

## 🧪 Ejecutar Tests

```bash
# Todos los tests
python3 -m pytest

# Tests con cobertura
python3 -m pytest --cov=.

# Tests de un módulo específico
python3 -m pytest usuarios/test/
```

## 📊 Verificar Calidad del Código

```bash
# Flake8 (linting)
python3 -m flake8 --max-line-length=120 --exclude=migrations,__pycache__

# Black (formateo)
python3 -m black --check .
```

## 🔧 Comandos Útiles

### Crear Superusuario
```bash
python3 manage.py createsuperuser
```

### Crear Usuarios de Prueba
```bash
python3 manage.py create_test_users
```

### Colectar Archivos Estáticos
```bash
python3 manage.py collectstatic --no-input
```

### Verificar Seguridad
```bash
python3 manage.py check --deploy
```

## 🛡️ Seguridad Implementada

### Middleware de Seguridad
- ✅ Content Security Policy (CSP)
- ✅ XSS Protection
- ✅ X-Frame-Options (Clickjacking protection)
- ✅ X-Content-Type-Options (MIME sniffing protection)
- ✅ Referrer Policy
- ✅ Permissions Policy

### Autenticación
- ✅ JWT Tokens con rotación automática
- ✅ Tokens de acceso de 60 minutos
- ✅ Tokens de refresco de 7 días
- ✅ Blacklisting de tokens después de rotación
- ✅ Rate limiting en endpoints de login (5/minuto)

### Protección de Datos
- ✅ Contraseñas hasheadas con Django's password hashers
- ✅ Validación de formato de email
- ✅ Sanitización de inputs
- ✅ CSRF protection
- ✅ CORS configurado específicamente para frontend

### Headers de Seguridad (Producción)
- ✅ SECURE_SSL_REDIRECT
- ✅ SESSION_COOKIE_SECURE
- ✅ CSRF_COOKIE_SECURE
- ✅ SECURE_HSTS_SECONDS
- ✅ SECURE_BROWSER_XSS_FILTER
- ✅ SECURE_CONTENT_TYPE_NOSNIFF

## 📦 Estructura de APIs

```
/api/
├── auth/               # Autenticación y autorización
│   ├── login/
│   ├── logout/
│   ├── me/
│   ├── csrf-token/
│   ├── token/
│   └── token/refresh/
├── cursos/             # Gestión de cursos
├── maestros/           # Datos maestros
├── personas/           # Gestión de personas
├── proveedores/        # Gestión de proveedores
├── pagos/              # Sistema de pagos
└── geografia/          # Datos geográficos
```

## 🔄 Configuración CORS

El backend está configurado para permitir solicitudes desde:
- http://localhost:3000 (React/Next.js)
- http://localhost:5173 (Vite)
- http://127.0.0.1:3000
- http://127.0.0.1:5173

Para añadir más orígenes, edita `CORS_ALLOWED_ORIGINS` en `settings.py`.

## 📝 Variables de Entorno

### Desarrollo (.env)
```bash
DJANGO_SECRET_KEY=dev-secret-key-for-local-development-only
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOW_ALL=True
DB_ENGINE=sqlite3
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```

### Producción
```bash
DJANGO_SECRET_KEY=<secret-key-segura-aleatoria>
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=tudominio.com,www.tudominio.com
CORS_ALLOW_ALL=False
DB_ENGINE=mysql
DB_NAME=gic_db
DB_USER=gic_user
DB_PASSWORD=<password-segura>
DB_HOST=localhost
DB_PORT=3306
```

## 🐛 Troubleshooting

### Error: No module named 'decouple'
```bash
pip3 install python-decouple
```

### Error: mysqlclient installation failed
En Ubuntu/Debian:
```bash
sudo apt-get install python3-dev default-libmysqlclient-dev build-essential
pip3 install mysqlclient
```

### Error: CSRF verification failed
Asegúrate de incluir el CSRF token en las peticiones POST/PUT/DELETE o usa JWT authentication.

## 📞 Contacto y Soporte

Para problemas o dudas sobre el backend, consulta:
- Documentación del proyecto en `/docs`
- API documentation en `/api/docs/`
- Tests en cada módulo para ejemplos de uso

## ⚙️ Dependencias Principales

- Django 5.2.7 - Framework web
- Django REST Framework 3.14.0 - APIs RESTful
- djangorestframework-simplejwt 5.3.1 - JWT authentication
- django-cors-headers 4.3.1 - CORS support
- drf-yasg 1.21.7 - API documentation
- mysqlclient 2.2.4 - MySQL driver
- pytest 7.4.3 - Testing framework
- flake8 6.1.0 - Code linting
- black 23.12.0 - Code formatting

Ver `requirements.txt` para la lista completa de dependencias.
