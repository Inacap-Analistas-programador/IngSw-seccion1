# Guía de Deployment SGICS a Hosting de Producción

## Configuración de Deployment

### Información del Hosting
- **Panel de Control:** [Proporcionado por administrador]
- **Usuario:** [Configurado en GitHub Secrets]  
- **Password:** [Configurado en GitHub Secrets]
- **FTP Host:** [Proporcionado por administrador]

**IMPORTANTE:** Las credenciales reales están guardadas de forma segura en GitHub Secrets y archivo .env local. No se documentan públicamente por seguridad.

## Pasos de Deployment Manual

### 1. Preparar el código para producción

```bash
# En tu máquina local
cd IngSw-seccion1

# Crear build del frontend
cd frontend
npm run build
cd ..

# Preparar archivos estáticos de Django
cd backend  
python manage.py collectstatic --noinput
cd ..
```

### 2. Configuración del servidor

```bash
# En el servidor (via SSH o Panel de Control)
# 1. Subir archivos al directorio web
# 2. Configurar variables de entorno
# 3. Instalar dependencias Python
# 4. Ejecutar migraciones
# 5. Configurar servidor web
```

### 3. Configuración de Base de Datos

```sql
-- Crear base de datos en el hosting
CREATE DATABASE proyecto_sgics;
CREATE USER 'proyecto_sgics'@'localhost' IDENTIFIED BY 'password_seguro_aqui';
GRANT ALL PRIVILEGES ON proyecto_sgics.* TO 'proyecto_sgics'@'localhost';
FLUSH PRIVILEGES;
```

### 4. Variables de Entorno para Producción

Crear archivo `.env` en el servidor:

```bash
# Producción
DEBUG=False
SECRET_KEY=clave_secreta_super_segura_generada_para_produccion
ALLOWED_HOSTS=proyecto.tu-dominio.com,tu-dominio.com

# Base de datos  
DATABASE_ENGINE=mysql
DATABASE_NAME=tu_nombre_base_datos  
DATABASE_USER=tu_usuario_db
DATABASE_PASSWORD=password_muy_seguro_de_db
DATABASE_HOST=localhost
DATABASE_PORT=3306

# Email (para notificaciones)
EMAIL_HOST=mail.tu-dominio.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=noreply@tu-dominio.com
EMAIL_HOST_PASSWORD=password_email_seguro
```

## Deployment Automatizado (CI/CD)

El workflow de GitHub Actions se encarga de:

1. **Tests automáticos** al hacer push a main
2. **Build y verificación** de código
3. **Deployment automático** si los tests pasan
4. **Health checks** post-deployment

### Activar deployment automático:

1. Configurar secrets en GitHub (ver `.github/SECRETS_SETUP.md`)
2. Hacer push a branch `main`
3. El workflow se ejecutará automáticamente

## Health Checks Post-Deployment

Después del deployment, verificar que estos endpoints respondan:

```bash
# Health check básico
curl https://tu-dominio.com/healthz/
# Respuesta esperada: {"status": "ok", "service": "SGICS Backend API"}

# Readiness check  
curl https://tu-dominio.com/healthz/ready/
# Respuesta esperada: {"status": "ready", "database": "connected"}
```

## Estructura de Archivos en Servidor

```
/public_html/sgics/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── scouts_platform/
│   └── apps/
├── frontend/
│   └── dist/           # Archivos compilados de Vue
├── static/             # CSS, JS, imágenes
├── media/              # Archivos subidos por usuarios  
├── .env               # Variables de entorno (NO subir a Git)
└── logs/              # Logs de la aplicación
```

## Configuración de Servidor Web

### Apache .htaccess (en public_html/sgics/)

```apache
RewriteEngine On

# Servir frontend (Vue.js)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d  
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule . /sgics/frontend/dist/index.html [L]

# Proxy para API Django
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^api/(.*)$ /sgics/backend/wsgi.py/$1 [L,QSA]
```

### Configurar Python/Django en el Hosting

```bash
# En Panel de Python del hosting
App Directory: /public_html/sgics/backend
Entry Point: scouts_platform.wsgi:application  
Python Version: 3.12
```

## Monitoreo y Mantenimiento

### Logs importantes:
- `/logs/django.log` - Logs de la aplicación
- `/logs/access.log` - Accesos web
- `/logs/error.log` - Errores del servidor

### Comandos útiles:
```bash
# Ver logs en tiempo real
tail -f /public_html/sgics/logs/django.log

# Reiniciar aplicación
touch /public_html/sgics/backend/scouts_platform/wsgi.py

# Backup de base de datos
mysqldump proyecto_sgics > backup_$(date +%Y%m%d).sql
```

## Troubleshooting

### Error: "Application failed to start"
- Verificar `.env` file existe y es válido
- Verificar permisos de archivos (644 para archivos, 755 para directorios)
- Revisar logs de error

### Error: "Database connection failed"  
- Verificar credenciales de base de datos en `.env`
- Verificar que la base de datos existe
- Verificar que el usuario tiene permisos

### Error: "Static files not loading"
- Ejecutar `python manage.py collectstatic`
- Verificar configuración de STATIC_ROOT
- Verificar permisos del directorio static/

## Contacto de Soporte

- **Hosting:** Soporte técnico del proveedor
- **Aplicación:** Equipo de desarrollo SGICS
- **Base de datos:** DBA o admin de sistemas

**Última actualización:** 9 octubre 2025