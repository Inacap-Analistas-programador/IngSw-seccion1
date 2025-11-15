FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Instalar dependencias Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

# Copiar código fuente
COPY . .

# Recopilar archivos estáticos
RUN python manage.py collectstatic --noinput --settings=scout_project.settings

EXPOSE 8000

# Comando de inicio
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "4", "scout_project.wsgi:application"]
