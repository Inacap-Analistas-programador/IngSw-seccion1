# 🚀 Guía de Despliegue SGICS - guiasyscoutsbiobio.cl
## Checklist Paso a Paso

---

## **PASO 1: Crear Base de Datos MySQL** 📊

### 1.1 Acceder a MySQL Databases
- [ ] Ve a tu cPanel de `guiasyscoutsbiobio.cl`
- [ ] Busca "**MySQL Databases**" (Base de Datos MySQL)
- [ ] Haz clic para acceder

### 1.2 Crear Base de Datos
- [ ] En "**Crear nueva base de datos**"
- [ ] Nombre: `sgics` 
- [ ] Clic en "**Crear base de datos**"
- [ ] **⚠️ IMPORTANTE**: Anota el nombre completo que aparece (ej: `volbiobio_sgics`)

### 1.3 Crear Usuario MySQL
- [ ] En "**Agregar nuevo usuario**"
- [ ] Usuario: `sgics_admin`
- [ ] Password: Genera uno fuerte (anótalo)
- [ ] Clic en "**Crear usuario**"
- [ ] **⚠️ IMPORTANTE**: Anota el nombre completo del usuario (ej: `volbiobio_sgics_admin`)

### 1.4 Asignar Permisos
- [ ] En "**Agregar usuario a base de datos**"
- [ ] Selecciona el usuario y la base de datos creados
- [ ] **Marca TODOS los privilegios**
- [ ] Clic en "**Realizar cambios**"

### 1.5 Anotar Información ✍️
```
Host: localhost
Puerto: 3306
Base de datos: [EL_NOMBRE_COMPLETO_QUE_ANOTASTE]
Usuario: [EL_USUARIO_COMPLETO_QUE_ANOTASTE]  
Password: [EL_PASSWORD_QUE_GENERASTE]
```

---

## **PASO 2: Configurar Python Application** 🐍

### 2.1 Acceder a Setup Python App
- [ ] En tu cPanel, busca "**Setup Python App**"
- [ ] Haz clic para acceder

### 2.2 Crear Nueva Aplicación
- [ ] Clic en "**CREATE APPLICATION**"
- [ ] **Python version**: Selecciona la más reciente disponible (3.11 o 3.12)
- [ ] **Application root**: `sgics`
- [ ] **Application URL**: `sgics`
- [ ] **Application startup file**: `passenger_wsgi.py`
- [ ] **Application Entry point**: `application`
- [ ] Clic en "**CREATE**"

### 2.3 Anotar Rutas Importantes ✍️
El sistema te mostrará:
```
Application Root: /home/[tu_usuario]/sgics/
Virtual Environment: /home/[tu_usuario]/virtualenv/sgics/
URL: https://guiasyscoutsbiobio.cl/sgics/
```

---

## **PASO 3: Preparar Archivos Localmente** 📦

### 3.1 Crear Build del Frontend
```powershell
# En tu PC, navegar al frontend
cd c:\Users\Ricardo\project\IngSw-seccion1\frontend

# Instalar dependencias si no están
npm install

# Crear build de producción
npm run build

# Verificar que se creó dist/
dir dist
```

### 3.2 Preparar Backend
```powershell
# Navegar al backend
cd ..\backend

# Copiar archivo de configuración
copy .env.production .env

# Abrir .env y completar con los datos de MySQL que anotaste
notepad .env
```

### 3.3 Completar .env con TUS datos reales:
```bash
# Reemplazar con TUS datos reales:
SECRET_KEY=[GENERAR_CLAVE_SECRETA_DE_50_CARACTERES]
DB_NAME=[NOMBRE_COMPLETO_DB_QUE_ANOTASTE]
DB_USER=[USUARIO_COMPLETO_QUE_ANOTASTE]  
DB_PASSWORD=[PASSWORD_QUE_ANOTASTE]
EMAIL_HOST_PASSWORD=[PASSWORD_EMAIL_SI_TIENES]
```

### 3.4 Crear ZIP del Backend
```powershell
# Crear ZIP excluyendo archivos innecesarios
# Usa WinRAR, 7-Zip o el comprimidor que prefieras
# Incluir: todos los archivos .py, requirements.txt, .env
# Excluir: __pycache__, .git, venv, htmlcov, logs, db.sqlite3
```

---

## **PASO 4: Subir Archivos al Servidor** ⬆️

### 4.1 Acceder a File Manager
- [ ] En cPanel, busca "**File Manager**" (Administrador de Archivos)
- [ ] Navegar a `/home/[tu_usuario]/sgics/`

### 4.2 Subir Backend
- [ ] Clic en "**Upload**" (Subir)
- [ ] Seleccionar tu ZIP del backend
- [ ] Esperar que termine la subida
- [ ] **Extraer el ZIP** en la carpeta sgics
- [ ] **Eliminar el ZIP** después de extraer

### 4.3 Verificar Estructura
Debería verse así:
```
/home/[tu_usuario]/sgics/
├── manage.py
├── requirements.txt
├── .env
├── scouts_platform/
├── apps/
├── tests/
└── ...otros archivos
```

---

## **PASO 5: Configurar Python Environment** ⚙️

### 5.1 Acceder al Terminal de Python
- [ ] Ve a "**Setup Python App**"
- [ ] Encuentra tu aplicación `sgics`
- [ ] Clic en el botón "**Terminal**" junto a tu app

### 5.2 Instalar Dependencias
```bash
# En el terminal que se abre:
pwd  # Verificar que estás en /home/[usuario]/sgics

# Instalar dependencias
pip install -r requirements.txt

# Verificar instalaciones importantes
pip list | grep Django
pip list | grep mysqlclient
```

### 5.3 Configurar Django
```bash
# Verificar configuración
python manage.py check

# Crear migraciones
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser
# Email: admin@guiasyscoutsbiobio.cl
# Password: [CREAR_UNO_SEGURO]

# Recolectar archivos estáticos
python manage.py collectstatic --noinput
```

Si tu panel solo permite "Execute python script" (un archivo .py), puedes usar estos atajos ya incluidos en el repo (colócalos en el campo y presiona Run Script):

```
scripts/migrate.py
scripts/collectstatic.py
scripts/createsuperuser.py
```

O bien, el wrapper genérico para cualquier comando:

```
scripts/manage_cmd.py migrate
scripts/manage_cmd.py collectstatic --noinput
scripts/manage_cmd.py showmigrations
```

---

## **PASO 6: Crear passenger_wsgi.py** 🚂

### 6.1 Crear archivo de inicio
En el terminal o File Manager, crear `/home/[usuario]/sgics/passenger_wsgi.py`:

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

### 6.2 Configurar Permisos
```bash
chmod 644 passenger_wsgi.py
chmod -R 755 media/ 2>/dev/null || echo "media folder created later"
chmod -R 755 staticfiles/ 2>/dev/null || echo "staticfiles folder created later"
```

---

## **PASO 7: Subir Frontend** 🎨

### 7.1 Acceder a public_html
- [ ] En File Manager, navegar a `/home/[usuario]/public_html/`
- [ ] Crear carpeta `sgics-app`

### 7.2 Subir Frontend Build
- [ ] Entrar a la carpeta `sgics-app`
- [ ] Subir todos los archivos de `dist/` (NO la carpeta dist, sino su contenido)
- [ ] Debe quedar: `index.html`, `assets/`, etc. directamente en `sgics-app/`

### 7.3 Crear .htaccess para Frontend
Crear `/home/[usuario]/public_html/sgics-app/.htaccess`:
```apache
RewriteEngine On
RewriteBase /sgics-app/
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /sgics-app/index.html [L]

Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
```

---

## **PASO 8: Reiniciar y Probar** 🔄

### 8.1 Reiniciar Python App
- [ ] Ve a "**Setup Python App**"
- [ ] Encuentra tu aplicación `sgics`
- [ ] Clic en "**Restart**"

### 8.2 Probar Backend
- [ ] Visitar: `https://guiasyscoutsbiobio.cl/sgics/`
- [ ] Debería mostrar página de Django
- [ ] Probar: `https://guiasyscoutsbiobio.cl/sgics/admin/`
- [ ] Probar: `https://guiasyscoutsbiobio.cl/sgics/healthz/`

### 8.3 Probar Frontend  
- [ ] Visitar: `https://guiasyscoutsbiobio.cl/sgics-app/`
- [ ] Debería cargar la aplicación Vue.js
- [ ] Verificar consola del navegador (F12) que no hay errores

---

## **🆘 Si hay Problemas:**

### Ver Logs de Errores:
```bash
# En terminal de Python App:
tail -f /home/[usuario]/logs/error_log
tail -f logs/django.log  # si existe
```

### Errores Comunes:
1. **Error 500**: Revisar configuración de .env
2. **Database Error**: Verificar credenciales MySQL
3. **Import Error**: Verificar que todas las dependencias se instalaron
4. **Static Files**: Re-ejecutar `python manage.py collectstatic`

---

## **✅ Checklist Final:**
- [ ] Base de datos MySQL creada y configurada
- [ ] Python App configurada en cPanel  
- [ ] Backend subido y configurado
- [ ] Dependencias instaladas
- [ ] Migraciones ejecutadas
- [ ] Superusuario creado
- [ ] passenger_wsgi.py creado
- [ ] Frontend build subido
- [ ] .htaccess configurado
- [ ] Aplicación reiniciada
- [ ] Backend funciona: `/sgics/`
- [ ] Admin funciona: `/sgics/admin/`
- [ ] Frontend funciona: `/sgics-app/`

**¡Una vez completado todo, tendrás SGICS funcionando en https://guiasyscoutsbiobio.cl!** 🎉