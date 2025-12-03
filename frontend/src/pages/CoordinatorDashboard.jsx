import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { FaRightFromBracket } from 'react-icons/fa6';
import authService from '@/services/authService';
import ModernSidebar from '@/components/ModernSidebar';
import Cursos from '@/components/dashboard/Cursos';
import Pagos from '@/components/dashboard/Pagos';
import EnvioCorreo from '@/components/dashboard/EnvioCorreo';
import Maestros from '@/components/dashboard/Maestros';
import DashboardEjecutivo from '@/components/dashboard/DashboardEjecutivo';
import Inscripciones from '@/components/dashboard/Preinscripcion';
import Acreditacion from '@/components/dashboard/Acreditacion';
import Personas from '@/components/dashboard/Personas';
import UserProfilePage from '@/pages/UserProfilePage';
import ProveedoresPage from '@/pages/ProveedoresPage';

const CoordinatorDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(true);
  const [coordinator, setCoordinator] = useState(null);

  useEffect(() => {
    console.log('✅ CoordinatorDashboard renderizado correctamente, location:', location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCoordinator({
        name: user.first_name || user.username || 'Administrador',
        email: user.email,
        role: 'Coordinador'
      });
    } else {
      // Fallback for dev/testing if authService has no user but we are allowed in (e.g. by ProtectedRoute)
      // or redirect to login
      if (!authService.isAuthenticated()) {
        navigate('/coordinador/login');
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    authService.logout('USER_ACTION');
    console.log('Sesión cerrada');
    navigate('/');
  };

  const basePath = location.pathname.startsWith('/coordinador/panel')
    ? '/coordinador/panel'
    : location.pathname.startsWith('/panel')
      ? '/panel'
      : location.pathname.startsWith('/coordinador/dashboard')
        ? '/coordinador/dashboard'
        : '/dashboard';

  if (!coordinator) {
    return null;
  }

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/ejecutivo')) return 'Vista Ejecutiva';
    if (path.includes('/gestion-cursos')) return 'Gestión de Cursos';
    if (path.includes('/inscripciones')) return 'Inscripciones';
    if (path.includes('/personas')) return 'Gestión de Personas';
    if (path.includes('/gestion-pagos')) return 'Gestión Financiera';
    if (path.includes('/envio-correos')) return 'Envío de Correos';
    if (path.includes('/acreditacion')) return 'Acreditación';
    if (path.includes('/maestros')) return 'Maestros';
    if (path.includes('/proveedores')) return 'Proveedores';
    if (path.includes('/perfil')) return 'Mi Perfil';
    return 'Panel de Control';
  };

  const isPagosPage = location.pathname.includes('/gestion-pagos');

  return (
    <>
      <Helmet>
        <title>{getPageTitle()} - GIC</title>
        <meta name="description" content="Panel de administración de la plataforma GIC." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex">
        {/* Modern Sidebar */}
        <ModernSidebar
          basePath={basePath}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        {/* Main content - with fixed left margin for collapsed state */}
        <div
          className="flex-1 flex flex-col ml-[80px]"
          style={{ transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
        >
          {/* Integrated Header */}
          <header
            className="fixed top-0 right-0 z-40 h-16 px-8 flex justify-between items-center backdrop-blur-md bg-slate-900/80 border-b border-white/5 left-[80px]"
            style={{ transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
          >
            <div className="flex items-center space-x-4 pl-4">
              <span className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                {getPageTitle()}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {/* Portal Target for Page Actions (Filters, etc) */}
              <div id="header-actions" className="flex items-center"></div>
              
              <div className="hidden md:flex items-center px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 backdrop-blur-md">
                <span className="text-xs text-white/90" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Bienvenido, <span className="font-semibold text-white">{coordinator.name}</span>
                </span>
              </div>
              <Button
                onClick={() => navigate('/')}
                variant="ghost"
                size="sm"
                className="text-white/70 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10 h-8 text-xs"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                Inicio
              </Button>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 h-8 text-xs"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                <FaRightFromBracket className="w-3 h-3 mr-0 sm:mr-2" />
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </Button>
            </div>
          </header>

          <main className={`flex-1 mt-16 ${isPagosPage ? 'p-0' : 'p-4 lg:p-6'}`}>
            <Routes>
              <Route path="/ejecutivo" element={<DashboardEjecutivo />} />
              <Route path="/gestion-cursos" element={<Cursos />} />
              <Route path="/inscripciones" element={<Inscripciones />} />
              <Route path="/personas" element={<Personas />} />
              <Route path="/gestion-pagos" element={<Pagos />} />
              <Route path="/envio-correos" element={<EnvioCorreo />} />
              <Route path="/acreditacion" element={<Acreditacion />} />
              <Route path="/maestros" element={<Maestros />} />
              <Route path="/proveedores" element={<ProveedoresPage />} />
              <Route path="/perfil" element={<UserProfilePage />} />
              <Route path="/" element={<Navigate to="ejecutivo" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </>
  );
};

export default CoordinatorDashboard;
