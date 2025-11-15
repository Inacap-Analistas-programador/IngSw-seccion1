# Revisión de Rutas del Frontend - Plataforma GIC

## Estructura Esperada del Frontend

Basándose en las instrucciones del agente y las mejores prácticas de React Router v7 + Vite, el frontend debe seguir esta estructura:

```
frontend/
├── public/                         # Archivos estáticos públicos
│   ├── favicon.ico
│   ├── logo.svg
│   └── assets/
│       └── images/                 # Imágenes estáticas
├── src/
│   ├── main.jsx                    # Punto de entrada de la aplicación
│   ├── App.jsx                     # Componente raíz con Router
│   ├── index.css                   # Estilos globales con Tailwind
│   │
│   ├── routes/                     # Definición de rutas (React Router v7)
│   │   ├── index.jsx              # Archivo principal de rutas
│   │   ├── ProtectedRoute.jsx    # HOC para rutas protegidas
│   │   └── routeConfig.js         # Configuración centralizada de rutas
│   │
│   ├── pages/                      # Componentes de página (vistas)
│   │   ├── Home/
│   │   │   └── HomePage.jsx
│   │   ├── Auth/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── ResetPasswordPage.jsx
│   │   ├── Courses/
│   │   │   ├── CoursesListPage.jsx
│   │   │   ├── CourseDetailPage.jsx
│   │   │   └── CourseEnrollPage.jsx
│   │   ├── Dashboard/
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── UserDashboard.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── Profile/
│   │   │   ├── ProfilePage.jsx
│   │   │   └── EditProfilePage.jsx
│   │   ├── Payments/
│   │   │   ├── PaymentPage.jsx
│   │   │   └── PaymentConfirmationPage.jsx
│   │   └── NotFound/
│   │       └── NotFoundPage.jsx
│   │
│   ├── components/                 # Componentes reutilizables (Atomic Design)
│   │   ├── atoms/                 # Componentes básicos
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Card/
│   │   │   └── Badge/
│   │   ├── molecules/             # Componentes compuestos
│   │   │   ├── FormField/
│   │   │   ├── SearchBar/
│   │   │   └── CourseCard/
│   │   ├── organisms/             # Componentes complejos
│   │   │   ├── Navigation/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Sidebar.jsx
│   │   │   ├── Footer/
│   │   │   │   └── Footer.jsx
│   │   │   ├── Forms/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   ├── RegisterForm.jsx
│   │   │   │   └── CourseForm.jsx
│   │   │   └── Tables/
│   │   │       └── DataTable.jsx
│   │   └── templates/             # Layouts de página
│   │       ├── MainLayout.jsx
│   │       ├── AuthLayout.jsx
│   │       └── DashboardLayout.jsx
│   │
│   ├── hooks/                      # Custom React Hooks
│   │   ├── useAuth.js             # Hook de autenticación
│   │   ├── useCourses.js          # Hook para gestión de cursos
│   │   ├── useEnrollments.js      # Hook para inscripciones
│   │   ├── usePayments.js         # Hook para pagos
│   │   └── useNotifications.js    # Hook para notificaciones
│   │
│   ├── context/                    # Context API para estado global
│   │   ├── AuthContext.jsx        # Contexto de autenticación
│   │   ├── ThemeContext.jsx       # Contexto de tema
│   │   └── NotificationContext.jsx # Contexto de notificaciones
│   │
│   ├── services/                   # Servicios de API (Axios)
│   │   ├── api.js                 # Configuración base de Axios
│   │   ├── authService.js         # Servicios de autenticación
│   │   ├── courseService.js       # Servicios de cursos
│   │   ├── enrollmentService.js   # Servicios de inscripciones
│   │   ├── paymentService.js      # Servicios de pagos
│   │   └── userService.js         # Servicios de usuarios
│   │
│   ├── utils/                      # Utilidades y helpers
│   │   ├── validators.js          # Validadores de formularios
│   │   ├── formatters.js          # Formateadores (fecha, moneda, etc.)
│   │   ├── constants.js           # Constantes de la aplicación
│   │   └── helpers.js             # Funciones auxiliares
│   │
│   ├── styles/                     # Estilos adicionales
│   │   ├── tailwind.config.js     # Configuración de Tailwind
│   │   └── theme.js               # Tema corporativo Scout
│   │
│   └── assets/                     # Assets importados en componentes
│       ├── images/
│       ├── icons/
│       └── fonts/
│
├── .env                            # Variables de entorno (desarrollo)
├── .env.example                    # Ejemplo de variables de entorno
├── .gitignore                      # Archivos ignorados por Git
├── vite.config.js                  # Configuración de Vite
├── tailwind.config.js              # Configuración de Tailwind CSS
├── postcss.config.js               # Configuración de PostCSS
├── package.json                    # Dependencias y scripts
├── jsconfig.json                   # Configuración de rutas absolutas
└── README.md                       # Documentación del frontend
```

## Configuración de Rutas con React Router v7

### 1. Archivo Principal de Rutas (`src/routes/index.jsx`)

```jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from '../components/templates/MainLayout';
import AuthLayout from '../components/templates/AuthLayout';
import DashboardLayout from '../components/templates/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';

// Importar páginas
import HomePage from '../pages/Home/HomePage';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import ResetPasswordPage from '../pages/Auth/ResetPasswordPage';
import CoursesListPage from '../pages/Courses/CoursesListPage';
import CourseDetailPage from '../pages/Courses/CourseDetailPage';
import CourseEnrollPage from '../pages/Courses/CourseEnrollPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import ProfilePage from '../pages/Profile/ProfilePage';
import EditProfilePage from '../pages/Profile/EditProfilePage';
import PaymentPage from '../pages/Payments/PaymentPage';
import PaymentConfirmationPage from '../pages/Payments/PaymentConfirmationPage';
import NotFoundPage from '../pages/NotFound/NotFoundPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'courses',
        children: [
          {
            index: true,
            element: <CoursesListPage />
          },
          {
            path: ':courseId',
            element: <CourseDetailPage />
          },
          {
            path: ':courseId/enroll',
            element: (
              <ProtectedRoute>
                <CourseEnrollPage />
              </ProtectedRoute>
            )
          }
        ]
      }
    ]
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'register',
        element: <RegisterPage />
      },
      {
        path: 'reset-password',
        element: <ResetPasswordPage />
      }
    ]
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />
      },
      {
        path: 'profile',
        element: <ProfilePage />
      },
      {
        path: 'profile/edit',
        element: <EditProfilePage />
      },
      {
        path: 'enrollments',
        element: <UserEnrollmentsPage />
      },
      {
        path: 'payments',
        element: <UserPaymentsPage />
      }
    ]
  },
  {
    path: '/payment',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: ':enrollmentId',
        element: <PaymentPage />
      },
      {
        path: 'confirmation/:paymentId',
        element: <PaymentConfirmationPage />
      }
    ]
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
```

### 2. Componente de Ruta Protegida (`src/routes/ProtectedRoute.jsx`)

```jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children, requiredRole = null }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirigir a login guardando la ruta original
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Usuario no tiene el rol requerido
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
```

### 3. Configuración Centralizada de Rutas (`src/routes/routeConfig.js`)

```javascript
// Constantes de rutas para evitar strings mágicos
export const ROUTES = {
  HOME: '/',
  
  // Autenticación
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    RESET_PASSWORD: '/auth/reset-password',
  },
  
  // Cursos
  COURSES: {
    LIST: '/courses',
    DETAIL: (courseId) => `/courses/${courseId}`,
    ENROLL: (courseId) => `/courses/${courseId}/enroll`,
  },
  
  // Dashboard
  DASHBOARD: {
    HOME: '/dashboard',
    PROFILE: '/dashboard/profile',
    PROFILE_EDIT: '/dashboard/profile/edit',
    ENROLLMENTS: '/dashboard/enrollments',
    PAYMENTS: '/dashboard/payments',
  },
  
  // Pagos
  PAYMENT: {
    PROCESS: (enrollmentId) => `/payment/${enrollmentId}`,
    CONFIRMATION: (paymentId) => `/payment/confirmation/${paymentId}`,
  },
  
  // Admin (si aplica)
  ADMIN: {
    HOME: '/admin',
    COURSES: '/admin/courses',
    USERS: '/admin/users',
    ENROLLMENTS: '/admin/enrollments',
    PAYMENTS: '/admin/payments',
  }
};

// Metadata de las rutas (para navegación, breadcrumbs, etc.)
export const ROUTE_METADATA = {
  [ROUTES.HOME]: {
    title: 'Inicio',
    breadcrumb: 'Inicio',
    icon: 'home'
  },
  [ROUTES.COURSES.LIST]: {
    title: 'Cursos',
    breadcrumb: 'Cursos',
    icon: 'book'
  },
  [ROUTES.DASHBOARD.HOME]: {
    title: 'Dashboard',
    breadcrumb: 'Dashboard',
    icon: 'dashboard',
    protected: true
  },
  // ... más metadata
};
```

### 4. Integración en App.jsx

```jsx
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import AppRouter from './routes';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NotificationProvider>
          <AppRouter />
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
```

## Verificación de la Estructura

### Checklist de Verificación

#### 1. Estructura de Archivos
- [ ] ¿Existe la carpeta `src/pages/` con componentes de página?
- [ ] ¿Existe la carpeta `src/components/` organizada por Atomic Design?
- [ ] ¿Existe la carpeta `src/routes/` con configuración de rutas?
- [ ] ¿Existe la carpeta `src/services/` con servicios de API?
- [ ] ¿Existe la carpeta `src/hooks/` con custom hooks?
- [ ] ¿Existe la carpeta `src/context/` con providers de contexto?

#### 2. Configuración de Rutas
- [ ] ¿Está instalado `react-router-dom` v7?
- [ ] ¿Existe archivo de configuración de rutas (`src/routes/index.jsx`)?
- [ ] ¿Está implementado `ProtectedRoute` para rutas autenticadas?
- [ ] ¿Existe constante `ROUTES` para evitar strings mágicos?
- [ ] ¿Están definidos todos los layouts (Main, Auth, Dashboard)?

#### 3. Navegación
- [ ] ¿El componente Navbar usa rutas de la configuración?
- [ ] ¿Se usa `useNavigate` en lugar de redireccionamientos manuales?
- [ ] ¿Se maneja correctamente el estado de ubicación para redirects post-login?
- [ ] ¿Existe página 404 (NotFound)?

#### 4. Layouts y Templates
- [ ] ¿Existe `MainLayout` para páginas públicas?
- [ ] ¿Existe `AuthLayout` para páginas de autenticación?
- [ ] ¿Existe `DashboardLayout` para páginas del dashboard?
- [ ] ¿Los layouts usan `<Outlet />` correctamente?

#### 5. Hooks de Autenticación
- [ ] ¿Existe `useAuth` hook personalizado?
- [ ] ¿El hook maneja estados de loading, authenticated, user?
- [ ] ¿Se integra con el AuthContext?
- [ ] ¿Maneja tokens JWT correctamente?

#### 6. Servicios API
- [ ] ¿Está configurado Axios con baseURL?
- [ ] ¿Existe interceptor para agregar tokens JWT?
- [ ] ¿Existe interceptor para manejar errores 401/403?
- [ ] ¿Los servicios están organizados por dominio (auth, courses, etc.)?

#### 7. Configuración Vite
- [ ] ¿El archivo `vite.config.js` existe y está bien configurado?
- [ ] ¿Está configurado el proxy para `/api` apuntando al backend?
- [ ] ¿Están definidos los aliases para imports?

#### 8. Tailwind CSS
- [ ] ¿Está instalado Tailwind CSS 4?
- [ ] ¿Existe `tailwind.config.js` con tema corporativo Scout?
- [ ] ¿Los breakpoints están definidos correctamente?
- [ ] ¿El archivo `index.css` importa las directivas de Tailwind?

## Problemas Comunes y Soluciones

### Problema 1: Rutas No Funcionan (404)
**Síntomas**: Al navegar a una ruta, aparece 404 o página en blanco.

**Soluciones**:
1. Verificar que `createBrowserRouter` esté siendo usado en lugar de `BrowserRouter`
2. Verificar que las rutas estén correctamente anidadas
3. Verificar que los componentes estén correctamente importados
4. Verificar la configuración de Vite para manejo de historial

```javascript
// vite.config.js
export default defineConfig({
  server: {
    historyApiFallback: true, // Importante para SPA
  }
});
```

### Problema 2: ProtectedRoute No Funciona
**Síntomas**: Usuarios no autenticados pueden acceder a rutas protegidas.

**Soluciones**:
1. Verificar que `AuthContext` esté envolviendo la app
2. Verificar que `useAuth` hook esté retornando el estado correcto
3. Verificar que los tokens JWT se estén guardando y leyendo correctamente
4. Agregar logs para debug

```jsx
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  console.log('ProtectedRoute - isAuthenticated:', isAuthenticated);
  console.log('ProtectedRoute - isLoading:', isLoading);
  
  // ... resto del código
}
```

### Problema 3: Navegación Entre Páginas Es Lenta
**Síntomas**: Hay delay al cambiar de página.

**Soluciones**:
1. Implementar lazy loading con `React.lazy` y `Suspense`
2. Optimizar componentes pesados con `React.memo`
3. Usar code splitting por rutas

```jsx
import { lazy, Suspense } from 'react';

const CoursesListPage = lazy(() => import('../pages/Courses/CoursesListPage'));

// En las rutas
{
  path: 'courses',
  element: (
    <Suspense fallback={<LoadingSpinner />}>
      <CoursesListPage />
    </Suspense>
  )
}
```

### Problema 4: Estado de Autenticación Se Pierde al Recargar
**Síntomas**: Al hacer F5, el usuario se desloguea.

**Soluciones**:
1. Verificar que los tokens JWT se guarden en localStorage
2. Implementar lógica de restauración de sesión en `AuthContext`
3. Verificar que el token no haya expirado

```jsx
// En AuthContext
useEffect(() => {
  const token = localStorage.getItem('access_token');
  if (token) {
    // Verificar y restaurar sesión
    verifyToken(token).then(user => {
      setUser(user);
      setIsAuthenticated(true);
    }).catch(() => {
      localStorage.removeItem('access_token');
    });
  }
  setIsLoading(false);
}, []);
```

## Comandos para Verificar la Estructura

```powershell
# Desde la carpeta frontend/

# Verificar estructura de directorios
Get-ChildItem -Directory -Recurse -Depth 2 | Select-Object FullName

# Verificar archivos de rutas
Get-ChildItem -Path src/routes -Recurse

# Verificar dependencias instaladas
npm list react-router-dom
npm list axios
npm list tailwindcss

# Verificar configuración de Vite
cat vite.config.js

# Verificar estructura de components
Get-ChildItem -Path src/components -Directory
```

## Recomendaciones Finales

1. **Mantener Consistencia**: Todas las rutas deben seguir el mismo patrón de definición
2. **Centralizar Configuración**: Usar el archivo `routeConfig.js` para todas las rutas
3. **Documentar Rutas**: Mantener documentación actualizada de las rutas disponibles
4. **Testing**: Escribir tests para la navegación y rutas protegidas
5. **Performance**: Implementar lazy loading para páginas grandes
6. **SEO**: Si es necesario, considerar usar `react-helmet` para meta tags dinámicos
7. **Breadcrumbs**: Implementar breadcrumbs para mejorar UX de navegación
8. **Analytics**: Integrar tracking de páginas vistas (Google Analytics, etc.)

---

**Nota**: Esta estructura es la recomendada para el proyecto GIC basándose en las mejores prácticas de React Router v7 y la arquitectura definida en las instrucciones del agente.
