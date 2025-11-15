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

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-scout-azul-oscuro"></div>
  </div>
);

import TestPage from '@/pages/TestPage';

import ProveedoresPage from '@/pages/ProveedoresPage';
import ProveedorForm from '@/pages/ProveedorForm';
import RegionList from '@/components/geografia/RegionList';

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
            <Route path="/" element={<HomePage />} />
            <Route path="/preinscripcion" element={<PreRegistrationForm />} />
            <Route path="/coordinador/login" element={<CoordinatorLogin />} />
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pre-inscripcion" element={<PreRegistrationForm />} />
          <Route path="/coordinador/ingreso" element={<CoordinatorLogin />} />
          <Route path="/coordinador/panel/*" element={<CoordinatorDashboard />} />
          <Route path="/coordinador/dashboard/*" element={<CoordinatorDashboard />} />
          <Route path="/panel/*" element={<CoordinatorDashboard />} />
          <Route path="/dashboard/*" element={<CoordinatorDashboard />} />
          <Route path="/panel/*" element={<CoordinatorDashboard />} />
          {/* Rutas de personas eliminadas (gestionadas por repositorio remoto) */}
          {/* Rutas de maestros */}
          <Route path="/maestros" element={<MaestrosPage />} />
          <Route path="/maestros/nuevo" element={<MaestroForm />} />
          <Route path="/maestros/editar/:id" element={<MaestroForm />} />
          {/* Rutas de proveedores */}
          <Route path="/proveedores" element={<ProveedoresPage />} />
          <Route path="/proveedores/nuevo" element={<ProveedorForm />} />
          <Route path="/proveedores/editar/:id" element={<ProveedorForm />} />
          <Route path="/prueba" element={<TestPage />} />
          {/* Rutas de geografía */}
          <Route path="/geografia/regiones" element={<RegionList />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
