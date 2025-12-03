// Servicio de autenticación seguro para GIC
// Implementa autenticación JWT y gestión segura de sesiones

const AUTH_TOKEN_KEY = 'gic_auth_token';
const REFRESH_TOKEN_KEY = 'gic_refresh_token';
const USER_DATA_KEY = 'gic_user_data';
const SESSION_TIMEOUT = 15 * 60 * 1000; // 15 minutos
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 60 * 60 * 1000; // 1 hora

class AuthService {
  constructor() {
    this.sessionTimer = null;
    this.initSessionMonitoring();
  }

  /**
   * Inicializa el monitoreo de sesión
   */
  initSessionMonitoring() {
    // Verificar actividad del usuario
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach((event) => {
      document.addEventListener(event, () => this.resetSessionTimer(), true);
    });
  }

  /**
   * Reinicia el temporizador de sesión
   */
  resetSessionTimer() {
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
    }

    if (this.isAuthenticated()) {
      this.sessionTimer = setTimeout(() => {
        this.logout('SESSION_TIMEOUT');
      }, SESSION_TIMEOUT);
    }
  }

  /**
   * Verifica si el usuario está autenticado
   * @returns {boolean}
   */
  isAuthenticated() {
    const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return false;

    try {
      const payload = this.parseJWT(token);
      const now = Date.now() / 1000;

      // Verificar expiración del token
      if (payload.exp && payload.exp < now) {
        this.logout('TOKEN_EXPIRED');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  }

  /**
   * Parsea un token JWT sin verificar la firma (verificación del backend)
   * @param {string} token
   * @returns {object}
   */
  parseJWT(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      throw new Error('Invalid token format');
    }
  }

  /**
   * Realiza el login del usuario
   * @param {string} email
   * @param {string} password
   * @returns {Promise<object>}
   */
  async login(email, password) {
    // Verificar intentos de login
    const attempts = this.getLoginAttempts(email);
    const lockoutUntil = this.getLockoutTime(email);

    if (lockoutUntil && Date.now() < lockoutUntil) {
      const remainingTime = Math.ceil((lockoutUntil - Date.now()) / 60000);
      throw new Error(`Cuenta bloqueada. Intenta en ${remainingTime} minutos.`);
    }

    // Validar formato de email
    if (!this.isValidEmail(email)) {
      throw new Error('Formato de email inválido');
    }

    // Validar contraseña
    if (!password || password.length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres');
    }

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      
      const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Credenciales inválidas');
      }

      const data = await response.json();

      if (data.success) {
        // Limpiar intentos fallidos
        this.clearLoginAttempts(email);

        // Almacenar tokens de forma segura
        sessionStorage.setItem(AUTH_TOKEN_KEY, data.accessToken);
        sessionStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
        sessionStorage.setItem(USER_DATA_KEY, JSON.stringify(data.user));

        // Iniciar temporizador de sesión
        this.resetSessionTimer();

        // Auditar login exitoso
        this.auditLog('LOGIN_SUCCESS', { email, timestamp: new Date().toISOString() });

        return data.user;
      } else {
        throw new Error('Credenciales inválidas');
      }
    } catch (error) {
      // Incrementar intentos fallidos
      this.incrementLoginAttempts(email);

      if (this.getLoginAttempts(email) >= MAX_LOGIN_ATTEMPTS) {
        this.setLockoutTime(email, Date.now() + LOCKOUT_TIME);
        this.auditLog('ACCOUNT_LOCKED', { email, reason: 'MAX_ATTEMPTS' });
        throw new Error('Demasiados intentos fallidos. Cuenta bloqueada por 1 hora.');
      }

      this.auditLog('LOGIN_FAILED', { email, error: error.message });
      throw error;
    }
  }

  /**
   * Cierra la sesión del usuario
   * @param {string} reason - Razón del logout
   */
  logout(reason = 'USER_ACTION') {
    const userData = this.getCurrentUser();

    // Limpiar tokens
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(USER_DATA_KEY);

    // Limpiar timer
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
    }

    // Auditar logout
    this.auditLog('LOGOUT', {
      user: userData?.email,
      reason,
      timestamp: new Date().toISOString(),
    });

    // Redirigir al login si es necesario
    if (reason === 'SESSION_TIMEOUT') {
      window.location.href = '/coordinador/login?reason=timeout';
    }
  }

  /**
   * Obtiene el usuario actual
   * @returns {object|null}
   */
  getCurrentUser() {
    try {
      const userData = sessionStorage.getItem(USER_DATA_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  /**
   * Obtiene el token de acceso
   * @returns {string|null}
   */
  getAccessToken() {
    return sessionStorage.getItem(AUTH_TOKEN_KEY);
  }

  /**
   * Valida formato de email
   * @param {string} email
   * @returns {boolean}
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Gestión de intentos de login
   */
  getLoginAttempts(email) {
    const key = `login_attempts_${email}`;
    return parseInt(sessionStorage.getItem(key) || '0', 10);
  }

  incrementLoginAttempts(email) {
    const key = `login_attempts_${email}`;
    const attempts = this.getLoginAttempts(email) + 1;
    sessionStorage.setItem(key, attempts.toString());
  }

  clearLoginAttempts(email) {
    const key = `login_attempts_${email}`;
    sessionStorage.removeItem(key);
  }

  getLockoutTime(email) {
    const key = `lockout_${email}`;
    const time = sessionStorage.getItem(key);
    return time ? parseInt(time, 10) : null;
  }

  setLockoutTime(email, time) {
    const key = `lockout_${email}`;
    sessionStorage.setItem(key, time.toString());
  }

  /**
   * Sistema de auditoría
   */
  auditLog(action, details) {
    const log = {
      action,
      details,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      ip: 'CLIENT_SIDE', // IP se captura en el backend
    };

    // Guardar en sessionStorage (límite de 50 logs)
    const logs = this.getAuditLogs();
    logs.push(log);
    if (logs.length > 50) {
      logs.shift();
    }
    sessionStorage.setItem('gic_audit_logs', JSON.stringify(logs));

    // TODO: Enviar al backend para auditoría permanente
    console.log('[AUDIT]', log);
  }

  getAuditLogs() {
    try {
      const logs = sessionStorage.getItem('gic_audit_logs');
      return logs ? JSON.parse(logs) : [];
    } catch (error) {
      return [];
    }
  }
}

// Instancia única del servicio
const authService = new AuthService();

export default authService;
