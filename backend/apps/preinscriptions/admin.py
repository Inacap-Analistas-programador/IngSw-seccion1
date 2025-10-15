from django.contrib import admin
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from .models import Preinscription


@admin.register(Preinscription)
class PreinscriptionAdmin(admin.ModelAdmin):
    list_display = ('id', 'course', 'persona_info', 'status', 'payment_status', 'created_at', 'status_icons')
    list_filter = ('status', 'payment_status', 'created_at', 'course')
    search_fields = ('course__title', 'persona__first_name', 'persona__last_name', 'persona__rut', 'persona__email')
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'
    list_per_page = 25
    
    fieldsets = (
        ('Información del Curso', {
            'fields': ('course',)
        }),
        ('Datos del Participante', {
            'fields': ('persona', 'emergency_contact', 'emergency_phone', 'medical_info', 'dietary_restrictions')
        }),
        ('Estado y Seguimiento', {
            'fields': ('status', 'payment_status', 'notes')
        }),
        ('Fechas', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ('created_at', 'updated_at')
    
    def persona_info(self, obj):
        """Información de la persona inscrita"""
        if obj.persona:
            return format_html(
                '<div><strong>{}</strong><br><small style="color: #666;">RUT: {}</small><br><small style="color: #666;">📧 {}</small></div>',
                obj.persona.get_full_name() if hasattr(obj.persona, 'get_full_name') else f"{obj.persona.first_name} {obj.persona.last_name}",
                obj.persona.rut or 'Sin RUT',
                obj.persona.email or 'Sin email'
            )
        return '-'
    
    persona_info.short_description = 'Participante'
    
    def status_icons(self, obj):
        """Iconos de estado visual"""
        icons = []
        
        # Estado de preinscripción
        if obj.status == 'pending':
            icons.append('<span style="color: #f59e0b;" title="Pendiente de aprobación">⏳ Pendiente</span>')
        elif obj.status == 'approved':
            icons.append('<span style="color: #10b981;" title="Aprobado">✅ Aprobado</span>')
        elif obj.status == 'rejected':
            icons.append('<span style="color: #ef4444;" title="Rechazado">❌ Rechazado</span>')
        
        # Estado de pago
        if obj.payment_status == 'pending':
            icons.append('<span style="color: #f59e0b;" title="Pago pendiente">💳 Pago pendiente</span>')
        elif obj.payment_status == 'paid':
            icons.append('<span style="color: #10b981;" title="Pagado">💰 Pagado</span>')
        
        return format_html('<br>'.join(icons)) if icons else '-'
    
    status_icons.short_description = 'Estado'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('course', 'persona')
    
    # Acciones masivas
    def approve_preinscriptions(self, request, queryset):
        """Aprobar preinscripciones seleccionadas"""
        updated = queryset.filter(status='pending').update(status='approved')
        self.message_user(request, f'{updated} preinscripciones aprobadas.')
    
    approve_preinscriptions.short_description = "Aprobar preinscripciones seleccionadas"
    
    def reject_preinscriptions(self, request, queryset):
        """Rechazar preinscripciones seleccionadas"""
        updated = queryset.filter(status='pending').update(status='rejected')
        self.message_user(request, f'{updated} preinscripciones rechazadas.')
    
    reject_preinscriptions.short_description = "Rechazar preinscripciones seleccionadas"
    
    actions = ['approve_preinscriptions', 'reject_preinscriptions']