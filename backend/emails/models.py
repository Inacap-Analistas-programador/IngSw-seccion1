from django.db import models
from django.contrib.auth import get_user_model
from usuarios.models import Usuario


class EmailTemplate(models.Model):
    """
    Modelo para almacenar plantillas de correos electrónicos
    """
    TEMPLATE_TYPES = [
        ('registration', 'Confirmación de Registro'),
        ('verification', 'Verificación de Cuenta'),
        ('course_enrollment', 'Inscripción a Curso'),
        ('event_qr', 'Código QR de Evento'),
        ('event_reminder', 'Recordatorio de Evento'),
        ('payment_confirmation', 'Confirmación de Pago'),
        ('custom', 'Personalizado'),
    ]

    template_id = models.AutoField(primary_key=True)
    template_name = models.CharField(max_length=100, unique=True)
    template_type = models.CharField(max_length=50, choices=TEMPLATE_TYPES)
    subject = models.CharField(max_length=200)
    html_content = models.TextField()
    text_content = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, related_name='created_templates')

    class Meta:
        db_table = 'email_template'
        verbose_name = 'Plantilla de Email'
        verbose_name_plural = 'Plantillas de Email'

    def __str__(self):
        return f"{self.template_name} ({self.get_template_type_display()})"


class EmailLog(models.Model):
    """
    Modelo para registrar todos los correos enviados
    """
    STATUS_CHOICES = [
        ('pending', 'Pendiente'),
        ('sent', 'Enviado'),
        ('failed', 'Fallido'),
        ('bounced', 'Rebotado'),
        ('delivered', 'Entregado'),
        ('opened', 'Abierto'),
        ('clicked', 'Click en Enlace'),
    ]

    log_id = models.AutoField(primary_key=True)
    template = models.ForeignKey(EmailTemplate, on_delete=models.SET_NULL, null=True, blank=True)
    recipient_email = models.EmailField()
    recipient_user = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True, related_name='received_emails')
    subject = models.CharField(max_length=200)
    html_content = models.TextField()
    text_content = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    error_message = models.TextField(blank=True, null=True)
    external_id = models.CharField(max_length=255, blank=True, null=True)  # SendGrid message ID
    sent_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    opened_at = models.DateTimeField(null=True, blank=True)
    clicked_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    metadata = models.JSONField(default=dict, blank=True)  # Para información adicional

    class Meta:
        db_table = 'email_log'
        verbose_name = 'Log de Email'
        verbose_name_plural = 'Logs de Email'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['recipient_email', '-created_at']),
            models.Index(fields=['status', '-created_at']),
        ]

    def __str__(self):
        return f"Email to {self.recipient_email} - {self.status}"


class EmailConfiguration(models.Model):
    """
    Modelo para configuraciones de email del sistema
    """
    config_id = models.AutoField(primary_key=True)
    config_key = models.CharField(max_length=100, unique=True)
    config_value = models.TextField()
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'email_configuration'
        verbose_name = 'Configuración de Email'
        verbose_name_plural = 'Configuraciones de Email'

    def __str__(self):
        return f"{self.config_key}"


class EmailQueue(models.Model):
    """
    Cola de correos para procesamiento asíncrono
    """
    PRIORITY_CHOICES = [
        (1, 'Baja'),
        (2, 'Normal'),
        (3, 'Alta'),
        (4, 'Urgente'),
    ]

    queue_id = models.AutoField(primary_key=True)
    template = models.ForeignKey(EmailTemplate, on_delete=models.CASCADE)
    recipient_email = models.EmailField()
    recipient_user = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True)
    context_data = models.JSONField(default=dict)  # Datos para renderizar la plantilla
    priority = models.IntegerField(choices=PRIORITY_CHOICES, default=2)
    scheduled_at = models.DateTimeField(null=True, blank=True)  # Para envío programado
    attempts = models.IntegerField(default=0)
    max_attempts = models.IntegerField(default=3)
    is_processed = models.BooleanField(default=False)
    processed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'email_queue'
        verbose_name = 'Cola de Email'
        verbose_name_plural = 'Cola de Emails'
        ordering = ['-priority', 'created_at']
        indexes = [
            models.Index(fields=['is_processed', '-priority', 'created_at']),
        ]

    def __str__(self):
        return f"Queue #{self.queue_id} - {self.recipient_email}"


class EmailAttachment(models.Model):
    """
    Modelo para adjuntos de correos (ej: QR codes, PDFs)
    """
    attachment_id = models.AutoField(primary_key=True)
    email_queue = models.ForeignKey(EmailQueue, on_delete=models.CASCADE, related_name='attachments', null=True, blank=True)
    email_log = models.ForeignKey(EmailLog, on_delete=models.CASCADE, related_name='attachments', null=True, blank=True)
    filename = models.CharField(max_length=255)
    file_content = models.BinaryField()  # Contenido del archivo en bytes
    content_type = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'email_attachment'
        verbose_name = 'Adjunto de Email'
        verbose_name_plural = 'Adjuntos de Email'

    def __str__(self):
        return f"{self.filename}"
