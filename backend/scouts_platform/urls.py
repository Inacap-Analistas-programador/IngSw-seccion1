"""URL configuration for SGICS."""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import TokenRefreshView

from authentication.views import PersonSearchView, MyTokenObtainPairView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("authentication.urls")),
    path("api/auth/login/", MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/catalogo/", include("catalog.urls")),
    path("api/preinscripciones/", include("preinscriptions.urls")),
    path("api/pagos/", include("payments.urls")),
    path("api/archivos/", include("files.urls")),
    path("api/cursos/", include("courses.urls")),
    path("api/personas/buscar/", PersonSearchView.as_view(), name="persons-search"),
    path("api/personas/", include("personas.urls")),
    path("api/emails/", include("emails.urls")),
    path("healthz/", include("utils.health.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
