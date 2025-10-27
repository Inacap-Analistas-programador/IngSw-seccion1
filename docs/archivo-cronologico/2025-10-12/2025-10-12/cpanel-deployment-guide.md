# Guía de Despliegue SGICS en cPanel
## Sistema de Gestión Integral de Cursos Scout

Esta guía te llevará paso a paso por el proceso de despliegue de la aplicación SGICS (Django + Vue.js + MySQL) en un servidor con cPanel.

---

## 📋 **Requisitos Previos**

### **Hosting Requirements:**
- ✅ cPanel con soporte para Python 3.12+
- ✅ MySQL 8.0+ (MariaDB también funciona)
- ✅ Acceso SSH (opcional, pero recomendado)
- ✅ Dominio configurado

### **Archivos Necesarios:**
- ✅ Código backend completo (carpeta `backend/`)
- ✅ Build del frontend (carpeta `dist/` generada)
- ✅ Archivo `.env` configurado para producción

---

## 🚀 **PARTE 1: Preparación Local**

### **1.1 Build del Frontend**
```bash
# Navegar al directorio frontend
cd IngSw-seccion1/frontend

# Instalar dependencias (si no están instaladas)
npm install

# Crear build de producción
npm run build

# Verificar que se creó la carpeta dist/
ls -la dist/
```

### **1.2 Preparar Backend**
```bash
# Navegar al directorio backend
cd ../backend

# Verificar requirements.txt
cat requirements.txt

# Crear archivo .env para producción
cp .env.production .env
# Editar .env con tus datos reales de cPanel
```

### **1.3 Empaquetar para Subida**
```bash
# Crear ZIP del backend
zip -r sgics-backend.zip . -x "*.pyc" "__pycache__/*" ".git/*" "venv/*" "htmlcov/*" "logs/*"

# Crear ZIP del frontend build
cd ../frontend
zip -r sgics-frontend.zip dist/
```

---

## 🗄️ **PARTE 2: Configuración de Base de Datos en cPanel**

### **2.1 Crear Base de Datos MySQL**
1. **Accede a cPanel** → **MySQL Databases**
2. **Crear nueva base de datos:**
   - Nombre: `sgics` (se convertirá en `tu_usuario_sgics`)
   - Anotar el nombre completo generado

### **2.2 Crear Usuario MySQL**
1. En la misma página, **crear usuario:**
   - Nombre: `sgics_admin`
   - Password: `[GENERAR_PASSWORD_FUERTE]`
   - Anotar usuario completo generado

### **2.3 Asignar Permisos**
1. **Asignar usuario a base de datos**
2. **Seleccionar TODOS los privilegios**
3. **Guardar cambios**

### **2.4 Anotar Información de Conexión**
```
Host: localhost
Puerto: 3306
Base de datos: tu_usuario_sgics
Usuario: tu_usuario_sgics_admin
Password: [EL_QUE_GENERASTE]
```

---

## 🐍 **PARTE 3: Configuración de Python App en cPanel**

### **3.1 Crear Python Application**
1. **cPanel** → **Setup Python App**
2. **Crear nueva aplicación:**
   - Python Version: `3.12` (o la más reciente disponible)
   - Application Root: `sgics`
   - Application URL: `sgics` (aparecerá como tu-dominio.com/sgics)
   - Application Startup File: `wsgi.py`
   - Application Entry Point: `application`

### **3.2 Configurar Variables de Entorno**
1. En la aplicación Python creada, ir a **Environment Variables**
2. **Agregar las siguientes variables:**

```
DJANGO_SETTINGS_MODULE=scouts_platform.settings.production
SECRET_KEY=[GENERAR_CLAVE_SECRETA_LARGA]
DEBUG=False
ALLOWED_HOST=tu-dominio.com
ALLOWED_HOST_WWW=www.tu-dominio.com

DB_NAME=tu_usuario_sgics
DB_USER=tu_usuario_sgics_admin
DB_PASSWORD=[PASSWORD_MYSQL]
DB_HOST=localhost
DB_PORT=3306

EMAIL_HOST=mail.tu-dominio.com
EMAIL_HOST_USER=noreply@tu-dominio.com
EMAIL_HOST_PASSWORD=[PASSWORD_EMAIL]
```

### **3.3 Anotar Rutas Importantes**
cPanel te mostrará:
- **Application Root:** `/home/tu_usuario/sgics/`
- **Virtual Environment:** `/home/tu_usuario/virtualenv/sgics/`

---

## 📁 **PARTE 4: Subir y Configurar Archivos**

### **4.1 Subir Backend**
1. **File Manager** → navegar a `/home/tu_usuario/sgics/`
2. **Subir** `sgics-backend.zip`
3. **Extraer** el archivo ZIP
4. **Eliminar** el ZIP después de extraer

### **4.2 Instalar Dependencias**
1. **Setup Python App** → abrir **Terminal** de la aplicación
2. **Ejecutar comandos:**

```bash
# Verificar ubicación
pwd
ls -la

# Instalar dependencias
pip install -r requirements.txt

# Verificar instalación
pip list | grep Django
```

### **4.3 Configurar Base de Datos**
```bash
# Hacer migraciones
python manage.py makemigrations
python manage.py migrate

# Recolectar archivos estáticos
python manage.py collectstatic --noinput

# Crear superusuario
python manage.py createsuperuser
# Email: admin@tu-dominio.com
# Password: [CREAR_PASSWORD_SEGURO]
```

### **4.4 Subir Frontend**
1. **File Manager** → navegar a `/home/tu_usuario/public_html/`
2. **Crear carpeta** `sgics-app` (o el nombre que prefieras)
3. **Subir** `sgics-frontend.zip` a esta carpeta
4. **Extraer** el contenido de `dist/` directamente

---

## ⚙️ **PARTE 5: Configuración de Apache**

### **5.1 Crear .htaccess para Frontend**
Crear archivo `/home/tu_usuario/public_html/sgics-app/.htaccess`:

```apache
RewriteEngine On

# Handle Angular and Vue Router
RewriteBase /sgics-app/
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /sgics-app/index.html [L]

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"

# Cache static assets
<filesMatch "\\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 month"
</filesMatch>
```

### **5.2 Configurar Proxy para API (Opcional)**
Si quieres que `/api/` redirija al backend Python:

Crear/editar `.htaccess` en `public_html`:
```apache
# Proxy API requests to Python app
RewriteEngine On
RewriteRule ^api/(.*)$ /sgics/$1 [P,L]
ProxyPreserveHost On
```

---

## 🔧 **PARTE 6: Configuración Final**

### **6.1 Crear passenger_wsgi.py**
Crear archivo en `/home/tu_usuario/sgics/passenger_wsgi.py`:

```python
import sys
import os

# Add the application directory to the Python path
sys.path.insert(0, os.path.dirname(__file__))

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'scouts_platform.settings.production')

# Import Django WSGI application
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```

### **6.2 Verificar Permisos**
```bash
# En terminal de la Python App
chmod 644 passenger_wsgi.py
chmod -R 755 media/
chmod -R 755 staticfiles/
chmod -R 644 logs/
```

### **6.3 Reiniciar Aplicación**
1. **Setup Python App** → **Restart** la aplicación
2. **Verificar** que no hay errores en los logs

---

## 🧪 **PARTE 7: Testing y Verificación**

### **7.1 Verificar Backend**
```
URL: https://tu-dominio.com/sgics/
Esperado: Página de Django o mensaje JSON

URL: https://tu-dominio.com/sgics/admin/
Esperado: Panel de admin de Django

URL: https://tu-dominio.com/sgics/healthz/
Esperado: {"status": "healthy", "timestamp": "..."}
```

### **7.2 Verificar Frontend**
```
URL: https://tu-dominio.com/sgics-app/
Esperado: Aplicación Vue.js cargada

Verificar: Console del navegador sin errores
Verificar: Requests a API funcionando
```

### **7.3 Test de Integración**
1. **Acceder al frontend**
2. **Intentar login** con el superusuario creado
3. **Verificar dashboard** carga correctamente
4. **Probar funcionalidades** básicas

---

## 🔍 **PARTE 8: Troubleshooting**

### **8.1 Problemas Comunes**

#### **Error 500 - Internal Server Error**
```bash
# Revisar logs
tail -f /home/tu_usuario/sgics/logs/error.log
tail -f /home/tu_usuario/logs/error_log

# Verificar configuración
python manage.py check --deploy
```

#### **Error de Base de Datos**
```bash
# Verificar conexión
python manage.py shell
>>> from django.db import connection
>>> connection.cursor()
```

#### **CORS Errors en Frontend**
- Verificar `CORS_ALLOWED_ORIGINS` en `production.py`
- Verificar que las URLs coincidan exactamente

#### **Static Files Not Loading**
```bash
# Re-ejecutar collectstatic
python manage.py collectstatic --clear --noinput

# Verificar permisos
ls -la staticfiles/
```

### **8.2 Comandos Útiles de Diagnóstico**
```bash
# Verificar Python y Django
python --version
python -m django --version

# Verificar configuración
python manage.py diffsettings

# Test de email
python manage.py shell
>>> from django.core.mail import send_mail
>>> send_mail('Test', 'Test message', 'from@domain.com', ['to@domain.com'])

# Verificar migraciones
python manage.py showmigrations
```

---

## 📝 **PARTE 9: Mantenimiento**

### **9.1 Backups Regulares**
```bash
# Backup de base de datos
mysqldump -u tu_usuario_sgics_admin -p tu_usuario_sgics > backup_$(date +%Y%m%d).sql

# Backup de media files
tar -czf media_backup_$(date +%Y%m%d).tar.gz media/
```

### **9.2 Updates y Deployments**
1. **Desarrollo local** → push cambios a repositorio
2. **Download nuevos cambios** en servidor
3. **Reinstalar dependencias** si hay cambios en requirements.txt
4. **Ejecutar migraciones** si hay cambios en modelos
5. **Recolectar static files** si hay cambios en frontend
6. **Reiniciar aplicación** Python

### **9.3 Monitoring**
- **Revisar logs** regularmente: `/home/tu_usuario/sgics/logs/`
- **Monitorear espacio** en disco: `df -h`
- **Verificar salud** de la aplicación: `/sgics/healthz/`

---

## ✅ **Checklist Final**

- [ ] Base de datos MySQL creada y configurada
- [ ] Usuario MySQL con permisos completos
- [ ] Aplicación Python configurada en cPanel
- [ ] Variables de entorno configuradas
- [ ] Backend subido e instalado
- [ ] Migraciones ejecutadas correctamente
- [ ] Superusuario creado
- [ ] Static files recolectados
- [ ] Frontend build subido a public_html
- [ ] .htaccess configurado para frontend
- [ ] passenger_wsgi.py creado
- [ ] Permisos de archivos configurados
- [ ] Aplicación Python reiniciada
- [ ] Tests de verificación completados
- [ ] Documentación de credenciales guardada de forma segura

---

## 🆘 **Contacto y Soporte**

Si encuentras problemas durante el despliegue:

1. **Revisar logs** de errores específicos
2. **Consultar documentación** de cPanel de tu hosting
3. **Contactar soporte técnico** del hosting si es necesario
4. **Documentar errores** para futura referencia

**¡Éxito con tu despliegue de SGICS!** 🚀