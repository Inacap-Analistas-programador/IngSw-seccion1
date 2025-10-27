import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as paymentsService from '@/services/payments'
import type { PagoPersona, PaymentStats, PaymentFilters } from '@/types/payments' 

export const usePaymentsStore = defineStore('payments', () => {
  const list = ref<PagoPersona[]>([])
  const prepagos = ref<any[]>([])
  const comprobantes = ref<any[]>([])
  const conceptos = ref<any[]>([])
  const meta = ref<PaymentStats>({ count: 0, total_amount: 0, breakdown: { ingresos: 0, egresos: 0, pendientes: 0, registrados: 0 } })
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchByGroup(group: string, courseId?: number) {
    loading.value = true
    error.value = null
    try {
      const data = await paymentsService.getPaymentsByGroup(group, courseId)
      list.value = (data.items || data || []) as unknown as PagoPersona[]
      meta.value = {
        count: data.count,
        total_amount: parseFloat(data.total_amount), 
        breakdown: {
          ingresos: data.breakdown?.ingresos || 0,
          egresos: data.breakdown?.egresos || 0,
          pendientes: data.breakdown?.pendientes || 0,
          registrados: data.breakdown?.registrados || 0
        }
      }
      return data
    } catch (err: any) {
      error.value = err?.message || 'Error cargando pagos'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function get(id: number) {
    loading.value = true
    try {
      const data = await paymentsService.getPayment(id)
      return data
    } finally {
      loading.value = false
    }
  }

  async function create(payload: Record<string, any>) {
    loading.value = true
    try {
      const data = await paymentsService.createPayment(payload)
      return data
    } finally {
      loading.value = false
    }
  }

  async function update(id: number, payload: Record<string, any>) {
    loading.value = true
    try {
      const data = await paymentsService.updatePayment(id, payload)
      return data
    } finally {
      loading.value = false
    }
  }

  async function remove(id: number) {
    loading.value = true
    try {
      const data = await paymentsService.deletePayment(id)
      return data
    } finally {
      loading.value = false
    }
  }

  async function emitirComprobante(payload: Record<string, any>) {
    loading.value = true
    try {
      const data = await paymentsService.createComprobante(payload)
      return data
    } finally {
      loading.value = false
    }
  }

  async function cambioTitularidad(payload: Record<string, any>) {
    loading.value = true
    try {
      const data = await paymentsService.changeTitularidad(payload)
      return data
    } finally {
      loading.value = false
    }
  }

  async function fetchPrepagos(filters?: PaymentFilters) {
    loading.value = true
    try {
      // Mock implementation - replace with actual service call when available
      prepagos.value = []
      return { items: [] }
    } finally {
      loading.value = false
    }
  }

  async function fetchComprobantes(filters?: PaymentFilters) {
    loading.value = true
    try {
      // Mock implementation - replace with actual service call when available
      comprobantes.value = []
      return { items: [] }
    } finally {
      loading.value = false
    }
  }

  async function fetchConceptos() {
    loading.value = true
    try {
      // Mock implementation - replace with actual service call when available
      conceptos.value = [
        { COC_ID: 1, COC_DESCRIPCION: 'Pago de Curso', COC_VIGENTE: true },
        { COC_ID: 2, COC_DESCRIPCION: 'Material Didáctico', COC_VIGENTE: true }
      ]
      return { items: conceptos.value }
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    list,
    prepagos,
    comprobantes,
    conceptos,
    meta,
    loading,
    error,

    // Actions
    fetchByGroup,
    get,
    create,
    update,
    remove,
    emitirComprobante,
    cambioTitularidad,
    fetchPrepagos,
    fetchComprobantes,
    fetchConceptos
  }
})
