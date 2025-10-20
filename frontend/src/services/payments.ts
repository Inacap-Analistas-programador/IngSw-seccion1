import axios from 'axios'

// Frontend types matching backend canonical PagoPersona DTO
export interface PagoPersonaItem {
  PAP_ID: number
  PER_ID: number
  CUR_ID: number | null
  USU_ID: number
  PAP_VALOR: string | number
  PAP_TIPO?: string
  PAP_FECHA_HORA?: string | null
  PAP_OBSERVACION?: string
}

export interface PaymentsByGroupResponse {
  group: string
  count: number
  total_amount: string
  items: PagoPersonaItem[]
}

export async function getPaymentsByGroup(
  group: string,
  courseId?: number,
  signal?: AbortSignal
): Promise<PaymentsByGroupResponse> {
  const params: Record<string, any> = { group }
  if (courseId) params.course = courseId

  // Backend provides this under pagos-persona/by-group via the payments router
  const { data } = await axios.get<PaymentsByGroupResponse>('/api/payments/pagos-persona/by-group/', { params, signal })
  return data
}
