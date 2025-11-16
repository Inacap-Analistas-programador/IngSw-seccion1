from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import EmailTemplate, EmailLog, EmailConfiguration, EmailQueue
from .serializers import (
    EmailTemplateSerializer,
    EmailLogSerializer,
    EmailConfigurationSerializer,
    EmailQueueSerializer,
    SendEmailSerializer,
    SendTemplateEmailSerializer,
)
from .services import EmailService, EmailTriggerService
import logging

logger = logging.getLogger(__name__)


class EmailTemplateViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión de plantillas de email
    """
    queryset = EmailTemplate.objects.all()
    serializer_class = EmailTemplateSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        """Asignar usuario creador al crear plantilla"""
        # Obtener el usuario actual desde el request
        from usuarios.models import Usuario
        try:
            user = Usuario.objects.get(usu_email=self.request.user.username)
            serializer.save(created_by=user)
        except Usuario.DoesNotExist:
            serializer.save()

    @action(detail=True, methods=['post'])
    def test_template(self, request, pk=None):
        """
        Endpoint para probar una plantilla con datos de ejemplo
        """
        template = self.get_object()
        context = request.data.get('context', {})

        try:
            email_service = EmailService()
            subject, html_content, text_content = email_service.render_template(template, context)

            return Response({
                'success': True,
                'subject': subject,
                'html_content': html_content,
                'text_content': text_content,
            })
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


class EmailLogViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para consulta de logs de email (solo lectura)
    """
    queryset = EmailLog.objects.all()
    serializer_class = EmailLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filtrar logs por parámetros de consulta"""
        queryset = EmailLog.objects.all()
        
        # Filtrar por email
        recipient_email = self.request.query_params.get('recipient_email', None)
        if recipient_email:
            queryset = queryset.filter(recipient_email__icontains=recipient_email)
        
        # Filtrar por estado
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Filtrar por plantilla
        template_id = self.request.query_params.get('template_id', None)
        if template_id:
            queryset = queryset.filter(template_id=template_id)
        
        return queryset.order_by('-created_at')

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """
        Endpoint para estadísticas de envío de emails
        """
        from django.db.models import Count
        
        stats = EmailLog.objects.values('status').annotate(count=Count('status'))
        
        return Response({
            'statistics': list(stats),
            'total': EmailLog.objects.count(),
        })


class EmailConfigurationViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión de configuraciones de email
    """
    queryset = EmailConfiguration.objects.all()
    serializer_class = EmailConfigurationSerializer
    permission_classes = [IsAuthenticated]


class EmailQueueViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión de cola de emails
    """
    queryset = EmailQueue.objects.all()
    serializer_class = EmailQueueSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'])
    def process(self, request):
        """
        Endpoint para procesar emails en cola
        """
        batch_size = request.data.get('batch_size', 10)
        
        try:
            email_service = EmailService()
            email_service.process_queue(batch_size=batch_size)
            
            return Response({
                'success': True,
                'message': f'Processed up to {batch_size} emails from queue'
            })
        except Exception as e:
            logger.error(f"Error processing queue: {str(e)}")
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class EmailSendViewSet(viewsets.ViewSet):
    """
    ViewSet para envío de emails
    """
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'])
    def send(self, request):
        """
        Endpoint para enviar un email directo
        POST /api/emails/send/
        {
            "recipient_email": "user@example.com",
            "subject": "Test Email",
            "html_content": "<h1>Hello</h1>",
            "text_content": "Hello"
        }
        """
        serializer = SendEmailSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            email_service = EmailService()
            email_log = email_service.send_email(
                recipient_email=serializer.validated_data['recipient_email'],
                subject=serializer.validated_data['subject'],
                html_content=serializer.validated_data['html_content'],
                text_content=serializer.validated_data.get('text_content', ''),
            )

            return Response({
                'success': True,
                'email_log_id': email_log.log_id,
                'status': email_log.status,
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error sending email: {str(e)}")
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'])
    def send_from_template(self, request):
        """
        Endpoint para enviar un email usando una plantilla
        POST /api/emails/send_from_template/
        {
            "template_name": "registration_confirmation",
            "recipient_email": "user@example.com",
            "context": {
                "username": "john_doe",
                "verification_token": "abc123"
            },
            "queue": false,
            "priority": 2
        }
        """
        serializer = SendTemplateEmailSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Verificar que la plantilla existe
            template = EmailTemplate.objects.get(
                template_name=serializer.validated_data['template_name'],
                is_active=True
            )

            email_service = EmailService()

            # Si se solicita poner en cola
            if serializer.validated_data.get('queue', False):
                email_queue = email_service.queue_email(
                    template=template,
                    recipient_email=serializer.validated_data['recipient_email'],
                    context_data=serializer.validated_data['context'],
                    priority=serializer.validated_data.get('priority', 2),
                    scheduled_at=serializer.validated_data.get('scheduled_at'),
                )

                return Response({
                    'success': True,
                    'queued': True,
                    'queue_id': email_queue.queue_id,
                }, status=status.HTTP_200_OK)

            # Enviar inmediatamente
            email_log = email_service.send_from_template(
                template_name=serializer.validated_data['template_name'],
                recipient_email=serializer.validated_data['recipient_email'],
                context=serializer.validated_data['context'],
            )

            return Response({
                'success': True,
                'queued': False,
                'email_log_id': email_log.log_id,
                'status': email_log.status,
            }, status=status.HTTP_200_OK)

        except EmailTemplate.DoesNotExist:
            return Response({
                'success': False,
                'error': f"Template '{serializer.validated_data['template_name']}' not found"
            }, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            logger.error(f"Error sending email from template: {str(e)}")
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
