import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { searchPersonByRut } from '../persons'

vi.mock('axios')

describe('persons service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls GET /api/persons/search/ with rut param', async () => {
    const mocked = axios as unknown as {
      get: (url: string, config?: any) => Promise<{ data: any }>
    }

    const response = { data: { results: [{ id: 1, email: 'a@b.c', first_name: 'A', last_name: 'B', rut: '11.111.111-1' }] } }
    vi.spyOn(mocked, 'get').mockResolvedValueOnce(response)

    const results = await searchPersonByRut('11111111-1')

    expect(mocked.get).toHaveBeenCalledWith('/api/persons/search/', { params: { rut: '11111111-1' } })
    expect(results).toHaveLength(1)
    expect(results[0].email).toBe('a@b.c')
  })
})
