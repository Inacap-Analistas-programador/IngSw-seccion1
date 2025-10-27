# Manual Técnico - Sistema de Gestión Scout

##  Tabla de Contenidos

1. [Introducción](#introducción)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Configuración del Entorno](#configuración-del-entorno)
4. [APIs y Endpoints](#apis-y-endpoints)
5. [Base de Datos](#base-de-datos)
6. [Seguridad](#seguridad)
7. [Despliegue](#despliegue)
8. [Monitoreo y Logs](#monitoreo-y-logs)
9. [Troubleshooting](#troubleshooting)
10. [Mantenimiento](#mantenimiento)

---

## 1. Introducción

### 1.1 Propósito

Este manual técnico proporciona información detallada sobre la arquitectura, configuración, implementación y mantenimiento del Sistema de Gestión Scout.

### 1.2 Tecnologías Utilizadas

- **Backend:** Django 4.2+ con Django REST Framework
w- **Frontend:** Vue 3 + TypeScript (Vite)
- **Base de Datos:** Microsoft SQL Server 2019 (modelo relacional definido en SAP PowerDesigner)
- **Cache:** Redis 7+
- **Almacenamiento:** AWS S3 / MinIO
- **Containerización:** Docker + Docker Compose
- **CI/CD:** GitHub Actions + Integración SonarQube
- **Gestión Ágil:** Jira Software (Scrum/Kanban)
- **Calidad de Código:** SonarQube (Quality Gates y seguridad)
- **Monitoreo:** Prometheus + Grafana

### 1.3 Arquitectura General

El sistema sigue una arquitectura de 4 capas:

- **Capa de Presentación:** Frontend web
- **Capa de API:** REST APIs con autenticación JWT
- **Capa de Datos:** Microsoft SQL Server + Redis + File Storage
- **Capa de Gestión y Calidad:** Jira Software + SonarQube integrados con el pipeline CI/CD
- **Capa de Infraestructura:** Docker + CI/CD + Monitoreo

---

## 2. Arquitectura del Sistema

### 2.1 Diagrama de Componentes

```mermaid
graph TB
    subgraph "Frontend"
  WebApp[Web App - Vue 3]
  AdminPanel[Admin Panel - Vue 3]
    end

    subgraph "API Layer"
        APIGateway[API Gateway - Nginx]
        AuthAPI[Auth API - Django]
        CoreAPI[Core APIs - Django]
    end

    subgraph "Services"
        AuthService[Auth Service]
        ValidationService[Validation Service]
        NotificationService[Notification Service]
    end

  subgraph "Data Layer"
    SQLServer[(SQL Server)]
        Redis[(Redis)]
        S3[(S3 Storage)]
    end

    WebApp --> APIGateway
    AdminPanel --> APIGateway
    APIGateway --> AuthAPI
    APIGateway --> CoreAPI
    AuthAPI --> AuthService
    CoreAPI --> ValidationService
    CoreAPI --> NotificationService
  AuthService --> SQLServer
  ValidationService --> SQLServer
    NotificationService --> Redis
    CoreAPI --> S3
```

### 2.2 Estructura de Directorios

```
scout_system/
├── backend/
│   ├── scout_system/
│   │   ├── settings/
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── apps/
│   │   ├── users/
│   │   ├── courses/
│   │   ├── enrollments/
│   │   ├── payments/
│   │   ├── notifications/
│   │   └── reports/
│   ├── requirements.txt
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   └── public/
├── docker/
│   ├── docker-compose.yml
│   ├── Dockerfile.backend
│   └── Dockerfile.frontend
├── docs/
├── scripts/
└── tests/
```

---

## 3. Configuración del Entorno

### 3.1 Requisitos del Sistema

#### Desarrollo:

- Python 3.11+
- Node.js 18+
- Microsoft SQL Server 2019+
- Redis 7+
- Docker & Docker Compose

#### Producción:

- Ubuntu 20.04+ / CentOS 8+
- 4GB RAM mínimo
- 50GB almacenamiento
- SSL Certificate

### 3.2 Configuración de Desarrollo

#### Backend:

```bash
# Clonar repositorio
git clone https://github.com/nilsonGuerraInacap/proyecto_cursos_scouts.git
cd proyecto_cursos_scouts/backend

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# Editar .env con configuración local

# Ejecutar migraciones
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Ejecutar servidor
python manage.py runserver
```

#### Frontend:

```bash
cd frontend

# Instalar dependencias
npm install

# Configurar variables de entorno (crear `.env.local` si no existe)
# Las variables requeridas están resumidas en la sección 3.3

# Ejecutar servidor de desarrollo
npm run dev
```

### 3.3 Variables de Entorno

#### Backend (.env):

```env
# Base de datos
DATABASE_URL=mssql+pyodbc://scout_user:StrongPass123@localhost,1433/SGICS?driver=ODBC+Driver+18+for+SQL+Server&TrustServerCertificate=yes
DB_ODBC_DRIVER=ODBC Driver 18 for SQL Server
REDIS_URL=redis://localhost:6379/0

# Seguridad
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# JWT
JWT_SECRET_KEY=your-jwt-secret
JWT_ACCESS_TOKEN_LIFETIME=3600
JWT_REFRESH_TOKEN_LIFETIME=86400

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# File Storage
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_STORAGE_BUCKET_NAME=scout-files
AWS_S3_REGION_NAME=us-east-1
```

#### Frontend (`.env.local`):

```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=Sistema Scout
VITE_APP_VERSION=0.0.1
```

---

## 4. APIs y Endpoints

### 4.1 Autenticación

#### POST /api/auth/login/

```json
{
  "username": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

**Respuesta:**

```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "username": "usuario@ejemplo.com",
    "email": "usuario@ejemplo.com",
    "first_name": "Juan",
    "last_name": "Pérez",
    "roles": ["participante"]
  }
}
```

#### POST /api/auth/refresh/

```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### 4.2 Gestión de Cursos

#### GET /api/courses/

**Parámetros de consulta:**

- `status`: active, inactive, all
- `zone`: filtro por zona
- `page`: número de página
- `page_size`: tamaño de página

**Respuesta:**

```json
{
  "count": 10,
  "next": "http://localhost:8000/api/courses/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "code": "CM-2025-001",
      "name": "Curso Medio 2025",
      "zone": "Biobío",
      "start_date": "2025-03-15",
      "end_date": "2025-03-17",
      "capacity": 144,
      "status": "active"
    }
  ]
}
```

#### POST /api/courses/

```json
{
  "code": "CM-2025-002",
  "name": "Curso Medio 2025 - Segunda Edición",
  "zone": "Biobío",
  "location": "Centro Scout",
  "start_date": "2025-04-15",
  "end_date": "2025-04-17",
  "capacity": 144,
  "registration_start": "2025-02-01",
  "registration_end": "2025-03-01"
}
```

### 4.3 Preinscripciones

#### POST /api/enrollments/

```json
{
  "course": 1,
  "person": {
    "rut": "12345678-9",
    "full_name": "Juan Pérez",
    "birth_date": "1990-01-15",
    "gender": "M",
    "phone": "+56912345678",
    "email": "juan@ejemplo.com",
    "zone": "Biobío",
    "district": "Concepción",
    "group": "Grupo 1",
    "role": "scout",
    "branch": "tropa"
  },
  "documents": [
    {
      "type": "medical_certificate",
      "file": "base64_encoded_file_content"
    }
  ]
}
```

#### GET /api/enrollments/{id}/

**Respuesta:**

```json
{
  "id": 1,
  "code": "ENR-2025-001",
  "course": {
    "id": 1,
    "name": "Curso Medio 2025"
  },
  "person": {
    "id": 1,
    "rut": "12345678-9",
    "full_name": "Juan Pérez"
  },
  "status": "validated",
  "created_at": "2025-01-15T10:30:00Z",
  "qr_code": "QR_CODE_HERE"
}
```

### 4.4 Pagos

#### POST /api/payments/

```json
{
  "enrollment": 1,
  "amount": 50000,
  "payment_method": "transfer",
  "payment_date": "2025-01-20",
  "reference": "TRF-2025-001",
  "receipt": "base64_encoded_receipt"
}
```

#### GET /api/payments/

**Parámetros de consulta:**

- `enrollment`: ID de inscripción
- `status`: pending, confirmed, rejected
- `date_from`: fecha desde
- `date_to`: fecha hasta

---

## 5. Base de Datos

### 5.1 Configuración de Microsoft SQL Server

#### Ajustes iniciales recomendados (ejecutar con una cuenta `sysadmin`):

```sql
EXEC sp_configure 'show advanced options', 1;
RECONFIGURE;
EXEC sp_configure 'max degree of parallelism', 4;
RECONFIGURE;
EXEC sp_configure 'cost threshold for parallelism', 30;
RECONFIGURE;

ALTER DATABASE SGICS SET READ_COMMITTED_SNAPSHOT ON;
ALTER DATABASE SGICS SET AUTO_UPDATE_STATISTICS ON;
ALTER DATABASE SGICS SET RECOVERY SIMPLE;
```

#### Despliegue del modelo SAP PowerDesigner

Exportar el `.pdg` a T-SQL desde PowerDesigner y versionar los scripts en `database/schema/mssql`. El script principal crea las tablas con tipos `numeric(10)`, `varchar`, `bit` y `datetime`, respetando las claves primarias `PK_` y foráneas `FK_` descritas en el modelo.

### 5.2 Índices recomendados según el modelo

```sql
-- Búsqueda rápida de personas por RUN
CREATE INDEX IX_PERSONA_RUN ON PERSONA (PER_RUN, PER_DV);

-- Listado de cursos por estado y fechas
CREATE INDEX IX_CURSO_ESTADO ON CURSO (CUR_ESTADO, CUR_FECHA_HORA DESC);
CREATE INDEX IX_CURSO_SECCION_RAM ON CURSO_SECCION (RAM_ID, CUR_ID);

-- Inscritos y acreditaciones
CREATE INDEX IX_PERSONA_CURSO_ESTADO ON PERSONA_CURSO (PEC_ACREDITADO, PEC_REGISTRO);

-- Pagos
CREATE INDEX IX_PAGO_PERSONA_CURSO ON PAGO_PERSONA (CUR_ID, PER_ID, PAP_FECHA_HORA DESC);
CREATE INDEX IX_PREPAGO_ESTADO ON PREPAGO (CUR_ID, PPA_VIGENTE);

-- Auditoría de estados
CREATE INDEX IX_PERSONA_ESTADO_CURSO ON PERSONA_ESTADO_CURSO (PEC_ID, PEU_FECHA_HORA DESC);
```

### 5.3 Sincronización y reportes

```sql
-- Vista para estadísticas diarias de acreditaciones
CREATE OR ALTER VIEW VW_ACREDITACIONES_DIARIAS AS
SELECT
  c.CUR_ID,
  c.CUR_DESCRIPCION,
  CAST(peu.PEU_FECHA_HORA AS DATE) AS FECHA,
  peu.PEU_ESTADO,
  COUNT(*) AS TOTAL
FROM PERSONA_ESTADO_CURSO AS peu
INNER JOIN PERSONA_CURSO AS pec ON pec.PEC_ID = peu.PEC_ID
INNER JOIN CURSO AS c ON c.CUR_ID = pec.CUR_ID
GROUP BY c.CUR_ID, c.CUR_DESCRIPCION, CAST(peu.PEU_FECHA_HORA AS DATE), peu.PEU_ESTADO;

-- Job sugerido (SQL Server Agent) para refrescar reportes nocturnos
EXEC msdb.dbo.sp_add_job @job_name = N'RefreshReportesCursos';
```

---

## 6. Seguridad

### 6.1 Autenticación JWT

#### Configuración:

```python
# settings.py
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUTH_HEADER_TYPES': ('Bearer',),
}
```

### 6.2 Permisos y Roles

#### Definición de roles:

```python
# apps/users/models.py
class Role(models.Model):
    name = models.CharField(max_length=100, unique=True)
    permissions = models.JSONField(default=dict)

    ROLES = {
        'admin': {
            'permissions': ['*']  # Todos los permisos
        },
        'coordinator': {
            'permissions': [
                'courses.create', 'courses.update', 'courses.delete',
                'enrollments.validate', 'enrollments.reject',
                'reports.view'
            ]
        },
        'validator': {
            'permissions': [
                'enrollments.validate', 'enrollments.reject'
            ]
        },
        'participant': {
            'permissions': [
                'enrollments.create', 'enrollments.view_own'
            ]
        }
    }
```

### 6.3 Rate Limiting

```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/hour',
        'user': '1000/hour'
    }
}
```

---

## 7. Despliegue

### 7.1 Docker Compose

```yaml
# docker-compose.yml
version: "3.8"

services:
  db:
    image: mcr.microsoft.com/mssql/server:2022-latest
    environment:
      ACCEPT_EULA: "Y"
      MSSQL_PID: "Developer"
      SA_PASSWORD: Str0ngPass!2025
      MSSQL_DATABASE: SGICS
      MSSQL_USER: sgics_user
      MSSQL_PASSWORD: Str0ngPass!2025
    volumes:
      - mssql_data:/var/opt/mssql
      - ./database/schema/mssql/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    ports:
      - "1433:1433"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=mssql+pyodbc://sgics_user:Str0ngPass!2025@db,1433/SGICS?driver=ODBC+Driver+18+for+SQL+Server&TrustServerCertificate=yes
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis
    volumes:
      - ./backend:/app

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    environment:
      - VITE_API_URL=http://localhost:8000
    depends_on:
      - backend

volumes:
  mssql_data:
```

### 7.2 Scripts de Despliegue

#### deploy.sh:

```bash
#!/bin/bash
set -e

echo "Iniciando despliegue..."

# Backup de base de datos
echo "Creando backup..."
BACKUP_NAME="SGICS_$(date +%Y%m%d_%H%M%S).bak"
docker compose exec db /opt/mssql-tools/bin/sqlcmd \
  -S localhost -U sa -P "Str0ngPass!2025" \
  -Q "BACKUP DATABASE [SGICS] TO DISK = '/var/opt/mssql/backups/${BACKUP_NAME}' WITH INIT, COMPRESSION"
docker compose cp db:/var/opt/mssql/backups/${BACKUP_NAME} ./backups/${BACKUP_NAME}

# Actualizar código
echo "Actualizando código..."
git pull origin main

# Reconstruir contenedores
echo "Reconstruyendo contenedores..."
docker-compose build

# Ejecutar migraciones
echo "Ejecutando migraciones..."
docker-compose exec backend python manage.py migrate

# Recopilar archivos estáticos
echo "Recopilando archivos estáticos..."
docker-compose exec backend python manage.py collectstatic --noinput

# Reiniciar servicios
echo "Reiniciando servicios..."
docker-compose restart

echo "Despliegue completado!"
```

### 7.3 Pipeline CI/CD con SonarQube y Jira

1. **Build de ramas**: cada `push` a `develop` ejecuta lint, pruebas unitarias (`pytest`, `npm test`) y análisis estático en SonarQube. El Quality Gate debe aprobarse para continuar.
2. **Sincronización Jira**: los commits y PRs deben referenciar un issue (`PROY-XXX`); al completarse el pipeline se actualiza automáticamente el estado del ticket mediante las reglas de Jira Automation.
3. **Quality Gate**: se bloquea el despliegue si:
  - Cobertura < 80 %
  - Bugs/vulnerabilidades críticos > 0
  - Duplicación > 3 %
4. **Despliegue**: staging es automático tras pasar SonarQube; producción requiere release y aprobación manual registrada como “Deployment” en Jira.
5. **Reportes**: SonarQube emite informes semanales con deuda técnica, enviados al tablero operativo en Jira (`Dashboard SGICS`).

---

## 8. Monitoreo y Logs

### 8.1 Configuración de Logs

```python
# settings.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': 'logs/django.log',
            'formatter': 'verbose',
        },
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
        },
    },
    'root': {
        'handlers': ['console', 'file'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}
```

### 8.2 Métricas de Aplicación

```python
# apps/core/middleware.py
import time
from django.utils.deprecation import MiddlewareMixin

class MetricsMiddleware(MiddlewareMixin):
    def process_request(self, request):
        request.start_time = time.time()

    def process_response(self, request, response):
        if hasattr(request, 'start_time'):
            duration = time.time() - request.start_time
            # Enviar métrica a Prometheus
            self.record_metric(request, response, duration)
        return response
```

---

## 9. Troubleshooting

### 9.1 Problemas Comunes

#### Error de conexión a base de datos:

```bash
# Verificar estado de SQL Server
docker compose exec db /opt/mssql-tools/bin/sqlcmd \
  -S localhost -U sa -P "Str0ngPass!2025" -Q "SELECT @@SERVERNAME AS instancia, SYSDATETIME() AS fecha"

# Verificar logs
docker compose logs db

# Reiniciar servicio
docker compose restart db
```

#### Error de migraciones:

```bash
# Verificar migraciones pendientes
python manage.py showmigrations

# Aplicar migraciones específicas
python manage.py migrate app_name migration_name

# Resetear migraciones (solo desarrollo)
python manage.py migrate app_name zero
```

#### Problemas de memoria:

```bash
# Verificar uso de memoria
docker stats

# Limpiar contenedores no utilizados
docker system prune -a

# Aumentar memoria en docker-compose.yml
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 1G
```

### 9.2 Logs de Debugging

```bash
# Ver logs en tiempo real
docker compose logs -f backend

# Ver logs de un servicio específico
docker compose logs backend | Select-String ERROR

# Ver logs de base de datos
docker compose logs db | Select-String ERROR
```

---

## 10. Mantenimiento

### 10.1 Backup Automático

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="SGICS"
SA_PASSWORD="Str0ngPass!2025"

# Backup de base de datos
docker compose exec -T db /opt/mssql-tools/bin/sqlcmd \
  -S localhost -U sa -P "$SA_PASSWORD" \
  -Q "BACKUP DATABASE [$DB_NAME] TO DISK = '/var/opt/mssql/backups/${DB_NAME}_${DATE}.bak' WITH INIT, COMPRESSION"
docker compose cp db:/var/opt/mssql/backups/${DB_NAME}_${DATE}.bak $BACKUP_DIR/${DB_NAME}_${DATE}.bak

# Backup de archivos
tar -czf $BACKUP_DIR/files_backup_$DATE.tar.gz /app/media/

# Limpiar backups antiguos (más de 30 días)
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "Backup completado: $DATE"
```

### 10.2 Tareas de Mantenimiento

#### Limpieza de logs:

```bash
# Limpiar logs antiguos
find /var/log -name "*.log" -mtime +30 -delete

# Rotar logs de Django
logrotate /etc/logrotate.d/django
```

#### Optimización de base de datos:

```sql
-- Analizar tablas
ANALYZE;

-- Reindexar tablas
REINDEX DATABASE scout_db;

-- Limpiar espacio no utilizado
VACUUM FULL;
```

---
