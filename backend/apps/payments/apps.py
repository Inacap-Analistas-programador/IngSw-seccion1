"""
Módulo de Configuración de la Aplicación de Pagos.

Este archivo se utiliza para configurar la aplicación 'payments' dentro del proyecto Django.
Permite definir metadatos y comportamientos específicos de la aplicación.
"""

from django.apps import AppConfig


class PagosConfig(AppConfig):
    """
    Clase de configuración para la aplicación 'payments'.

    Django utiliza esta clase para saber cómo interactuar con la aplicación.

    Atributos:
        default_auto_field (str): Define el tipo de campo primario automático
            (por ejemplo, para las migraciones) como BigAutoField para una mejor escalabilidad.
        name (str): El nombre completo de la ruta de importación de la aplicación.
        verbose_name (str): Un nombre legible por humanos para esta aplicación,
            que se muestra en lugares como el panel de administración de Django.
    """

    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.payments"
    verbose_name = "Gestión de Pagos"
