/**
 * Tests para el componente CourseCard
 * Sistema de Gestión Integral de Cursos Scout
 * 
 * Prueba la funcionalidad del sistema de semáforo,
 * barras de progreso y acciones de curso.
 */

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import CourseCard from '@/components/CourseCard.vue'


vi.mock('vue-router', () => ({
  useRouter: () => mockRouter,
}))

// Mock del router
const mockRouter = {
  push: vi.fn(),
}

const createWrapper = (props = {}) => {
  const pinia = createPinia()
  
  return mount(CourseCard, {
    props: {
      course: {
        id: 1,
        title: 'Curso de Primeros Auxilios',
        code: 'AUX-001',
        rama: 'GENERAL',
        current_participants: 15,
        max_participants: 30,
        payments_received: 10,
        status: 'active',
        start_date: '2024-11-01',
        end_date: '2024-11-02',
        price: 25000,
        ...props,
      },
    },
    global: {
      plugins: [pinia],
      mocks: {
        $router: mockRouter,
      },
    },
  })
}

describe('CourseCard', () => {
  it('renders course information correctly', () => {
    const wrapper = createWrapper()
    
    expect(wrapper.text()).toContain('Curso de Primeros Auxilios')
    expect(wrapper.text()).toContain('AUX-001')
    expect(wrapper.text()).toContain('GENERAL')
    expect(wrapper.text()).toContain('15')
    expect(wrapper.text()).toContain('30')
    expect(wrapper.text()).toContain('$25.000')
  })

  it('shows green status for low enrollment', () => {
    const wrapper = createWrapper({
      current_participants: 10,
      max_participants: 30,
    })
    
    const statusBadge = wrapper.find('[data-testid="status-badge"]')
    expect(statusBadge.classes()).toContain('bg-green-500')
    const statusText = wrapper.find('[data-testid="status-text"]')
    expect(statusText.text()).toBe('Disponible')
  })

  it('shows yellow status for medium enrollment', () => {
    const wrapper = createWrapper({
      current_participants: 20,
      max_participants: 30,
    })
    
    const statusBadge = wrapper.find('[data-testid="status-badge"]')
    expect(statusBadge.classes()).toContain('bg-yellow-500')
    const statusText = wrapper.find('[data-testid="status-text"]')
    expect(statusText.text()).toBe('Medio')
  })

  it('shows red status for high enrollment', () => {
    const wrapper = createWrapper({
      current_participants: 28,
      max_participants: 30,
    })
    
    const statusBadge = wrapper.find('[data-testid="status-badge"]')
    expect(statusBadge.classes()).toContain('bg-red-500')
    const statusText = wrapper.find('[data-testid="status-text"]')
    expect(statusText.text()).toBe('Lleno')
  })

  it('calculates progress percentage correctly', () => {
    const wrapper = createWrapper({
      current_participants: 15,
      max_participants: 30,
    })
    
    const progressBar = wrapper.find('[data-testid="progress-bar"]')
    expect(progressBar.attributes('style')).toContain('width: 50%')
  })

  it('navigates to course details when view button is clicked', async () => {
    const wrapper = createWrapper()
    
    const viewButton = wrapper.find('[data-testid="view-course-btn"]')
    await viewButton.trigger('click')
    
    expect(mockRouter.push).toHaveBeenCalledWith('/courses/1')
  })

  it('navigates to enrollment when enroll button is clicked', async () => {
    const wrapper = createWrapper()
    
    const paymentsBtn = wrapper.find('[data-testid="payments-btn"]')
    await paymentsBtn.trigger('click')
    expect(mockRouter.push).toHaveBeenCalledWith('/courses/1/payments')
  })

  it('shows full status when course is full', () => {
    const wrapper = createWrapper({
      current_participants: 30,
      max_participants: 30,
    })
    const statusBadge = wrapper.find('[data-testid="status-badge"]')
    expect(statusBadge.classes()).toContain('bg-red-500')
    const statusText = wrapper.find('[data-testid] ~ [data-testid="status-text"]')
    expect(wrapper.find('[data-testid="status-text"]').text()).toBe('Lleno')
  })

  it('shows correct dates formatting', () => {
    const wrapper = createWrapper({
      start_date: '2024-11-01',
      end_date: '2024-11-02',
    })
    
    expect(wrapper.text()).toContain('01/11/2024')
    expect(wrapper.text()).toContain('02/11/2024')
  })
})