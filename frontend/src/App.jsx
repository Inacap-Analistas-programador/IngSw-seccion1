import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import PreRegistrationForm from '@/pages/PreRegistrationForm';
import CoordinatorLogin from '@/pages/CoordinatorLogin';
import CoordinatorDashboard from '@/pages/CoordinatorDashboard';
// Personas UI removed from local dashboard; external module handles person management
import MaestrosPage from '@/pages/MaestrosPage';
import MaestroForm from '@/pages/MaestroForm';

import TestPage from '@/pages/TestPage';

import ProveedoresPage from '@/pages/ProveedoresPage';
import ProveedorForm from '@/pages/ProveedorForm';
import RegionList from '@/components/geografia/RegionList';

function App() {
  return (
    <Router 
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <div className="min-h-screen">
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
