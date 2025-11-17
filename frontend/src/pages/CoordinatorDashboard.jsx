import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import {
  FaRightFromBracket,
  FaBars,
  FaChartLine,
  FaBook,
  FaClipboardCheck,
  FaCreditCard,
  FaUsers,
  FaEnvelope,
  FaAward,
  FaDatabase,
  FaTruck,
} from 'react-icons/fa6';
import authService from '@/services/authService';
import Cursos from '@/components/dashboard/Cursos';
import Pagos from '@/components/dashboard/Pagos';
import EnvioCorreo from '@/components/dashboard/EnvioCorreo';
import Maestros from '@/components/dashboard/Maestros';
import DashboardEjecutivo from '@/components/dashboard/DashboardEjecutivo';
import Inscripciones from '@/components/dashboard/Preinscripcion';
import Acreditacion from '@/components/dashboard/Acreditacion';

import ProveedoresPage from '@/pages/ProveedoresPage';
// import Breadcrumb from '@/components/Breadcrumb';

const CoordinatorDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [coordinator, setCoordinator] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

  // Move render-time console logging into an effect so it's only a side effect
  useEffect(() => {
    console.log('✅ CoordinatorDashboard renderizado correctamente, location:', location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const storedCoordinator = localStorage.getItem('coordinator');
    if (!storedCoordinator) {
      // Para desarrollo, creamos un coordinador por defecto
      const defaultCoordinator = {
        correo: 'coordinador@scout.cl',
        name: 'Coordinador Scout',
        loginTime: new Date().toISOString(),
      };
      localStorage.setItem('coordinator', JSON.stringify(defaultCoordinator));
      setCoordinator(defaultCoordinator);
    } else {
      setCoordinator(JSON.parse(storedCoordinator));
    }
  }, [navigate]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    authService.logout('USER_ACTION');
    console.log('Sesión cerrada');
    navigate('/');
  };

  // Detectar si estamos en ruta /panel o /coordinador/panel, sino caer en /dashboard por compatibilidad
  const basePath = location.pathname.startsWith('/coordinador/panel')
    ? '/coordinador/panel'
    : location.pathname.startsWith('/panel')
      ? '/panel'
      : location.pathname.startsWith('/coordinador/dashboard')
        ? '/coordinador/dashboard'
        : '/dashboard';

  const menuItems = [
    { icon: FaChartLine, label: 'Dashboard Ejecutivo', path: `${basePath}/ejecutivo` },
    { icon: FaBook, label: 'Gestión de Cursos', path: `${basePath}/gestion-cursos` },
    { icon: FaClipboardCheck, label: 'Inscripciones', path: `${basePath}/inscripciones` },
    { icon: FaCreditCard, label: 'Gestión de Pagos', path: `${basePath}/gestion-pagos` },
    { icon: FaEnvelope, label: 'Envío de Correos', path: `${basePath}/envio-correos` },
    { icon: FaAward, label: 'Acreditación', path: `${basePath}/acreditacion` },
    { icon: FaDatabase, label: 'Maestros', path: `${basePath}/maestros` },
    { icon: FaTruck, label: 'Proveedores', path: '/proveedores' },
    { icon: FaChartLine, label: 'Casos de Uso', path: `${basePath}/use-cases` },
  ];

  if (!coordinator) {
    return null;
  }

  const getPageTitle = () => {
    const currentPath = location.pathname;
    const activeItem = menuItems.find((item) => item.path === currentPath);
    return activeItem ? activeItem.label : 'Dashboard';
  };

  return (
    <>
      <Helmet>
        <title>{getPageTitle()} - Scout Formación</title>
        <meta name="description" content="Panel de administración para coordinadores Scout." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-scout-azul-oscuro to-scout-azul-medio text-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-center h-20 border-b border-white/10 px-6">
            <FaAward className="w-8 h-8 mr-3 text-white" />
            <span className="text-xl font-bold text-white">Scout Admin</span>
          </div>
          <nav className="p-3 space-y-1 h-full overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    if (window.innerWidth < 1024) {
                      setSidebarOpen(false);
                    }
                  }}
                  variant="ghost"
                  className={`w-full justify-start text-base py-6 transition-all duration-200 hover:bg-white/10 hover:translate-x-1 ${
                    isActive ? 'bg-white/15 shadow-lg' : ''
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />}
                </Button>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Top Navbar */}
          <nav className="bg-white shadow-sm sticky top-0 z-30 border-b border-gray-200">
            <div className="px-4 py-4 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="text-gray-600 hover:bg-gray-100 lg:hidden"
                >
                  <FaBars className="w-6 h-6" />
                </Button>
                {/* <Breadcrumb /> */}
                <span className="text-lg font-semibold text-gray-800">Dashboard Scout</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="hidden md:flex items-center px-3 py-2 bg-scout-azul-muy-claro rounded-lg">
                  <span className="text-sm text-scout-azul-oscuro">
                    Bienvenido, <span className="font-semibold">{coordinator.name}</span>
                  </span>
                </div>
                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                  size="sm"
                  className="text-scout-azul-medio border-scout-azul-claro hover:bg-scout-azul-muy-claro"
                >
                  Inicio
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:bg-red-50"
                >
                  <FaRightFromBracket className="w-4 h-4 mr-0 sm:mr-2" />
                  <span className="hidden sm:inline">Cerrar Sesión</span>
                </Button>
              </div>
            </div>
          </nav>

          <main className="flex-1 p-6 lg:p-8 bg-gray-50">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">{getPageTitle()}</h1>
              <p className="text-sm text-gray-500 mt-1">Gestión y administración de la plataforma</p>
            </div>
            <Routes>
              <Route path="/ejecutivo" element={<DashboardEjecutivo />} />

              <Route path="/gestion-cursos" element={<Cursos />} />
              <Route path="/inscripciones" element={<Inscripciones />} />
              <Route path="/gestion-pagos" element={<Pagos />} />
              <Route path="/envio-correos" element={<EnvioCorreo />} />
              <Route path="/acreditacion" element={<Acreditacion />} />
              <Route path="/maestros" element={<Maestros />} />
              <Route path="/proveedores" element={<ProveedoresPage />} />
              {/* Fallback route */}
              <Route path="/" element={<Navigate to="ejecutivo" replace />} />
            </Routes>
          </main>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && window.innerWidth < 1024 && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}
      </div>
    </>
  );
};

export default CoordinatorDashboard;
