# Guía de Despliegue - Sistema de Gestión de Emails

## 📋 Pre-requisitos

- Python 3.12+
- Node.js 18+
- MySQL (producción) o SQLite (desarrollo)
- Cuenta SendGrid (producción)
- Google Maps API Key (opcional)

## 🚀 Instalación Rápida

### 1. Backend

```bash
# Clonar repositorio
git clone https://github.com/Inacap-Analistas-programador/IngSw-seccion1.git
cd IngSw-seccion1/backend

# Crear entorno virtual (opcional pero recomendado)
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Aplicar migraciones
python manage.py migrate

# Crear plantillas de email predeterminadas
python manage.py create_email_templates

# Crear superusuario (opcional)
python manage.py createsuperuser

# Iniciar servidor de desarrollo
python manage.py runserver
```

### 2. Frontend

```bash
cd ../frontend

# Instalar dependencias
npm install

# Configurar variables de entorno (si es necesario)
# Crear .env.local si no existe

# Iniciar servidor de desarrollo
npm run dev
```

## 🔧 Configuración

### Backend (.env)

#### Desarrollo
```env
# Django
DJANGO_DEBUG=True
DJANGO_SECRET_KEY=tu-clave-secreta-aqui
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

# Base de datos (SQLite para desarrollo)
DATABASE_URL=sqlite:///db.sqlite3

# Email (modo consola para desarrollo)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
DEFAULT_FROM_EMAIL=noreply@scouts.cl

# URLs
FRONTEND_URL=http://localhost:3000
```

#### Producción
```env
# Django
DJANGO_DEBUG=False
DJANGO_SECRET_KEY=tu-clave-secreta-muy-segura-aqui
DJANGO_ALLOWED_HOSTS=tu-dominio.com,www.tu-dominio.com

# Base de datos MySQL
DB_ENGINE=mysql
DB_NAME=gic_db
DB_USER=gic_user
DB_PASSWORD=tu-password-seguro
DB_HOST=localhost
DB_PORT=3306

# Email (SendGrid)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=apikey
EMAIL_HOST_PASSWORD=SG.tu-api-key-de-sendgrid-aqui
DEFAULT_FROM_EMAIL=noreply@tu-dominio.com
SERVER_EMAIL=noreply@tu-dominio.com

# URLs
FRONTEND_URL=https://tu-dominio.com

# Google Maps (opcional)
GOOGLE_MAPS_API_KEY=tu-api-key-de-google-maps

# Seguridad
SECURE_SSL_REDIRECT=True
CORS_ALLOWED_ORIGINS=https://tu-dominio.com
```

## 📧 Configuración de SendGrid

1. **Crear Cuenta**
   - Ir a https://sendgrid.com/
   - Registrarse (plan gratuito: 100 emails/día)

2. **Generar API Key**
   - Settings > API Keys > Create API Key
   - Nombre: "GIC Production"
   - Permisos: Full Access
   - Copiar y guardar la API Key

3. **Verificar Dominio**
   - Settings > Sender Authentication
   - Verificar dominio con DNS records
   - Configurar SPF, DKIM, DMARC en cPanel

4. **Configurar Webhooks** (opcional)
   - Settings > Mail Settings > Event Webhook
   - URL: `https://tu-dominio.com/api/emails/webhook/`
   - Eventos: Delivered, Opened, Clicked, Bounced

## 🗄️ Configuración de Base de Datos

### MySQL (Producción)

```sql
-- Crear base de datos
CREATE DATABASE gic_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Crear usuario
CREATE USER 'gic_user'@'localhost' IDENTIFIED BY 'tu-password-seguro';

-- Otorgar permisos
GRANT ALL PRIVILEGES ON gic_db.* TO 'gic_user'@'localhost';
FLUSH PRIVILEGES;
```

```bash
# Aplicar migraciones
python manage.py migrate

# Crear plantillas
python manage.py create_email_templates

# Crear superusuario
python manage.py createsuperuser
```

## 🌐 Configuración de cPanel

### 1. Email Deliverability

```
cPanel > Email Deliverability
- Verificar estado de SPF
- Verificar estado de DKIM
- Resolver problemas
```

### 2. Reenviadores (Forwarders)

```
cPanel > Email > Forwarders
- eventos@tu-dominio.com → sistema de emails
- cursos@tu-dominio.com → sistema de emails
- notificaciones@tu-dominio.com → sistema de emails
```

### 3. Filtros de Correo

```
cPanel > Email > Email Filters
- Crear filtro para spam
- Crear filtro para clasificación automática
- Configurar acciones
```

### 4. Auto Contestadores

```
cPanel > Email > Autoresponders
- Configurar respuestas automáticas
- Integrar con plantillas del sistema
```

### 5. Certificados SSL

```
cPanel > Security > SSL/TLS
- Verificar certificados instalados
- Renovar si es necesario
- Forzar HTTPS
```

## ⚙️ Automatización

### Cron Job para Procesar Cola

```bash
# Editar crontab
crontab -e

# Agregar línea (procesar cada 5 minutos)
*/5 * * * * cd /ruta/a/backend && /ruta/a/venv/bin/python manage.py process_email_queue --batch-size=50 >> /var/log/email_queue.log 2>&1
```

### Systemd Service (Alternativa)

Crear `/etc/systemd/system/email-queue.service`:

```ini
[Unit]
Description=GIC Email Queue Processor
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/gic/backend
Environment="PATH=/var/www/gic/venv/bin"
ExecStart=/var/www/gic/venv/bin/python manage.py process_email_queue --batch-size=50
Restart=always
RestartSec=300

[Install]
WantedBy=multi-user.target
```

```bash
# Habilitar y iniciar
sudo systemctl enable email-queue
sudo systemctl start email-queue
sudo systemctl status email-queue
```

## 🔒 Seguridad

### Checklist de Producción

- [ ] `DEBUG=False` en producción
- [ ] Secret key único y seguro
- [ ] HTTPS habilitado (SSL/TLS)
- [ ] `SECURE_SSL_REDIRECT=True`
- [ ] Firewall configurado
- [ ] Acceso a base de datos restringido
- [ ] API keys en variables de entorno
- [ ] CORS configurado correctamente
- [ ] Rate limiting habilitado
- [ ] Backups automáticos configurados
- [ ] Monitoreo de logs activo
- [ ] SendGrid domain verification
- [ ] SPF, DKIM, DMARC configurados

## 📊 Verificación

### 1. Backend

```bash
# Verificar instalación
python manage.py check

# Verificar migraciones
python manage.py migrate --check

# Ejecutar tests
python manage.py test emails

# Verificar plantillas creadas
python manage.py shell
>>> from emails.models import EmailTemplate
>>> EmailTemplate.objects.all()
```

### 2. API

```bash
# Verificar endpoints
curl http://localhost:8000/api/emails/templates/

# Con autenticación
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:8000/api/emails/logs/statistics/
```

### 3. Envío de Test

```python
# En Django shell
python manage.py shell

>>> from emails.services import EmailTriggerService
>>> from usuarios.models import Usuario
>>> 
>>> trigger = EmailTriggerService()
>>> user = Usuario.objects.first()
>>> 
>>> # Enviar test
>>> trigger.send_account_verification(user)
```

## 🐛 Troubleshooting

### Email no se envía

```bash
# Verificar configuración
python manage.py shell
>>> from django.core.mail import send_mail
>>> send_mail('Test', 'Message', 'from@example.com', ['to@example.com'])

# Verificar logs
tail -f /var/log/gic/email.log

# Verificar SendGrid status
curl https://status.sendgrid.com/api/v2/status.json
```

### Cola no se procesa

```bash
# Verificar cron
crontab -l

# Ejecutar manualmente
python manage.py process_email_queue --batch-size=10

# Ver cola pendiente
python manage.py shell
>>> from emails.models import EmailQueue
>>> EmailQueue.objects.filter(is_processed=False).count()
```

### Problemas de permisos

```bash
# Verificar permisos de archivos
ls -la /var/www/gic/

# Ajustar si es necesario
sudo chown -R www-data:www-data /var/www/gic/
sudo chmod -R 755 /var/www/gic/
```

## 📈 Monitoreo

### Logs a Monitorear

```bash
# Logs de Django
tail -f /var/log/gic/django.log

# Logs de email
tail -f /var/log/gic/email.log

# Logs de cola
tail -f /var/log/email_queue.log

# Logs de sistema
sudo tail -f /var/log/syslog
```

### Métricas Importantes

- Tasa de envío exitoso (> 95%)
- Tiempo de procesamiento de cola (< 30s)
- Tasa de rebote (< 5%)
- Tasa de apertura (varía por tipo)

## 🔄 Mantenimiento

### Diario
- Revisar logs de errores
- Verificar estado de cola
- Monitorear métricas de SendGrid

### Semanal
- Revisar estadísticas de envío
- Actualizar plantillas si es necesario
- Limpiar logs antiguos

### Mensual
- Backup de base de datos
- Actualizar dependencias
- Revisar seguridad
- Optimizar plantillas

## 📞 Soporte

- Documentación: `/EMAIL_SYSTEM_README.md`
- Backend docs: `/backend/emails/README.md`
- API docs: `http://tu-dominio.com/api/docs/`
- Issues: GitHub Issues

## ✅ Checklist Final

- [ ] Backend instalado y funcionando
- [ ] Frontend instalado y funcionando
- [ ] Base de datos configurada
- [ ] SendGrid configurado y verificado
- [ ] Plantillas creadas
- [ ] Cron job configurado
- [ ] SSL/TLS habilitado
- [ ] Firewall configurado
- [ ] Monitoreo activo
- [ ] Backups automáticos
- [ ] Tests ejecutados exitosamente
- [ ] Documentación revisada

¡Sistema listo para producción! 🚀
