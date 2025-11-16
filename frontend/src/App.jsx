import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('@/pages/HomePage'));
const ModernHomePage = lazy(() => import('@/pages/ModernHomePage'));
const PreRegistrationForm = lazy(() => import('@/pages/PreRegistrationForm'));
const CoordinatorLogin = lazy(() => import('@/pages/CoordinatorLogin'));
const CoordinatorDashboard = lazy(() => import('@/pages/CoordinatorDashboard'));
const PersonasPage = lazy(() => import('@/pages/PersonasPage'));
const PersonaForm = lazy(() => import('@/pages/PersonaForm'));
const MaestrosPage = lazy(() => import('@/pages/MaestrosPage'));
const MaestroForm = lazy(() => import('@/pages/MaestroForm'));
const ProveedoresPage = lazy(() => import('@/pages/ProveedoresPage'));
const ProveedorForm = lazy(() => import('@/pages/ProveedorForm'));
const TestPage = lazy(() => import('@/pages/TestPage'));
const RegionList = lazy(() => import('@/components/geografia/RegionList'));
const GoogleMapsDemo = lazy(() => import('@/pages/GoogleMapsDemo'));
const EmailSystemDemo = lazy(() => import('@/pages/EmailSystemDemo'));

// Maestros pages
const CargosPage = lazy(() => import('@/pages/maestros/CargosPage'));
const AlimentacionesPage = lazy(() => import('@/pages/maestros/AlimentacionesPage'));
const ConceptosContablesPage = lazy(() => import('@/pages/maestros/ConceptosContablesPage'));
const EstadosCivilesPage = lazy(() => import('@/pages/maestros/EstadosCivilesPage'));
const GruposPage = lazy(() => import('@/pages/maestros/GruposPage'));
const NivelesPage = lazy(() => import('@/pages/maestros/NivelesPage'));
const RamasPage = lazy(() => import('@/pages/maestros/RamasPage'));
const RolesPage = lazy(() => import('@/pages/maestros/RolesPage'));
const TiposArchivoPage = lazy(() => import('@/pages/maestros/TiposArchivoPage'));
const TiposCursoPage = lazy(() => import('@/pages/maestros/TiposCursoPage'));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-scout-azul-oscuro"></div>
  </div>
);

function App() {
  return (
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
            <Route path="/" element={<ModernHomePage />} />
            <Route path="/home-old" element={<HomePage />} />
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
                  <RegionList />
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
              path="/maestros/grupos"
              element={
                <ProtectedRoute>
                  <GruposPage />
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
  );
}

export default App;
