# Dockerfile para SGICS Backend - Django API
# Optimizado para producción con health checks integrados

# Usar Python 3.12 (3.14 aún no está soportado por Django en octubre 2025)
FROM python:3.12-slim

# Información del mantenedor
LABEL maintainer="SGICS Team <dev@sgics.local>"
LABEL description="Sistema de Gestión Integral de Cursos Scout - Backend API"

# Configurar variables de entorno para Python
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    DJANGO_SETTINGS_MODULE=scouts_platform.settings.production

# Crear usuario no-root para seguridad
RUN addgroup --system django && \
    adduser --system --ingroup django django

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivo de dependencias
COPY requirements.txt /app/


# Instalar dependencias de Python
RUN pip install --no-cache-dir -r requirements.txt


# Copiar código de la aplicación
COPY . /app/
RUN python manage.py collectstatic --noinput
# Crear directorio para logs
RUN mkdir -p /app/logs && \
    chown -R django:django /app

# Cambiar a usuario no-root
USER django

# Exponer puerto 8000
EXPOSE 8000

# Health check usando nuestros endpoints personalizados
# Verifica que la aplicación responda correctamente
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8000/healthz/ || exit 1

# Comando por defecto para ejecutar la aplicación
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", "--timeout", "60", "scouts_platform.wsgi:application"]