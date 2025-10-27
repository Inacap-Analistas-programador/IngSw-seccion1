<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center space-x-4">
            <div class="p-2 bg-blue-100 rounded-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Gestión de Pagos</h1>
              <p class="text-sm text-gray-500">Sistema de control financiero Scout</p>
            </div>
          </div>
          <button 
            @click="showCreateModal = true"
            class="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors shadow-sm"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Registrar Pago
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Filtros -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Filtros de Búsqueda</h2>
          <button @click="clearFilters" class="text-sm text-gray-500 hover:text-gray-700">Limpiar filtros</button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">Agrupación</label>
            <select v-model="filters.group" @change="loadPayments" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500">
              <option value="">Todos los grupos</option>
              <option value="curso">Por Curso</option>
              <option value="persona">Por Persona</option>
            </select>
          </div>
          
          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">Estado</label>
            <select v-model="filters.status" @change="loadPayments" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              <option value="">Todos los estados</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Registrado">Registrado</option>
              <option value="Cancelado">Cancelado</option>
              <option value="Comprobado">Comprobado</option>
            </select>
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">Fecha desde</label>
            <input 
              v-model="filters.date_from" 
              type="date" 
              @change="loadPayments"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
          </div>
          
          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">Fecha hasta</label>
            <input 
              v-model="filters.date_to" 
              type="date" 
              @change="loadPayments"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-emerald-100 text-sm font-medium">Total Pagos</p>
              <p class="text-3xl font-bold">{{ paymentsStore.meta.count }}</p>
            </div>
            <div class="p-3 bg-emerald-400 bg-opacity-30 rounded-lg">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-100 text-sm font-medium">Monto Total</p>
              <p class="text-3xl font-bold">${{ formatCurrency(paymentsStore.meta.total_amount) }}</p>
            </div>
            <div class="p-3 bg-green-400 bg-opacity-30 rounded-lg">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path>
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-100 text-sm font-medium">Ingresos</p>
              <p class="text-3xl font-bold">${{ formatCurrency(paymentsStore.meta.breakdown.ingresos) }}</p>
            </div>
            <div class="p-3 bg-green-400 bg-opacity-30 rounded-lg">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-red-100 text-sm font-medium">Egresos</p>
              <p class="text-3xl font-bold">${{ formatCurrency(paymentsStore.meta.breakdown.egresos) }}</p>
            </div>
            <div class="p-3 bg-red-400 bg-opacity-30 rounded-lg">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla de Pagos -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">Lista de Pagos</h2>
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-500">{{ paymentsStore.list.length }} registros</span>
            </div>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="pago in paymentsStore.list" :key="pago.PAP_ID" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">#{{ pago.PAP_ID }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(pago.PAP_FECHA_HORA) }}</div>
                  <div class="text-sm text-gray-500">{{ formatTime(pago.PAP_FECHA_HORA) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div :class="pago.PAP_TIPO === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                      <svg v-if="pago.PAP_TIPO === 1" class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                      </svg>
                      <svg v-else class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                      </svg>
                      {{ pago.PAP_TIPO === 1 ? 'Ingreso' : 'Egreso' }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-semibold text-gray-900">${{ formatCurrency(pago.PAP_VALOR) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <PaymentStatusBadge :status="pago.estado" />
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end space-x-2">
                    <button @click="editPago(pago)" class="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500">
                      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                      Editar
                    </button>
                    <button @click="emitComprobante(pago)" class="inline-flex items-center px-3 py-1 border border-green-300 text-xs font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500">
                      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      Comprobante
                    </button>
                    <button @click="changeTitularidad(pago)" class="inline-flex items-center px-3 py-1 border border-emerald-300 text-xs font-medium rounded-md text-emerald-700 bg-emerald-50 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                      </svg>
                      Cambiar
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="paymentsStore.loading" class="flex justify-center items-center py-12">
        <div class="flex items-center space-x-2">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span class="text-gray-600">Cargando pagos...</span>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!paymentsStore.loading && paymentsStore.list.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V9a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No hay pagos registrados</h3>
        <p class="mt-1 text-sm text-gray-500">Comienza registrando el primer pago del sistema.</p>
        <div class="mt-6">
          <button @click="showCreateModal = true" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
            <svg class="-ml-1 mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"></path>
            </svg>
            Registrar Pago
          </button>
        </div>
      </div>
    </div>

    <!-- Modales -->
    <PaymentFormModal 
      v-if="showCreateModal" 
      :pago="selectedPago"
      @close="showCreateModal = false"
      @saved="handlePaymentSaved"
    />
    
    <ComprobanteModal 
      v-if="showComprobanteModal" 
      :pago="selectedPago"
      @close="showComprobanteModal = false"
      @saved="handleComprobanteSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { usePaymentsStore } from '@/stores/payments'
import type { PagoPersona, PaymentFilters } from '@/types/payments'
import PaymentFormModal from '@/components/payments/PaymentFormModal.vue'
import ComprobanteModal from '@/components/payments/ComprobanteModal.vue'
import PaymentStatusBadge from '@/components/payments/PaymentStatusBadge.vue'

const paymentsStore = usePaymentsStore()

const showCreateModal = ref(false)
const showComprobanteModal = ref(false)
const selectedPago = ref<PagoPersona | null>(null)

const filters = reactive<PaymentFilters>({
  group: '',
  status: '',
  date_from: '',
  date_to: ''
})

const loadPayments = async () => {
  try {
    await paymentsStore.fetchByGroup(filters.group || 'all')
  } catch (error) {
    console.error('Error loading payments:', error)
  }
}

const editPago = (pago: PagoPersona) => {
  selectedPago.value = pago
  showCreateModal.value = true
}

const emitComprobante = (pago: PagoPersona) => {
  selectedPago.value = pago
  showComprobanteModal.value = true
}

const changeTitularidad = async (pago: PagoPersona) => {
  // Implementar modal de cambio de titularidad
  console.log('Cambiar titularidad:', pago)
}

const handlePaymentSaved = () => {
  showCreateModal.value = false
  selectedPago.value = null
  loadPayments()
}

const handleComprobanteSaved = () => {
  showComprobanteModal.value = false
  selectedPago.value = null
  loadPayments()
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CL').format(value)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-CL')
}

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
}

const clearFilters = () => {
  Object.assign(filters, {
    group: '',
    status: '',
    date_from: '',
    date_to: ''
  })
  loadPayments()
}

const getStatusClass = (status: string) => {
  const classes = {
    'Pendiente': 'bg-yellow-100 text-yellow-800',
    'Registrado': 'bg-blue-100 text-blue-800',
    'Cancelado': 'bg-red-100 text-red-800',
    'Comprobado': 'bg-green-100 text-green-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

onMounted(() => {
  loadPayments()
})
</script>