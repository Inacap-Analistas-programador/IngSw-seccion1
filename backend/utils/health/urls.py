"""
URLs para endpoints de salud del sistema SGICS

Endpoints estándar de Kubernetes health checks:
- /healthz        -> Health check básico
- /readyz         -> Readiness check (DB, cache)
- /livez          -> Liveness check (app no bloqueada)

Compatibilidad con nombres alternativos para sistemas legacy.
"""

from django.urls import path
from . import views

urlpatterns = [
    # Endpoints estándar de Kubernetes
    path("healthz", views.healthz, name="healthz"),
    path("readyz", views.readyz, name="readyz"),
    path("livez", views.livez, name="livez"),
    # Compatibilidad con nombres alternativos
    path("", views.health_check, name="health_check"),
    path("ready/", views.readiness_check, name="readiness_check"),
    path("live/", views.liveness_check, name="liveness_check"),
]
