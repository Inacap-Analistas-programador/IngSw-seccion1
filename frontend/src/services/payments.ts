import axios from 'axios'

export interface PaymentItem {
  id: number
  preinscripcion: number
  monto: string | number
  medio: string
  referencia: string
  notas: string
  estado: string
  fecha_pago: string | null
  created_at: string
  updated_at: string
}

export interface PaymentsByGroupResponse {
  group: string
  count: number
  total_amount: string
  breakdown: Record<string, number>
  items: PaymentItem[]
}

export async function getPaymentsByGroup(
  group: string,
  courseId?: number,
  signal?: AbortSignal
): Promise<PaymentsByGroupResponse> {
  const params: Record<string, any> = { group }
  if (courseId) {
    params.course = courseId
  }
  const { data } = await axios.get<PaymentsByGroupResponse>(
    '/api/payments/by-group/',
    { params, signal }
  )
  return data
}
