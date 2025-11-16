import os
import json
import base64
import logging
from datetime import datetime
from typing import Dict, List, Optional, Any
from django.conf import settings
from django.template import Template, Context
from django.core.mail import EmailMultiAlternatives
from django.utils import timezone
from django.db import models
from .models import EmailTemplate, EmailLog, EmailQueue, EmailConfiguration, EmailAttachment

logger = logging.getLogger(__name__)


class EmailService:
    """
    Servicio principal para gestión de correos electrónicos
    Soporta múltiples backends: SendGrid, SMTP, Console (para desarrollo)
    """

    def __init__(self):
        self.backend = self._get_email_backend()
        self.from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@scouts.cl')

    def _get_email_backend(self):
        """Obtiene el backend de email configurado"""
        try:
            config = EmailConfiguration.objects.get(config_key='EMAIL_BACKEND', is_active=True)
            return config.config_value
        except EmailConfiguration.DoesNotExist:
            return getattr(settings, 'EMAIL_BACKEND', 'console')

    def render_template(self, template: EmailTemplate, context: Dict[str, Any]) -> tuple:
        """
        Renderiza una plantilla de email con el contexto proporcionado
        Returns: (subject, html_content, text_content)
        """
        try:
            # Renderizar subject
            subject_template = Template(template.subject)
            subject = subject_template.render(Context(context))

            # Renderizar HTML content
            html_template = Template(template.html_content)
            html_content = html_template.render(Context(context))

            # Renderizar text content si existe
            text_content = None
            if template.text_content:
                text_template = Template(template.text_content)
                text_content = text_template.render(Context(context))

            return subject, html_content, text_content
        except Exception as e:
            logger.error(f"Error rendering template {template.template_id}: {str(e)}")
            raise

    def send_email(
        self,
        recipient_email: str,
        subject: str,
        html_content: str,
        text_content: Optional[str] = None,
        attachments: Optional[List[Dict]] = None,
        template: Optional[EmailTemplate] = None,
        recipient_user=None,
        metadata: Optional[Dict] = None,
    ) -> EmailLog:
        """
        Envía un correo electrónico y registra el log
        
        Args:
            recipient_email: Email del destinatario
            subject: Asunto del correo
            html_content: Contenido HTML
            text_content: Contenido texto plano (opcional)
            attachments: Lista de adjuntos [{filename, content, content_type}]
            template: Plantilla utilizada (opcional)
            recipient_user: Usuario destinatario (opcional)
            metadata: Información adicional (opcional)
        
        Returns:
            EmailLog object
        """
        # Crear log de email
        email_log = EmailLog.objects.create(
            template=template,
            recipient_email=recipient_email,
            recipient_user=recipient_user,
            subject=subject,
            html_content=html_content,
            text_content=text_content or '',
            status='pending',
            metadata=metadata or {}
        )

        try:
            # Enviar email usando Django's email backend
            msg = EmailMultiAlternatives(
                subject=subject,
                body=text_content or html_content,
                from_email=self.from_email,
                to=[recipient_email]
            )

            if html_content:
                msg.attach_alternative(html_content, "text/html")

            # Adjuntar archivos si existen
            if attachments:
                for attachment in attachments:
                    msg.attach(
                        attachment['filename'],
                        attachment['content'],
                        attachment['content_type']
                    )

            # Enviar
            msg.send(fail_silently=False)

            # Actualizar log
            email_log.status = 'sent'
            email_log.sent_at = timezone.now()
            email_log.save()

            logger.info(f"Email sent successfully to {recipient_email}")

        except Exception as e:
            # Registrar error
            email_log.status = 'failed'
            email_log.error_message = str(e)
            email_log.save()
            logger.error(f"Error sending email to {recipient_email}: {str(e)}")
            raise

        return email_log

    def send_from_template(
        self,
        template_name: str,
        recipient_email: str,
        context: Dict[str, Any],
        recipient_user=None,
        attachments: Optional[List[Dict]] = None,
    ) -> EmailLog:
        """
        Envía un correo usando una plantilla
        
        Args:
            template_name: Nombre de la plantilla
            recipient_email: Email del destinatario
            context: Contexto para renderizar la plantilla
            recipient_user: Usuario destinatario (opcional)
            attachments: Lista de adjuntos (opcional)
        
        Returns:
            EmailLog object
        """
        try:
            template = EmailTemplate.objects.get(template_name=template_name, is_active=True)
        except EmailTemplate.DoesNotExist:
            logger.error(f"Template {template_name} not found")
            raise

        # Renderizar plantilla
        subject, html_content, text_content = self.render_template(template, context)

        # Enviar email
        return self.send_email(
            recipient_email=recipient_email,
            subject=subject,
            html_content=html_content,
            text_content=text_content,
            attachments=attachments,
            template=template,
            recipient_user=recipient_user,
            metadata={'context': context}
        )

    def queue_email(
        self,
        template: EmailTemplate,
        recipient_email: str,
        context_data: Dict[str, Any],
        recipient_user=None,
        priority: int = 2,
        scheduled_at: Optional[datetime] = None,
    ) -> EmailQueue:
        """
        Añade un correo a la cola para procesamiento asíncrono
        
        Args:
            template: Plantilla de email
            recipient_email: Email del destinatario
            context_data: Datos para renderizar la plantilla
            recipient_user: Usuario destinatario (opcional)
            priority: Prioridad (1-4, default 2)
            scheduled_at: Fecha programada de envío (opcional)
        
        Returns:
            EmailQueue object
        """
        return EmailQueue.objects.create(
            template=template,
            recipient_email=recipient_email,
            recipient_user=recipient_user,
            context_data=context_data,
            priority=priority,
            scheduled_at=scheduled_at
        )

    def process_queue(self, batch_size: int = 10):
        """
        Procesa correos en cola
        
        Args:
            batch_size: Número de correos a procesar
        """
        now = timezone.now()
        
        # Obtener correos pendientes
        queued_emails = EmailQueue.objects.filter(
            is_processed=False,
            attempts__lt=models.F('max_attempts')
        ).filter(
            models.Q(scheduled_at__isnull=True) | models.Q(scheduled_at__lte=now)
        ).order_by('-priority', 'created_at')[:batch_size]

        for queued_email in queued_emails:
            try:
                # Renderizar y enviar
                subject, html_content, text_content = self.render_template(
                    queued_email.template,
                    queued_email.context_data
                )

                # Obtener adjuntos
                attachments = []
                for attachment in queued_email.attachments.all():
                    attachments.append({
                        'filename': attachment.filename,
                        'content': bytes(attachment.file_content),
                        'content_type': attachment.content_type
                    })

                # Enviar email
                self.send_email(
                    recipient_email=queued_email.recipient_email,
                    subject=subject,
                    html_content=html_content,
                    text_content=text_content,
                    attachments=attachments if attachments else None,
                    template=queued_email.template,
                    recipient_user=queued_email.recipient_user,
                    metadata={'queue_id': queued_email.queue_id}
                )

                # Marcar como procesado
                queued_email.is_processed = True
                queued_email.processed_at = timezone.now()
                queued_email.save()

            except Exception as e:
                # Incrementar intentos
                queued_email.attempts += 1
                queued_email.save()
                logger.error(f"Error processing queue {queued_email.queue_id}: {str(e)}")


class EmailTriggerService:
    """
    Servicio para triggers automáticos de correos basados en eventos
    """

    def __init__(self):
        self.email_service = EmailService()

    def send_registration_confirmation(self, user, verification_token: str):
        """Envía correo de confirmación de registro"""
        context = {
            'username': user.usu_username,
            'email': user.usu_email,
            'verification_token': verification_token,
            'verification_url': f"{settings.FRONTEND_URL}/verify-account?token={verification_token}",
        }

        try:
            return self.email_service.send_from_template(
                template_name='registration_confirmation',
                recipient_email=user.usu_email,
                context=context,
                recipient_user=user
            )
        except Exception as e:
            logger.error(f"Error sending registration confirmation: {str(e)}")
            raise

    def send_account_verification(self, user):
        """Envía correo de verificación exitosa"""
        context = {
            'username': user.usu_username,
            'login_url': f"{settings.FRONTEND_URL}/login",
        }

        try:
            return self.email_service.send_from_template(
                template_name='account_verification',
                recipient_email=user.usu_email,
                context=context,
                recipient_user=user
            )
        except Exception as e:
            logger.error(f"Error sending account verification: {str(e)}")
            raise

    def send_course_enrollment(self, user, course, qr_code_data: Optional[bytes] = None):
        """
        Envía correo de inscripción a curso con código QR
        
        Args:
            user: Usuario inscrito
            course: Curso
            qr_code_data: Datos del QR code en bytes (opcional)
        """
        # Obtener ubicación del curso
        location_data = None
        if course.com_id_lugar:
            location_data = {
                'address': course.cur_lugar or '',
                'comuna': course.com_id_lugar.com_descripcion if course.com_id_lugar else '',
                'maps_url': self._generate_google_maps_url(course)
            }

        context = {
            'username': user.usu_username,
            'course_name': course.cur_descripcion,
            'course_code': course.cur_codigo,
            'location': location_data,
            'course_dates': self._get_course_dates(course),
        }

        # Preparar adjuntos
        attachments = []
        if qr_code_data:
            attachments.append({
                'filename': f'qr_code_{course.cur_codigo}.png',
                'content': qr_code_data,
                'content_type': 'image/png'
            })

        try:
            return self.email_service.send_from_template(
                template_name='course_enrollment',
                recipient_email=user.usu_email,
                context=context,
                recipient_user=user,
                attachments=attachments if attachments else None
            )
        except Exception as e:
            logger.error(f"Error sending course enrollment: {str(e)}")
            raise

    def send_event_qr_code(self, user, event, qr_code_data: bytes):
        """Envía código QR para evento"""
        context = {
            'username': user.usu_username,
            'event_name': event.get('name', ''),
            'event_date': event.get('date', ''),
            'location': event.get('location', ''),
        }

        attachments = [{
            'filename': f'qr_code_event.png',
            'content': qr_code_data,
            'content_type': 'image/png'
        }]

        try:
            return self.email_service.send_from_template(
                template_name='event_qr',
                recipient_email=user.usu_email,
                context=context,
                recipient_user=user,
                attachments=attachments
            )
        except Exception as e:
            logger.error(f"Error sending event QR code: {str(e)}")
            raise

    def _generate_google_maps_url(self, course) -> str:
        """Genera URL de Google Maps para la ubicación del curso"""
        if not course.cur_lugar:
            return ''
        
        # Codificar la dirección para URL
        from urllib.parse import quote
        address = f"{course.cur_lugar}"
        if course.com_id_lugar:
            address += f", {course.com_id_lugar.com_descripcion}"
        
        return f"https://www.google.com/maps/search/?api=1&query={quote(address)}"

    def _get_course_dates(self, course) -> List[Dict]:
        """Obtiene las fechas del curso"""
        from cursos.models import CursoFecha
        
        dates = []
        course_dates = CursoFecha.objects.filter(cur_id=course).order_by('cuf_fecha_inicio')
        
        for date in course_dates:
            dates.append({
                'start': date.cuf_fecha_inicio,
                'end': date.cuf_fecha_termino,
                'type': date.cuf_tipo
            })
        
        return dates
