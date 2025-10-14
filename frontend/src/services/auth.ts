// Servicio de autenticación (JWT) para el frontend
// Provee funciones para iniciar sesión, refrescar el token y obtener el perfil actual
import { apiClient } from './api'

// Credenciales necesarias para iniciar sesión
export interface LoginCredentials {
  username: string
  password: string
}

// Respuesta esperada al iniciar sesión (tokens JWT)
export interface LoginResponse {
  access: string
  refresh: string
}

// Respuesta al refrescar el token (nuevo access token)
export interface RefreshTokenResponse {
  access: string
}

/**
 * Inicia sesión con usuario y contraseña para obtener tokens JWT
 */
export async function login(credentials: LoginCredentials, signal?: AbortSignal): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>('/auth/login/', credentials, { signal })
  return data
}

/**
 * Refresca el access token usando el refresh token
 */
export async function refreshToken(refresh: string, signal?: AbortSignal): Promise<RefreshTokenResponse> {
  const { data } = await apiClient.post<RefreshTokenResponse>('/auth/refresh/', { refresh }, { signal })
  return data
}

/**
 * Obtiene el perfil del usuario actual (requiere autenticación)
 */
export async function getCurrentUser(signal?: AbortSignal): Promise<any> {
  const { data } = await apiClient.get('/persons/search/', { 
    params: { rut: 'current' }, // Special param to get current user
    signal 
  })
  return data
}