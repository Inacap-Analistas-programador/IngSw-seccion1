<template>
  <div class="p-8 max-w-4xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold">Pago #{{ payment?.PAP_ID || payment?.id }}</h2>
      <div class="space-x-2">
        <router-link :to="`/payments/${id}/edit`" class="btn-sm">Editar</router-link>
        <router-link :to="`/payments/${id}/comprobante`" class="btn-sm">Emitir Comprobante</router-link>
      </div>
    </div>

    <div v-if="loading" class="p-6 bg-white rounded shadow">Cargando...</div>
    <div v-else-if="error" class="p-6 bg-red-50 rounded">{{ error }}</div>
    <div v-else class="bg-white rounded shadow p-6 space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <h3 class="text-sm text-gray-500">Persona</h3>
          <div class="text-lg font-semibold">{{ payment?.PER_ID }}</div>
        </div>
        <div>
          <h3 class="text-sm text-gray-500">Monto</h3>
          <div class="text-lg font-semibold text-green-600">{{ formatCurrency(payment?.PAP_VALOR || payment?.monto) }}</div>
        </div>
      </div>

      <div>
        <h3 class="text-sm text-gray-500">Observación</h3>
        <p class="text-gray-700">{{ payment?.PAP_OBSERVACION || payment?.notas || '-' }}</p>
      </div>

      <div class="flex space-x-3 mt-4">
        <button @click="remove" class="px-4 py-2 bg-red-600 text-white rounded">Eliminar</button>
        <router-link to="/payments" class="px-4 py-2 bg-gray-100 rounded">Volver</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePaymentsStore } from '@/stores/payments'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)

const store = usePaymentsStore()
const payment = ref<any | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

function formatCurrency(amount: any) {
  const n = typeof amount === 'string' ? parseFloat(amount) : amount || 0
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(n)
}

async function load() {
  loading.value = true
  try {
    payment.value = await store.get(id)
  } catch (err: any) {
    error.value = err?.message || 'Error cargando pago'
  } finally {
    loading.value = false
  }
}

async function remove() {
  if (!confirm('¿Eliminar este pago?')) return
  await store.remove(id)
  router.push('/payments')
}

onMounted(load)
</script>

<style scoped>
.btn-sm { padding:.4rem .8rem; background:#eef2ff; border-radius:.5rem }
</style>
