import { apiClient } from './api'
import type { PrepagoItem } from '@/types'

const BASE = '/api/payments/prepagos/'

export async function listPrepagos(params?: Record<string, any>) {
  const { data } = await apiClient.get<PrepagoItem[]>(BASE, { params })
  return data
}

export async function getPrepago(id: number) {
  const { data } = await apiClient.get<PrepagoItem>(`${BASE}${id}/`)
  return data
}

export async function createPrepago(payload: Partial<PrepagoItem>) {
  const { data } = await apiClient.post<PrepagoItem>(BASE, payload)
  return data
}

export async function updatePrepago(id: number, payload: Partial<PrepagoItem>) {
  const { data } = await apiClient.patch<PrepagoItem>(`${BASE}${id}/`, payload)
  return data
}

export async function deletePrepago(id: number) {
  const { data } = await apiClient.delete(`${BASE}${id}/`)
  return data
}

export default {
  listPrepagos,
  getPrepago,
  createPrepago,
  updatePrepago,
  deletePrepago,
}
