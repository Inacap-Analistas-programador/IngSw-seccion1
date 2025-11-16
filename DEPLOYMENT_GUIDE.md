# 🚀 Guía de Deployment - Plataforma GIC

Guía completa para desplegar la Plataforma GIC en producción.

## 📋 Tabla de Contenidos

- [Requisitos](#requisitos)
- [Preparación del Servidor](#preparación-del-servidor)
- [Configuración de Producción](#configuración-de-producción)
- [Deployment con Docker](#deployment-con-docker)
- [Monitoreo](#monitoreo)
- [Mantenimiento](#mantenimiento)
- [Troubleshooting](#troubleshooting)

---

## 🔧 Requisitos

### Hardware Mínimo (Producción)
- **CPU**: 4 cores
- **RAM**: 8 GB
- **Disco**: 100 GB SSD
- **Red**: 100 Mbps

### Hardware Recomendado (Producción)
- **CPU**: 8 cores
- **RAM**: 16 GB
- **Disco**: 500 GB SSD
- **Red**: 1 Gbps

### Software
- Ubuntu 20.04 LTS o superior
- Docker 24.0+
- Docker Compose 2.0+
- Git
- Dominio con SSL/TLS

---

## 🖥️ Preparación del Servidor

### 1. Actualizar el Sistema

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Instalar Docker

```bash
# Instalar dependencias
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Agregar repositorio de Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instalar Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Agregar usuario al grupo docker
sudo usermod -aG docker $USER
newgrp docker

# Verificar instalación
docker --version
docker compose version
```

### 3. Configurar Firewall

```bash
# Permitir SSH, HTTP y HTTPS
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

### 4. Clonar el Repositorio

```bash
cd /opt
sudo git clone <repository-url> GIC
cd GIC
sudo chown -R $USER:$USER /opt/GIC
```

---

## ⚙️ Configuración de Producción

### 1. Configurar Variables de Entorno

```bash
# Copiar el archivo de ejemplo
cp .env.production.example .env

# Editar el archivo .env
nano .env
```

**Variables críticas a configurar:**

```bash
# Base de Datos
MYSQL_ROOT_PASSWORD=<contraseña-root-segura>
MYSQL_DATABASE=GIC_prod
MYSQL_USER=GIC_user
MYSQL_PASSWORD=<contraseña-segura>

# Django
SECRET_KEY=<generar-clave-secreta-50-caracteres>
DEBUG=False
ALLOWED_HOSTS=tudominio.com,www.tudominio.com

# Redis
REDIS_URL=redis://redis:6379/0
```

**Generar SECRET_KEY:**
```bash
python3 -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

### 2. Configurar SSL/TLS (Let's Encrypt)

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtener certificado
sudo certbot certonly --standalone -d tudominio.com -d www.tudominio.com

# Los certificados estarán en:
# /etc/letsencrypt/live/tudominio.com/fullchain.pem
# /etc/letsencrypt/live/tudominio.com/privkey.pem
```

### 3. Actualizar Configuración de Nginx

Editar `nginx/prod.conf` para incluir SSL:

```nginx
server {
    listen 80;
    server_name tudominio.com www.tudominio.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name tudominio.com www.tudominio.com;

    ssl_certificate /etc/letsencrypt/live/tudominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tudominio.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # ... resto de la configuración
}
```

---

## 🐳 Deployment con Docker

### Opción 1: Script Automático (Recomendado)

```bash
# Ejecutar script de deployment
./scripts/deploy-production.sh
```

El script automáticamente:
- ✅ Crea backup de la base de datos
- ✅ Construye las imágenes Docker
- ✅ Inicia los contenedores
- ✅ Ejecuta migraciones
- ✅ Recopila archivos estáticos
- ✅ Verifica que todo funcione

### Opción 2: Manual

```bash
# 1. Construir imágenes
docker compose -f docker-compose.prod.yml build

# 2. Iniciar servicios
docker compose -f docker-compose.prod.yml up -d

# 3. Ejecutar migraciones
docker compose -f docker-compose.prod.yml exec backend python manage.py migrate

# 4. Recopilar estáticos
docker compose -f docker-compose.prod.yml exec backend python manage.py collectstatic --noinput

# 5. Crear superusuario
docker compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser

# 6. Verificar servicios
docker compose -f docker-compose.prod.yml ps
```

### Verificar Deployment

```bash
# Health check
curl http://localhost/health

# API check
curl http://localhost/api/

# Frontend check
curl http://localhost/
```

---

## 📊 Monitoreo

### Iniciar Stack de Monitoreo

```bash
cd monitoring
docker compose -f docker-compose.monitoring.yml up -d
```

### Acceder a Servicios de Monitoreo

- **Prometheus**: http://servidor:9090
- **Grafana**: http://servidor:3001
  - Usuario: admin
  - Contraseña: (configurada en .env o "admin" por defecto)
- **Alertmanager**: http://servidor:9093

### Configurar Grafana

1. Login a Grafana
2. Agregar Prometheus como Data Source:
   - URL: http://prometheus:9090
3. Importar dashboards predefinidos
4. Configurar alertas

### Script de Performance Check

```bash
# Verificar rendimiento del sistema
./scripts/performance-check.sh
```

---

## 🔧 Mantenimiento

### Backups Automáticos

**Configurar Cron Job:**

```bash
# Editar crontab
crontab -e

# Agregar backup diario a las 2 AM
0 2 * * * /opt/GIC/scripts/backup.sh >> /var/log/GIC-backup.log 2>&1
```

**Backup Manual:**

```bash
./scripts/backup.sh
```

Los backups se guardan en `/backups/GIC/` y se mantienen por 30 días.

### Actualizar la Aplicación

```bash
# 1. Pull de cambios
git pull origin main

# 2. Ejecutar deployment
./scripts/deploy-production.sh
```

### Ver Logs

```bash
# Todos los servicios
docker compose -f docker-compose.prod.yml logs -f

# Solo backend
docker compose -f docker-compose.prod.yml logs -f backend

# Solo frontend
docker compose -f docker-compose.prod.yml logs -f frontend

# Últimas 100 líneas
docker compose -f docker-compose.prod.yml logs --tail=100
```

### Reiniciar Servicios

```bash
# Reiniciar todo
docker compose -f docker-compose.prod.yml restart

# Reiniciar un servicio específico
docker compose -f docker-compose.prod.yml restart backend
```

### Escalar Servicios

```bash
# Escalar backend a 4 instancias
docker compose -f docker-compose.prod.yml up -d --scale backend=4
```

---

## 🚨 Troubleshooting

### Problema: Contenedores no inician

```bash
# Ver logs de error
docker compose -f docker-compose.prod.yml logs

# Verificar configuración
docker compose -f docker-compose.prod.yml config

# Recrear contenedores
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d --force-recreate
```

### Problema: Base de datos no conecta

```bash
# Verificar que MySQL esté corriendo
docker compose -f docker-compose.prod.yml ps mysql

# Ver logs de MySQL
docker compose -f docker-compose.prod.yml logs mysql

# Conectar manualmente a MySQL
docker compose -f docker-compose.prod.yml exec mysql mysql -u root -p
```

### Problema: Error 502 Bad Gateway

```bash
# Verificar que backend esté corriendo
docker compose -f docker-compose.prod.yml ps backend

# Ver logs de backend
docker compose -f docker-compose.prod.yml logs backend

# Verificar health check
curl http://backend:8000/api/
```

### Problema: Espacio en disco lleno

```bash
# Ver uso de disco
df -h

# Limpiar imágenes y contenedores no usados
docker system prune -a --volumes

# Limpiar backups antiguos manualmente
find /backups/GIC -name "GIC_*" -mtime +30 -delete
```

### Rollback a Versión Anterior

```bash
# 1. Detener contenedores
docker compose -f docker-compose.prod.yml down

# 2. Volver a commit anterior
git log --oneline  # Ver commits
git checkout <commit-hash>

# 3. Restaurar backup de BD
docker compose -f docker-compose.prod.yml up -d mysql
docker exec -i GIC_mysql mysql -u root -p$MYSQL_ROOT_PASSWORD $MYSQL_DATABASE < /backups/GIC/GIC_backup_YYYYMMDD_HHMMSS.sql

# 4. Rebuild y reiniciar
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
```

---

## 📈 Optimizaciones de Producción

### 1. Cache con Redis

Ya está configurado en `docker-compose.prod.yml`. Redis mejora el rendimiento de:
- Sesiones de usuario
- Cache de queries
- Rate limiting

### 2. CDN para Archivos Estáticos

Configurar un CDN (Cloudflare, AWS CloudFront) para servir:
- Archivos estáticos (/static/)
- Media files (/media/)
- Frontend assets

### 3. Load Balancer

Para alta disponibilidad, configurar Nginx como load balancer:

```nginx
upstream backend {
    least_conn;
    server backend1:8000;
    server backend2:8000;
    server backend3:8000;
}
```

### 4. Database Replication

Configurar MySQL master-slave replication para:
- Alta disponibilidad
- Distribución de carga de lectura
- Backup en tiempo real

---

## 📞 Soporte

Para problemas o consultas:
- 📧 Email: soporte@gic.scouts.cl
- 📚 Documentación: `/opt/GIC/docs/`
- 🐛 Issues: GitHub Issues

---

**Fecha**: 2025-11-15  
**Versión**: 1.0.0  
**Última actualización**: 2025-11-15
