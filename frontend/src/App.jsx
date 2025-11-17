import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ErrorBoundary from '@/components/ErrorBoundary';

// Lazy load pages for code splitting with retry logic
const lazyRetry = (componentImport) =>
  lazy(() =>
    componentImport().catch((error) => {
      console.error('Error loading component, retrying...', error);
      // Retry after 1 second
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(componentImport());
        }, 1000);
      });
    })
  );

const HomePage = lazyRetry(() => import('@/pages/HomePage'));
const CursosPublicPage = lazyRetry(() => import('@/pages/CursosPublicPage'));
const UserProfilePage = lazyRetry(() => import('@/pages/UserProfilePage'));
const PreRegistrationForm = lazyRetry(() => import('@/pages/PreRegistrationForm'));
const CoordinatorLogin = lazyRetry(() => import('@/pages/CoordinatorLogin'));
const CoordinatorDashboard = lazyRetry(() => import('@/pages/CoordinatorDashboard'));
const PersonasPage = lazyRetry(() => import('@/pages/PersonasPage'));
const PersonaForm = lazyRetry(() => import('@/pages/PersonaForm'));
const MaestrosPage = lazyRetry(() => import('@/pages/MaestrosPage'));
const MaestroForm = lazyRetry(() => import('@/pages/MaestroForm'));
const ProveedoresPage = lazyRetry(() => import('@/pages/ProveedoresPage'));
const ProveedorForm = lazyRetry(() => import('@/pages/ProveedorForm'));
const TestPage = lazyRetry(() => import('@/pages/TestPage'));
const GoogleMapsDemo = lazyRetry(() => import('@/pages/GoogleMapsDemo'));
const EmailSystemDemo = lazyRetry(() => import('@/pages/EmailSystemDemo'));

// Geografia pages
const RegionesPage = lazyRetry(() => import('@/pages/geografia/RegionesPage'));
const ProvinciasPage = lazyRetry(() => import('@/pages/geografia/ProvinciasPage'));
const ComunasPage = lazyRetry(() => import('@/pages/geografia/ComunasPage'));
const ZonasPage = lazyRetry(() => import('@/pages/geografia/ZonasPage'));
const DistritosPage = lazyRetry(() => import('@/pages/geografia/DistritosPage'));
const GruposPage = lazyRetry(() => import('@/pages/geografia/GruposPage'));

// Maestros pages
const CargosPage = lazyRetry(() => import('@/pages/maestros/CargosPage'));
const AlimentacionesPage = lazyRetry(() => import('@/pages/maestros/AlimentacionesPage'));
const ConceptosContablesPage = lazyRetry(() => import('@/pages/maestros/ConceptosContablesPage'));
const EstadosCivilesPage = lazyRetry(() => import('@/pages/maestros/EstadosCivilesPage'));
const NivelesPage = lazyRetry(() => import('@/pages/maestros/NivelesPage'));
const RamasPage = lazyRetry(() => import('@/pages/maestros/RamasPage'));
const RolesPage = lazyRetry(() => import('@/pages/maestros/RolesPage'));
const TiposArchivoPage = lazyRetry(() => import('@/pages/maestros/TiposArchivoPage'));
const TiposCursoPage = lazyRetry(() => import('@/pages/maestros/TiposCursoPage'));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600 text-lg">Cargando...</p>
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <div className="min-h-screen">
          <Suspense fallback={<PageLoader />}>
            <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<HomePage />} />
            <Route path="/cursos" element={<CursosPublicPage />} />
            <Route path="/perfil" element={<UserProfilePage />} />
            <Route path="/preinscripcion" element={<PreRegistrationForm />} />
            <Route path="/coordinador/login" element={<CoordinatorLogin />} />
            
            {/* Demo pages - públicas */}
            <Route path="/demo/google-maps" element={<GoogleMapsDemo />} />
            <Route path="/demo/email-system" element={<EmailSystemDemo />} />
            
            {/* Rutas del dashboard - protegidas */}
            <Route
              path="/coordinador/dashboard/*"
              element={
                <ProtectedRoute>
                  <CoordinatorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <CoordinatorDashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Rutas de personas - protegidas */}
            <Route
              path="/personas"
              element={
                <ProtectedRoute>
                  <PersonasPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/personas/editar/:id"
              element={
                <ProtectedRoute>
                  <PersonaForm />
                </ProtectedRoute>
              }
            />
            
            {/* Rutas de maestros - protegidas */}
            <Route
              path="/maestros"
              element={
                <ProtectedRoute>
                  <MaestrosPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/maestros/nuevo"
              element={
                <ProtectedRoute>
                  <MaestroForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/maestros/editar/:id"
              element={
                <ProtectedRoute>
                  <MaestroForm />
                </ProtectedRoute>
              }
            />
            
            {/* Rutas de proveedores - protegidas */}
            <Route
              path="/proveedores"
              element={
                <ProtectedRoute>
                  <ProveedoresPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/proveedores/nuevo"
              element={
                <ProtectedRoute>
                  <ProveedorForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/proveedores/editar/:id"
              element={
                <ProtectedRoute>
                  <ProveedorForm />
                </ProtectedRoute>
              }
            />
            
            {/* Rutas de geografía - protegidas */}
            <Route
              path="/geografia/regiones"
              element={
                <ProtectedRoute>
                  <RegionesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/geografia/provincias"
              element={
                <ProtectedRoute>
                  <ProvinciasPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/geografia/comunas"
              element={
                <ProtectedRoute>
                  <ComunasPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/geografia/zonas"
              element={
                <ProtectedRoute>
                  <ZonasPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/geografia/distritos"
              element={
                <ProtectedRoute>
                  <DistritosPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/geografia/grupos"
              element={
                <ProtectedRoute>
                  <GruposPage />
                </ProtectedRoute>
              }
            />
            
            {/* Rutas de maestros - protegidas */}
            <Route
              path="/maestros/cargos"
              element={
                <ProtectedRoute>
                  <CargosPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/maestros/alimentaciones"
              element={
                <ProtectedRoute>
                  <AlimentacionesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/maestros/conceptos-contables"
              element={
                <ProtectedRoute>
                  <ConceptosContablesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/maestros/estados-civiles"
              element={
                <ProtectedRoute>
                  <EstadosCivilesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/maestros/niveles"
              element={
                <ProtectedRoute>
                  <NivelesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/maestros/ramas"
              element={
                <ProtectedRoute>
                  <RamasPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/maestros/roles"
              element={
                <ProtectedRoute>
                  <RolesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/maestros/tipos-archivo"
              element={
                <ProtectedRoute>
                  <TiposArchivoPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/maestros/tipos-curso"
              element={
                <ProtectedRoute>
                  <TiposCursoPage />
                </ProtectedRoute>
              }
            />
            
            {/* Ruta de prueba - protegida */}
            <Route
              path="/prueba"
              element={
                <ProtectedRoute>
                  <TestPage />
                </ProtectedRoute>
              }
            />
            
            {/* Ruta por defecto */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
    </ErrorBoundary>
  );
}

export default App;
