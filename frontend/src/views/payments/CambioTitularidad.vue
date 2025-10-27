<template>
  <div class="p-8 max-w-2xl mx-auto bg-white rounded-lg shadow">
    <h2 class="text-2xl font-bold mb-4">Cambio de Titularidad</h2>

    <form @submit.prevent="submit" class="space-y-4">
      <div>
        <label class="block text-sm">Pago (PAP_ID)</label>
        <input v-model.number="form.PAP_ID" required class="input-base w-full" />
      </div>

      <div>
        <label class="block text-sm">Nueva Persona (PER_ID)</label>
        <input v-model.number="form.PER_ID_NUEVO" required class="input-base w-full" />
      </div>

      <div class="flex items-center space-x-3">
        <button type="submit" class="btn-primary">Cambiar Titularidad</button>
        <router-link to="/payments" class="px-3 py-2 text-sm border rounded">Cancelar</router-link>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePaymentsStore } from '@/stores/payments'
import { useRouter } from 'vue-router'

const store = usePaymentsStore()
const router = useRouter()

const form = ref<any>({ PAP_ID: undefined, PER_ID_NUEVO: undefined })

async function submit() {
  try {
    await store.cambioTitularidad({ PAP_ID: form.value.PAP_ID, PER_ID: form.value.PER_ID_NUEVO })
    router.push('/payments')
  } catch (err) {
    alert('Error al cambiar titularidad')
  }
}
</script>

<style scoped>
.input-base { padding: .6rem .9rem; border: 1px solid #e5e7eb; border-radius: .5rem }
.btn-primary { background: linear-gradient(90deg,#6366f1,#3b82f6); color:#fff; padding:.5rem 1rem; border-radius:.5rem }
</style>
