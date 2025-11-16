# Sistema de Gestión de Emails - GIC Platform

## Descripción General

Sistema completo de gestión de correos electrónicos para eventos, actividades y accesos a cursos de la plataforma GIC. Incluye automatización de correos, gestión de plantillas, colas de envío y generación de códigos QR.

## Características Principales

### 1. Gestión de Plantillas
- Plantillas HTML y texto plano
- Sistema de variables Django Template
- Tipos de plantilla predefinidos:
  - Confirmación de registro
  - Verificación de cuenta
  - Inscripción a curso
  - Código QR de evento
  - Recordatorio de evento
  - Confirmación de pago
  - Personalizado

### 2. Sistema de Colas
- Procesamiento asíncrono de correos
- Sistema de prioridades (1-4)
- Reintentos automáticos
- Programación de envíos

### 3. Registro de Actividad
- Log completo de todos los correos enviados
- Estados: pendiente, enviado, fallido, rebotado, entregado, abierto, click
- Estadísticas de envío
- Trazabilidad completa

### 4. Integración con SendGrid
- Backend SMTP configurable
- Soporte para múltiples proveedores
- Modo consola para desarrollo
- Tracking de apertura y clicks

### 5. Generación de Códigos QR
- QR personalizados para cursos
- QR para acceso a eventos
- Adjuntos automáticos en emails
- Formato PNG optimizado

### 6. Geolocalización
- Integración con Google Maps
- Enlaces directos a ubicaciones
- Información de comuna y dirección

## Modelos de Datos

### EmailTemplate
Almacena plantillas de correo reutilizables.

```python
{
    "template_id": 1,
    "template_name": "course_enrollment",
    "template_type": "course_enrollment",
    "subject": "Inscripción confirmada - {{ course_name }}",
    "html_content": "<html>...</html>",
    "text_content": "...",
    "is_active": true
}
```

### EmailLog
Registro de todos los correos enviados.

```python
{
    "log_id": 1,
    "recipient_email": "user@example.com",
    "subject": "Inscripción confirmada",
    "status": "sent",
    "sent_at": "2024-01-15T10:30:00Z",
    "metadata": {"user_id": 123}
}
```

### EmailQueue
Cola de correos pendientes de envío.

```python
{
    "queue_id": 1,
    "template": 1,
    "recipient_email": "user@example.com",
    "context_data": {"username": "john"},
    "priority": 2,
    "is_processed": false
}
```

### EmailConfiguration
Configuraciones del sistema de email.

```python
{
    "config_key": "EMAIL_BACKEND",
    "config_value": "sendgrid",
    "is_active": true
}
```

## API Endpoints

### Plantillas de Email

#### Listar Plantillas
```http
GET /api/emails/templates/
```

**Respuesta:**
```json
{
    "count": 10,
    "results": [
        {
            "template_id": 1,
            "template_name": "registration_confirmation",
            "template_type": "registration",
            "subject": "Bienvenido a GIC Scouts",
            "is_active": true
        }
    ]
}
```

#### Crear Plantilla
```http
POST /api/emails/templates/
Content-Type: application/json

{
    "template_name": "custom_notification",
    "template_type": "custom",
    "subject": "{{ subject_text }}",
    "html_content": "<h1>{{ title }}</h1><p>{{ content }}</p>",
    "text_content": "{{ title }}\n\n{{ content }}",
    "is_active": true
}
```

#### Probar Plantilla
```http
POST /api/emails/templates/{id}/test_template/
Content-Type: application/json

{
    "context": {
        "subject_text": "Prueba",
        "title": "Hola",
        "content": "Este es un test"
    }
}
```

### Envío de Emails

#### Enviar Email Directo
```http
POST /api/emails/send/send/
Content-Type: application/json

{
    "recipient_email": "user@example.com",
    "subject": "Test Email",
    "html_content": "<h1>Hello World</h1>",
    "text_content": "Hello World"
}
```

**Respuesta:**
```json
{
    "success": true,
    "email_log_id": 123,
    "status": "sent"
}
```

#### Enviar Email desde Plantilla
```http
POST /api/emails/send/send_from_template/
Content-Type: application/json

{
    "template_name": "course_enrollment",
    "recipient_email": "user@example.com",
    "context": {
        "username": "John Doe",
        "course_name": "Curso Básico de Campismo",
        "course_code": "CBC-2024"
    },
    "queue": false,
    "priority": 2
}
```

**Respuesta:**
```json
{
    "success": true,
    "queued": false,
    "email_log_id": 124,
    "status": "sent"
}
```

#### Añadir a Cola con Programación
```http
POST /api/emails/send/send_from_template/
Content-Type: application/json

{
    "template_name": "event_reminder",
    "recipient_email": "user@example.com",
    "context": {
        "event_name": "Reunión Mensual",
        "event_date": "2024-02-15"
    },
    "queue": true,
    "priority": 3,
    "scheduled_at": "2024-02-14T08:00:00Z"
}
```

### Logs de Email

#### Listar Logs
```http
GET /api/emails/logs/
```

**Parámetros de consulta:**
- `recipient_email`: Filtrar por email del destinatario
- `status`: Filtrar por estado (sent, failed, etc.)
- `template_id`: Filtrar por plantilla

#### Estadísticas de Envío
```http
GET /api/emails/logs/statistics/
```

**Respuesta:**
```json
{
    "statistics": [
        {"status": "sent", "count": 1250},
        {"status": "failed", "count": 15},
        {"status": "delivered", "count": 1200}
    ],
    "total": 1265
}
```

### Cola de Emails

#### Listar Cola
```http
GET /api/emails/queue/
```

#### Procesar Cola
```http
POST /api/emails/queue/process/
Content-Type: application/json

{
    "batch_size": 10
}
```

## Uso en Código Python

### Servicio de Email

```python
from emails.services import EmailService, EmailTriggerService
from emails.utils import generate_course_qr

# Crear instancia del servicio
email_service = EmailService()

# Enviar email directo
email_log = email_service.send_email(
    recipient_email='user@example.com',
    subject='Test Email',
    html_content='<h1>Hello</h1>',
    text_content='Hello'
)

# Enviar desde plantilla
email_log = email_service.send_from_template(
    template_name='course_enrollment',
    recipient_email='user@example.com',
    context={
        'username': 'John',
        'course_name': 'Curso Básico'
    }
)

# Añadir a cola
from emails.models import EmailTemplate

template = EmailTemplate.objects.get(template_name='course_enrollment')
queue_item = email_service.queue_email(
    template=template,
    recipient_email='user@example.com',
    context_data={'username': 'John'},
    priority=3
)
```

### Triggers Automáticos

```python
from emails.services import EmailTriggerService
from usuarios.models import Usuario

trigger_service = EmailTriggerService()

# Confirmación de registro
user = Usuario.objects.get(usu_email='user@example.com')
trigger_service.send_registration_confirmation(
    user=user,
    verification_token='abc123xyz'
)

# Verificación de cuenta
trigger_service.send_account_verification(user=user)

# Inscripción a curso
from cursos.models import Curso
from emails.utils import generate_course_qr

course = Curso.objects.get(cur_codigo='CBC-2024')
qr_code = generate_course_qr(user, course)

trigger_service.send_course_enrollment(
    user=user,
    course=course,
    qr_code_data=qr_code
)
```

### Generación de Códigos QR

```python
from emails.utils import generate_qr_code, generate_course_qr, generate_event_qr

# QR genérico
qr_data = {
    'type': 'access',
    'user_id': 123,
    'event_id': 456
}
qr_bytes = generate_qr_code(qr_data)

# QR para curso
qr_bytes = generate_course_qr(user, course)

# QR para evento
qr_bytes = generate_event_qr(
    user=user,
    event_id=789,
    event_name='Reunión Mensual'
)

# Guardar QR en archivo
with open('qr_code.png', 'wb') as f:
    f.write(qr_bytes)
```

## Configuración

### Variables de Entorno

```bash
# Backend de Email (desarrollo)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend

# Backend de Email (producción con SendGrid)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=apikey
EMAIL_HOST_PASSWORD=SG.your-api-key-here

# Configuración general
DEFAULT_FROM_EMAIL=noreply@scouts.cl
SERVER_EMAIL=noreply@scouts.cl

# Frontend URL para enlaces en emails
FRONTEND_URL=http://localhost:3000

# Google Maps API Key
GOOGLE_MAPS_API_KEY=your-api-key-here
```

### Crear Plantillas Predeterminadas

```bash
python manage.py create_email_templates
```

### Procesar Cola de Emails

```bash
# Manual
python manage.py shell
>>> from emails.services import EmailService
>>> service = EmailService()
>>> service.process_queue(batch_size=50)

# Con Celery (recomendado para producción)
# Configurar tarea periódica en celery beat
```

## Plantillas de Email

### Variables Disponibles

#### Plantilla: registration_confirmation
- `username`: Nombre de usuario
- `email`: Email del usuario
- `verification_token`: Token de verificación
- `verification_url`: URL completa de verificación

#### Plantilla: account_verification
- `username`: Nombre de usuario
- `login_url`: URL de inicio de sesión

#### Plantilla: course_enrollment
- `username`: Nombre de usuario
- `course_name`: Nombre del curso
- `course_code`: Código del curso
- `location`: Objeto con ubicación {address, comuna, maps_url}
- `course_dates`: Array de fechas {start, end, type}

#### Plantilla: event_qr
- `username`: Nombre de usuario
- `event_name`: Nombre del evento
- `event_date`: Fecha del evento
- `location`: Ubicación del evento

### Personalización de Plantillas

Las plantillas usan el sistema de templates de Django:

```html
<!DOCTYPE html>
<html>
<body>
    <h1>Hola {{ username }}</h1>
    
    {% if location %}
    <p>Ubicación: {{ location.address }}, {{ location.comuna }}</p>
    <a href="{{ location.maps_url }}">Ver en Google Maps</a>
    {% endif %}
    
    {% for date in course_dates %}
    <p>{{ date.start|date:"d/m/Y H:i" }} - {{ date.end|date:"d/m/Y H:i" }}</p>
    {% endfor %}
</body>
</html>
```

## Testing

```bash
# Ejecutar tests
python manage.py test emails

# Con coverage
python manage.py test emails --coverage

# Tests específicos
python manage.py test emails.tests.EmailServiceTest
```

## Mejores Prácticas

### 1. Uso de Cola
Para envíos masivos o no urgentes, siempre use la cola:

```python
email_service.queue_email(
    template=template,
    recipient_email=email,
    context_data=context,
    priority=2
)
```

### 2. Manejo de Errores
Siempre capture excepciones al enviar emails:

```python
try:
    email_service.send_from_template(...)
except Exception as e:
    logger.error(f"Error sending email: {str(e)}")
    # Manejar el error apropiadamente
```

### 3. Validación de Plantillas
Use el endpoint de test antes de usar nuevas plantillas:

```http
POST /api/emails/templates/{id}/test_template/
```

### 4. Monitoreo
Revise regularmente las estadísticas de envío:

```python
from emails.models import EmailLog
from django.db.models import Count

stats = EmailLog.objects.values('status').annotate(count=Count('status'))
```

### 5. Límites de Envío
Respete los límites del proveedor de email:
- SendGrid Free: 100 emails/día
- SendGrid Essentials: 40,000-100,000 emails/mes

## Solución de Problemas

### Email no se envía

1. Verificar configuración de EMAIL_BACKEND
2. Verificar credenciales de SendGrid
3. Revisar logs en EmailLog
4. Verificar que la plantilla está activa

### Email en cola no se procesa

1. Verificar que scheduled_at no sea futuro
2. Verificar intentos < max_attempts
3. Revisar errores en cola
4. Procesar manualmente: `service.process_queue()`

### QR Code no se genera

1. Verificar que qrcode está instalado: `pip install qrcode[pil]`
2. Verificar que Pillow está instalado
3. Revisar logs de errores

## Seguridad

- **Nunca** incluya credenciales en el código
- Use variables de entorno para API keys
- Valide todos los datos de entrada
- Sanitize HTML content en plantillas
- Use HTTPS para enlaces en emails
- Implemente rate limiting en producción

## Performance

- Use cola para envíos masivos
- Configure batch_size apropiado (10-50)
- Implemente caching de plantillas frecuentes
- Use Celery para procesamiento en background
- Monitoree uso de SendGrid API

## Roadmap

- [ ] Webhooks de SendGrid para tracking
- [ ] Soporte para archivos adjuntos desde disco
- [ ] Templates visuales con drag & drop
- [ ] A/B testing de plantillas
- [ ] Integración con calendario
- [ ] Soporte multiidioma
- [ ] Analytics avanzado de apertura/clicks
