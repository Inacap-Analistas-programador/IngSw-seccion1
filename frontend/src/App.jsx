import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

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
            <Route path="/coordinador/dashboard/*" element={<CoordinatorDashboard />} />
            <Route path="/dashboard/*" element={<CoordinatorDashboard />} />
            {/* Rutas de personas */}
            <Route path="/personas" element={<PersonasPage />} />
            <Route path="/personas/editar/:id" element={<PersonaForm />} />
            {/* Rutas de maestros */}
            <Route path="/maestros" element={<MaestrosPage />} />
            <Route path="/maestros/nuevo" element={<MaestroForm />} />
            <Route path="/maestros/editar/:id" element={<MaestroForm />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
