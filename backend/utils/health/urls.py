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
    # Endpoints estándar bajo el prefijo /healthz/
    # Nota: este archivo se incluye con prefix 'healthz/' desde urls.py del proyecto
    path("", views.healthz, name="healthz"),  # /healthz/
    path("readyz/", views.readyz, name="readyz"),  # /healthz/readyz/
    path("livez/", views.livez, name="livez"),  # /healthz/livez/
    # Aliases de compatibilidad sin la 'z'
    path("ready/", views.readiness_check, name="readiness_check"),  # /healthz/ready/
    path("live/", views.liveness_check, name="liveness_check"),  # /healthz/live/
]
