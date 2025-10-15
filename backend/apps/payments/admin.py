from django.contrib import admin
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from django.db.models import Sum
from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('id', 'persona_info', 'course', 'amount_formatted', 'payment_method', 'status', 'payment_date', 'status_icons')
    list_filter = ('status', 'payment_method', 'payment_date', 'created_at')
    search_fields = ('persona__first_name', 'persona__last_name', 'persona__rut', 'course__title', 'transaction_id')
    ordering = ('-created_at',)
    date_hierarchy = 'payment_date'
    list_per_page = 25
    
    fieldsets = (
        ('Información del Pago', {
            'fields': ('persona', 'course', 'amount', 'payment_method')
        }),
        ('Estado y Transacción', {
            'fields': ('status', 'transaction_id', 'payment_date', 'notes')
        }),
        ('Fechas del Sistema', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ('created_at', 'updated_at')
    
    def persona_info(self, obj):
        """Información de la persona que realizó el pago"""
        if obj.persona:
            return format_html(
                '<div><strong>{}</strong><br><small style="color: #666;">RUT: {}</small></div>',
                obj.persona.get_full_name() if hasattr(obj.persona, 'get_full_name') else f"{obj.persona.first_name} {obj.persona.last_name}",
                obj.persona.rut or 'Sin RUT'
            )
        return '-'
    
    persona_info.short_description = 'Participante'
    
    def amount_formatted(self, obj):
        """Monto formateado"""
        return format_html(
            '<strong style="color: #059669;">${:,.0f}</strong>',
            obj.amount
        )
    
    amount_formatted.short_description = 'Monto'
    
    def status_icons(self, obj):
        """Estado visual con iconos"""
        status_info = []
        
        # Estado del pago
        if obj.status == 'pending':
            status_info.append('<span style="color: #f59e0b;" title="Pago pendiente">⏳ Pendiente</span>')
        elif obj.status == 'completed':
            status_info.append('<span style="color: #10b981;" title="Pago completado">✅ Completado</span>')
        elif obj.status == 'failed':
            status_info.append('<span style="color: #ef4444;" title="Pago fallido">❌ Fallido</span>')
        elif obj.status == 'refunded':
            status_info.append('<span style="color: #3b82f6;" title="Reembolsado">↩️ Reembolsado</span>')
        
        # Método de pago
        if obj.payment_method == 'transfer':
            status_info.append('<span title="Transferencia">🏦 Transferencia</span>')
        elif obj.payment_method == 'cash':
            status_info.append('<span title="Efectivo">💵 Efectivo</span>')
        elif obj.payment_method == 'card':
            status_info.append('<span title="Tarjeta">💳 Tarjeta</span>')
        
        return format_html('<br>'.join(status_info)) if status_info else '-'
    
    status_icons.short_description = 'Estado y Método'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('persona', 'course')
    
    # Acciones masivas
    def make_completed(self, request, queryset):
        """Marcar pagos como completados"""
        updated = queryset.filter(status='pending').update(status='completed')
        self.message_user(request, f'{updated} pagos marcados como completados.')
    
    make_completed.short_description = "Marcar como completados"
    
    def make_failed(self, request, queryset):
        """Marcar pagos como fallidos"""
        updated = queryset.filter(status='pending').update(status='failed')
        self.message_user(request, f'{updated} pagos marcados como fallidos.')
    
    make_failed.short_description = "Marcar como fallidos"
    
    actions = ['make_completed', 'make_failed']
    
    def changelist_view(self, request, extra_context=None):
        """Agregar estadísticas al changelist"""
        extra_context = extra_context or {}
        
        # Calcular estadísticas
        queryset = self.get_queryset(request)
        total_amount = queryset.filter(status='completed').aggregate(total=Sum('amount'))['total'] or 0
        pending_count = queryset.filter(status='pending').count()
        completed_count = queryset.filter(status='completed').count()
        
        extra_context['total_amount'] = total_amount
        extra_context['pending_count'] = pending_count
        extra_context['completed_count'] = completed_count
        
        return super().changelist_view(request, extra_context=extra_context)