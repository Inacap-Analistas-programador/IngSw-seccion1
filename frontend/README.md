# Scout Formación - Frontend Application

Sistema de gestión de formación Scout con React 18, Vite y TailwindCSS 3.

## 🚀 Características Principales

### Vistas Implementadas

#### Dashboard Administrativo
- **Dashboard Ejecutivo**: Vista general con estadísticas y métricas
- **Gestión de Cursos**: CRUD completo para administración de cursos
- **Inscripciones**: Sistema completo de gestión de inscripciones con CRUD
- **Gestión de Pagos**: Control de pagos y comprobantes
- **Envío de Correos**: Sistema de comunicaciones
- **Acreditación**: Gestión de acreditaciones y QR
- **Maestros**: Vista general de todas las tablas maestras

#### Maestros (Tablas Base)
Sistema completo de gestión para:
- Cargos
- Alimentación
- Conceptos Contables
- Estados Civiles
- Grupos Scout
- Niveles
- Ramas
- Roles
- Tipos de Archivo
- Tipos de Curso
- Geografia (Regiones, Provincias, Comunas)

### Funcionalidades CRUD
Todas las vistas de maestros e inscripciones incluyen:
- ✅ Listar con búsqueda y filtros
- ✅ Ver detalles
- ✅ Crear nuevo registro
- ✅ Editar registro existente
- ✅ Eliminar con confirmación

## 🎨 Diseño y UI/UX

### Tema Scout Corporativo
- Colores principales: #003366 (Azul Scout)
- Diseño limpio y profesional con alto contraste
- Interfaz responsive y accesible
- Animaciones suaves con Framer Motion

### Componentes UI
- Button con variantes (default, destructive, outline, ghost, link)
- Card para contenedores de contenido
- Input y formularios con validación
- Modales con animaciones
- Toast notifications

## 📦 Tecnologías

- **React 18.2** - Framework UI
- **Vite 4.4** - Build tool y dev server
- **TailwindCSS 3.3** - Styling
- **React Router 6.16** - Navegación
- **Framer Motion 10.16** - Animaciones
- **Axios** - Cliente HTTP
- **Lucide React** - Iconos
- **React Icons** - Más iconos

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
npm run lint:fix

# Formateo de código
npm run format
npm run format:check

# Verificar contraste de colores
npm run lint:contrast
```

## 🔧 Configuración

### Variables de Entorno
Copiar `.env.example` a `.env` y configurar:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── auth/           # Autenticación
│   ├── dashboard/      # Componentes del dashboard
│   ├── maestros/       # Componentes de maestros
│   └── ui/             # Componentes UI reutilizables
├── pages/
│   ├── maestros/       # Páginas de maestros individuales
│   └── ...             # Otras páginas
├── services/
│   ├── authService.js
│   ├── cursosService.js
│   ├── maestrosService.js
│   ├── preinscripcionService.js
│   └── httpClient.js
├── hooks/              # Custom hooks
├── utils/              # Utilidades
└── config/             # Configuraciones
```

## 🚦 Estado del Desarrollo

### ✅ Completado
- [x] Configuración base con Vite y React
- [x] Sistema de routing con React Router
- [x] Tema Scout con TailwindCSS
- [x] Componentes UI base (Button, Card, Input, etc)
- [x] Dashboard principal con navegación
- [x] Servicios HTTP con autenticación
- [x] Vista de Maestros (general)
- [x] CRUD completo para Inscripciones
- [x] Páginas individuales para todas las tablas maestras
- [x] Sistema de autenticación
- [x] Protección de rutas
- [x] Mejoras de contraste y accesibilidad

### 🔄 En Progreso
- [ ] Integración completa con backend API
- [ ] Testing unitario y de integración
- [ ] Optimizaciones de rendimiento

## 🎯 Próximos Pasos

1. Conectar todos los componentes con el backend real
2. Implementar gestión de estados global (Context API o Redux)
3. Agregar tests con Vitest
4. Mejorar manejo de errores
5. Agregar documentación de componentes con Storybook

## 📝 Notas de Desarrollo

### Convenciones de Código
- Componentes en PascalCase
- Hooks en camelCase con prefijo 'use'
- Servicios en camelCase con sufijo 'Service'
- Constantes en UPPER_SNAKE_CASE

### Estándares de Calidad
- ESLint configurado
- Prettier para formateo automático
- Verificación de contraste WCAG 2.1 AA
- Build optimizado < 150KB (gzipped)

## 📞 Soporte

Para preguntas o problemas, contactar al equipo de desarrollo.

---

Desarrollado con ❤️ para el Movimiento Scout
