import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import RutSearchField from '../RutSearchField.vue'

vi.mock('@/services/persons', () => ({
  searchPersonByRut: vi.fn(async () => [{ id: 1, email: 'a@b.c', first_name: 'A', last_name: 'B', rut: '11.111.111-1' }])
}))

describe('RutSearchField', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('emits autofill when a single person is found', async () => {
    const wrapper = mount(RutSearchField)
    const input = wrapper.find('input')
    await input.setValue('11111111-1')
    await input.trigger('blur')

    // Wait for search to complete
    await new Promise(r => setTimeout(r, 0))

    const events = wrapper.emitted('autofill')
    expect(events).toBeTruthy()
    expect((events![0][0] as { email: string }).email).toBe('a@b.c')
  })
})
