// Configuración de constantes de la aplicación GIC

// API Base URL - Usar HTTPS en producción
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.MODE === 'production' 
    ? 'https://api.gic.scouts.cl' 
    : 'http://localhost:8000');

export const ROLES = {
  DIRIGENTE: 'dirigente',
  PADRE: 'padre',
  JOVEN: 'joven',
  COORDINADOR: 'coordinador',
};

export const ESTADOS_INSCRIPCION = {
  PENDIENTE: 'pendiente',
  CONFIRMADA: 'confirmada',
  CANCELADA: 'cancelada',
  PAGADA: 'pagada',
};

export const ESTADOS_PAGO = {
  PENDIENTE: 'pendiente',
  PAGADO: 'pagado',
  RECHAZADO: 'rechazado',
};

export const BREAKPOINTS = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1440px',
};

export const ROUTES = {
  HOME: '/',
  PREINSCRIPCION: '/preinscripcion',
  COORDINADOR_LOGIN: '/coordinador/login',
  COORDINADOR_DASHBOARD: '/coordinador/dashboard',
  DASHBOARD: '/dashboard',
  PERSONAS: '/personas',
  MAESTROS: '/maestros',
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'idToken',
  USER_DATA: 'userData',
  THEME: 'theme',
};
