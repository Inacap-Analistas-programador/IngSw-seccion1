import { apiClient } from './api'
import type { PagoCambioPersonaItem } from '@/types'

const BASE = '/api/payments/pago-cambio-persona/'

export async function listPagoCambioPersona(params?: Record<string, any>) {
  const { data } = await apiClient.get<PagoCambioPersonaItem[]>(BASE, { params })
  return data
}

export async function createPagoCambioPersona(payload: Partial<PagoCambioPersonaItem>) {
  const { data } = await apiClient.post<PagoCambioPersonaItem>(BASE, payload)
  return data
}

export async function deletePagoCambioPersona(id: number) {
  const { data } = await apiClient.delete(`${BASE}${id}/`)
  return data
}

export default { listPagoCambioPersona, createPagoCambioPersona, deletePagoCambioPersona }
