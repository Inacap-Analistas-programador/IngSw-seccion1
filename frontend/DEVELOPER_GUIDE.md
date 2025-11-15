# GIC Frontend - Guía de Desarrollo

## 📋 Stack Tecnológico

- **React 18.2**: Biblioteca de UI con hooks y componentes funcionales
- **Vite 4**: Build tool moderno con HMR ultrarrápido
- **TailwindCSS 3**: Framework CSS utility-first
- **React Router v6**: Navegación SPA con lazy loading
- **Framer Motion**: Animaciones y transiciones fluidas
- **Vitest**: Framework de testing rápido
- **React Testing Library**: Testing de componentes
- **Prettier**: Formateo automático de código
- **ESLint**: Linting y calidad de código

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Desarrollo con hot reload
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Tests con UI interactiva
npm run test:ui

# Coverage
npm run test:coverage
```

## 🎨 Calidad de Código

```bash
# Linting
npm run lint
npm run lint:fix

# Formateo
npm run format
npm run format:check
```

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── common/          # Componentes reutilizables
│   ├── dashboard/       # Componentes específicos del dashboard
│   ├── ui/             # Componentes de UI base
│   └── wizard/         # Componentes del wizard de inscripción
├── context/            # Contextos de React (Auth, Toast)
├── hooks/              # Custom hooks (useAuth, useForm, useFetch)
├── pages/              # Componentes de página
├── lib/                # Utilidades y API
├── config/             # Configuración y constantes
├── data/               # Datos estáticos y mocks
├── assets/             # Imágenes y recursos estáticos
└── test/               # Setup y tests
```

## 🎯 Características Implementadas

### Hooks Personalizados

#### `useAuth`
Gestión de autenticación con localStorage:
```javascript
const { user, isAuthenticated, login, logout, updateUser } = useAuth();
```

#### `useForm`
Validación de formularios con reglas personalizables:
```javascript
const { values, errors, handleChange, handleSubmit } = useForm(
  initialValues,
  validationRules
);
```

#### `useFetch`
Gestión de peticiones HTTP con loading y error states.

### Contextos

#### `AuthContext`
Provider para autenticación global en toda la aplicación.

#### `ToastContext`
Sistema de notificaciones con tipos: success, error, warning, info.

### Componentes Comunes

- **Breadcrumb**: Navegación breadcrumb con react-router
- **CallToAction**: CTA con variantes y animaciones
- **HeroImage**: Componente de imagen hero con overlay
- **WelcomeMessage**: Mensaje de bienvenida personalizable

### Configuración de Constantes

En `src/config/constants.js`:
- `API_BASE_URL`: URL base de la API
- `ROLES`: Roles de usuario (dirigente, padre, joven, coordinador)
- `ESTADOS_INSCRIPCION`: Estados de inscripción
- `ESTADOS_PAGO`: Estados de pago
- `BREAKPOINTS`: Breakpoints responsive
- `ROUTES`: Rutas de la aplicación
- `STORAGE_KEYS`: Claves de localStorage

## 🎨 Tema y Diseño

### Colores Scout

```css
--scout-azul-oscuro: Color principal
--scout-azul-medio: Color secundario
--scout-azul-claro: Color terciario
--scout-azul-muy-claro: Color de fondo
--scout-verde-natura: Color de éxito/natura
--scout-dorado-aventura: Color de destacado/aventura
--scout-rojo-alerta: Color de error/alerta
```

### Breakpoints Responsive

- **mobile**: 320px - Teléfonos móviles
- **tablet**: 768px - Tablets
- **desktop**: 1024px - Desktop estándar
- **wide**: 1440px - Pantallas amplias

## 🔧 Optimizaciones

### Code Splitting
- Lazy loading de rutas con React.lazy y Suspense
- Manual chunks para vendors (react, ui-components, utils)
- Chunks separados por funcionalidad

### Performance
- Bundle principal optimizado con code splitting
- Chunks lazy < 50KB cada uno
- Memoización con React.memo donde es necesario

## 📝 Convenciones de Código

### Naming
- **Componentes**: PascalCase (ej: `UserProfile.jsx`)
- **Hooks**: camelCase con prefijo "use" (ej: `useAuth.js`)
- **Utilidades**: camelCase (ej: `formatDate.js`)
- **Constantes**: UPPER_SNAKE_CASE (ej: `API_BASE_URL`)

### Imports
```javascript
// Orden de imports
import React from 'react';                    // Bibliotecas externas
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui';     // Componentes locales
import { useAuth } from '@/hooks/useAuth';    // Hooks

import { API_BASE_URL } from '@/config/constants';  // Config
```

### Componentes
```javascript
// Estructura de componente funcional
const ComponentName = ({ prop1, prop2 }) => {
  // 1. Hooks
  const [state, setState] = useState();
  
  // 2. Efectos
  useEffect(() => {}, []);
  
  // 3. Handlers
  const handleClick = () => {};
  
  // 4. Render
  return <div>...</div>;
};

export default ComponentName;
```

## 🧪 Testing

### Estructura de Tests
```javascript
describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('...')).toBeInTheDocument();
  });
});
```

### Coverage Objetivo
- Hooks personalizados: 100%
- Componentes críticos: >80%
- Utilidades: 100%

## 🔐 Seguridad

- Tokens JWT almacenados en localStorage
- Validación de inputs en formularios
- Sanitización de datos en API calls
- HTTPS obligatorio en producción

## 📦 Build y Deploy

```bash
# Build optimizado
npm run build

# El output está en dist/
# Servir con servidor estático o integrar con backend
```

## 🐛 Debugging

### React Developer Tools
Instalar extensión para Chrome/Firefox

### Vite HMR
Hot Module Replacement automático en desarrollo

### Console Logs
- Usar `console.warn` y `console.error` (permitidos por linter)
- Evitar `console.log` en producción

## 📚 Recursos

- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [TailwindCSS Docs](https://tailwindcss.com)
- [React Router Docs](https://reactrouter.com)
- [Vitest Docs](https://vitest.dev)

## 🤝 Contribuir

1. Crear feature branch desde `main`
2. Implementar cambios con tests
3. Ejecutar linter y tests: `npm run lint && npm test`
4. Formatear código: `npm run format`
5. Crear Pull Request con descripción clara

## 📄 Licencia

Proyecto interno GIC - Todos los derechos reservados
