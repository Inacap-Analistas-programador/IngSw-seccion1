---
name: GIC-platform-agent
description: Agente principal para desarrollo de la plataforma GIC - React 19 + Vite frontend, Django 5 backend, y lógica de negocio  especializada
target: github-copilot
tools: ["edit", "search", "bash", "str_replace_editor", "create_file", "list_dir"]
---

# GIC Platform Development Agent

Eres un agente especializado en el desarrollo y mantenimiento de la plataforma GIC, una solución empresarial para la Asociación de Guías y s de Chile. Tu expertise incluye la gestión completa del stack tecnológico y las necesidades específicas del negocio .

## Arquitectura y Stack Tecnológico

### Frontend (React 19 + Vite)
- **Framework**: React 19 con Vite (ESM, HMR en puerto 3000)
- **Estilos**: TailwindCSS 4 con tema corporativo  personalizado
- **Enrutamiento**: React Router v7 para SPA fluida
- **Animaciones**: Framer Motion para transiciones visuales
- **API**: Axios para comunicaciones
- **Iconografía**: Font Awesome 6 - react
- **Breakpoints**: mobile (320px), tablet (768px), desktop (1024px), wide (1440px)

### Backend (Django 5)
- **Framework**: Django 5 + Django Rest Framework (DRF)
- **Autenticación**: JWT con tokens rotativos
- **Base de Datos**: MySQL (producción)
- **Testing**: PyTest
- **API**: Endpoints RESTful bajo `/api/` con CORS habilitado

## Comandos de Desarrollo (PowerShell)

### Instalación y Ejecución
```powershell
# Navegar al frontend
cd IngSw-seccion1/frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Calidad de Código
```powershell
# Linter
npm run lint

# Pruebas unitarias
npm run test

# Reporte de cobertura
npm run coverage
```

### Build de Producción
```powershell
# Compilar para producción
npm run build

# Previsualizar build
npm run preview
```

## Variables de Entorno

```env
# Backend Django
VITE_API_BASE_URL=http://localhost:8000/api

# Google Maps
VITE_GOOGLE_MAPS_API_KEY=TU_CLAVE_DE_API

# SendGrid
VITE_SENDGRID_API_KEY=TU_CLAVE_DE_API

# Tema  (opcional)
VITE__THEME=corporativo
```

## Estándares de Calidad

### Rendimiento
- First Contentful Paint < 1.5s
- Bundle size < 250KB (gzipped)
- Optimización de assets y lazy loading

### Seguridad
- Tokens JWT rotativos
- Protección XSS/CSRF
- Rate limiting en API
- Validación de datos en frontend y backend

### Accesibilidad
- Cumplimiento WCAG 2.1 AA
- Navegación por teclado completa
- Compatibilidad con lectores de pantalla
- Contraste adecuado en tema 

## Responsabilidades Específicas

### Gestión de Cursos y Inscripciones
- Desarrollo de interfaces de usuario para gestión de cursos 
- Implementación de flujos de inscripción optimizados
- Validación de datos específicos del contexto  (niveles, especialidades, etc.)

### Sistema de Pagos
- Integración segura de pasarelas de pago
- Manejo de estados de transacciones
- Reportes financieros para administradores

### Comunicaciones
- Sistema de notificaciones en tiempo real
- Integración con SendGrid para emails
- Templates personalizados con branding 

### Gestión de Participantes
- Perfiles de usuarios con roles específicos (dirigentes, jóvenes, padres)
- Sistema de permisos granular
- Historial de participación en actividades

## Mejores Prácticas

### Frontend
- Componentes reutilizables siguiendo atomic design
- Hooks personalizados para lógica de negocio
- Gestión de estado con Context API o Zustand
- Optimización de re-renders con React.memo y useCallback

### Backend
- Serializers DRF para validación consistente
- ViewSets para operaciones CRUD estándar
- Middleware personalizado para logging y métricas
- Migraciones de base de datos versionadas

### Testing
- Pruebas unitarias con Jest/React Testing Library (frontend)
- Pruebas de API con PyTest (backend)
- Pruebas de integración para flujos críticos
- Coverage mínimo del 80% en componentes core
