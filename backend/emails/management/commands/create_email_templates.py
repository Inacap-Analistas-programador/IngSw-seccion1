from django.core.management.base import BaseCommand
from emails.models import EmailTemplate


class Command(BaseCommand):
    help = 'Crea plantillas de email predeterminadas'

    def handle(self, *args, **options):
        templates = [
            {
                'template_name': 'registration_confirmation',
                'template_type': 'registration',
                'subject': 'Bienvenido a GIC Scouts - Confirma tu cuenta',
                'html_content': '''
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #004B87; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .button { display: inline-block; padding: 10px 20px; background: #004B87; color: white; text-decoration: none; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>¡Bienvenido a GIC Scouts!</h1>
        </div>
        <div class="content">
            <p>Hola {{ username }},</p>
            <p>Gracias por registrarte en nuestra plataforma de Gestión Integral de Cursos.</p>
            <p>Para activar tu cuenta, por favor haz clic en el siguiente botón:</p>
            <p style="text-align: center; margin: 30px 0;">
                <a href="{{ verification_url }}" class="button">Verificar mi cuenta</a>
            </p>
            <p>O copia y pega este enlace en tu navegador:</p>
            <p style="word-break: break-all;">{{ verification_url }}</p>
            <p>Este enlace expirará en 24 horas.</p>
        </div>
        <div class="footer">
            <p>Asociación de Guías y Scouts de Chile</p>
            <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
        </div>
    </div>
</body>
</html>
                ''',
                'text_content': '''
Bienvenido a GIC Scouts

Hola {{ username }},

Gracias por registrarte en nuestra plataforma de Gestión Integral de Cursos.

Para activar tu cuenta, por favor visita el siguiente enlace:
{{ verification_url }}

Este enlace expirará en 24 horas.

Asociación de Guías y Scouts de Chile
Este es un correo automático, por favor no respondas a este mensaje.
                ''',
            },
            {
                'template_name': 'account_verification',
                'template_type': 'verification',
                'subject': 'Cuenta verificada exitosamente',
                'html_content': '''
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #28a745; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .button { display: inline-block; padding: 10px 20px; background: #28a745; color: white; text-decoration: none; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>¡Cuenta Verificada!</h1>
        </div>
        <div class="content">
            <p>Hola {{ username }},</p>
            <p>Tu cuenta ha sido verificada exitosamente. Ya puedes acceder a todas las funcionalidades de la plataforma GIC.</p>
            <p style="text-align: center; margin: 30px 0;">
                <a href="{{ login_url }}" class="button">Iniciar Sesión</a>
            </p>
        </div>
        <div class="footer">
            <p>Asociación de Guías y Scouts de Chile</p>
        </div>
    </div>
</body>
</html>
                ''',
                'text_content': '''
¡Cuenta Verificada!

Hola {{ username }},

Tu cuenta ha sido verificada exitosamente. Ya puedes acceder a todas las funcionalidades de la plataforma GIC.

Inicia sesión en: {{ login_url }}

Asociación de Guías y Scouts de Chile
                ''',
            },
            {
                'template_name': 'course_enrollment',
                'template_type': 'course_enrollment',
                'subject': 'Inscripción confirmada - {{ course_name }}',
                'html_content': '''
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #004B87; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .info-box { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #004B87; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Inscripción Confirmada</h1>
        </div>
        <div class="content">
            <p>Hola {{ user.usu_username }},</p>
            <p>Tu inscripción al curso ha sido confirmada exitosamente.</p>
            
            <div class="info-box">
                <h3>Detalles del Curso</h3>
                <p><strong>Curso:</strong> {{ course_name }}</p>
                <p><strong>Código:</strong> {{ course_code }}</p>
                {% if location %}
                <p><strong>Ubicación:</strong> {{ location.address }}, {{ location.comuna }}</p>
                <p><a href="{{ location.maps_url }}" target="_blank">Ver en Google Maps</a></p>
                {% endif %}
            </div>
            
            {% if course_dates %}
            <div class="info-box">
                <h3>Fechas del Curso</h3>
                {% for date in course_dates %}
                <p>{{ date.start|date:"d/m/Y H:i" }} - {{ date.end|date:"d/m/Y H:i" }}</p>
                {% endfor %}
            </div>
            {% endif %}
            
            <p>Tu código QR para acceso presencial está adjunto en este correo.</p>
            <p><strong>Importante:</strong> Presenta tu código QR al llegar al evento.</p>
        </div>
        <div class="footer">
            <p>Asociación de Guías y Scouts de Chile</p>
        </div>
    </div>
</body>
</html>
                ''',
                'text_content': '''
Inscripción Confirmada

Hola {{ user.usu_username }},

Tu inscripción al curso ha sido confirmada exitosamente.

Detalles del Curso:
- Curso: {{ course_name }}
- Código: {{ course_code }}
{% if location %}
- Ubicación: {{ location.address }}, {{ location.comuna }}
- Google Maps: {{ location.maps_url }}
{% endif %}

Tu código QR para acceso presencial está adjunto en este correo.
Importante: Presenta tu código QR al llegar al evento.

Asociación de Guías y Scouts de Chile
                ''',
            },
            {
                'template_name': 'event_qr',
                'template_type': 'event_qr',
                'subject': 'Tu código QR para {{ event_name }}',
                'html_content': '''
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #004B87; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; text-align: center; }
        .qr-box { background: white; padding: 20px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Tu Código de Acceso</h1>
        </div>
        <div class="content">
            <p>Hola {{ user.usu_username }},</p>
            <p>Aquí está tu código QR para el evento:</p>
            
            <div class="qr-box">
                <h2>{{ event_name }}</h2>
                <p><strong>Fecha:</strong> {{ event_date }}</p>
                <p><strong>Ubicación:</strong> {{ location }}</p>
            </div>
            
            <p><strong>Instrucciones:</strong></p>
            <ul style="text-align: left;">
                <li>Descarga el código QR adjunto en este correo</li>
                <li>Presenta el código al llegar al evento</li>
                <li>Llega 15 minutos antes del inicio</li>
            </ul>
        </div>
        <div class="footer">
            <p>Asociación de Guías y Scouts de Chile</p>
        </div>
    </div>
</body>
</html>
                ''',
                'text_content': '''
Tu Código de Acceso

Hola {{ user.usu_username }},

Aquí está tu código QR para el evento:

{{ event_name }}
Fecha: {{ event_date }}
Ubicación: {{ location }}

Instrucciones:
- Descarga el código QR adjunto en este correo
- Presenta el código al llegar al evento
- Llega 15 minutos antes del inicio

Asociación de Guías y Scouts de Chile
                ''',
            },
        ]

        for template_data in templates:
            template, created = EmailTemplate.objects.get_or_create(
                template_name=template_data['template_name'],
                defaults=template_data
            )
            
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'Plantilla creada: {template.template_name}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Plantilla ya existe: {template.template_name}')
                )

        self.stdout.write(self.style.SUCCESS('¡Proceso completado!'))
