# Guía Completa de Despliegue de GIC
## Sistema de Gestión Integral para Campamentos

---

## 📋 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Requisitos del Sistema](#requisitos-del-sistema)
3. [Arquitectura de Despliegue](#arquitectura-de-despliegue)
4. [Preparación del Entorno](#preparación-del-entorno)
5. [Despliegue Paso a Paso](#despliegue-paso-a-paso)
6. [Configuración de Seguridad](#configuración-de-seguridad)
7. [Monitoreo y Observabilidad](#monitoreo-y-observabilidad)
8. [Mantenimiento y Operaciones](#mantenimiento-y-operaciones)
9. [Solución de Problemas](#solución-de-problemas)
10. [Optimización de Rendimiento](#optimización-de-rendimiento)

---

## 🎯 Introducción

Este documento proporciona una guía completa para el despliegue de la aplicación GIC (Gestión Integral de Campamentos) en un entorno de producción seguro, rápido y eficaz.

### Características del Sistema de Despliegue

- ✅ **Containerización con Docker**: Aislamiento y portabilidad
- ✅ **Multi-stage builds**: Optimización de imágenes
- ✅ **Non-root containers**: Seguridad mejorada
- ✅ **Health checks**: Monitoreo automático
- ✅ **Rate limiting**: Protección contra DDoS
- ✅ **Resource limits**: Uso eficiente de recursos
- ✅ **Rollback automático**: Recuperación ante fallos
- ✅ **Zero-downtime deployment**: Disponibilidad continua
- ✅ **Monitoring stack completo**: Prometheus + Grafana + Alertmanager

---

## 💻 Requisitos del Sistema

### Hardware Mínimo (Desarrollo/Staging)

- **CPU**: 2 cores
- **RAM**: 4 GB
- **Disco**: 20 GB SSD
- **Red**: 10 Mbps

### Hardware Recomendado (Producción)

- **CPU**: 4+ cores
- **RAM**: 8+ GB
- **Disco**: 50+ GB SSD
- **Red**: 100+ Mbps

### Software Requerido

```bash
# Sistema Operativo
- Ubuntu 20.04 LTS o superior
- Debian 11 o superior
- CentOS 8 o superior

# Docker
Docker Engine 24.0+
Docker Compose 2.20+

# Herramientas adicionales
curl
wget
git
openssl
```

### Instalación de Dependencias

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y \
    docker.io \
    docker-compose \
    curl \
    wget \
    git \
    openssl

# Iniciar Docker
sudo systemctl start docker
sudo systemctl enable docker

# Agregar usuario al grupo docker
sudo usermod -aG docker $USER
```

---

## 🏗️ Arquitectura de Despliegue

### Componentes del Sistema

```
┌─────────────────────────────────────────────────────────┐
│                    Nginx (Reverse Proxy)                 │
│           - Rate Limiting                                │
│           - SSL/TLS Termination                          │
│           - Compression & Caching                        │
└────────────────┬──────────────────┬─────────────────────┘
                 │                  │
        ┌────────▼────────┐  ┌─────▼──────┐
        │   Frontend      │  │  Backend   │
        │   (React/Vite)  │  │  (Django)  │
        │   Port: 80      │  │  Port: 8000│
        └─────────────────┘  └─────┬──────┘
                                    │
                 ┌──────────────────┴────────────┐
                 │                               │
         ┌───────▼────────┐           ┌─────────▼────────┐
         │    MySQL 8.0    │           │   Redis 7.x     │
         │    Port: 3306   │           │   Port: 6379    │
         └─────────────────┘           └──────────────────┘

┌─────────────────────────────────────────────────────────┐
│              Monitoring Stack (Opcional)                 │
│  - Prometheus (Port: 9090)                              │
│  - Grafana (Port: 3001)                                 │
│  - Alertmanager (Port: 9093)                            │
│  - Node Exporter (Port: 9100)                           │
│  - cAdvisor (Port: 8080)                                │
└─────────────────────────────────────────────────────────┘
```

### Flujo de Red

1. **Cliente** → Nginx (Puerto 80/443)
2. **Nginx** → Frontend (SPA estático)
3. **Nginx** → Backend (API /api/*)
4. **Backend** → MySQL (Datos)
5. **Backend** → Redis (Cache/Sesiones)
6. **Prometheus** → Todos (Métricas)

---

## 🔧 Preparación del Entorno

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Inacap-Analistas-programador/IngSw-seccion1.git
cd IngSw-seccion1
```

### 2. Configurar Variables de Entorno

```bash
# Copiar el archivo de ejemplo
cp .env.production.example .env

# Editar con tus valores de producción
nano .env
```

#### Variables Críticas a Configurar

```bash
# ⚠️ IMPORTANTE: Cambiar estos valores
SECRET_KEY=genera_una_clave_segura_de_50_caracteres_minimo
MYSQL_ROOT_PASSWORD=password_mysql_root_muy_seguro_123
MYSQL_PASSWORD=password_mysql_usuario_muy_seguro_123

# Configurar dominio
ALLOWED_HOSTS=tudominio.com,www.tudominio.com

# Email (si es necesario)
EMAIL_HOST_USER=tu_email@gmail.com
EMAIL_HOST_PASSWORD=tu_app_password
```

#### Generar SECRET_KEY Segura

```bash
python3 -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

### 3. Configurar Firewall

```bash
# UFW (Ubuntu/Debian)
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable

# Opcional: Monitoring
sudo ufw allow 9090/tcp  # Prometheus
sudo ufw allow 3001/tcp  # Grafana
```

### 4. Verificar Puertos Disponibles

```bash
# Verificar que los puertos estén libres
sudo netstat -tlnp | grep -E ':80|:443|:3306|:6379'
```

---

## 🚀 Despliegue Paso a Paso

### Opción 1: Despliegue Rápido (Recomendado)

```bash
# Despliegue de producción con un solo comando
./scripts/deploy-production.sh
```

Este script realiza:
- ✅ Verificación de prerrequisitos
- ✅ Backup automático de base de datos
- ✅ Build de imágenes optimizadas
- ✅ Health checks completos
- ✅ Rollback automático en caso de fallo

### Opción 2: Despliegue Manual

```bash
# 1. Build de imágenes
docker-compose -f docker-compose.prod.yml build

# 2. Iniciar servicios
docker-compose -f docker-compose.prod.yml up -d

# 3. Verificar estado
docker-compose -f docker-compose.prod.yml ps

# 4. Ver logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Opción 3: Despliegue con Monitoreo

```bash
# Iniciar aplicación + stack de monitoreo
./scripts/start-with-monitoring.sh
```

### Verificar Despliegue Exitoso

```bash
# Health check
curl http://localhost/health

# API health
curl http://localhost/api/health/

# Verificar contenedores
docker ps

# Verificar logs
docker-compose -f docker-compose.prod.yml logs --tail=50
```

---

## 🔐 Configuración de Seguridad

### 1. SSL/TLS (HTTPS)

#### Opción A: Certificado Let's Encrypt (Recomendado)

```bash
# Instalar Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtener certificado
sudo certbot certonly --standalone -d tudominio.com -d www.tudominio.com

# Los certificados se guardan en:
# /etc/letsencrypt/live/tudominio.com/
```

#### Opción B: Certificado Autofirmado (Solo Desarrollo)

```bash
# Generar certificado autofirmado
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/gic.key \
  -out /etc/ssl/certs/gic.crt
```

#### Configurar Nginx para HTTPS

Editar `nginx/prod.conf` y descomentar la sección de HTTPS:

```nginx
server {
    listen 443 ssl http2;
    server_name tudominio.com;

    ssl_certificate /etc/ssl/certs/gic.crt;
    ssl_certificate_key /etc/ssl/private/gic.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
    
    # ... resto de configuración
}
```

### 2. Actualizar Variables de Seguridad

```bash
# En .env, habilitar SSL
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
```

### 3. Hardening de Base de Datos

```bash
# Conectar a MySQL
docker exec -it GIC_mysql mysql -u root -p

# Ejecutar en MySQL:
DELETE FROM mysql.user WHERE User='';
DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1');
DROP DATABASE IF EXISTS test;
DELETE FROM mysql.db WHERE Db='test' OR Db='test\\_%';
FLUSH PRIVILEGES;
```

### 4. Rate Limiting

El sistema ya incluye rate limiting en Nginx:

- **API General**: 60 requests/minuto
- **Login**: 5 requests/minuto
- **Burst**: 10-20 requests

### 5. Backups Automáticos

```bash
# Configurar cron para backups diarios
crontab -e

# Agregar línea:
0 2 * * * /path/to/IngSw-seccion1/scripts/backup.sh
```

---

## 📊 Monitoreo y Observabilidad

### Acceder a Herramientas de Monitoreo

```bash
# Prometheus (Métricas)
http://localhost:9090

# Grafana (Dashboards)
http://localhost:3001
Usuario: admin
Contraseña: admin (cambiar en primer acceso)

# Alertmanager (Alertas)
http://localhost:9093
```

### Configurar Dashboards en Grafana

1. **Login en Grafana**: http://localhost:3001
2. **Agregar Prometheus como datasource** (ya configurado automáticamente)
3. **Importar dashboards**:
   - Docker Container Metrics: ID 193
   - Node Exporter Full: ID 1860
   - MySQL Overview: ID 7362

### Configurar Alertas

Las alertas están configuradas en `monitoring/alert_rules.yml`:

- ❗ Alto tiempo de respuesta (>500ms)
- ❗ Alta tasa de errores (>5%)
- ❗ MySQL down
- ❗ Alto uso de CPU (>80%)
- ❗ Alto uso de memoria (>1GB)
- ❗ Poco espacio en disco (<10%)

### Ver Métricas en Tiempo Real

```bash
# Métricas del sistema
curl http://localhost:9100/metrics

# Métricas de contenedores
curl http://localhost:8080/metrics

# Métricas del backend (si está configurado)
curl http://localhost/api/metrics/
```

---

## 🔧 Mantenimiento y Operaciones

### Backup Manual

```bash
# Ejecutar script de backup
./scripts/backup.sh

# Backups se guardan en:
/backups/GIC/
```

### Restaurar desde Backup

```bash
# 1. Detener servicios
docker-compose -f docker-compose.prod.yml down

# 2. Restaurar base de datos
gunzip /backups/GIC/GIC_backup_YYYYMMDD_HHMMSS.sql.gz
docker exec -i GIC_mysql mysql -u root -p$MYSQL_ROOT_PASSWORD $MYSQL_DATABASE < /backups/GIC/GIC_backup_YYYYMMDD_HHMMSS.sql

# 3. Reiniciar servicios
docker-compose -f docker-compose.prod.yml up -d
```

### Actualizar Aplicación

```bash
# 1. Pull de cambios
git pull origin main

# 2. Desplegar nueva versión
./scripts/deploy-production.sh
```

### Rollback a Versión Anterior

```bash
# Rollback automático
./scripts/deploy-production.sh --rollback
```

### Ver Logs

```bash
# Logs de todos los servicios
docker-compose -f docker-compose.prod.yml logs -f

# Logs de un servicio específico
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
docker-compose -f docker-compose.prod.yml logs -f nginx

# Últimas 100 líneas
docker-compose -f docker-compose.prod.yml logs --tail=100
```

### Limpiar Sistema

```bash
# Detener servicios
./scripts/stop-all.sh

# Detener y limpiar todo (incluyendo volúmenes)
./scripts/stop-all.sh --clean
```

### Verificar Performance

```bash
# Ejecutar script de performance
./scripts/performance-check.sh
```

---

## 🔍 Solución de Problemas

### Problema: Contenedor no inicia

```bash
# Ver logs del contenedor
docker logs GIC_backend
docker logs GIC_frontend
docker logs GIC_mysql

# Verificar configuración
docker inspect GIC_backend
```

### Problema: Error de conexión a base de datos

```bash
# Verificar que MySQL esté corriendo
docker ps | grep mysql

# Verificar logs de MySQL
docker logs GIC_mysql

# Conectar manualmente para probar
docker exec -it GIC_mysql mysql -u root -p
```

### Problema: Puerto en uso

```bash
# Identificar proceso usando el puerto
sudo lsof -i :80
sudo lsof -i :3306

# Matar proceso si es necesario
sudo kill -9 <PID>
```

### Problema: Falta de espacio en disco

```bash
# Ver uso de disco
df -h

# Limpiar imágenes no utilizadas
docker system prune -a

# Limpiar volúmenes no utilizados
docker volume prune
```

### Problema: Alto uso de memoria

```bash
# Ver uso de recursos
docker stats

# Reiniciar contenedor específico
docker-compose -f docker-compose.prod.yml restart backend
```

---

## ⚡ Optimización de Rendimiento

### 1. Configuración de Gunicorn

En `docker-compose.prod.yml`, ajustar workers:

```bash
# Fórmula: (2 x CPU cores) + 1
GUNICORN_WORKERS=9  # Para servidor de 4 cores
```

### 2. Optimización de MySQL

Ver `mysql/my.cnf` para configuraciones optimizadas.

Para servidores con más RAM:

```ini
innodb_buffer_pool_size = 2G  # Para servidores con 8GB+ RAM
```

### 3. Cache de Nginx

Ya configurado en `nginx/prod.conf`:

- Cache de archivos estáticos: 1 año
- Cache de media: 30 días
- Cache de API: Deshabilitado

### 4. Compresión

Gzip ya está habilitado en Nginx para:
- HTML, CSS, JS
- JSON, XML
- Fuentes
- SVG

### 5. Monitoreo de Performance

```bash
# Ver tiempo de respuesta de endpoints
for endpoint in "/api/health/" "/api/cursos/" "/api/auth/user/"; do
    time=$(curl -o /dev/null -s -w '%{time_total}\n' "http://localhost$endpoint")
    echo "$endpoint: ${time}s"
done
```

---

## 📞 Soporte

Para problemas o preguntas:

- **Issues**: https://github.com/Inacap-Analistas-programador/IngSw-seccion1/issues
- **Documentación**: Ver carpeta `/docs`
- **Logs**: Revisar `/var/log/GIC-deploy.log`

---

## 🎉 Conclusión

Con esta guía, tu aplicación GIC está:

- ✅ **Protegida**: Rate limiting, SSL/TLS, headers de seguridad
- ✅ **Rápida**: Cache optimizado, compresión, resource limits
- ✅ **Eficaz**: Health checks, rollback automático, monitoring

**¡Feliz despliegue!** 🚀
