<template>
  <div class="p-8 max-w-3xl mx-auto bg-white rounded-lg shadow">
    <h2 class="text-2xl font-bold mb-4">{{ isEdit ? 'Editar Pago' : 'Nuevo Pago' }}</h2>

    <form @submit.prevent="submit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Persona (PER_ID)</label>
        <input v-model.number="form.PER_ID" required class="input-base w-full" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Curso (CUR_ID)</label>
        <input v-model.number="form.CUR_ID" class="input-base w-full" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Monto</label>
        <input v-model.number="form.PAP_VALOR" required type="number" class="input-base w-full" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Método</label>
        <input v-model="form.medio" class="input-base w-full" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Referencia</label>
        <input v-model="form.referencia" class="input-base w-full" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Observación</label>
        <textarea v-model="form.PAP_OBSERVACION" class="input-base w-full" rows="3"></textarea>
      </div>

      <div class="flex items-center space-x-3">
        <button type="submit" class="btn-primary">{{ isEdit ? 'Guardar' : 'Crear Pago' }}</button>
        <router-link to="/payments" class="px-3 py-2 text-sm border rounded">Cancelar</router-link>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePaymentsStore } from '@/stores/payments'

const route = useRoute()
const router = useRouter()
const idParam = route.params.id
const isEdit = !!idParam
const store = usePaymentsStore()

const form = ref<any>({ PER_ID: undefined, CUR_ID: undefined, PAP_VALOR: 0, medio: 'CASH', referencia: '', PAP_OBSERVACION: '' })

async function load() {
  if (!isEdit) return
  const id = Number(idParam)
  const data = await store.get(id)
  // map possible backend fields to form
  form.value = { ...form.value, ...data }
}

async function submit() {
  try {
    if (isEdit) {
      await store.update(Number(idParam), form.value)
      router.push(`/payments/${idParam}`)
    } else {
      const created = await store.create(form.value)
      router.push(`/payments/${created.PAP_ID || created.id}`)
    }
  } catch (err) {
    console.error(err)
    alert('Error al guardar')
  }
}

onMounted(load)
</script>

<style scoped>
.input-base { padding: .6rem .9rem; border: 1px solid #e5e7eb; border-radius: .5rem }
.btn-primary { background: linear-gradient(90deg,#6366f1,#3b82f6); color:#fff; padding:.5rem 1rem; border-radius:.5rem }
</style>
