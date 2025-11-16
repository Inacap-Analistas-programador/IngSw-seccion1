# 📧 Guía de Configuración del Sistema de Emails

Esta guía te ayudará a configurar el sistema completo de correos electrónicos con SendGrid en la plataforma GIC.

## 📋 Requisitos Previos

- Cuenta de SendGrid (incluye 100 emails/día gratis)
- Acceso al backend del proyecto
- Dominio propio (opcional, para mejor deliverability)

## 🚀 Pasos de Configuración

### 1. Crear Cuenta en SendGrid

1. Ve a [SendGrid](https://sendgrid.com)
2. Haz clic en "Start for Free" o "Sign Up"
3. Completa el registro:
   - Email profesional
   - Contraseña segura
   - Información de la empresa
4. Verifica tu email
5. Completa el cuestionario inicial de SendGrid

### 2. Crear API Key en SendGrid

1. Inicia sesión en SendGrid
2. Ve a **Settings** → **API Keys** en el menú lateral
3. Haz clic en **Create API Key**
4. Configura:
   - **API Key Name**: "GIC Platform Production"
   - **API Key Permissions**: "Full Access" (o "Restricted Access" con permisos de Mail Send)
5. Haz clic en **Create & View**
6. **IMPORTANTE**: Copia la API Key AHORA
   - Solo se muestra UNA VEZ
   - Guárdala en un lugar seguro
   - Formato: `SG.xxxxxxxxxxxx...`

### 3. Configurar Sender Identity

SendGrid requiere verificar tu identidad como remitente.

#### Opción A: Single Sender Verification (Más Rápido)

1. Ve a **Settings** → **Sender Authentication** → **Single Sender Verification**
2. Haz clic en **Create New Sender**
3. Completa el formulario:
   - **From Name**: GIC Platform (o nombre de tu organización)
   - **From Email Address**: noreply@scouts.cl (o tu email)
   - **Reply To**: soporte@scouts.cl
   - Dirección física (requerida por ley anti-spam)
4. Haz clic en **Create**
5. SendGrid enviará un email de verificación
6. Abre el email y haz clic en "Verify Single Sender"
7. ✅ Tu sender está verificado

#### Opción B: Domain Authentication (Profesional - Recomendado)

1. Ve a **Settings** → **Sender Authentication** → **Domain Authentication**
2. Haz clic en **Get Started**
3. Selecciona tu proveedor DNS (ej: GoDaddy, cPanel, Cloudflare)
4. Ingresa tu dominio: `scouts.cl`
5. SendGrid generará registros DNS CNAME
6. Copia los registros y agrégalos en tu panel de DNS:
   ```
   CNAME s1._domainkey → s1.domainkey.u12345678.wl.sendgrid.net
   CNAME s2._domainkey → s2.domainkey.u12345678.wl.sendgrid.net
   ```
7. Espera propagación de DNS (puede tomar hasta 48 horas)
8. Haz clic en "Verify" en SendGrid
9. ✅ Tu dominio está autenticado

### 4. Configurar Backend Django

#### Editar archivo .env

1. Abre `backend/.env`:
   ```bash
   cd backend
   nano .env
   ```

2. **Comenta** la configuración de desarrollo:
   ```env
   # Desarrollo - emails en consola
   # EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
   ```

3. **Descomenta y configura** SendGrid:
   ```env
   # Producción - SendGrid
   EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
   EMAIL_HOST=smtp.sendgrid.net
   EMAIL_PORT=587
   EMAIL_USE_TLS=True
   EMAIL_HOST_USER=apikey
   EMAIL_HOST_PASSWORD=SG.tu_sendgrid_api_key_aqui
   DEFAULT_FROM_EMAIL=noreply@scouts.cl
   SERVER_EMAIL=noreply@scouts.cl
   ```

4. **IMPORTANTE**: Reemplaza `SG.tu_sendgrid_api_key_aqui` con tu API Key real

5. Guarda el archivo (Ctrl+O, Enter, Ctrl+X en nano)

#### Verificar .gitignore

```bash
cat .gitignore | grep .env
```

Debe aparecer `.env` para evitar subir credenciales a Git.

### 5. Crear Plantillas de Email

```bash
cd backend
python manage.py create_email_templates
```

Este comando crea plantillas predeterminadas:
- ✅ registration_confirmation
- ✅ account_verification
- ✅ course_enrollment
- ✅ event_qr
- ✅ event_reminder
- ✅ payment_confirmation

### 6. Aplicar Migraciones (si es necesario)

```bash
python manage.py migrate emails
```

### 7. Probar Configuración

#### Opción A: Desde Django Shell

```bash
python manage.py shell
```

```python
from django.core.mail import send_mail

send_mail(
    subject='Prueba GIC Platform',
    message='Este es un email de prueba.',
    from_email='noreply@scouts.cl',
    recipient_list=['tu-email@ejemplo.com'],
    fail_silently=False,
)
```

Deberías recibir el email en unos segundos.

#### Opción B: Desde la Aplicación Web

1. Inicia el backend:
   ```bash
   python manage.py runserver
   ```

2. Inicia el frontend:
   ```bash
   cd ../frontend
   npm run dev
   ```

3. Abre tu navegador en `http://localhost:3000/demo/email-system`

4. Completa el formulario:
   - Email del Destinatario: tu-email@ejemplo.com
   - Nombre del Destinatario: Tu Nombre
   - Plantilla: registration_confirmation

5. Haz clic en "Enviar Email"

6. Verifica tu bandeja de entrada

### 8. Verificar Logs

#### Ver logs en la aplicación:

1. Ve a `http://localhost:3000/demo/email-system`
2. Haz clic en la pestaña "Historial de Emails"
3. Deberías ver tu email con estado "sent"

#### Ver logs en SendGrid:

1. Ve a SendGrid → **Activity**
2. Busca tu email por destinatario
3. Verifica el estado: Delivered, Opened, etc.

## 📊 Monitoreo y Estadísticas

### Dashboard de SendGrid

1. Ve a SendGrid → **Dashboard**
2. Verifica:
   - Emails Sent (últimos 7 días)
   - Delivered %
   - Opens %
   - Clicks %
   - Bounces
   - Spam Reports

### API de Estadísticas (Backend)

```bash
curl -X GET http://localhost:8000/api/emails/logs/statistics/ \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Respuesta:
```json
{
  "total": 150,
  "statistics": [
    {"status": "sent", "count": 120},
    {"status": "pending", "count": 15},
    {"status": "failed", "count": 5}
  ]
}
```

## 🔧 Configuración Avanzada

### Personalizar Plantillas

#### Desde Django Admin:

1. Ve a `http://localhost:8000/admin/`
2. Login con superusuario
3. Ve a **Emails** → **Email templates**
4. Edita cualquier plantilla
5. Modifica:
   - Subject
   - HTML Content (soporta Django Templates)
   - Text Content (versión texto plano)

#### Variables disponibles en plantillas:

```django
Hola {{ username }},

Gracias por registrarte en {{ site_name }}.

Tu código de verificación es: {{ verification_token }}

Enlace de verificación: {{ verification_url }}

Saludos,
El equipo de {{ site_name }}
```

### Envío Programado

```python
from emails.services import EmailService
from datetime import datetime, timedelta

email_service = EmailService()

# Programar para envío en 24 horas
scheduled_time = datetime.now() + timedelta(hours=24)

email_service.queue_email(
    template_name='event_reminder',
    recipient_email='usuario@ejemplo.com',
    context_data={'event_name': 'Campamento de Verano'},
    priority=3,
    scheduled_at=scheduled_time
)
```

### Procesamiento de Cola

El sistema incluye una cola para envío asíncrono.

#### Manual:
```bash
python manage.py process_email_queue --batch-size=50
```

#### Automático con Cron:
```bash
crontab -e
```

Agrega:
```cron
*/5 * * * * cd /ruta/al/proyecto/backend && python manage.py process_email_queue --batch-size=50
```

#### Con Celery (Recomendado para Producción):

1. Instalar Celery:
   ```bash
   pip install celery redis
   ```

2. Configurar en `settings.py`:
   ```python
   CELERY_BROKER_URL = 'redis://localhost:6379/0'
   ```

3. Crear tarea en `emails/tasks.py`:
   ```python
   from celery import shared_task
   from .services import EmailService
   
   @shared_task
   def process_email_queue_task():
       service = EmailService()
       service.process_queue(batch_size=50)
   ```

4. Configurar Celery Beat para ejecución periódica

## 🔐 Seguridad y Mejores Prácticas

### Variables de Entorno

✅ **NUNCA** subas tu API Key a Git
✅ Usa variables de entorno para credenciales
✅ Diferentes API Keys para desarrollo y producción
✅ Rota API Keys periódicamente (cada 3-6 meses)

### Rate Limiting

El sistema incluye rate limiting por defecto:
- Anónimos: 100 requests/hora
- Autenticados: 1000 requests/hora

Configurable en `settings.py`:
```python
REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/hour',
        'user': '1000/hour',
        'email': '50/hour',  # Rate específico para emails
    }
}
```

### Validación de Emails

```python
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

try:
    validate_email('usuario@ejemplo.com')
except ValidationError:
    print("Email inválido")
```

### Prevención de Spam

1. **Límites por Usuario**:
   - Max 10 emails por minuto
   - Max 100 emails por día

2. **Lista Negra**:
   ```python
   BLACKLISTED_DOMAINS = ['tempmail.com', 'guerrillamail.com']
   ```

3. **Verificación de Cuenta**:
   - Requiere verificación antes de enviar emails masivos

## 💰 Costos y Límites

### Plan Gratuito de SendGrid

- **100 emails/día** GRATIS (3,000/mes)
- Acceso completo a la API
- Estadísticas básicas
- Soporte por email

### Planes Pagos

| Plan | Emails/Mes | Precio |
|------|------------|--------|
| Essentials | 50,000 | $19.95/mes |
| Pro | 100,000 | $89.95/mes |
| Premier | 1,000,000+ | Contactar ventas |

### Recomendación para GIC

- **Desarrollo**: Plan Gratuito (suficiente)
- **Producción Pequeña** (<3000 emails/mes): Plan Gratuito
- **Producción Mediana** (3000-50000/mes): Plan Essentials
- **Producción Grande** (>50000/mes): Plan Pro

## 🐛 Solución de Problemas

### ❌ Error: "Authentication failed"

**Causa**: API Key incorrecta o no configurada.

**Solución**:
1. Verifica que la API Key está en `.env`
2. Verifica que comienza con `SG.`
3. Verifica que no tiene espacios extra
4. Crea una nueva API Key en SendGrid

### ❌ Error: "Sender address rejected"

**Causa**: Email remitente no verificado en SendGrid.

**Solución**:
1. Ve a SendGrid → Sender Authentication
2. Verifica tu Single Sender o Dominio
3. Usa el email verificado en `DEFAULT_FROM_EMAIL`

### ❌ Emails no llegan (pero sin error)

**Causa**: Pueden estar en spam o bloqueados.

**Solución**:
1. Revisa la carpeta de spam
2. Ve a SendGrid → Activity → busca el email
3. Revisa el estado: Delivered, Bounced, Dropped
4. Si está "Dropped", revisa el motivo
5. Configura SPF, DKIM, DMARC para tu dominio

### ❌ Error: "Daily send limit exceeded"

**Causa**: Superaste el límite de 100 emails/día del plan gratuito.

**Solución**:
1. Espera hasta el día siguiente
2. Upgradea a plan pago
3. Implementa cola y distribución de envíos

### ❌ Emails se ven mal formateados

**Causa**: HTML mal formado en la plantilla.

**Solución**:
1. Valida el HTML con [HTML Validator](https://validator.w3.org/)
2. Usa plantillas responsive para emails
3. Evita CSS complejo (muchos clientes no lo soportan)
4. Usa tablas para layout (estándar en emails)

## 📱 Uso en Producción

### Variables de Entorno en Servidor

#### cPanel:
1. Ve a "Variables de Entorno" en cPanel
2. Agrega:
   - `EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend`
   - `EMAIL_HOST=smtp.sendgrid.net`
   - `EMAIL_HOST_PASSWORD=SG.tu_api_key`
   - Etc.

#### VPS/Servidor Dedicado:
1. Edita `/etc/environment` o `.bashrc`
2. Agrega las variables
3. Reinicia el servicio Django

#### Docker:
```dockerfile
ENV EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
ENV EMAIL_HOST=smtp.sendgrid.net
ENV EMAIL_HOST_PASSWORD=SG.tu_api_key
```

### Monitoreo Continuo

1. **Webhooks de SendGrid**:
   - Configura webhook en SendGrid → Settings → Mail Settings → Event Webhook
   - URL: `https://tu-dominio.cl/api/emails/webhook/`
   - Eventos: Delivered, Opened, Clicked, Bounced

2. **Alertas**:
   - Configura alertas en SendGrid para bounces altos
   - Monitorea reputation score
   - Revisa logs diariamente

## 📚 Ejemplos de Código

### Enviar Email Simple

```python
from emails.services import EmailService

service = EmailService()
service.send_email(
    subject='Bienvenido a GIC',
    message='Gracias por registrarte',
    from_email='noreply@scouts.cl',
    recipient_list=['usuario@ejemplo.com']
)
```

### Enviar desde Plantilla

```python
from emails.services import EmailTriggerService

trigger = EmailTriggerService()
trigger.send_registration_confirmation(
    user=user,
    verification_token='abc123'
)
```

### Enviar con Adjunto (QR Code)

```python
from emails.services import EmailTriggerService
from emails.utils import generate_course_qr

trigger = EmailTriggerService()
qr_code = generate_course_qr(user, course)

trigger.send_course_enrollment(
    user=user,
    course=course,
    qr_code_data=qr_code
)
```

## 📚 Recursos Adicionales

- [Documentación SendGrid](https://docs.sendgrid.com/)
- [SendGrid API Reference](https://docs.sendgrid.com/api-reference/how-to-use-the-sendgrid-v3-api)
- [Email Best Practices](https://sendgrid.com/blog/email-best-practices/)
- [Demo en vivo](http://localhost:3000/demo/email-system)

## ✅ Checklist de Verificación

- [ ] Cuenta de SendGrid creada
- [ ] API Key generada y guardada
- [ ] Sender verificado (Single Sender o Domain)
- [ ] Variables configuradas en `backend/.env`
- [ ] Plantillas creadas con `create_email_templates`
- [ ] Email de prueba enviado exitosamente
- [ ] Logs verificados en aplicación
- [ ] Logs verificados en SendGrid Dashboard
- [ ] Cola de emails probada
- [ ] Rate limiting configurado
- [ ] Monitoreo configurado (webhooks/alertas)

## 🆘 Soporte

Si tienes problemas:
1. Revisa esta guía paso a paso
2. Verifica logs en `backend/` con `python manage.py runserver`
3. Revisa SendGrid Activity Feed
4. Consulta [SendGrid Support](https://support.sendgrid.com/)
5. Contacta al equipo de desarrollo

---

**Última actualización**: 2024-11-16
**Versión**: 1.0.0
