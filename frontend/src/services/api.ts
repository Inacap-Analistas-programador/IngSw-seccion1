/**
 * Servicio API centralizado para SGICS
 * Configuración base para todas las llamadas HTTP
 */

import axios, { AxiosInstance } from 'axios'
import { useAuthStore } from '@/stores/auth'

// Configuración base de Axios
const createConfig = {
  // En desarrollo usamos el proxy de Vite: '/api' -> backend
  // En producción se puede definir VITE_API_URL, si no, mantiene '/api'
  baseURL: ((import.meta as any).env?.VITE_API_URL as string) || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
}

// Some test environments mock `axios` and may not provide `axios.create` or
// may have it stubbed to return undefined. To avoid module-init crashes in
// unit tests, fall back to the global axios instance when create() is not
// available or returns a falsy value.
let apiClient: AxiosInstance
try {
  if (typeof axios.create === 'function') {
    const created = axios.create(createConfig)
    apiClient = (created || axios) as AxiosInstance
  } else {
    // If create isn't available (tests often mock axios), build a tiny
    // wrapper that preserves the behavior of prefixing requests with the
    // configured baseURL. This keeps tests stable while allowing mocks to
    // intercept calls to axios.get/post/etc.
    // Cast the tiny wrapper to AxiosInstance so call sites can use generics
    apiClient = ({
      get: (url: string, opts?: any) => axios.get(`${createConfig.baseURL}${url}`, opts),
      post: (url: string, data?: any, opts?: any) => axios.post(`${createConfig.baseURL}${url}`, data, opts),
      put: (url: string, data?: any, opts?: any) => axios.put(`${createConfig.baseURL}${url}`, data, opts),
      patch: (url: string, data?: any, opts?: any) => axios.patch(`${createConfig.baseURL}${url}`, data, opts),
      delete: (url: string, opts?: any) => axios.delete(`${createConfig.baseURL}${url}`, opts),
      interceptors: {
        request: { use: () => {} },
        response: { use: () => {} }
      }
    } as unknown) as AxiosInstance
  }
} catch (err) {
  // On unexpected errors, fall back to raw axios (without create). Tests
  // that mock axios will still intercept these calls; however, we try to
  // ensure a baseURL prefix when possible.
  apiClient = axios as AxiosInstance
}

// Interceptor para agregar token de autenticación
if (apiClient && apiClient.interceptors && apiClient.interceptors.request && typeof apiClient.interceptors.request.use === 'function') {
  apiClient.interceptors.request.use(
    (config: any) => {
      const authStore = useAuthStore()
      if (authStore?.token) {
        if (!config.headers) config.headers = {}
        ;(config.headers as any).Authorization = `Bearer ${authStore.token}`
      }
      return config
    },
    (error: any) => {
      return Promise.reject(error)
    }
  )
}

// Interceptor para manejar respuestas y errores
if (apiClient && apiClient.interceptors && apiClient.interceptors.response && typeof apiClient.interceptors.response.use === 'function') {
  apiClient.interceptors.response.use(
    (response: any) => response,
    async (error: any) => {
      if (error.response?.status === 401) {
        const authStore = useAuthStore()
        // logout may not exist in test auth store mocks but we'll attempt it
        if (authStore && typeof authStore.logout === 'function') {
          await authStore.logout()
        }
      }
      return Promise.reject(error)
    }
  )
}

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