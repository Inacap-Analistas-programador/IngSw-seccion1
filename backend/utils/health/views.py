"""
Health check endpoints para SGICS - Sistema de Gestión Integral de Cursos Scout

Endpoints estándar para verificar el estado de la aplicación:
- /healthz: Health check básico - retorna 200 si la app está corriendo
- /readyz: Readiness check - verifica que la app está lista para recibir tráfico

Basado en las mejores prácticas de Kubernetes health checks.
"""

from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.db import connection
from django.core.cache import cache
from django.conf import settings
import time
import logging

logger = logging.getLogger(__name__)


@csrf_exempt
@require_http_methods(["GET"])
def healthz(request):
    """
    Health check básico - verifica que la aplicación está corriendo.

    Este endpoint debe ser simple y rápido, sin dependencias externas.
    Usado por load balancers para verificar que el proceso está vivo.

    Returns:
        JsonResponse: 200 si la app está corriendo, 500 si hay error
    """
    try:
        return JsonResponse(
            {
                "status": "healthy",
                "service": "sgics-backend",
                "version": "1.0.0",
                "timestamp": int(time.time()),
            }
        )
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return JsonResponse(
            {"status": "unhealthy", "error": str(e), "timestamp": int(time.time())},
            status=500,
        )


# Alias para compatibilidad
health_check = healthz


@csrf_exempt
@require_http_methods(["GET"])
def readyz(request):
    """
    Readiness check - verifica que la aplicación está lista para servir tráfico.

    Verifica dependencias críticas:
    - Conexión a base de datos
    - Sistema de cache (si está configurado)

    Usado por Kubernetes para saber cuándo dirigir tráfico al pod.

    Returns:
        JsonResponse: 200 si está listo, 503 si no está listo
    """
    checks = {}
    all_healthy = True

    try:
        # Check 1: Verificar conexión a base de datos
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
                cursor.fetchone()
            checks["database"] = {"status": "healthy"}
        except Exception as e:
            checks["database"] = {"status": "unhealthy", "error": str(e)}
            all_healthy = False

        # Check 2: Verificar sistema de cache (opcional)
        try:
            cache.set("health_check", "test", 30)
            test_value = cache.get("health_check")
            if test_value == "test":
                checks["cache"] = {"status": "healthy"}
            else:
                checks["cache"] = {
                    "status": "unhealthy",
                    "error": "Cache write/read failed",
                }
                all_healthy = False
        except Exception as e:
            # Cache no es crítico para funcionar, solo warning
            checks["cache"] = {"status": "warning", "error": str(e)}

        # Preparar respuesta
        response_data = {
            "status": "ready" if all_healthy else "not_ready",
            "service": "sgics-backend",
            "checks": checks,
            "timestamp": int(time.time()),
        }

        status_code = 200 if all_healthy else 503
        return JsonResponse(response_data, status=status_code)

    except Exception as e:
        logger.error(f"Readiness check failed: {e}")
        return JsonResponse(
            {"status": "not_ready", "error": str(e), "timestamp": int(time.time())},
            status=503,
        )


# Alias para compatibilidad
readiness_check = readyz


@csrf_exempt
@require_http_methods(["GET"])
def livez(request):
    """
    Liveness check - verifica que la aplicación no está bloqueada.

    Verificación básica de que la aplicación está respondiendo
    y no está en estado zombie o deadlock.

    Returns:
        JsonResponse: 200 si está viva, 500 si hay problemas
    """
    try:
        start_time = time.time()

        # Verificación básica - si llegamos aquí, la app responde
        response_time = time.time() - start_time

        return JsonResponse(
            {
                "status": "alive",
                "response_time_ms": int(response_time * 1000),
                "service": "sgics-backend",
                "timestamp": int(time.time()),
            }
        )

    except Exception as e:
        logger.error(f"Liveness check failed: {e}")
        return JsonResponse(
            {"status": "unhealthy", "error": str(e), "timestamp": int(time.time())},
            status=500,
        )


# Alias para compatibilidad
liveness_check = livez
