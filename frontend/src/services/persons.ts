// Servicio de personas
// Permite buscar personas por RUT y obtener datos resumidos
import { apiClient } from './api'

// Estructura resumida de datos de persona
export interface PersonSummary {
  id: number
  email: string
  first_name: string
  last_name: string
  rut: string | null
  rama?: string | null
}

// Respuesta del endpoint de búsqueda
export interface PersonSearchResponse {
  results: PersonSummary[]
}

/**
 * Busca personas por RUT chileno (con o sin formato).
 */
export async function searchPersonByRut(rut: string): Promise<PersonSummary[]> {
  const { data } = await apiClient.get<PersonSearchResponse>('/persons/search/', {
    params: { rut },
  })
  return data.results || []
}
