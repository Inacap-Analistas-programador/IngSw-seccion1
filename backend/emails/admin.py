from django.contrib import admin
from .models import EmailTemplate, EmailLog, EmailConfiguration, EmailQueue, EmailAttachment


@admin.register(EmailTemplate)
class EmailTemplateAdmin(admin.ModelAdmin):
    list_display = ['template_name', 'template_type', 'is_active', 'created_at', 'updated_at']
    list_filter = ['template_type', 'is_active', 'created_at']
    search_fields = ['template_name', 'subject']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(EmailLog)
class EmailLogAdmin(admin.ModelAdmin):
    list_display = ['log_id', 'recipient_email', 'subject', 'status', 'sent_at', 'created_at']
    list_filter = ['status', 'created_at', 'sent_at']
    search_fields = ['recipient_email', 'subject']
    readonly_fields = ['created_at', 'sent_at', 'delivered_at', 'opened_at', 'clicked_at']
    date_hierarchy = 'created_at'


@admin.register(EmailConfiguration)
class EmailConfigurationAdmin(admin.ModelAdmin):
    list_display = ['config_key', 'is_active', 'created_at', 'updated_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['config_key', 'description']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(EmailQueue)
class EmailQueueAdmin(admin.ModelAdmin):
    list_display = ['queue_id', 'recipient_email', 'priority', 'is_processed', 'attempts', 'created_at']
    list_filter = ['priority', 'is_processed', 'created_at']
    search_fields = ['recipient_email']
    readonly_fields = ['created_at', 'processed_at']


@admin.register(EmailAttachment)
class EmailAttachmentAdmin(admin.ModelAdmin):
    list_display = ['attachment_id', 'filename', 'content_type', 'created_at']
    list_filter = ['content_type', 'created_at']
    search_fields = ['filename']
    readonly_fields = ['created_at']
