import { apiClient } from './api'
import type { PagoComprobanteItem } from '@/types'

const BASE = '/api/payments/pagos-comprobante/'

export async function listPagoComprobante(params?: Record<string, any>) {
  const { data } = await apiClient.get<PagoComprobanteItem[]>(BASE, { params })
  return data
}

export async function createPagoComprobante(payload: Partial<PagoComprobanteItem>) {
  const { data } = await apiClient.post<PagoComprobanteItem>(BASE, payload)
  return data
}

export async function deletePagoComprobante(id: number) {
  const { data } = await apiClient.delete(`${BASE}${id}/`)
  return data
}

export default { listPagoComprobante, createPagoComprobante, deletePagoComprobante }
