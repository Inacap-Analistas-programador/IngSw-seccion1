import { apiClient } from './api'
import type { ComprobantePagoItem } from '@/types'

const BASE = '/api/payments/comprobantes-pago/'

export async function listComprobantes(params?: Record<string, any>) {
  const { data } = await apiClient.get<ComprobantePagoItem[]>(BASE, { params })
  return data
}

export async function getComprobante(id: number) {
  const { data } = await apiClient.get<ComprobantePagoItem>(`${BASE}${id}/`)
  return data
}

export async function createComprobante(payload: Partial<ComprobantePagoItem>) {
  const { data } = await apiClient.post<ComprobantePagoItem>(BASE, payload)
  return data
}

export async function updateComprobante(id: number, payload: Partial<ComprobantePagoItem>) {
  const { data } = await apiClient.patch<ComprobantePagoItem>(`${BASE}${id}/`, payload)
  return data
}

export async function deleteComprobante(id: number) {
  const { data } = await apiClient.delete(`${BASE}${id}/`)
  return data
}

export default {
  listComprobantes,
  getComprobante,
  createComprobante,
  updateComprobante,
  deleteComprobante,
}
