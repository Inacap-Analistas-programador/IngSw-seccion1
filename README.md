# 🏕️ Plataforma GIC - Gestión Integral de Cursos Scouts

## 📋 Descripción General

Este proyecto combina un sistema de gestión integral para cursos y actividades Scouts con un frontend moderno y un backend robusto.

### Frontend
- **Framework:** React 18.2
- **Build Tool:** Vite 4.4
- **Estilos:** TailwindCSS 3.3
- **Animaciones:** Framer Motion
- **Navegación:** React Router

### Backend
- **Framework:** Django 5.2.7
- **API:** Django REST Framework
- **Base de Datos:** SQLite (desarrollo) / MySQL (producción)

## 🚀 Características Principales

### Frontend
- **Dashboard Administrativo:**
  - Estadísticas y métricas
  - CRUD completo para cursos, inscripciones y pagos
  - Gestión de acreditaciones y QR
  - Sistema de comunicaciones
- **Diseño Corporativo:**
  - Tema Scout con colores oficiales
  - Interfaz responsive y accesible
  - Animaciones suaves

### Backend
- **API REST Completa:**
  - Autenticación JWT
  - Documentación automática con Swagger
  - Paginación y filtros
  - Validaciones de negocio
- **Gestión de Datos:**
  - Personas, cursos, pagos, proveedores, preinscripciones
  - Tablas maestras y estructura geográfica

## 📦 Estructura del Proyecto

```
IngSw-seccion1/
├── backend/                    # Backend Django
│   ├── scout_project/          # Configuración principal
│   ├── usuarios/               # Autenticación y usuarios
│   ├── personas/               # Gestión de personas
│   ├── cursos/                 # Gestión de cursos
│   ├── maestros/               # Tablas catálogo
│   ├── geografia/              # Regiones, comunas, grupos
│   ├── pagos/                  # Pagos y comprobantes
│   ├── proveedores/            # Proveedores
│   ├── preinscripcion/         # Sistema de preinscripción
│   ├── archivos/               # Gestión de archivos
│   ├── requirements.txt        # Dependencias Python
│   └── manage.py               # CLI Django
│
├── frontend/                   # Frontend React
│   ├── src/
│   │   ├── components/         # Componentes React
│   │   ├── pages/              # Páginas/vistas
│   │   ├── services/           # Servicios API
│   │   ├── hooks/              # Custom hooks
│   │   ├── context/            # React contexts
│   │   └── utils/              # Utilidades
│   ├── package.json            # Dependencias Node
│   └── vite.config.js          # Configuración Vite
│
└── README.md                   # Este archivo
```

## 🛠️ Scripts Disponibles

### Backend
```bash
# Instalar dependencias
pip install -r requirements.txt

# Aplicar migraciones
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Iniciar servidor
python manage.py runserver
```

### Frontend
```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## 🔗 URLs Importantes

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **Admin Django:** http://localhost:8000/admin/
- **API Docs:** http://localhost:8000/api/docs/

## 📖 Documentación

- [Frontend README](frontend/README.md)
- [Backend README](backend/README.md)

---

**Última actualización:** 2025-11-24
**Estado:** ✅ **VERSIÓN OFICIAL LANZADA**
