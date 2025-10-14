/**
 * Servicio API centralizado para SGICS
 * Configuración base para todas las llamadas HTTP
 */

import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

// Configuración base de Axios
const apiClient = axios.create({
  // En desarrollo usamos el proxy de Vite: '/api' -> backend
  // En producción se puede definir VITE_API_URL, si no, mantiene '/api'
  baseURL: ((import.meta as any).env?.VITE_API_URL as string) || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para agregar token de autenticación
apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar respuestas y errores
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      await authStore.logout()
    }
    return Promise.reject(error)
  }
)

export { apiClient }

/**
 * Clase base para servicios API con operaciones CRUD estándar
 */
export class BaseApiService {
  constructor(private endpoint: string) {}

  async list(params?: Record<string, any>) {
    const response = await apiClient.get(this.endpoint, { params })
    return response.data
  }

  async get(id: number | string) {
    const response = await apiClient.get(`${this.endpoint}${id}/`)
    return response.data
  }

  async create(data: Record<string, any>) {
    const response = await apiClient.post(this.endpoint, data)
    return response.data
  }

  async update(id: number | string, data: Record<string, any>) {
    const response = await apiClient.put(`${this.endpoint}${id}/`, data)
    return response.data
  }

  async partialUpdate(id: number | string, data: Record<string, any>) {
    const response = await apiClient.patch(`${this.endpoint}${id}/`, data)
    return response.data
  }

  async delete(id: number | string) {
    const response = await apiClient.delete(`${this.endpoint}${id}/`)
    return response.data
  }

  async customAction(id: number | string | null | undefined, action: string, data?: Record<string, any>) {
    // Build URL safely to avoid double slashes when id is empty
    let url = this.endpoint
    if (id !== undefined && id !== null && `${id}` !== '') {
      url += `${id}/`
    }
    url += `${action}/`
    const response = data 
      ? await apiClient.post(url, data)
      : await apiClient.get(url)
    return response.data
  }
}