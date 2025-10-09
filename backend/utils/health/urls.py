"""
URLs para endpoints de salud del sistema SGICS

Estos endpoints son utilizados por:
- Sistemas de monitoreo (Prometheus, Grafana)
- Load balancers para verificar que el servicio está activo
- Docker health checks
- Pipeline de CI/CD para verificar deployments

Endpoints disponibles:
- /healthz/          -> Verificación básica de que el servicio responde
- /healthz/ready/    -> Verificación de que el servicio está listo (DB conectada)
- /healthz/live/     -> Verificación de que el servicio está vivo
"""

from django.urls import path
from . import views

# TODO: El equipo de DevOps debe implementar los health checks completos
urlpatterns = [
    # Health check básico - solo verifica que Django responde
    path('', views.health_check, name='health_check'),
    
    # Readiness check - verifica DB, cache, servicios externos
    path('ready/', views.readiness_check, name='readiness_check'),
    
    # Liveness check - verifica que la aplicación no está bloqueada
    path('live/', views.liveness_check, name='liveness_check'),
]