<template>
  <div class="p-8 max-w-3xl mx-auto bg-white rounded-lg shadow">
    <h2 class="text-2xl font-bold mb-4">Emitir Comprobante</h2>

    <form @submit.prevent="submit" class="space-y-4">
      <div>
        <label class="block text-sm">Concepto (COC_ID)</label>
        <input v-model.number="form.COC_ID" required class="input-base w-full" />
      </div>

      <div>
        <label class="block text-sm">Fecha (YYYY-MM-DD)</label>
        <input v-model="form.CPA_FECHA" type="date" class="input-base w-full" />
      </div>

      <div>
        <label class="block text-sm">Pagos a incluir (IDs, coma separados)</label>
        <input v-model="paymentsList" class="input-base w-full" placeholder="1,2,3" />
      </div>

      <div class="flex items-center space-x-3">
        <button type="submit" class="btn-primary">Crear Comprobante</button>
        <router-link to="/payments" class="px-3 py-2 text-sm border rounded">Cancelar</router-link>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePaymentsStore } from '@/stores/payments'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = usePaymentsStore()

const form = ref<any>({ COC_ID: undefined, CPA_FECHA: new Date().toISOString().slice(0,10), CPA_VALOR: 0 })
const paymentsList = ref('')

async function submit() {
  const pago_ids = paymentsList.value.split(',').map(s => Number(s.trim())).filter(Boolean)
  const payload = { ...form.value, pagos: pago_ids }
  try {
    const res = await store.emitirComprobante(payload)
    router.push('/payments')
  } catch (err) {
    alert('Error al crear comprobante')
  }
}
</script>

<style scoped>
.input-base { padding: .6rem .9rem; border: 1px solid #e5e7eb; border-radius: .5rem }
.btn-primary { background: linear-gradient(90deg,#6366f1,#3b82f6); color:#fff; padding:.5rem 1rem; border-radius:.5rem }
</style>
