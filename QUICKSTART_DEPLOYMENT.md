# 🚀 Guía de Inicio Rápido - Despliegue de GIC

Esta guía te permite desplegar GIC en producción en **menos de 10 minutos**.

---

## ⚡ Inicio Rápido (3 Comandos)

```bash
# 1. Configurar variables de entorno
cp .env.production.example .env
nano .env  # Editar valores críticos

# 2. Desplegar aplicación
./scripts/deploy-production.sh

# 3. (Opcional) Agregar monitoreo
./scripts/start-with-monitoring.sh
```

**¡Listo!** Tu aplicación está corriendo en http://localhost

---

## 📋 Requisitos Previos

- Docker 24.0+
- Docker Compose 2.20+
- 4GB RAM mínimo
- 20GB disco disponible

### Instalar Docker (Ubuntu/Debian)

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

---

## 🔧 Configuración Rápida

### 1. Variables de Entorno Críticas

Edita `.env` y cambia estos valores:

```bash
# 🔑 Genera una clave secreta segura
SECRET_KEY=$(python3 -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')

# 🔐 Contraseñas seguras (mínimo 20 caracteres)
MYSQL_ROOT_PASSWORD=tu_password_mysql_root_muy_seguro_123456
MYSQL_PASSWORD=tu_password_mysql_usuario_seguro_123456

# 🌐 Tu dominio
ALLOWED_HOSTS=tudominio.com,www.tudominio.com
```

### 2. Configurar Firewall

```bash
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

---

## 🎯 Comandos Esenciales

### Despliegue

```bash
# Despliegue completo con verificaciones
./scripts/deploy-production.sh

# Despliegue con monitoreo
./scripts/start-with-monitoring.sh
```

### Verificación

```bash
# Health check
curl http://localhost/health

# Ver servicios corriendo
docker-compose -f docker-compose.prod.yml ps

# Ver logs en tiempo real
docker-compose -f docker-compose.prod.yml logs -f
```

### Mantenimiento

```bash
# Backup de base de datos
./scripts/backup.sh

# Performance check
./scripts/performance-check.sh

# Detener servicios
./scripts/stop-all.sh

# Detener y limpiar todo
./scripts/stop-all.sh --clean
```

### Rollback

```bash
# Revertir a versión anterior
./scripts/deploy-production.sh --rollback
```

---

## 🌐 URLs de Acceso

### Aplicación Principal

- **Frontend**: http://localhost
- **API**: http://localhost/api/
- **Admin Panel**: http://localhost/admin/
- **API Docs**: http://localhost/api/swagger/
- **Health Check**: http://localhost/health

### Monitoreo (si está habilitado)

- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3001 (admin/admin)
- **Alertmanager**: http://localhost:9093
- **Node Exporter**: http://localhost:9100/metrics
- **cAdvisor**: http://localhost:8080

---

## 🔐 Seguridad Básica

### 1. Cambiar Contraseñas por Defecto

```bash
# Grafana (accede a http://localhost:3001)
Usuario: admin
Contraseña: admin (cambiar en primer login)
```

### 2. Habilitar SSL/TLS (Recomendado)

```bash
# Obtener certificado Let's Encrypt
sudo apt-get install certbot
sudo certbot certonly --standalone -d tudominio.com

# Actualizar nginx/prod.conf con rutas de certificados
# Reiniciar nginx
docker-compose -f docker-compose.prod.yml restart nginx
```

### 3. Configurar Backups Automáticos

```bash
# Agregar a crontab
crontab -e

# Backup diario a las 2 AM
0 2 * * * /ruta/a/IngSw-seccion1/scripts/backup.sh
```

---

## 📊 Verificar que Todo Funciona

### Test de Endpoints

```bash
# Health check principal
curl http://localhost/health
# Debe devolver: healthy

# API health
curl http://localhost/api/health/
# Debe devolver: {"status": "healthy"}

# Frontend cargando
curl -I http://localhost
# Debe devolver: 200 OK
```

### Ver Estado de Contenedores

```bash
docker ps
```

Deberías ver estos contenedores corriendo:
- GIC_nginx
- GIC_backend
- GIC_frontend
- GIC_mysql
- GIC_redis

### Ver Uso de Recursos

```bash
docker stats
```

---

## 🔍 Solución Rápida de Problemas

### Contenedor no inicia

```bash
# Ver logs
docker logs GIC_backend

# Reiniciar contenedor
docker-compose -f docker-compose.prod.yml restart backend
```

### Puerto 80 en uso

```bash
# Ver qué está usando el puerto
sudo lsof -i :80

# Detener servicio anterior
sudo systemctl stop apache2  # Si es Apache
sudo systemctl stop nginx    # Si es Nginx del sistema
```

### Error de base de datos

```bash
# Verificar MySQL
docker logs GIC_mysql

# Conectar manualmente
docker exec -it GIC_mysql mysql -u root -p
```

### Poco espacio en disco

```bash
# Limpiar imágenes no usadas
docker system prune -a

# Ver uso de disco
df -h
```

---

## 📱 Acceso desde Otros Dispositivos

Para acceder desde otros dispositivos en tu red local:

```bash
# Obtener IP del servidor
ip addr show

# Acceder desde otro dispositivo
http://192.168.x.x
```

Para acceso desde Internet, necesitas:
1. IP pública o dominio
2. Redireccionamiento de puertos en tu router (80, 443)
3. Certificado SSL (Let's Encrypt)

---

## 📈 Próximos Pasos

1. **Configurar SSL/TLS** para producción
2. **Configurar email** para notificaciones
3. **Configurar alertas** en Alertmanager
4. **Personalizar Grafana dashboards**
5. **Configurar backups automáticos**
6. **Optimizar para tu tráfico** (ajustar workers, memoria, etc.)

---

## 📚 Documentación Completa

Para información detallada, ver:
- **[DEPLOYMENT_PRODUCTION.md](DEPLOYMENT_PRODUCTION.md)** - Guía completa de despliegue
- **[README.md](README.md)** - Documentación general
- **[SECURITY_GUIDE.md](frontend/SECURITY_GUIDE.md)** - Guía de seguridad

---

## 🆘 ¿Necesitas Ayuda?

1. Revisa los logs: `docker-compose logs -f`
2. Verifica el health check: `curl http://localhost/health`
3. Consulta la documentación completa
4. Abre un issue en GitHub

---

## ✅ Checklist de Despliegue

- [ ] Docker y Docker Compose instalados
- [ ] Archivo `.env` configurado
- [ ] Firewall configurado
- [ ] Variables críticas cambiadas (SECRET_KEY, passwords)
- [ ] Despliegue ejecutado exitosamente
- [ ] Health checks pasando
- [ ] Endpoints respondiendo correctamente
- [ ] SSL/TLS configurado (producción)
- [ ] Backups configurados
- [ ] Monitoreo activo (opcional)

---

**🎉 ¡Felicidades! Tu aplicación GIC está en producción** 

Sistema protegido ✅ | Rápido ✅ | Eficaz ✅
