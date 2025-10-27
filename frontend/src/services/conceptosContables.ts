import { apiClient } from './api'
import type { ConceptoContableItem } from '@/types'

const BASE = '/api/payments/conceptos-contables/'

export async function listConceptosContables(params?: Record<string, any>) {
  const { data } = await apiClient.get<ConceptoContableItem[]>(BASE, { params })
  return data
}

export async function createConceptoContable(payload: Partial<ConceptoContableItem>) {
  const { data } = await apiClient.post<ConceptoContableItem>(BASE, payload)
  return data
}

export async function updateConceptoContable(id: number, payload: Partial<ConceptoContableItem>) {
  const { data } = await apiClient.put<ConceptoContableItem>(`${BASE}${id}/`, payload)
  return data
}

export async function deleteConceptoContable(id: number) {
  const { data } = await apiClient.delete(`${BASE}${id}/`)
  return data
}

export default { listConceptosContables, createConceptoContable, updateConceptoContable, deleteConceptoContable }
