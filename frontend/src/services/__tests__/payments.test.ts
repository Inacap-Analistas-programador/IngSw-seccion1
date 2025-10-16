import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { getPaymentsByGroup } from '../payments'

vi.mock('axios')

describe('payments service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls GET /api/payments/by-group/ with required and optional params', async () => {
    const mocked = axios as unknown as {
      get: (url: string, config?: any) => Promise<{ data: any }>
    }

    const responseData = {
      group: 'grupo-a',
      count: 1,
      total_amount: '1000',
      breakdown: { pagado: 1 },
      items: [{ id: 1, preinscripcion: 1, monto: '1000', medio: 'transferencia', referencia: '', notas: '', estado: 'pagado', fecha_pago: '2025-01-01', created_at: '2025-01-01', updated_at: '2025-01-01' }]
    }
    vi.spyOn(mocked, 'get').mockResolvedValueOnce({ data: responseData })

    const data = await getPaymentsByGroup('grupo-a', 2)

    expect(mocked.get).toHaveBeenCalledWith('/api/payments/by-group/', { params: { group: 'grupo-a', course: 2 }, signal: undefined })
    expect(data.count).toBe(1)
    expect(data.items[0].estado).toBe('pagado')
  })
})
