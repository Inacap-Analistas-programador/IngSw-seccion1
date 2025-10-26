from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = (
        "username",
        "email",
        "first_name",
        "last_name",
        "rut",
        "rama",
        "is_active",
        "date_joined",
        "user_actions",
    )
    list_filter = ("is_active", "is_staff", "is_superuser", "rama", "date_joined")
    search_fields = ("username", "email", "first_name", "last_name", "rut")
    ordering = ("-date_joined",)
    list_per_page = 25

    fieldsets = (
        (None, {"fields": ("username", "password")}),
        (
            "Información Personal",
            {
                "fields": (
                    "first_name",
                    "last_name",
                    "email",
                    "rut",
                    "phone",
                    "birth_date",
                )
            },
        ),
        (
            "Información Scout",
            {"fields": ("rama", "grupo_scout", "cargo", "nivel_formacion")},
        ),
        (
            "Permisos",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
                "classes": ("collapse",),
            },
        ),
        (
            "Fechas Importantes",
            {"fields": ("last_login", "date_joined"), "classes": ("collapse",)},
        ),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "username",
                    "email",
                    "password1",
                    "password2",
                    "first_name",
                    "last_name",
                    "rut",
                ),
            },
        ),
    )

    readonly_fields = ("date_joined", "last_login")

    def user_actions(self, obj):
        """Acciones rápidas para el usuario"""
        actions = []

        # Ver preinscripciones
        try:
            preinscription_url = (
                reverse("admin:preinscriptions_preinscription_changelist")
                + f"?persona__user={obj.id}"
            )
            actions.append(
                f'<a href="{preinscription_url}" title="Ver preinscripciones">📋</a>'
            )
        except Exception:
            pass

        # Ver pagos
        try:
            payment_url = (
                reverse("admin:payments_payment_changelist")
                + f"?persona__user={obj.id}"
            )
            actions.append(f'<a href="{payment_url}" title="Ver pagos">💳</a>')
        except Exception:
            pass
        return mark_safe(" | ".join(actions)) if actions else "-"

    user_actions.short_description = "Acciones"

    def get_queryset(self, request):
        return super().get_queryset(request).select_related().prefetch_related("groups")


admin.site.site_header = "SGICS - Sistema de Gestión Integral de Cursos Scout"
admin.site.site_title = "SGICS Admin"
admin.site.index_title = "Panel de Administración del Sistema"
