# Sistema de Gestión de Correos Electrónicos - GIC Platform

## Descripción

Sistema completo de gestión de correos electrónicos automatizados para la plataforma GIC, diseñado específicamente para la Asociación de Guías y Scouts de Chile. Este sistema permite el envío automatizado de correos para eventos, actividades, inscripciones a cursos, y generación de códigos QR de acceso.

## Características Implementadas

### ✅ Backend (Django)

#### Modelos de Datos
- **EmailTemplate**: Plantillas reutilizables de correos con soporte HTML y texto plano
- **EmailLog**: Registro completo de todos los correos enviados con trazabilidad
- **EmailQueue**: Sistema de cola para procesamiento asíncrono
- **EmailConfiguration**: Configuraciones del sistema de email
- **EmailAttachment**: Soporte para archivos adjuntos (QR codes, PDFs)

#### Servicios
- **EmailService**: Servicio principal para envío de correos
  - Renderizado de plantillas con Django Templates
  - Envío directo o a través de cola
  - Soporte para múltiples backends (Console, SMTP, SendGrid)
  - Gestión de adjuntos
  
- **EmailTriggerService**: Triggers automáticos para eventos del sistema
  - Confirmación de registro de usuario
  - Verificación de cuenta
  - Inscripción a cursos con QR
  - Códigos QR para eventos
  - Integración con Google Maps para ubicaciones

#### API REST Endpoints
```
GET    /api/emails/templates/              # Listar plantillas
POST   /api/emails/templates/              # Crear plantilla
GET    /api/emails/templates/{id}/         # Obtener plantilla
PUT    /api/emails/templates/{id}/         # Actualizar plantilla
DELETE /api/emails/templates/{id}/         # Eliminar plantilla
POST   /api/emails/templates/{id}/test_template/  # Probar plantilla

GET    /api/emails/logs/                   # Listar logs
GET    /api/emails/logs/{id}/              # Obtener log
GET    /api/emails/logs/statistics/        # Estadísticas

GET    /api/emails/queue/                  # Listar cola
POST   /api/emails/queue/process/          # Procesar cola

POST   /api/emails/send/send/              # Enviar email directo
POST   /api/emails/send/send_from_template/ # Enviar desde plantilla

GET    /api/emails/configurations/         # Configuraciones
PUT    /api/emails/configurations/{id}/    # Actualizar config
```

#### Comandos de Gestión
```bash
# Crear plantillas predeterminadas
python manage.py create_email_templates

# Procesar cola de emails
python manage.py process_email_queue --batch-size=50
```

#### Tests
- 15 tests unitarios implementados
- Cobertura de modelos, servicios y utilidades
- Tests de integración para envío de correos
- 100% de tests pasando ✅

### ✅ Frontend (React)

#### Servicio de Email (emailService.js)
- Cliente HTTP para todos los endpoints de email
- Manejo de errores integrado
- Métodos para:
  - Gestión de plantillas
  - Envío de correos
  - Consulta de logs
  - Procesamiento de cola
  - Configuraciones

#### Página de Logs (EmailLogsPage.jsx)
- Visualización de historial de correos
- Tarjetas de estadísticas
- Filtros por destinatario y estado
- Tabla responsiva con información detallada
- Indicadores de estado con colores

### ✅ Utilidades

#### Generación de Códigos QR
```python
from emails.utils import generate_qr_code, generate_course_qr, generate_event_qr

# QR genérico
qr_bytes = generate_qr_code({'user_id': 123, 'event_id': 456})

# QR para curso
qr_bytes = generate_course_qr(user, course)

# QR para evento
qr_bytes = generate_event_qr(user, event_id, event_name)
```

#### Integración con Google Maps
- Generación automática de URLs de Google Maps
- Información de ubicación en correos
- Enlaces directos desde emails

## Configuración

### Variables de Entorno

#### Desarrollo
```bash
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
DEFAULT_FROM_EMAIL=noreply@scouts.cl
FRONTEND_URL=http://localhost:3000
```

#### Producción con SendGrid
```bash
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=apikey
EMAIL_HOST_PASSWORD=SG.your-api-key-here
DEFAULT_FROM_EMAIL=noreply@scouts.cl
SERVER_EMAIL=noreply@scouts.cl
FRONTEND_URL=https://gic.scouts.cl
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### Instalación

1. **Backend**
```bash
cd backend

# Instalar dependencias
pip install -r requirements.txt

# Aplicar migraciones
python manage.py migrate

# Crear plantillas predeterminadas
python manage.py create_email_templates

# Iniciar servidor
python manage.py runserver
```

2. **Frontend**
```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## Uso

### Ejemplo 1: Enviar Confirmación de Registro

```python
from emails.services import EmailTriggerService
from usuarios.models import Usuario

trigger_service = EmailTriggerService()
user = Usuario.objects.get(usu_email='user@example.com')

# Enviar email de confirmación
trigger_service.send_registration_confirmation(
    user=user,
    verification_token='abc123xyz'
)
```

### Ejemplo 2: Inscripción a Curso con QR

```python
from emails.services import EmailTriggerService
from emails.utils import generate_course_qr
from cursos.models import Curso

trigger_service = EmailTriggerService()
course = Curso.objects.get(cur_codigo='CBC-2024')

# Generar código QR
qr_code = generate_course_qr(user, course)

# Enviar email con QR adjunto
trigger_service.send_course_enrollment(
    user=user,
    course=course,
    qr_code_data=qr_code
)
```

### Ejemplo 3: Envío Programado

```python
from emails.services import EmailService
from emails.models import EmailTemplate
from datetime import datetime, timedelta

email_service = EmailService()
template = EmailTemplate.objects.get(template_name='event_reminder')

# Programar para envío en 24 horas
scheduled_time = datetime.now() + timedelta(hours=24)

email_service.queue_email(
    template=template,
    recipient_email='user@example.com',
    context_data={'event_name': 'Reunión Mensual'},
    priority=3,
    scheduled_at=scheduled_time
)
```

### Ejemplo 4: Envío desde Frontend

```javascript
import emailService from '../services/emailService';

// Enviar email desde plantilla
const sendEnrollmentEmail = async (userId, courseId) => {
  try {
    const result = await emailService.sendFromTemplate({
      template_name: 'course_enrollment',
      recipient_email: 'user@example.com',
      context: {
        username: 'Juan Pérez',
        course_name: 'Curso Básico de Campismo',
        course_code: 'CBC-2024'
      },
      queue: false,
      priority: 2
    });
    
    console.log('Email enviado:', result);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## Plantillas Predeterminadas

### 1. registration_confirmation
Correo de bienvenida con enlace de verificación
- Variables: `username`, `email`, `verification_token`, `verification_url`

### 2. account_verification
Confirmación de cuenta verificada
- Variables: `username`, `login_url`

### 3. course_enrollment
Inscripción a curso con QR y ubicación
- Variables: `username`, `course_name`, `course_code`, `location`, `course_dates`
- Adjuntos: Código QR automático

### 4. event_qr
Código QR para acceso a evento
- Variables: `username`, `event_name`, `event_date`, `location`
- Adjuntos: Código QR

## Automatización con Cron

Para procesamiento automático de la cola de emails:

```bash
# Agregar a crontab (cada 5 minutos)
*/5 * * * * cd /path/to/backend && python manage.py process_email_queue --batch-size=50

# O con Celery Beat (recomendado para producción)
# En celery.py
from celery.schedules import crontab

app.conf.beat_schedule = {
    'process-email-queue': {
        'task': 'emails.tasks.process_email_queue',
        'schedule': crontab(minute='*/5'),
    },
}
```

## Monitoreo y Estadísticas

### Dashboard de Estadísticas
```python
from emails.models import EmailLog
from django.db.models import Count

# Estadísticas por estado
stats = EmailLog.objects.values('status').annotate(count=Count('status'))

# Tasa de éxito
total = EmailLog.objects.count()
sent = EmailLog.objects.filter(status='sent').count()
success_rate = (sent / total) * 100 if total > 0 else 0

# Emails del último mes
from datetime import datetime, timedelta
last_month = datetime.now() - timedelta(days=30)
recent_emails = EmailLog.objects.filter(created_at__gte=last_month).count()
```

### API de Estadísticas
```bash
curl -X GET http://localhost:8000/api/emails/logs/statistics/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Integración con cPanel

El sistema está diseñado para funcionar con herramientas de cPanel:

### Reenviadores (Forwarders)
- Configurar reenviadores en cPanel para direcciones específicas
- El sistema puede usar direcciones como `eventos@scouts.cl`, `cursos@scouts.cl`

### Auto Contestadores (Autoresponders)
- Combinar con plantillas del sistema
- Respuestas automáticas para casos específicos

### Filtros de Correo
- Aplicar filtros en cPanel para clasificación
- Spam filtering integrado

### Email Deliverability
- Configurar SPF, DKIM, DMARC en cPanel
- Monitoreo de entregabilidad

### Cifrado
- SSL/TLS habilitado por defecto
- Configuración de certificados en cPanel

## Seguridad

### Mejores Prácticas Implementadas
- ✅ Variables de entorno para credenciales
- ✅ Autenticación requerida para todos los endpoints
- ✅ Validación de datos de entrada
- ✅ Sanitización de contenido HTML
- ✅ Rate limiting en API (configurar en producción)
- ✅ Logging completo de actividades
- ✅ Cifrado TLS para envío de correos

### Recomendaciones Adicionales
- Implementar CAPTCHA en formularios públicos
- Configurar límites de envío por usuario
- Monitorear patrones de uso sospechoso
- Revisar logs regularmente
- Backup de plantillas y configuraciones

## Troubleshooting

### Email no se envía
1. Verificar `EMAIL_BACKEND` en `.env`
2. Verificar credenciales de SendGrid
3. Revisar logs: `EmailLog.objects.filter(status='failed')`
4. Verificar límites de SendGrid

### Cola no se procesa
1. Ejecutar manualmente: `python manage.py process_email_queue`
2. Verificar `scheduled_at` no sea futuro
3. Revisar `attempts < max_attempts`
4. Verificar cron/celery configurado

### QR no se genera
1. Verificar `qrcode[pil]` instalado
2. Verificar `Pillow` instalado
3. Revisar permisos de archivos

### Plantillas no renderizan
1. Verificar sintaxis de Django Templates
2. Probar con endpoint `/test_template/`
3. Revisar variables en contexto

## Testing

```bash
# Ejecutar todos los tests
python manage.py test emails

# Con coverage
python manage.py test emails --coverage

# Test específico
python manage.py test emails.tests.EmailServiceTest

# Resultados esperados
# ----------------------------------------------------------------------
# Ran 15 tests in 0.030s
# OK
```

## Documentación Adicional

- [Backend README](backend/emails/README.md) - Documentación detallada del backend
- [API Documentation](http://localhost:8000/api/docs/) - Swagger UI
- [Django Admin](http://localhost:8000/admin/) - Panel de administración

## Licencia

BSD License - Asociación de Guías y Scouts de Chile

## Contacto

- Email: contact@gic.scouts.cl
- Repositorio: https://github.com/Inacap-Analistas-programador/IngSw-seccion1

## Roadmap Futuro

- [ ] Webhooks de SendGrid para tracking avanzado
- [ ] Editor visual de plantillas (drag & drop)
- [ ] A/B testing de plantillas
- [ ] Soporte multiidioma
- [ ] Analytics avanzado
- [ ] Integración con calendario compartido
- [ ] Notificaciones push móviles
- [ ] Plantillas dinámicas con IA
