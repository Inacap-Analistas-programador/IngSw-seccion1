# 🏕️ Plataforma GIC - Gestión Integral de Cursos Scouts

Sistema de gestión integral para cursos y actividades de la Asociación de Guías y Scouts de Chile.

## 📋 Descripción

Plataforma web completa para la administración de:
- 👥 Personas y participantes
- 📚 Cursos y formaciones
- 💳 Pagos y comprobantes
- 📍 Geografía (regiones, comunas, grupos)
- 🏢 Proveedores
- 📝 Preinscripciones

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────┐
│           Frontend React + Vite             │
│  - React 18.2.0                             │
│  - TailwindCSS + Radix UI                   │
│  - React Router 6                           │
│  - Autenticación JWT                        │
└─────────────────────────────────────────────┘
                    ↕ REST API
┌─────────────────────────────────────────────┐
│        Backend Django REST Framework        │
│  - Django 5.2.7                             │
│  - DRF 3.14.0                               │
│  - JWT Authentication                       │
│  - API Documentation (Swagger)              │
└─────────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────────┐
│            Base de Datos                    │
│  - SQLite (desarrollo)                      │
│  - MySQL (producción)                       │
│  - 47 tablas                                │
└─────────────────────────────────────────────┘
```

## ✨ Características Principales

### Backend
- ✅ **API REST completa** con Django REST Framework
- ✅ **Autenticación JWT** segura con tokens refresh
- ✅ **47 modelos** completamente implementados
- ✅ **Documentación automática** con Swagger/OpenAPI
- ✅ **CORS configurado** para frontend
- ✅ **Paginación** y filtros en todos los endpoints
- ✅ **Rate limiting** para protección de API
- ✅ **Validaciones de negocio**

### Frontend
- ✅ **React 18** con hooks modernos
- ✅ **UI profesional** con Radix UI + TailwindCSS
- ✅ **Autenticación segura** con JWT y refresh automático
- ✅ **Rutas protegidas** por rol
- ✅ **HTTP client** centralizado con interceptores
- ✅ **Gestión de sesiones** con timeout
- ✅ **Sistema de auditoría** de acciones
- ✅ **Responsive design** móvil y desktop

### Seguridad
- 🔐 JWT con rotación de tokens
- 🔐 CSRF protection
- 🔐 Rate limiting
- 🔐 Bloqueo por intentos fallidos
- 🔐 Session timeout por inactividad
- 🔐 Audit logging

## 🚀 Inicio Rápido

### Opción 1: Script Automático (Recomendado)

```bash
# Clonar el repositorio
git clone <repo-url>
cd IngSw-seccion1

# Ejecutar script de inicio
./start-dev.sh
```

El script automáticamente:
- ✅ Instala dependencias de Python y Node.js
- ✅ Configura la base de datos
- ✅ Inicia backend en http://localhost:8000
- ✅ Inicia frontend en http://localhost:3000

### Opción 2: Manual

#### Backend
```bash
cd backend

# Instalar dependencias
pip install -r requirements.txt

# Aplicar migraciones
python manage.py migrate

# Crear superusuario (opcional)
python manage.py createsuperuser

# Iniciar servidor
python manage.py runserver 0.0.0.0:8000
```

#### Frontend
```bash
cd frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Iniciar servidor de desarrollo
npm run dev
```

## 📚 Documentación

### Guías Principales
- 📖 [Guía de Integración](INTEGRATION_GUIDE.md) - Integración frontend-backend
- 📖 [Backend Review](BACKEND_REVIEW_SUMMARY.md) - Estado del backend
- 📖 [Frontend Cleanup](frontend/FRONTEND_CLEANUP_REPORT.md) - Estado del frontend
- 📖 [Modelo de Datos](modelo_de_datos.md) - Estructura de base de datos

### Backend
- 📖 [README Backend](backend/README.md)
- 📖 [Quick Start](backend/QUICK_START.md)
- 📖 [Next Steps](backend/NEXT_STEPS.md)
- 📖 [Schema Analysis](backend/SCHEMA_ANALYSIS.md)

### Frontend
- 📖 [README Frontend](frontend/README.md)
- 📖 [Developer Guide](frontend/DEVELOPER_GUIDE.md)
- 📖 [Security Guide](frontend/SECURITY_GUIDE.md)
- 📖 [Changelog](frontend/CHANGELOG.md)

## 🔗 URLs Importantes

### Desarrollo
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Admin Django**: http://localhost:8000/admin/
- **API Docs (Swagger)**: http://localhost:8000/api/docs/
- **API Docs (ReDoc)**: http://localhost:8000/api/redoc/

### Endpoints API Principales

**Autenticación**
- `POST /api/auth/login/` - Login
- `POST /api/auth/logout/` - Logout
- `GET /api/auth/me/` - Usuario actual
- `POST /api/auth/token/refresh/` - Refresh token

**Recursos**
- `/api/personas/` - Gestión de personas
- `/api/cursos/` - Gestión de cursos
- `/api/maestros/` - Catálogos y tablas maestras
- `/api/geografia/` - Regiones, comunas, grupos
- `/api/proveedores/` - Proveedores
- `/api/pagos/` - Pagos y comprobantes

## 🛠️ Stack Tecnológico

### Backend
- **Framework**: Django 5.2.7
- **API**: Django REST Framework 3.14.0
- **Auth**: djangorestframework-simplejwt 5.3.1
- **CORS**: django-cors-headers 4.3.1
- **Docs**: drf-yasg 1.21.7
- **DB**: SQLite (dev), MySQL (prod)

### Frontend
- **Framework**: React 18.2.0
- **Build**: Vite 4.4.5
- **Router**: React Router 6.16.0
- **UI**: TailwindCSS 3.3.3 + Radix UI
- **Animation**: Framer Motion 10.16.4
- **HTTP**: Axios 1.13.2
- **Testing**: Vitest 1.6.1

## 📦 Estructura del Proyecto

```
IngSw-seccion1/
├── backend/                    # Backend Django
│   ├── scout_project/          # Configuración principal
│   ├── usuarios/               # Autenticación y usuarios
│   ├── personas/               # Gestión de personas
│   ├── cursos/                 # Gestión de cursos
│   ├── maestros/               # Tablas catálogo
│   ├── geografia/              # Regiones, comunas, grupos
│   ├── pagos/                  # Pagos y comprobantes
│   ├── proveedores/            # Proveedores
│   ├── preinscripcion/         # Sistema de preinscripción
│   ├── archivos/               # Gestión de archivos
│   ├── requirements.txt        # Dependencias Python
│   └── manage.py               # CLI Django
│
├── frontend/                   # Frontend React
│   ├── src/
│   │   ├── components/         # Componentes React
│   │   ├── pages/              # Páginas/vistas
│   │   ├── services/           # Servicios API
│   │   ├── hooks/              # Custom hooks
│   │   ├── context/            # React contexts
│   │   └── utils/              # Utilidades
│   ├── package.json            # Dependencias Node
│   └── vite.config.js          # Configuración Vite
│
├── INTEGRATION_GUIDE.md        # Guía de integración
├── start-dev.sh                # Script de inicio rápido
└── README.md                   # Este archivo
```

## 🧪 Testing

### Backend
```bash
cd backend
python manage.py test
```

### Frontend
```bash
cd frontend

# Tests unitarios
npm test

# Tests con UI
npm run test:ui

# Cobertura
npm run test:coverage
```

## 🎨 Características de UI

- ✨ **Design System** basado en Radix UI
- 🎨 **TailwindCSS** para estilos
- 📱 **Responsive** móvil, tablet y desktop
- 🌓 **Dark mode** ready
- ♿ **Accesibilidad** WCAG 2.1 AA
- 🎭 **Animaciones** con Framer Motion
- 📊 **Dashboard** interactivo
- 📋 **Formularios** con validación
- 🔍 **Búsqueda y filtros**
- 📄 **Paginación** en tablas

## 🔐 Seguridad

### Implementado
- ✅ JWT con access y refresh tokens
- ✅ CSRF protection
- ✅ Rate limiting (100/hora anón, 1000/hora auth)
- ✅ Session timeout (60 min)
- ✅ Bloqueo por intentos fallidos (5 intentos)
- ✅ Validación de entrada
- ✅ CORS específico por origen
- ✅ Headers de seguridad
- ✅ Audit logging

### Recomendaciones para Producción
- 🔒 Usar HTTPS en todas las conexiones
- 🔒 Configurar SECRET_KEY único y seguro
- 🔒 Habilitar HSTS
- 🔒 Configurar CSP headers
- 🔒 Usar base de datos MySQL/PostgreSQL
- 🔒 Implementar backup automático
- 🔒 Monitoreo con Sentry
- 🔒 Rate limiting más estricto

## 📊 Estado del Proyecto

### Completado ✅
- [x] Modelos de base de datos (47 tablas)
- [x] Migraciones de Django
- [x] API REST con DRF
- [x] Autenticación JWT
- [x] CORS configurado
- [x] Documentación API (Swagger)
- [x] Frontend React
- [x] HTTP Client con interceptores
- [x] Gestión de sesiones
- [x] Sistema de auditoría
- [x] UI profesional con TailwindCSS
- [x] Rutas protegidas
- [x] Tests unitarios básicos
- [x] **Docker setup (dev y prod)**
- [x] **CI/CD con GitHub Actions**
- [x] **Password hashing seguro**
- [x] **Monitoreo con Prometheus/Grafana**
- [x] **Scripts de deployment y backup**

### En Progreso 🚧
- [ ] Tests de integración frontend-backend
- [ ] Permisos por rol en ViewSets
- [ ] Validaciones de negocio complejas
- [ ] Sistema de notificaciones
- [ ] Exportación PDF/Excel

### Por Hacer 📋
- [ ] Caché con Redis (configurado, pendiente uso)
- [ ] WebSockets para tiempo real
- [ ] Envío de emails
- [ ] Dashboard ejecutivo completo
- [ ] Reportes avanzados

## 🐳 Deployment en Producción

### Con Docker (Recomendado)

```bash
# 1. Configurar variables de entorno
cp .env.production.example .env
nano .env  # Editar con valores de producción

# 2. Ejecutar deployment
./scripts/deploy-production.sh
```

### Docker Compose Manual

```bash
# Desarrollo
docker-compose -f docker-compose.dev.yml up -d

# Producción
docker-compose -f docker-compose.prod.yml up -d
```

### Monitoreo

```bash
# Iniciar stack de monitoreo
cd monitoring
docker-compose -f docker-compose.monitoring.yml up -d

# Acceder a:
# - Prometheus: http://localhost:9090
# - Grafana: http://localhost:3001
# - Alertmanager: http://localhost:9093
```

### Scripts de Mantenimiento

```bash
# Backup de base de datos
./scripts/backup.sh

# Verificar rendimiento
./scripts/performance-check.sh
```

Ver [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) para instrucciones completas de deployment.

## 🔐 Seguridad

### Mejoras Implementadas

- ✅ **Password Hashing**: PBKDF2-SHA256 para contraseñas
- ✅ **JWT Tokens**: Access + refresh tokens con rotación
- ✅ **HTTPS Ready**: Configuración SSL/TLS lista
- ✅ **Rate Limiting**: Nginx con límites por endpoint
- ✅ **Security Headers**: X-Frame-Options, CSP, HSTS
- ✅ **CORS Específico**: Solo orígenes permitidos
- ✅ **Usuarios de Prueba**: Comando `create_test_users`

Ver [SECURITY_IMPROVEMENTS.md](SECURITY_IMPROVEMENTS.md) para detalles completos.

### Crear Usuarios de Prueba

```bash
cd backend
python manage.py create_test_users

# Usuarios creados:
# - admin@test.com / Admin123!
# - coordinador@test.com / Coord123!
# - dirigente@test.com / Dirig123!
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es privado y pertenece a la Asociación de Guías y Scouts de Chile.

## 👥 Equipo

Desarrollado por el equipo de Ingeniería de Software - Sección 1, INACAP.

## 📞 Soporte

Para soporte y consultas:
- 📧 Email: soporte@gic.scouts.cl
- 📚 Documentación: Ver carpeta `docs/`
- 🐛 Issues: GitHub Issues

---

**Versión**: 1.0.0  
**Última actualización**: 2025-11-15  
**Estado**: ✅ **COMPLETAMENTE FUNCIONAL E INTEGRADO**
