# SGICS Frontend - Vue.js + TypeScript

**Sistema de Gestión Integral de Cursos Scout**

## 🎨 Diseño Inspirado en Plataformas Modernas

El frontend está diseñado con inspiración en plataformas como Evently, con:
- **Gradientes modernos** y efectos glassmorphism
- **Interfaz responsive** y accesible
- **Componentes reutilizables** con Vue 3 Composition API
- **Tipado fuerte** con TypeScript

## 🛠️ Stack Tecnológico

- **Vue 3** - Framework frontend progresivo
- **TypeScript** - Tipado estático
- **Vite** - Build tool ultrarrápido  
- **Tailwind CSS** - Framework CSS utilitario
- **Pinia** - Store management moderno
- **Vue Router** - Enrutamiento SPA

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
├── views/              # Páginas/vistas principales
│   ├── auth/           # Autenticación (Login, Register)
│   ├── dashboard/      # Panel principal
│   └── courses/        # Gestión de cursos
├── stores/             # Estado global (Pinia)
├── router/             # Configuración de rutas
├── utils/              # Utilidades y helpers
└── assets/             # Recursos estáticos
```

## 🚀 Estado Actual - TODOs para el Equipo

### ✅ Completado:
- Estructura base del proyecto
- Sistema de autenticación (stores)
- Login con diseño moderno
- Configuración de TypeScript
- Setup de Tailwind CSS

### 🔄 En Progreso (TODOs principales):

#### 1. Autenticación
```typescript
// TODO en stores/auth.ts:
- Implementar llamada real a la API backend
- Manejar refresh tokens automáticamente
- Agregar validación de formularios
- Implementar recuperación de contraseña
```

#### 2. Rutas y Navegación
```typescript
// TODO en router/index.ts:
- Definir todas las rutas del sistema
- Implementar guards de autenticación
- Configurar lazy loading de vistas
- Agregar meta información para SEO
```

#### 3. Componentes Base
```vue
<!-- TODO crear en components/: -->
- BaseButton.vue (botones reutilizables)
- BaseInput.vue (inputs con validación)  
- BaseCard.vue (tarjetas de contenido)
- NavBar.vue (navegación principal)
- Sidebar.vue (menú lateral)
- LoadingSpinner.vue (indicadores de carga)
```

#### 4. Vistas Principales
```vue
<!-- TODO crear/completar en views/: -->
- DashboardView.vue (panel principal)
- CoursesListView.vue (lista de cursos)
- CourseDetailView.vue (detalle de curso)
- ProfileView.vue (perfil de usuario)
- SettingsView.vue (configuraciones)
```

## 🎯 Próximos Pasos para el Equipo

### Paso 1: Configurar Integración con Backend
1. Crear archivo de configuración de API
2. Implementar interceptores para tokens
3. Manejar errores HTTP globalmente

### Paso 2: Desarrollar Componentes Base
1. Crear system design con Tailwind
2. Implementar componentes reutilizables
3. Documentar props y eventos

### Paso 3: Implementar Funcionalidades Core
1. Dashboard con métricas
2. CRUD de cursos
3. Sistema de notificaciones
4. Upload de archivos

## 📊 Configuración del Entorno

### Variables de Entorno (.env.local):
```bash
# TODO: El equipo debe configurar según el backend
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=SGICS
VITE_APP_VERSION=1.0.0

# Configuraciones opcionales
VITE_ENABLE_DEVTOOLS=true
VITE_API_TIMEOUT=10000
```

### Comandos Disponibles:
```bash
npm run dev          # Desarrollo con hot reload
npm run build        # Build para producción  
npm run preview      # Preview del build
npm run type-check   # Verificar tipos TypeScript
npm run lint         # Ejecutar ESLint
```

## 🎨 Guía de Diseño

### Colores Principales (inspirados en Evently):
- **Primary**: Purple-600 (#7C3AED)
- **Secondary**: Slate-900 (#0F172A)
- **Accent**: Purple-400 (#A855F7)
- **Background**: Gradiente slate-900 → purple-900

### Componentes de UI:
- **Cards**: bg-white/10 con backdrop-blur-lg
- **Buttons**: Gradientes purple con hover effects
- **Inputs**: border-white/20 con focus purple
- **Layout**: min-h-screen con padding responsive

## 🔒 Seguridad Frontend

- ✅ Tokens JWT guardados en localStorage (TODO: evaluar httpOnly cookies)
- ✅ Validación de forms en cliente y servidor
- ✅ Sanitización de datos de entrada
- ✅ Guards de rutas para proteger páginas

## 📝 Notas para Desarrollo

### Convenciones de Código:
- Usar Composition API en lugar de Options API
- Prefijar componentes base con "Base"
- Usar TypeScript en todos los archivos
- Seguir convenciones de Vue 3 + Vite

### Performance:
- Lazy loading de rutas pesadas
- Optimización de imágenes
- Code splitting automático con Vite
- Tree shaking para reducir bundle size

---

**¡El equipo tiene una base sólida para desarrollar! 🚀**

Todos los TODOs están marcados claramente para facilitar el desarrollo colaborativo.