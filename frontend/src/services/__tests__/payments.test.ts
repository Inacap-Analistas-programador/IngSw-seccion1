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
      items: [{ PAP_ID: 1, PER_ID: 1, CUR_ID: 2, USU_ID: 3, PAP_VALOR: '1000', PAP_OBSERVACION: '' }]
    }
    vi.spyOn(mocked, 'get').mockResolvedValueOnce({ data: responseData })

    const data = await getPaymentsByGroup('grupo-a', 2)

    expect(mocked.get).toHaveBeenCalledWith('/api/payments/pagos-persona/by-group/', { params: { group: 'grupo-a', course: 2 }, signal: undefined })
    expect(data.count).toBe(1)
    expect(data.items[0].PAP_VALOR).toBe('1000')
  })
})
