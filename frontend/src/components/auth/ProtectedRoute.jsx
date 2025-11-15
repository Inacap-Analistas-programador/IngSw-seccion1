import { Navigate } from 'react-router-dom';
import authService from '@/services/authService';

/**
 * Componente de ruta protegida
 * Verifica autenticación antes de permitir acceso
 */
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    // Redirigir al login si no está autenticado
    return <Navigate to="/coordinador/login" replace />;
  }

  // Verificar rol si es requerido
  if (requiredRole) {
    const user = authService.getCurrentUser();
    if (user && user.rol !== requiredRole) {
      // Redirigir a página de acceso denegado
      return <Navigate to="/acceso-denegado" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
