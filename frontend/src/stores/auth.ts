// Store de autenticación (Pinia)
// Maneja el estado del usuario, tokens y acciones de login/logout
import { defineStore } from "pinia";
import { ref } from "vue";

/**
 * SPRINT 2 - Interface para datos del usuario autenticado
 *
 * Ajustar según la respuesta del backend Django si cambia
* Nota: Ajustar según la respuesta del backend Django si cambia.
* - Verificar estructura exacta del modelo User en Django
* - Agregar campos de roles y permisos según authentication app cuando estén disponibles
* - Incluir campos adicionales del perfil scout si es necesario
 */
// Representación del usuario autenticado (ajustar según backend)
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  rut?: string;

  // Campos adicionales se pueden agregar según el modelo Django User personalizado:
  // role?: 'instructor' | 'coordinador' | 'administrador' | 'participante'
  // permissions?: string[]
  // is_active?: boolean
  // date_joined?: string
  // last_login?: string
  // profile?: {
  //   phone?: string
  //   address?: string
  //   emergency_contact?: string
  // }
}

/**
 * Interface para credenciales de login
 * Ajustar según requirements de la API si el contrato cambia
 */
// Credenciales para autenticación (usuario/contraseña)
export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Interface para respuesta de login de la API
* Nota: Ajustar según la estructura real del backend si el contrato cambia
 */
// Estructura esperada de respuesta de login (ajustar si el backend cambia)
export interface LoginResponse {
  access: string;
  refresh: string;
}

export const useAuthStore = defineStore("auth", () => {
  // Estado de autenticación
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem("access_token"));
  const isAuthenticated = ref<boolean>(!!token.value);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Login con autenticación JWT
  // Inicia sesión contra el backend y configura Axios con el token recibido
  async function login(credentials: LoginCredentials): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
  const { login: loginService } = await import('@/services/auth')
  const response: LoginResponse = await loginService(credentials)
      
      // Construye un objeto de usuario básico (perfil detallado se puede cargar luego)
      const userData: User = {
        id: 0, // Will be populated when we get user profile
        username: credentials.username,
        email: '', // Will be populated when we get user profile
        first_name: '',
        last_name: '',
        full_name: credentials.username,
        rut: undefined
      }
      
  setAuth(userData, response.access, response.refresh)
      
      // Configura cabecera Authorization para las siguientes peticiones
      const axios = (await import('axios')).default
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.access}`
      
    } catch (err: any) {
      if (err.response?.status === 401) {
        error.value = 'Credenciales inválidas'
      } else {
        error.value = err?.message || 'Error de autenticación'
      }
      throw new Error(error.value || 'Error de autenticación')
    } finally {
      loading.value = false;
    }
  }

  /**
  * Establece los datos de autenticación en memoria y localStorage
  * Nota: se podría validar la forma del token antes de guardarlo
   */
  function setAuth(userData: User, accessToken: string, refreshToken?: string) {
    user.value = userData;
    token.value = accessToken;
    isAuthenticated.value = true;

    // Guardar tokens en localStorage
    localStorage.setItem("access_token", accessToken);
    if (refreshToken) {
      localStorage.setItem("refresh_token", refreshToken);
    }
  }

  /**
   * Limpia por completo el estado de autenticación y tokens persistidos
   */
  function clearAuth() {
    user.value = null;
    token.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }

  /**
   * Cierra la sesión del usuario (lado cliente). Si el backend expone un endpoint de logout,
   * se puede invocar aquí antes de limpiar el estado local.
   */
  async function logout(): Promise<void> {
    // Si en el futuro se habilita /api/auth/logout/, se puede llamar aquí.
    clearAuth();
  }

  // Futuras mejoras:
  // - refreshToken(): renovar token cuando expire (apoyado por interceptor en main.ts)
  // - checkAuthStatus(): verificar validez del token en arranque
  // - updateProfile(): actualizar datos del usuario
  // - changePassword(): cambiar contraseña

  return {
    // Estado
    user,
    token,
    isAuthenticated,
    loading,
    error,

    // Acciones
    login,
    logout,
    setAuth,
    clearAuth,
  };
});
