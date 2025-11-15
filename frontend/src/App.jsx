import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('@/pages/HomePage'));
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
            <Route path="/" element={<HomePage />} />
            <Route path="/preinscripcion" element={<PreRegistrationForm />} />
            <Route path="/coordinador/login" element={<CoordinatorLogin />} />
            
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
