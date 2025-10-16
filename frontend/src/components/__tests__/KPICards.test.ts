/**
 * Tests para el componente KPICards
 * Sistema de Gestión Integral de Cursos Scout
 * 
 * Prueba la funcionalidad de las tarjetas KPI,
 * indicadores de tendencia y acciones.
 */

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import KPICards from '@/components/KPICards.vue'
import type { KPICard } from '@/types'

// Mock del router
const mockRouter = {
  push: vi.fn(),
}

vi.mock('vue-router', () => ({
  useRouter: () => mockRouter,
}))

const createWrapper = (props: { kpis?: KPICard[] } = {}) => {
  const pinia = createPinia()
  
  const defaultKpis: KPICard[] = [
    {
      id: 'total-courses',
      title: 'Cursos Activos',
      subtitle: 'Cursos disponibles para inscripción',
      value: 12,
      icon: 'AcademicCapIcon',
      iconBg: 'bg-blue-400',
      valueColor: 'text-blue-400',
      trend: 20,
      actionLabel: 'Ver Cursos',
      actionRoute: '/courses',
    },
    {
      id: 'total-enrollments',
      title: 'Preinscripciones',
      subtitle: 'Personas preincritas este mes',
      value: 156,
      icon: 'UserGroupIcon',
      iconBg: 'bg-green-400',
      valueColor: 'text-green-400',
      trend: 11.4,
      actionLabel: 'Gestionar',
      actionRoute: '/preinscriptions',
    },
  ]
  
  return mount(KPICards, {
    props: {
      kpis: (props.kpis as KPICard[]) || defaultKpis,
    },
    global: {
      plugins: [pinia],
      mocks: {
        $router: mockRouter,
      },
    },
  })
}

describe('KPICards', () => {
  it('renders KPI cards correctly', () => {
    const wrapper = createWrapper()
    
    expect(wrapper.text()).toContain('Cursos Activos')
    expect(wrapper.text()).toContain('12')
    expect(wrapper.text()).toContain('Preinscripciones')
    expect(wrapper.text()).toContain('156')
  })

  it('displays trend indicators correctly for upward trend', () => {
    const wrapper = createWrapper()
    
  const trendElements = wrapper.findAll('[data-testid="trend-indicator"]')
    
  const firstTrend = trendElements[0]
  expect(firstTrend.classes()).toContain('text-green-400')
  expect(firstTrend.text()).toContain('↗ 20%')
  })

  it('displays trend indicators correctly for downward trend', () => {
    const kpisWithDownTrend: KPICard[] = [
      {
        id: 'declining-metric',
        title: 'Métrica en Declive',
        value: 80,
  icon: 'ChartBarIcon',
  subtitle: 'Métrica con descenso',
  iconBg: 'bg-red-400',
  valueColor: 'text-red-400',
  trend: -20,
      },
    ]

    const wrapper = createWrapper({ kpis: kpisWithDownTrend })
    
    const trendElement = wrapper.find('[data-testid="trend-indicator"]')
  expect(trendElement.classes()).toContain('text-red-400')
  expect(trendElement.text()).toContain('↘ 20%')
  })

  it('displays stable trend correctly', () => {
    const kpisWithStableTrend: KPICard[] = [
      {
        id: 'stable-metric',
        title: 'Métrica Estable',
        value: 50,
  icon: 'ChartBarIcon',
  subtitle: 'Sin cambios',
  iconBg: 'bg-blue-400',
  valueColor: 'text-blue-400',
  trend: 0,
      },
    ]

    const wrapper = createWrapper({ kpis: kpisWithStableTrend })
    
    const trendElement = wrapper.find('[data-testid="trend-indicator"]')
  expect(trendElement.classes()).toContain('text-slate-400')
  expect(trendElement.text()).toContain('→ 0%')
  })

  it('navigates to correct route when action button is clicked', async () => {
    const wrapper = createWrapper()
    
    const actionButtons = wrapper.findAll('[data-testid="kpi-action-btn"]')
    
    // Hacer clic en el primer botón de acción
    await actionButtons[0].trigger('click')
    
    expect(mockRouter.push).toHaveBeenCalledWith('/courses')
  })

  it('handles KPIs without actions gracefully', () => {
    const kpisWithoutActions: KPICard[] = [
      {
        id: 'no-action-kpi',
        title: 'KPI Sin Acción',
        value: 42,
        icon: 'ChartBarIcon',
        subtitle: 'sin acción',
        iconBg: 'bg-purple-400',
        valueColor: 'text-purple-400',
      },
    ]

    const wrapper = createWrapper({ kpis: kpisWithoutActions })
    
    // Verificar que no hay botones de acción
    const actionButtons = wrapper.findAll('[data-testid="kpi-action-btn"]')
    expect(actionButtons).toHaveLength(0)
  })

  it('applies correct color classes based on KPI color', () => {
    const kpisWithDifferentColors: KPICard[] = [
      {
        id: 'blue-kpi',
        title: 'KPI Azul',
        value: 1,
        icon: 'ChartBarIcon',
        subtitle: 'azul',
        iconBg: 'bg-blue-400',
        valueColor: 'text-blue-400',
      },
      {
        id: 'green-kpi',
        title: 'KPI Verde',
        value: 2,
        icon: 'ChartBarIcon',
        subtitle: 'verde',
        iconBg: 'bg-green-400',
        valueColor: 'text-green-400',
      },
      {
        id: 'red-kpi',
        title: 'KPI Rojo',
        value: 3,
        icon: 'ChartBarIcon',
        subtitle: 'rojo',
        iconBg: 'bg-red-400',
        valueColor: 'text-red-400',
      },
    ]

    const wrapper = createWrapper({ kpis: kpisWithDifferentColors })
    
  // Verify icon background classes
  const icons = wrapper.findAll('[data-testid="kpi-icon"]')
  expect(icons[0].classes()).toContain('bg-blue-400')
  expect(icons[1].classes()).toContain('bg-green-400')
  expect(icons[2].classes()).toContain('bg-red-400')
  })

  it('formats large numbers correctly', () => {
    const kpisWithLargeNumbers: KPICard[] = [
      {
        id: 'large-number',
        title: 'Número Grande',
        value: 1500000,
        icon: 'ChartBarIcon',
        subtitle: 'grande',
        iconBg: 'bg-blue-400',
        valueColor: 'text-blue-400',
      },
    ]

    const wrapper = createWrapper({ kpis: kpisWithLargeNumbers })
    
  const values = wrapper.findAll('[data-testid="kpi-value"]')
  // Formateo compacto por defecto: 1.5M
  expect(values[0].text()).toContain('1.5M')
  })

  it('renders empty state when no KPIs provided', () => {
    const wrapper = createWrapper({ kpis: [] })
    
    // Verificar que no hay tarjetas KPI
    const kpiCards = wrapper.findAll('[data-testid="kpi-card"]')
    expect(kpiCards).toHaveLength(0)
  })
})