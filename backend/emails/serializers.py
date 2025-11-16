from rest_framework import serializers
from .models import EmailTemplate, EmailLog, EmailConfiguration, EmailQueue, EmailAttachment


class EmailTemplateSerializer(serializers.ModelSerializer):
    """Serializer para plantillas de email"""
    created_by_username = serializers.CharField(source='created_by.usu_username', read_only=True)

    class Meta:
        model = EmailTemplate
        fields = [
            'template_id',
            'template_name',
            'template_type',
            'subject',
            'html_content',
            'text_content',
            'is_active',
            'created_at',
            'updated_at',
            'created_by',
            'created_by_username',
        ]
        read_only_fields = ['template_id', 'created_at', 'updated_at']


class EmailLogSerializer(serializers.ModelSerializer):
    """Serializer para logs de email"""
    template_name = serializers.CharField(source='template.template_name', read_only=True)
    recipient_username = serializers.CharField(source='recipient_user.usu_username', read_only=True)

    class Meta:
        model = EmailLog
        fields = [
            'log_id',
            'template',
            'template_name',
            'recipient_email',
            'recipient_user',
            'recipient_username',
            'subject',
            'status',
            'error_message',
            'external_id',
            'sent_at',
            'delivered_at',
            'opened_at',
            'clicked_at',
            'created_at',
            'metadata',
        ]
        read_only_fields = ['log_id', 'created_at']


class EmailConfigurationSerializer(serializers.ModelSerializer):
    """Serializer para configuraciones de email"""

    class Meta:
        model = EmailConfiguration
        fields = [
            'config_id',
            'config_key',
            'config_value',
            'description',
            'is_active',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['config_id', 'created_at', 'updated_at']


class EmailAttachmentSerializer(serializers.ModelSerializer):
    """Serializer para adjuntos de email"""

    class Meta:
        model = EmailAttachment
        fields = [
            'attachment_id',
            'email_queue',
            'email_log',
            'filename',
            'content_type',
            'created_at',
        ]
        read_only_fields = ['attachment_id', 'created_at']


class EmailQueueSerializer(serializers.ModelSerializer):
    """Serializer para cola de emails"""
    template_name = serializers.CharField(source='template.template_name', read_only=True)
    recipient_username = serializers.CharField(source='recipient_user.usu_username', read_only=True)
    attachments = EmailAttachmentSerializer(many=True, read_only=True)

    class Meta:
        model = EmailQueue
        fields = [
            'queue_id',
            'template',
            'template_name',
            'recipient_email',
            'recipient_user',
            'recipient_username',
            'context_data',
            'priority',
            'scheduled_at',
            'attempts',
            'max_attempts',
            'is_processed',
            'processed_at',
            'created_at',
            'attachments',
        ]
        read_only_fields = ['queue_id', 'attempts', 'is_processed', 'processed_at', 'created_at']


class SendEmailSerializer(serializers.Serializer):
    """Serializer para envío manual de emails"""
    recipient_email = serializers.EmailField()
    subject = serializers.CharField(max_length=200)
    html_content = serializers.CharField()
    text_content = serializers.CharField(required=False, allow_blank=True)
    template_name = serializers.CharField(required=False)
    context = serializers.JSONField(required=False)


class SendTemplateEmailSerializer(serializers.Serializer):
    """Serializer para envío de email con plantilla"""
    template_name = serializers.CharField(max_length=100)
    recipient_email = serializers.EmailField()
    context = serializers.JSONField()
    priority = serializers.IntegerField(required=False, default=2, min_value=1, max_value=4)
    queue = serializers.BooleanField(required=False, default=False)
    scheduled_at = serializers.DateTimeField(required=False, allow_null=True)
