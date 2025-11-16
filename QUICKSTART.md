# 🚀 Guía Rápida de Inicio - Plataforma GIC

Esta guía te ayudará a poner en marcha la plataforma completa en minutos.

## 📋 Lo que incluye este proyecto

- ✅ **Google Maps Integration** - Selección inteligente de ubicaciones
- ✅ **Sistema de Emails** - Plantillas y envío automatizado con SendGrid
- ✅ **Frontend Moderno** - React 18 + TailwindCSS + Radix UI
- ✅ **Backend Robusto** - Django 5 + REST Framework
- ✅ **Autenticación JWT** - Segura y escalable
- ✅ **API Completa** - 47 modelos con endpoints REST

## 🎯 Inicio Rápido (5 minutos)

### Opción 1: Script Automático (Recomendado)

```bash
# Clonar el repositorio
git clone https://github.com/Inacap-Analistas-programador/IngSw-seccion1.git
cd IngSw-seccion1

# Ejecutar script de inicio (Linux/Mac)
./start-dev.sh

# O en Windows PowerShell
.\start-dev.ps1
```

El script automáticamente:
- ✅ Instala todas las dependencias
- ✅ Configura la base de datos
- ✅ Crea usuario administrador
- ✅ Inicia backend (puerto 8000)
- ✅ Inicia frontend (puerto 3000)

### Opción 2: Manual

#### Backend (Django)

```bash
cd backend

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Aplicar migraciones
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Iniciar servidor
python manage.py runserver
```

Backend disponible en: http://localhost:8000

#### Frontend (React)

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Frontend disponible en: http://localhost:3000

## 🎨 Páginas de Demo

Una vez iniciado el servidor, visita estas páginas para ver las características en acción:

### 🗺️ Google Maps Demo
**URL**: http://localhost:3000/demo/google-maps

- Selector de ubicaciones interactivo
- Autocompletado de direcciones chilenas
- Extracción de información (comuna, región)
- Ejemplos de código listos para usar

**Requisito**: API Key de Google Maps (ver [guía de configuración](./GOOGLE_MAPS_SETUP.md))

### 📧 Email System Demo
**URL**: http://localhost:3000/demo/email-system

- Envío de emails desde plantillas
- Historial de emails enviados
- Estadísticas en tiempo real
- Ejemplos de integración

**Nota**: En desarrollo, los emails se muestran en consola. Para producción, configura SendGrid (ver [guía de configuración](./EMAIL_SYSTEM_SETUP.md))

### 🏠 Página Principal Moderna
**URL**: http://localhost:3000

- Landing page renovada
- Showcasing de características
- Enlaces a demos
- Diseño responsive

## 🔧 Configuración Completa

### 1. Google Maps (Opcional pero Recomendado)

```bash
# Frontend
cd frontend
nano .env
```

Agrega:
```env
VITE_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
```

📚 **Guía detallada**: [GOOGLE_MAPS_SETUP.md](./GOOGLE_MAPS_SETUP.md)

**Pasos rápidos**:
1. Crea cuenta en Google Cloud Platform
2. Habilita Places API y Maps JavaScript API
3. Genera API Key
4. Agrégala al archivo .env

### 2. Sistema de Emails (Opcional para Desarrollo)

```bash
# Backend
cd backend
nano .env
```

Para **desarrollo** (emails en consola):
```env
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
DEFAULT_FROM_EMAIL=noreply@scouts.cl
```

Para **producción** (SendGrid):
```env
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=apikey
EMAIL_HOST_PASSWORD=tu_sendgrid_api_key
DEFAULT_FROM_EMAIL=noreply@scouts.cl
```

📚 **Guía detallada**: [EMAIL_SYSTEM_SETUP.md](./EMAIL_SYSTEM_SETUP.md)

**Pasos rápidos**:
1. Crea cuenta gratuita en SendGrid
2. Genera API Key
3. Verifica sender identity
4. Configura variables en .env

### 3. Crear Plantillas de Email

```bash
cd backend
python manage.py create_email_templates
```

Esto crea plantillas predeterminadas:
- registration_confirmation
- account_verification
- course_enrollment
- event_qr
- event_reminder
- payment_confirmation

## 📁 Estructura del Proyecto

```
IngSw-seccion1/
├── backend/                 # Django backend
│   ├── emails/             # Sistema de correos
│   ├── personas/           # Gestión de personas
│   ├── cursos/            # Gestión de cursos
│   ├── maestros/          # Catálogos maestros
│   ├── geografia/         # Regiones y comunas
│   └── scout_project/     # Configuración principal
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── pages/         # Páginas de la aplicación
│   │   │   ├── ModernHomePage.jsx       # Landing renovada
│   │   │   ├── GoogleMapsDemo.jsx       # Demo Google Maps
│   │   │   ├── EmailSystemDemo.jsx      # Demo Emails
│   │   │   └── ...
│   │   ├── components/    # Componentes reutilizables
│   │   │   ├── LocationSelector.jsx     # Selector de ubicaciones
│   │   │   └── ...
│   │   ├── services/      # Servicios API
│   │   └── ...
│   └── ...
│
├── GOOGLE_MAPS_SETUP.md    # Guía Google Maps
├── EMAIL_SYSTEM_SETUP.md   # Guía Sistema Emails
├── README.md               # Documentación principal
└── QUICKSTART.md          # Esta guía (inicio rápido)
```

## 🌐 URLs Importantes

### Frontend (Puerto 3000)
- **Landing Page**: http://localhost:3000
- **Demo Google Maps**: http://localhost:3000/demo/google-maps
- **Demo Email System**: http://localhost:3000/demo/email-system
- **Preinscripción**: http://localhost:3000/preinscripcion
- **Login Coordinador**: http://localhost:3000/coordinador/login
- **Dashboard**: http://localhost:3000/dashboard

### Backend (Puerto 8000)
- **API Root**: http://localhost:8000/api/
- **Admin Panel**: http://localhost:8000/admin/
- **Swagger UI**: http://localhost:8000/api/docs/
- **ReDoc**: http://localhost:8000/api/redoc/

## 🔑 Credenciales de Prueba

Después de ejecutar el script de inicio o crear el superusuario:

```
Usuario: admin
Contraseña: [la que configuraste]
```

Úsalas para acceder a:
- Django Admin: http://localhost:8000/admin/
- Dashboard Coordinador: http://localhost:3000/coordinador/login

## 🧪 Probar las Características

### 1. Probar Google Maps

```bash
# 1. Configura la API Key en frontend/.env
# 2. Reinicia el servidor frontend
# 3. Ve a http://localhost:3000/demo/google-maps
# 4. Escribe una dirección chilena
# 5. Verás el autocompletado en acción
```

### 2. Probar Sistema de Emails

```bash
# 1. Asegúrate que el backend esté corriendo
# 2. Ve a http://localhost:3000/demo/email-system
# 3. Completa el formulario de envío
# 4. En desarrollo, revisa la consola del backend para ver el email
# 5. Con SendGrid configurado, recibirás el email real
```

### 3. Probar API REST

```bash
# Login y obtener token
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"tu_password"}'

# Usar el token para llamadas autenticadas
curl -X GET http://localhost:8000/api/personas/personas/ \
  -H "Authorization: Bearer tu_token_aqui"
```

## 🐛 Solución de Problemas Comunes

### ❌ Error: "Migrations not applied"

```bash
cd backend
python manage.py migrate
```

### ❌ Error: "npm: command not found"

Instala Node.js desde [nodejs.org](https://nodejs.org/)

### ❌ Error: "Module not found" en frontend

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### ❌ Error: "Port 8000 already in use"

```bash
# En Linux/Mac
lsof -ti:8000 | xargs kill -9

# En Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### ❌ Google Maps no funciona

1. Verifica que la API Key esté configurada
2. Verifica que Places API esté habilitada en Google Cloud
3. Reinicia el servidor frontend
4. Revisa la consola del navegador para errores

### ❌ Emails no se envían

En **desarrollo**: Los emails aparecen en la consola del backend (normal)
En **producción**: Verifica la configuración de SendGrid en backend/.env

## 📚 Documentación Adicional

- [README Principal](./README.md) - Información completa del proyecto
- [Configuración Google Maps](./GOOGLE_MAPS_SETUP.md) - Guía detallada de Google Maps
- [Configuración Emails](./EMAIL_SYSTEM_SETUP.md) - Guía detallada del sistema de correos
- [API Documentation](./API_DOCUMENTATION.md) - Documentación de la API REST
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Guía de despliegue en producción

## 🚀 Siguientes Pasos

Una vez que tengas todo funcionando:

1. **Explora el Dashboard**
   - Ve a http://localhost:3000/coordinador/login
   - Login con tu superusuario
   - Navega por las diferentes secciones

2. **Prueba las Demos**
   - Google Maps: http://localhost:3000/demo/google-maps
   - Email System: http://localhost:3000/demo/email-system

3. **Explora la API**
   - Swagger UI: http://localhost:8000/api/docs/
   - Prueba diferentes endpoints
   - Revisa la documentación interactiva

4. **Personaliza**
   - Modifica las plantillas de email en Django Admin
   - Personaliza los colores en `frontend/src/index.css`
   - Agrega tus propios componentes

5. **Despliega**
   - Sigue la guía [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
   - Configura las variables de entorno de producción
   - Despliega en tu servidor favorito

## 💡 Consejos Pro

### Desarrollo Eficiente

```bash
# Terminal 1 - Backend con auto-reload
cd backend
python manage.py runserver

# Terminal 2 - Frontend con HMR
cd frontend
npm run dev

# Terminal 3 - Comandos adicionales
cd backend
python manage.py shell  # Para probar código Python
```

### Hot Reload

- **Frontend**: Los cambios se reflejan instantáneamente (HMR)
- **Backend**: Django auto-recarga al cambiar archivos .py

### Debug Mode

Para ver más información de debug:

```bash
# Backend - en .env
DEBUG=True

# Frontend - en consola del navegador
localStorage.setItem('debug', '*')
```

## 🎓 Aprendizaje

Si eres nuevo en el stack tecnológico:

- **React**: [React Docs](https://react.dev/)
- **Django**: [Django Docs](https://docs.djangoproject.com/)
- **Django REST Framework**: [DRF Docs](https://www.django-rest-framework.org/)
- **TailwindCSS**: [Tailwind Docs](https://tailwindcss.com/)

## 🤝 Contribuir

¿Quieres contribuir? Excelente!

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

¿Necesitas ayuda?

- **Issues**: [GitHub Issues](https://github.com/Inacap-Analistas-programador/IngSw-seccion1/issues)
- **Email**: contact@gic.scouts.cl
- **Documentación**: Revisa los archivos MD en el repositorio

## ⭐ Star el Proyecto

Si te gusta el proyecto, dale una ⭐ en GitHub!

---

**Happy Coding!** 🚀

---

**Última actualización**: 2024-11-16  
**Versión**: 1.0.0
