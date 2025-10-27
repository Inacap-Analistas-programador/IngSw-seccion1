import { apiClient } from '@/utils/api'
import type { 
  PagoPersona, 
  Prepago, 
  ComprobantePago, 
  ConceptoContable,
  PaymentFilters,
  CreatePaymentRequest,
  CreateComprobanteRequest,
  ChangeTitularidadRequest
} from '@/types/payments'

// Pagos Persona
export const getPaymentsByGroup = async (group: string, courseId?: number) => {
  const params = new URLSearchParams({ group })
  if (courseId) params.append('course_id', courseId.toString())
  
  const response = await apiClient.get(`/api/payments/pagos-persona/?${params}`)
  return response.data
}

export const getPayment = async (id: number) => {
  const response = await apiClient.get(`/api/payments/pagos-persona/${id}/`)
  return response.data
}

export const createPayment = async (data: CreatePaymentRequest) => {
  const response = await apiClient.post('/api/payments/pagos-persona/', data)
  return response.data
}

export const updatePayment = async (id: number, data: Partial<PagoPersona>) => {
  const response = await apiClient.put(`/api/payments/pagos-persona/${id}/`, data)
  return response.data
}

export const deletePayment = async (id: number) => {
  const response = await apiClient.delete(`/api/payments/pagos-persona/${id}/`)
  return response.data
}

// Prepagos
export const getPrepagos = async (filters?: PaymentFilters) => {
  const params = new URLSearchParams()
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString())
    })
  }
  
  const response = await apiClient.get(`/api/payments/prepagos/?${params}`)
  return response.data
}

export const createPrepago = async (data: Partial<Prepago>) => {
  const response = await apiClient.post('/api/payments/prepagos/', data)
  return response.data
}

export const updatePrepago = async (id: number, data: Partial<Prepago>) => {
  const response = await apiClient.put(`/api/payments/prepagos/${id}/`, data)
  return response.data
}

export const deletePrepago = async (id: number) => {
  const response = await apiClient.delete(`/api/payments/prepagos/${id}/`)
  return response.data
}

// Comprobantes
export const getComprobantes = async (filters?: PaymentFilters) => {
  const params = new URLSearchParams()
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString())
    })
  }
  
  const response = await apiClient.get(`/api/payments/comprobantes-pago/?${params}`)
  return response.data
}

export const createComprobante = async (data: CreateComprobanteRequest) => {
  const response = await apiClient.post('/api/payments/comprobantes-pago/', data)
  return response.data
}

export const updateComprobante = async (id: number, data: Partial<ComprobantePago>) => {
  const response = await apiClient.put(`/api/payments/comprobantes-pago/${id}/`, data)
  return response.data
}

export const deleteComprobante = async (id: number) => {
  const response = await apiClient.delete(`/api/payments/comprobantes-pago/${id}/`)
  return response.data
}

// Cambio de Titularidad
export const changeTitularidad = async (data: ChangeTitularidadRequest) => {
  const response = await apiClient.post('/api/payments/pagos-cambio-persona/', data)
  return response.data
}

export const getTitularidadChanges = async () => {
  const response = await apiClient.get('/api/payments/pagos-cambio-persona/')
  return response.data
}

// Conceptos Contables
export const getConceptosContables = async () => {
  const response = await apiClient.get('/api/payments/conceptos-contables/')
  return response.data
}

export const createConceptoContable = async (data: Partial<ConceptoContable>) => {
  const response = await apiClient.post('/api/payments/conceptos-contables/', data)
  return response.data
}

export const updateConceptoContable = async (id: number, data: Partial<ConceptoContable>) => {
  const response = await apiClient.put(`/api/payments/conceptos-contables/${id}/`, data)
  return response.data
}

export const deleteConceptoContable = async (id: number) => {
  const response = await apiClient.delete(`/api/payments/conceptos-contables/${id}/`)
  return response.data
}