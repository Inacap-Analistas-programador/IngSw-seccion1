"""
URL configuration for scout_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# Configuración de Swagger/OpenAPI
schema_view = get_schema_view(
   openapi.Info(
      title="GIC API - Gestión Integral de Cursos",
      default_version='v1',
      description="API REST para la plataforma GIC de gestión de cursos scouts",
      terms_of_service="https://www.gic.scouts.cl/terms/",
      contact=openapi.Contact(email="contact@gic.scouts.cl"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    # Admin
    path("admin/", admin.site.urls),
    
    # API Documentation
    path('api/docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('api/redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    
    # Authentication
    path("api/auth/", include("usuarios.auth_urls")),
    
    # API Endpoints
    path("api/cursos/", include("cursos.urls")),
    path("api/maestros/", include("maestros.urls")),
    path("api/personas/", include("personas.urls")),
    path("api/proveedores/", include("proveedores.urls")),
    path("api/pagos/", include("pagos.urls")),
    path("api/geografia/", include("geografia.urls")),
    path("api/emails/", include("emails.urls")),
]
