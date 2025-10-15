"""
Manejo personalizado de excepciones para APIs de SGICS

Este módulo centraliza el manejo de errores en todas las APIs:
- Respuestas consistentes con códigos HTTP apropiados
- Mensajes de error en español para mejor UX
- Logging de errores para debugging y monitoreo
- Ocultación de información sensible en producción

Códigos HTTP utilizados:
- 400: Bad Request (datos inválidos del cliente)
- 401: Unauthorized (no autenticado)
- 403: Forbidden (autenticado pero sin permisos)
- 404: Not Found (recurso no existe)
- 409: Conflict (conflicto de negocio, ej: RUT duplicado)
- 422: Unprocessable Entity (validación de negocio falló)
- 500: Internal Server Error (error del servidor)
"""

from rest_framework.views import exception_handler
from rest_framework.response import Response
from django.core.exceptions import ValidationError
from django.http import Http404
import logging

# Logger para errores de API
logger = logging.getLogger("sgics.api")


def custom_exception_handler(exc, context):
    """
    Manejador personalizado de excepciones para APIs REST.

    Proporciona respuestas consistentes y mensajes en español.
    Registra errores críticos para monitoreo.

    Args:
        exc: Excepción que fue lanzada
        context: Contexto de la vista donde ocurrió el error

    Returns:
        Response: Respuesta HTTP con formato estandarizado de error
    """

    # Obtener respuesta estándar de DRF primero
    response = exception_handler(exc, context)

    if response is not None:
        # Personalizar respuesta según el tipo de error
        custom_response_data = format_error_response(
            exc, response.data, response.status_code
        )

        # Log del error para monitoreo
        log_api_error(exc, context, response.status_code)

        response.data = custom_response_data

    return response


def format_error_response(exception, original_data, status_code):
    """
    Formatea la respuesta de error en un formato consistente.

    Estructura de respuesta:
    {
        "error": true,
        "status_code": 400,
        "message": "Mensaje principal en español",
        "details": {...},  // Detalles específicos del error
        "timestamp": "2024-10-09T12:00:00Z"
    }
    """
    from datetime import datetime

    # Mapeo de mensajes comunes a español
    error_messages = {
        400: "Los datos enviados no son válidos",
        401: "Credenciales de autenticación requeridas",
        403: "No tiene permisos para realizar esta acción",
        404: "El recurso solicitado no fue encontrado",
        409: "Conflicto: el recurso ya existe o está en uso",
        422: "Los datos no cumplen las reglas de negocio",
        500: "Error interno del servidor",
    }

    # Determinar mensaje principal
    main_message = error_messages.get(status_code, "Ha ocurrido un error")

    # TODO: El equipo debe expandir mensajes específicos por tipo de error
    if hasattr(exception, "__class__"):
        if "ValidationError" in exception.__class__.__name__:
            main_message = "Error de validación en los datos enviados"
        elif "PermissionDenied" in exception.__class__.__name__:
            main_message = "No tiene permisos suficientes para esta operación"

    return {
        "error": True,
        "status_code": status_code,
        "message": main_message,
        "details": original_data
        if isinstance(original_data, dict)
        else {"detail": original_data},
        "timestamp": datetime.now().isoformat(),
    }


def log_api_error(exception, context, status_code):
    """
    Registra errores de API para debugging y monitoreo.

    TODO: El equipo de DevOps debe configurar agregación de logs
    - Enviar errores críticos a Sentry o similar
    - Configurar alertas para errores 500
    - Métricas de errores por endpoint
    """

    # Obtener información del contexto
    request = context.get("request")
    view = context.get("view")

    error_info = {
        "exception": str(exception),
        "status_code": status_code,
        "endpoint": request.path if request else "unknown",
        "method": request.method if request else "unknown",
        "user": str(request.user)
        if request and request.user.is_authenticated
        else "anonymous",
        "view": view.__class__.__name__ if view else "unknown",
    }

    # Log según severidad
    if status_code >= 500:
        logger.error(f"Error crítico en API: {error_info}")
    elif status_code >= 400:
        logger.warning(f"Error de cliente en API: {error_info}")
    else:
        logger.info(f"Error en API: {error_info}")
