# ✅ Checklist de Preparación para Producción - GIC

Este checklist asegura que tu aplicación está lista para producción de forma segura, rápida y eficaz.

---

## 🔐 Seguridad

### Variables de Entorno y Secretos

- [ ] **SECRET_KEY** generada aleatoriamente (mínimo 50 caracteres)
  ```bash
  python3 -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
  ```
- [ ] **MYSQL_ROOT_PASSWORD** cambiada (mínimo 20 caracteres, mezcla de caracteres)
- [ ] **MYSQL_PASSWORD** cambiada (diferente a root password)
- [ ] **GRAFANA_PASSWORD** cambiada
- [ ] **DEBUG** establecido en `False`
- [ ] **.env** NO está en el repositorio (verificar .gitignore)
- [ ] Credenciales de email configuradas correctamente

### SSL/TLS

- [ ] Certificado SSL obtenido (Let's Encrypt o comercial)
- [ ] Certificado SSL configurado en nginx
- [ ] **SECURE_SSL_REDIRECT** establecido en `True`
- [ ] **SESSION_COOKIE_SECURE** establecido en `True`
- [ ] **CSRF_COOKIE_SECURE** establecido en `True`
- [ ] HSTS habilitado (31536000 segundos = 1 año)
- [ ] Redirección HTTP → HTTPS configurada

### Firewall y Red

- [ ] Firewall configurado (UFW o similar)
- [ ] Solo puertos necesarios abiertos (22, 80, 443)
- [ ] Puertos de monitoreo protegidos o solo accesibles internamente
- [ ] SSH configurado con clave pública (sin password)
- [ ] SSH puerto cambiado de 22 (opcional pero recomendado)

### Base de Datos

- [ ] Usuario root de MySQL solo accesible desde localhost
- [ ] Usuarios y bases de datos de prueba eliminados
- [ ] Base de datos de prueba eliminada
- [ ] Privilegios mínimos para usuario de aplicación
- [ ] Backups automatizados configurados

### Contraseñas y Accesos

- [ ] Contraseña de admin de Django cambiada
- [ ] Contraseña de Grafana cambiada en primer acceso
- [ ] Acceso SSH configurado con claves (no passwords)
- [ ] Fail2ban instalado y configurado (opcional)

---

## ⚡ Rendimiento

### Recursos del Servidor

- [ ] RAM suficiente (mínimo 4GB, recomendado 8GB+)
- [ ] CPU suficiente (mínimo 2 cores, recomendado 4+)
- [ ] Espacio en disco suficiente (mínimo 20GB, recomendado 50GB+)
- [ ] Swap configurado (recomendado: 2x RAM)

### Optimización de Docker

- [ ] Resource limits configurados en docker-compose
- [ ] Health checks funcionando correctamente
- [ ] Images optimizadas (multi-stage builds)
- [ ] Volúmenes persistentes para datos importantes

### Optimización de Servicios

- [ ] **Gunicorn workers** ajustados según CPU cores
  ```bash
  # Fórmula: (2 x CPU cores) + 1
  GUNICORN_WORKERS=9  # Para 4 cores
  ```
- [ ] **MySQL buffer pool** ajustado según RAM disponible
- [ ] **Redis maxmemory** configurado apropiadamente
- [ ] **Nginx caching** habilitado y verificado

### Compresión y Cache

- [ ] Gzip habilitado en Nginx
- [ ] Archivos estáticos con cache headers apropiados
- [ ] CDN configurado (opcional para tráfico alto)

---

## 📊 Monitoreo y Logs

### Sistema de Monitoreo

- [ ] Prometheus corriendo y recolectando métricas
- [ ] Grafana accesible y configurado
- [ ] Dashboards importados en Grafana
- [ ] Alertmanager configurado
- [ ] Node Exporter recolectando métricas del sistema
- [ ] cAdvisor monitoreando contenedores

### Alertas

- [ ] Alertas configuradas para:
  - [ ] Alto tiempo de respuesta
  - [ ] Alta tasa de errores
  - [ ] Base de datos down
  - [ ] Alto uso de CPU
  - [ ] Alto uso de memoria
  - [ ] Poco espacio en disco
- [ ] Canal de notificación configurado (email, Slack, etc.)

### Logs

- [ ] Logs centralizados y accesibles
- [ ] Rotación de logs configurada
- [ ] Nivel de log apropiado (INFO en producción)
- [ ] Logs de acceso de Nginx habilitados

---

## 🔄 Backup y Recuperación

### Backups

- [ ] Script de backup funcionando
- [ ] Backups automáticos configurados (cron)
- [ ] Backups probados (restauración exitosa)
- [ ] Retención de backups configurada (ej: 30 días)
- [ ] Backups almacenados en ubicación segura
- [ ] Backups de base de datos
- [ ] Backups de archivos de media
- [ ] Backups de configuraciones

### Plan de Recuperación

- [ ] Documentación de procedimiento de recuperación
- [ ] Rollback automático probado
- [ ] Tiempo de recuperación objetivo (RTO) definido
- [ ] Punto de recuperación objetivo (RPO) definido

---

## 🚀 Deployment

### Pre-deployment

- [ ] Código revisado y aprobado
- [ ] Tests pasando (backend y frontend)
- [ ] Variables de entorno verificadas
- [ ] Backup reciente disponible
- [ ] Plan de rollback preparado

### Deployment Process

- [ ] Script de deployment probado
- [ ] Health checks verificados
- [ ] Zero-downtime deployment configurado
- [ ] Rollback automático funcionando
- [ ] Logs monitoreados durante deployment

### Post-deployment

- [ ] Health checks pasando
- [ ] Todos los servicios corriendo
- [ ] Endpoints respondiendo correctamente
- [ ] Métricas normales
- [ ] Logs sin errores críticos

---

## 📱 Accesibilidad

### DNS y Dominio

- [ ] Dominio configurado y apuntando al servidor
- [ ] DNS propagado correctamente
- [ ] Subdominios configurados (si aplica)

### URLs de Acceso

- [ ] Frontend accesible públicamente
- [ ] API accesible
- [ ] Admin panel accesible (con restricciones apropiadas)
- [ ] Documentación de API accesible

---

## 📖 Documentación

### Documentación Técnica

- [ ] README actualizado
- [ ] Guía de deployment completa
- [ ] Documentación de API actualizada
- [ ] Variables de entorno documentadas
- [ ] Procedimientos de mantenimiento documentados

### Documentación Operacional

- [ ] Runbook de incidentes creado
- [ ] Contactos de emergencia documentados
- [ ] Procedimientos de escalamiento definidos
- [ ] SLAs definidos (si aplica)

---

## 🧪 Testing

### Tests de Funcionalidad

- [ ] Tests unitarios pasando
- [ ] Tests de integración pasando
- [ ] Tests end-to-end ejecutados
- [ ] Funcionalidades críticas verificadas manualmente

### Tests de Carga (Recomendado)

- [ ] Tests de carga ejecutados
- [ ] Capacidad del sistema conocida
- [ ] Límites de escalamiento identificados

### Tests de Seguridad

- [ ] Scan de vulnerabilidades ejecutado
- [ ] Vulnerabilidades críticas resueltas
- [ ] Headers de seguridad verificados
- [ ] Rate limiting probado

---

## ✅ Verificación Final

### Checklist de Verificación

```bash
# 1. Health Checks
curl http://tudominio.com/health
curl http://tudominio.com/api/health/

# 2. SSL/TLS
curl -I https://tudominio.com

# 3. Security Headers
curl -I https://tudominio.com | grep -i "x-frame-options\|x-xss-protection\|strict-transport"

# 4. Servicios
docker-compose -f docker-compose.prod.yml ps

# 5. Logs
docker-compose -f docker-compose.prod.yml logs --tail=50

# 6. Performance
./scripts/performance-check.sh
```

### Métricas Clave

- [ ] Tiempo de respuesta < 500ms (P95)
- [ ] Tasa de error < 1%
- [ ] Disponibilidad > 99%
- [ ] CPU usage < 70%
- [ ] Memory usage < 80%
- [ ] Disk usage < 80%

---

## 📞 Contactos de Emergencia

- [ ] Equipo de desarrollo contactable
- [ ] Proveedor de hosting contactable
- [ ] Contactos de soporte documentados

---

## 🎯 Post-Producción

### Primeras 24 Horas

- [ ] Monitoreo activo de métricas
- [ ] Revisión de logs cada hora
- [ ] Health checks automáticos funcionando
- [ ] Alertas siendo recibidas

### Primera Semana

- [ ] Análisis de performance
- [ ] Revisión de errores
- [ ] Optimizaciones identificadas
- [ ] Feedback de usuarios recolectado

### Primer Mes

- [ ] Revisión de capacidad
- [ ] Análisis de costos
- [ ] Plan de escalamiento actualizado
- [ ] Documentación mejorada basada en experiencia

---

## 🎉 ¡Todo Listo!

Una vez completado este checklist, tu aplicación está:

- ✅ **Protegida**: Todas las medidas de seguridad implementadas
- ✅ **Rápida**: Optimizaciones de performance aplicadas
- ✅ **Eficaz**: Monitoreo y alertas configurados
- ✅ **Resiliente**: Backups y rollback preparados
- ✅ **Mantenible**: Documentación completa y actualizada

**¡Feliz despliegue! 🚀**

---

## 📝 Notas Adicionales

- Este checklist debe ser revisado antes de cada deployment importante
- Mantén este documento actualizado con tus propios procedimientos
- Considera crear checklists específicos para tu equipo y contexto
- Automatiza lo que puedas de este checklist

## 🔄 Revisión Periódica

Este checklist debe ser revisado:
- ✅ Antes de cada deployment a producción
- ✅ Mensualmente para mantenimiento preventivo
- ✅ Después de cada incidente para mejora continua
