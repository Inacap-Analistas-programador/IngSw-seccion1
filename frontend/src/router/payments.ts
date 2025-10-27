import type { RouteRecordRaw } from 'vue-router'

export const paymentsRoutes: RouteRecordRaw[] = [
  {
    path: '/payments',
    name: 'payments',
    component: () => import('@/views/PaymentsView.vue'),
    meta: {
      requiresAuth: true,
      roles: ['TESORERO', 'ADMINISTRADOR']
    }
  },
  {
    path: '/payments/prepagos',
    name: 'prepagos',
    component: () => import('@/views/PrepagosView.vue'),
    meta: {
      requiresAuth: true,
      roles: ['TESORERO', 'ADMINISTRADOR']
    }
  },
  {
    path: '/payments/comprobantes',
    name: 'comprobantes',
    component: () => import('@/views/ComprobantesView.vue'),
    meta: {
      requiresAuth: true,
      roles: ['TESORERO', 'ADMINISTRADOR']
    }
  },
  {
    path: '/payments/conceptos',
    name: 'conceptos-contables',
    component: () => import('@/views/ConceptosContablesView.vue'),
    meta: {
      requiresAuth: true,
      roles: ['ADMINISTRADOR']
    }
  }
]