<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 px-6 py-8">
    <div class="max-w-6xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Pagos</h1>
          <p class="text-sm text-gray-600">Listado y gestión de pagos — filtra por grupo o curso</p>
        </div>
        <div class="flex items-center space-x-3">
          <router-link to="/payments/new" class="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg shadow">Nuevo Pago</router-link>
          <router-link to="/payments/cambio-titular" class="px-4 py-2 bg-white border rounded-lg text-gray-700">Cambio Titularidad</router-link>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input v-model="filters.group" placeholder="Grupo (ej: grupo-a)" class="input-base" />
          <input v-model.number="filters.courseId" type="number" placeholder="Curso ID (opcional)" class="input-base" />
          <div class="flex items-center">
            <button @click="search" :disabled="loading" class="btn-primary w-full">
              {{ loading ? 'Buscando...' : 'Buscar' }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="error" class="bg-red-50 p-4 rounded mb-4">{{ error }}</div>

      <div v-if="meta.count !== undefined" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <MetricCard title="Total" :value="String(meta.count)" description="Pagos encontrados" />
        <MetricCard title="Monto" :value="formatCurrency(meta.total_amount)" description="Suma total" />
        <MetricCard title="Pendientes" :value="String(meta.breakdown?.PENDING || 0)" description="Requieren atención" />
        <MetricCard title="Completados" :value="String(meta.breakdown?.COMPLETED || 0)" description="Finalizados" />
      </div>

      <ModernTable
        :columns="columns"
        :data="payments"
        :actions="actions"
        @action="onAction"
      >
        <template #column-monto="{ row }">
          <span class="font-semibold text-green-600">{{ formatCurrency(row.monto) }}</span>
        </template>
        <template #column-estado="{ row }">
          <span :class="getBadgeClass(row.estado)">{{ row.estado }}</span>
        </template>
      </ModernTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ModernTable from '@/components/ui/ModernTable.vue'
import MetricCard from '@/components/ui/MetricCard.vue'
import { usePaymentsStore } from '@/stores/payments'
import { useRouter } from 'vue-router'

const store = usePaymentsStore()
const router = useRouter()

const filters = ref({ group: '', courseId: undefined as number | undefined })
const loading = ref(false)
const error = ref<string | null>(null)

const payments = ref<any[]>([])
const meta = ref<any>({ count: 0, total_amount: 0, breakdown: {} })

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'estado', label: 'Estado' },
  { key: 'monto', label: 'Monto' },
  { key: 'medio', label: 'Medio' },
  { key: 'referencia', label: 'Referencia' }
]

const actions = [{ key: 'view', label: 'Ver' }, { key: 'edit', label: 'Editar' }]

function formatCurrency(amount: any) {
  const n = typeof amount === 'string' ? parseFloat(amount) : amount || 0
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(n)
}

function getBadgeClass(status: string) {
  return 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800'
}

async function search() {
  error.value = null
  payments.value = []
  loading.value = true
  try {
    const data = await store.fetchByGroup(filters.value.group, filters.value.courseId)
    payments.value = data.items
    meta.value = { count: data.count, total_amount: data.total_amount, breakdown: data.breakdown }
  } catch (err: any) {
    error.value = err?.message || 'Error al buscar pagos'
  } finally {
    loading.value = false
  }
}

function onAction(action: string, row: any) {
  if (action === 'view') router.push(`/payments/${row.id}`)
  if (action === 'edit') router.push(`/payments/${row.id}/edit`)
}
</script>

<style scoped>
.input-base { padding: .75rem 1rem; border: 1px solid #e5e7eb; border-radius: .75rem; background: #fbfdff }
.btn-primary { background: linear-gradient(90deg,#6366f1,#3b82f6); color:#fff; padding:.6rem 1rem; border-radius:.75rem }
</style>
