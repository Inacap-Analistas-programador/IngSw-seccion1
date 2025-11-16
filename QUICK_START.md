# 🚀 Quick Start - Scout Formación Platform

## Para Desarrolladores

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Aplicación disponible en: http://localhost:3000

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

API disponible en: http://localhost:8000

## Credenciales de Prueba

**Coordinador:**
- Usuario: coordinador@scout.cl
- Password: (ver con equipo)

## Documentación

### Frontend
- 📘 [README Frontend](frontend/README.md) - Guía completa
- 📊 [Resumen de Implementación](frontend/IMPLEMENTATION_SUMMARY.md)
- 🚀 [Guía de Despliegue](frontend/DEPLOYMENT_GUIDE.md)
- ✅ [Reporte de Completitud](FRONTEND_COMPLETION_REPORT.md)

### Backend
- 📘 [README Backend](backend/README.md)
- 🔐 [Guía de Seguridad](backend/SECURITY_CHECKLIST.md)
- 🔗 [Integración Frontend](backend/FRONTEND_INTEGRATION.md)

## URLs Principales

### Públicas
- `/` - Página de inicio
- `/preinscripcion` - Formulario de preinscripción

### Dashboard (Requiere login)
- `/dashboard/ejecutivo` - Dashboard principal
- `/dashboard/inscripciones` - Gestión de inscripciones
- `/dashboard/gestion-cursos` - Gestión de cursos
- `/maestros` - Vista general de tablas maestras

### Maestros Individuales
- `/maestros/cargos`
- `/maestros/alimentaciones`
- `/maestros/conceptos-contables`
- `/maestros/estados-civiles`
- `/maestros/grupos`
- `/maestros/niveles`
- `/maestros/ramas`
- `/maestros/roles`
- `/maestros/tipos-archivo`
- `/maestros/tipos-curso`

## Características Principales

✅ Dashboard administrativo completo
✅ Sistema de inscripciones con CRUD
✅ Gestión de maestros (10 tablas)
✅ Autenticación y protección de rutas
✅ Tema Scout corporativo
✅ Responsive design
✅ API REST con Django

## Stack Tecnológico

**Frontend:**
- React 18.2
- Vite 4.4
- TailwindCSS 3.3
- React Router 6
- Framer Motion

**Backend:**
- Django 4.2
- Django REST Framework
- PostgreSQL
- JWT Authentication

## Comandos Útiles

### Frontend
```bash
npm run build       # Build de producción
npm run preview     # Preview del build
npm run lint        # Verificar código
npm run format      # Formatear código
```

### Backend
```bash
python manage.py test              # Ejecutar tests
python manage.py makemigrations    # Crear migraciones
python manage.py createsuperuser   # Crear admin
```

## Soporte

Para problemas o preguntas:
1. Revisar documentación en `/frontend` y `/backend`
2. Verificar logs en consola
3. Contactar al equipo de desarrollo

---

*Última actualización: Noviembre 2024*
