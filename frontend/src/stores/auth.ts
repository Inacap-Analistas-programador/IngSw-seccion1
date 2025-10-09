import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * SPRINT 2 - Interface para datos del usuario autenticado
 * 
 * TODO SPRINT 2: El equipo debe ajustar según la respuesta del backend Django
 * - Verificar estructura exacta del modelo User en Django
 * - Agregar campos de roles y permisos según authentication app
 * - Incluir campos adicionales del perfil scout si es necesario
 */
export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  full_name: string
  rut?: string
  
  // SPRINT 2 TODO: Agregar campos según modelo Django User personalizado:
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
 * TODO: Ajustar según requirements de la API
 */
export interface LoginCredentials {
  username: string
  password: string
}

/**
 * Interface para respuesta de login de la API
 * TODO: Ajustar según la estructura real del backend
 */
export interface LoginResponse {
  access_token: string
  refresh_token: string
  user: User
}

export const useAuthStore = defineStore('auth', () => {
  // Estado de autenticación
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('access_token'))
  const isAuthenticated = ref<boolean>(!!token.value)
  const loading = ref(false)

  /**
   * SPRINT 2 - Función principal de login con JWT
   * 
   * TODO SPRINT 2: El equipo debe implementar:
   * 1. Conexión con endpoint Django /api/auth/login/
   * 2. Manejo de tokens JWT (access + refresh)
   * 3. Validación de respuestas y errores HTTP
   * 4. Almacenamiento seguro de tokens
   */
  async function login(credentials: LoginCredentials): Promise<void> {
    loading.value = true
    
    try {
      // SPRINT 2 TODO: Implementar llamada real al backend Django
      // const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
      // const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     username: credentials.username,
      //     password: credentials.password
      //   })
      // })
      
      // SPRINT 2 TODO: Procesar respuesta del servidor
      // const data: LoginResponse = await response.json()
      
      // SPRINT 2 TODO: Manejar diferentes códigos de respuesta
      // if (!response.ok) {
      //   switch (response.status) {
      //     case 401:
      //       throw new Error('Credenciales inválidas')
      //     case 429:
      //       throw new Error('Demasiados intentos de login')
      //     case 500:
      //       throw new Error('Error del servidor')
      //     default:
      //       throw new Error(data.message || 'Error de autenticación')
      //   }
      // }
      
      // SPRINT 2 TODO: Guardar tokens JWT y datos del usuario
      // setAuth(data.user, data.access_token, data.refresh_token)
      
      // TEMPORAL - SPRINT 2 TODO: Remover simulación
      console.warn('SPRINT 2: Implementar conexión real con Django REST Framework')
      throw new Error('SPRINT 2 TODO: Conectar con backend Django + JWT')
      
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * Establece los datos de autenticación
   * TODO: Validar tokens antes de guardar
   */
  function setAuth(userData: User, accessToken: string, refreshToken?: string) {
    user.value = userData
    token.value = accessToken
    isAuthenticated.value = true
    
    // Guardar tokens en localStorage
    localStorage.setItem('access_token', accessToken)
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken)
    }
  }

  /**
   * Limpia los datos de autenticación
   */
  function clearAuth() {
    user.value = null
    token.value = null
    isAuthenticated.value = false
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }

  /**
   * Logout del usuario
   * TODO: El equipo debe implementar logout en el servidor si es necesario
   */
  async function logout(): Promise<void> {
    try {
      // TODO: Implementar llamada a endpoint de logout si es necesario
      // await fetch('/api/auth/logout/', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${token.value}`,
      //     'Content-Type': 'application/json'
      //   }
      // })
    } catch (error) {
      console.error('Error durante logout:', error)
    } finally {
      clearAuth()
    }
  }

  // TODO: El equipo debe implementar funciones adicionales según necesidades:
  // - refreshToken(): renovar token cuando expire
  // - checkAuthStatus(): verificar si el token sigue siendo válido
  // - updateProfile(): actualizar datos del usuario
  // - changePassword(): cambiar contraseña

  return {
    // Estado
    user,
    token,
    isAuthenticated,
    loading,
    
    // Acciones
    login,
    logout,
    setAuth,
    clearAuth
  }
})