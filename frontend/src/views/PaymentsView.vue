<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Header with modern styling -->
      <div class="mb-8 text-center">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-4">
          Gestión de Pagos
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Supervisa y administra todos los pagos del sistema de manera eficiente y segura
        </p>
      </div>

      <!-- Search and Filter Section -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
        <div class="flex items-center mb-6">
          <div class="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center mr-4">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900">Buscar Pagos</h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="space-y-2">
            <label for="group-input" class="block text-sm font-semibold text-gray-700">Grupo</label>
            <div class="relative">
              <input 
                id="group-input"
                v-model="searchFilters.group" 
                class="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-900 placeholder-gray-500 bg-gray-50 hover:bg-white focus:bg-white" 
                placeholder="Ej: grupo-a"
              />
              <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
            </div>
          </div>
          
          <div class="space-y-2">
            <label for="course-id-input" class="block text-sm font-semibold text-gray-700">Curso ID (opcional)</label>
            <div class="relative">
              <input 
                id="course-id-input"
                v-model.number="searchFilters.courseId" 
                type="number" 
                class="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-900 placeholder-gray-500 bg-gray-50 hover:bg-white focus:bg-white" 
                placeholder="Ej: 1"
              />
              <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                </svg>
              </div>
            </div>
          </div>
          
          <div class="flex items-end">
            <button 
              @click="searchPayments" 
              :disabled="loading"
              class="w-full px-8 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
            >
              <svg v-if="!loading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <div v-if="loading" class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>{{ loading ? 'Buscando...' : 'Buscar Pagos' }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8 shadow-lg">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-semibold text-red-800">Error al cargar datos</h3>
            <p class="text-red-600 mt-1">{{ error }}</p>
            <button 
              @click="searchPayments" 
              class="mt-3 text-sm bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Intentar nuevamente
            </button>
          </div>
        </div>
      </div>

      <!-- Results -->
      <div v-if="data && !loading" class="space-y-8">
        <!-- Summary Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard
            title="Total Pagos"
            :value="String(data.count)"
            description="Pagos encontrados"
            variant="primary"
          />
          <MetricCard
            title="Monto Total"
            :value="formatCurrency(data.total_amount)"
            description="Suma total"
            variant="success"
          />
          <MetricCard
            title="Pagos Pendientes"
            :value="String(data.breakdown?.PENDING || 0)"
            description="Requieren atención"
            variant="warning"
          />
          <MetricCard
            title="Pagos Completados"
            :value="String(data.breakdown?.COMPLETED || 0)"
            description="Finalizados"
            variant="info"
          />
        </div>

        <!-- Breakdown Chart -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-200 p-8" v-if="data.breakdown">
          <div class="flex items-center mb-6">
            <div class="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-4">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900">Distribución por Estado</h3>
          </div>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div 
              v-for="(count, status) in data.breakdown" 
              :key="status"
              class="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
            >
              <div class="text-3xl font-bold mb-2" :class="getStatusColor(status)">{{ count }}</div>
              <div class="text-sm font-medium text-gray-600 uppercase tracking-wider">{{ getStatusLabel(status) }}</div>
              <div class="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  class="h-full rounded-full transition-all duration-300" 
                  :class="getStatusBarColor(status)"
                  :style="{ width: `${(count / data.count * 100)}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Payments Table -->
        <div v-if="data.items.length > 0">
          <ModernTable
            title="Detalle de Pagos"
            :columns="tableColumns"
            :data="data.items"
            :loading="false"
            :search-placeholder="'Buscar en pagos...'"
            :actions="tableActions"
            @action="handleTableAction"
          >
            <!-- Custom status column -->
            <template #column-estado="{ row }">
              <span :class="getPaymentStatusBadgeClass(row.estado)">
                {{ getPaymentStatusLabel(row.estado) }}
              </span>
            </template>

            <!-- Custom amount column -->
            <template #column-monto="{ row }">
              <span class="font-semibold text-green-600">
                {{ formatCurrency(row.monto) }}
              </span>
            </template>

            <!-- Custom method column -->
            <template #column-medio="{ row }">
              <div class="flex items-center space-x-2">
                <span class="text-sm">{{ getPaymentMethodIcon(row.medio) }}</span>
                <span>{{ row.medio }}</span>
              </div>
            </template>
          </ModernTable>
        </div>

        <!-- No Payments State -->
        <div v-else class="bg-white rounded-2xl shadow-xl border border-gray-200 p-12 text-center">
          <div class="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No hay pagos disponibles</h3>
          <p class="text-gray-600">No se encontraron pagos para el grupo especificado</p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-2xl shadow-xl border border-gray-200 p-12">
        <div class="flex flex-col items-center justify-center">
          <div class="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mb-6"></div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Cargando pagos...</h3>
          <p class="text-gray-600">Por favor espera mientras procesamos tu búsqueda</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!data && !loading && !error" class="bg-white rounded-2xl shadow-xl border border-gray-200 p-12 text-center">
        <div class="w-24 h-24 bg-gradient-to-r from-indigo-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-12 h-12 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">Busca pagos por grupo</h3>
        <p class="text-gray-600 text-lg">Ingresa un grupo para ver los pagos asociados y comenzar a gestionar las transacciones</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ModernTable from '@/components/ui/ModernTable.vue'
import MetricCard from '@/components/ui/MetricCard.vue'
import { usePaymentsStore } from '@/stores/payments'
import { useRouter } from 'vue-router'

const router = useRouter()
const paymentsStore = usePaymentsStore()

// Reactive state from store
const loading = computed(() => paymentsStore.loading)
const error = computed(() => paymentsStore.error)
const data = computed(() => {
  if (paymentsStore.list.length === 0 && paymentsStore.meta.count === 0) {
    return null
  }
  return {
    items: paymentsStore.list,
    count: paymentsStore.meta.count,
    total_amount: paymentsStore.meta.total_amount,
    breakdown: paymentsStore.meta.breakdown,
    group: searchFilters.value.group,
  }
})

const searchFilters = ref({
  group: '',
  courseId: undefined as number | undefined
})

// Table configuration
const tableColumns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'estado', label: 'Estado', sortable: true },
  { key: 'monto', label: 'Monto', sortable: true },
  { key: 'medio', label: 'Método', sortable: true },
  { key: 'referencia', label: 'Referencia', sortable: false }
]

const tableActions = [
  { key: 'view', label: 'Ver Detalle', variant: 'primary' as const },
  { key: 'edit', label: 'Editar', variant: 'warning' as const }
]

// Main search function
const searchPayments = async () => {
  if (!searchFilters.value.group) {
    paymentsStore.error = 'Debe ingresar un grupo para buscar pagos'
    return
  }
  
  await paymentsStore.fetchByGroup(
    searchFilters.value.group,
    searchFilters.value.courseId
  )
}

// Event handlers
const handleTableAction = (action: string, row: any) => {
  switch (action) {
    case 'view':
      router.push(`/payments/${row.id}`)
      break
    case 'edit':
      router.push(`/payments/${row.id}/edit`)
      break
  }
}

// Utility functions
const formatCurrency = (amount: number | string) => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(numAmount)
}

const getStatusColor = (status: string) => {
  const colors = {
    'PENDING': 'text-yellow-400',
    'COMPLETED': 'text-green-400',
    'FAILED': 'text-red-400',
    'CANCELLED': 'text-gray-400'
  }
  return colors[status as keyof typeof colors] || 'text-gray-400'
}

const getStatusLabel = (status: string) => {
  const labels = {
    'PENDING': 'Pendiente',
    'COMPLETED': 'Completado',
    'FAILED': 'Fallido',
    'CANCELLED': 'Cancelado'
  }
  return labels[status as keyof typeof labels] || status
}

const getStatusBarColor = (status: string) => {
  const colors = {
    'PENDING': 'bg-yellow-400',
    'COMPLETED': 'bg-green-400',
    'FAILED': 'bg-red-400',
    'CANCELLED': 'bg-gray-400'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-400'
}

const getPaymentStatusBadgeClass = (status: string) => {
  const classes = {
    'PENDING': 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200',
    'COMPLETED': 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200',
    'FAILED': 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200',
    'CANCELLED': 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200'
  }
  return classes[status as keyof typeof classes] || classes.PENDING
}

const getPaymentStatusLabel = (status: string) => {
  return getStatusLabel(status)
}

const getPaymentMethodIcon = (method: string) => {
  const icons = {
    'CREDIT_CARD': 'CC',
    'DEBIT_CARD': 'DC',
    'BANK_TRANSFER': 'BT',
    'CASH': '$',
    'WEBPAY': 'WP',
    'PAYPAL': 'PP'
  }
  return icons[method as keyof typeof icons] || 'CC'
}
</script>

<style scoped>
/* Custom animations and transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Gradient text effect */
.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
}

/* Card hover effects */
.metric-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Button pulse effect */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .8;
  }
}

.btn-pulse:hover {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Glass morphism effect */
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
</style>
