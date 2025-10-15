// Servicio de preinscripciones
// Permite crear preinscripciones, listar las propias y cambiar estado
import axios from 'axios'

// Datos necesarios para crear una preinscripción
export interface PreinscripcionData {
  user_id?: number
  course_id: number
  rut_nuevo_usuario?: string
  nombre_nuevo_usuario?: string
  email_nuevo_usuario?: string
  telefono_nuevo_usuario?: string
  observaciones?: string
}

// Modelo de preinscripción devuelto por el backend
export interface Preinscripcion {
  id: number
  user: number
  course: number
  estado: string
  grupo: string
  observaciones: string
  created_at: string
  updated_at: string
  confirmado_at: string | null
  validated_at: string | null
  cancelled_at: string | null
}

// Respuesta al crear una preinscripción
export interface CreatePreinscripcionResponse {
  preinscripcion: Preinscripcion
  message: string
}

/**
 * Crea una nueva preinscripción para un usuario existente o uno nuevo
 */
export async function createPreinscripcion(
  data: PreinscripcionData, 
  signal?: AbortSignal
): Promise<CreatePreinscripcionResponse> {
  const { data: response } = await axios.post<CreatePreinscripcionResponse>(
    '/api/preinscriptions/', 
    data, 
    { signal }
  )
  return response
}

/**
 * Obtiene las preinscripciones del usuario autenticado
 */
export async function getUserPreinscripciones(signal?: AbortSignal): Promise<Preinscripcion[]> {
  const { data } = await axios.get<Preinscripcion[]>('/api/preinscriptions/mis-preinscripciones/', { signal })
  return data
}

/**
 * Actualiza el estado de una preinscripción
 */
export async function updatePreinscripcionEstado(
  id: number, 
  estado: string, 
  observacion?: string,
  signal?: AbortSignal
): Promise<Preinscripcion> {
  const { data } = await axios.patch<Preinscripcion>(
    `/api/preinscriptions/${id}/cambiar-estado/`, 
    { estado, observacion }, 
    { signal }
  )
  return data
}