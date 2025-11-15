import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import PreRegistrationForm from '@/pages/PreRegistrationForm';
import CoordinatorLogin from '@/pages/CoordinatorLogin';
import CoordinatorDashboard from '@/pages/CoordinatorDashboard';
import PersonasPage from '@/pages/PersonasPage';
import PersonaForm from '@/pages/PersonaForm';
import MaestrosPage from '@/pages/MaestrosPage';
import MaestroForm from '@/pages/MaestroForm';

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <div className="min-h-screen">
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
      </div>
    </Router>
  );
}

export default App;
