<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <div class="flex items-center space-x-3">
          <div class="p-2 bg-green-100 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900">{{ isEdit ? 'Editar Pago' : 'Registrar Nuevo Pago' }}</h2>
            <p class="text-sm text-gray-500">{{ isEdit ? 'Modifica los datos del pago' : 'Completa la información del pago' }}</p>
          </div>
        </div>
        <button @click="$emit('close')" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <div class="space-y-1">
          <label for="persona-pago" class="block text-sm font-semibold text-gray-700">Persona *</label>
          <select id="persona-pago" v-model="form.PER_ID" required class="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors">
            <option value="">Seleccionar persona</option>
            <option v-for="persona in personas" :key="persona.id" :value="persona.id">
              {{ persona.nombres }} {{ persona.apelpat }} - {{ persona.run }}-{{ persona.dv }}
            </option>
          </select>
        </div>

        <div class="space-y-1">
          <label for="curso-pago" class="block text-sm font-semibold text-gray-700">Curso *</label>
          <select id="curso-pago" v-model="form.CUR_ID" required class="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors">
            <option value="">Seleccionar curso</option>
            <option v-for="curso in cursos" :key="curso.id" :value="curso.id">
              {{ curso.descripcion }}
            </option>
          </select>
        </div>

        <fieldset class="space-y-1">
          <legend class="block text-sm font-semibold text-gray-700">Tipo de Pago *</legend>
          <div class="grid grid-cols-2 gap-3">
            <label class="relative">
              <input v-model="form.PAP_TIPO" :value="1" type="radio" name="tipo-pago" class="sr-only peer">
              <div class="flex items-center justify-center p-3 border-2 border-gray-300 rounded-lg cursor-pointer peer-checked:border-green-500 peer-checked:bg-green-50 hover:bg-gray-50 transition-colors">
                <div class="flex items-center space-x-2">
                  <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="text-sm font-medium text-gray-700">Ingreso</span>
                </div>
              </div>
            </label>
            <label class="relative">
              <input v-model="form.PAP_TIPO" :value="2" type="radio" name="tipo-pago" class="sr-only peer">
              <div class="flex items-center justify-center p-3 border-2 border-gray-300 rounded-lg cursor-pointer peer-checked:border-red-500 peer-checked:bg-red-50 hover:bg-gray-50 transition-colors">
                <div class="flex items-center space-x-2">
                  <svg class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="text-sm font-medium text-gray-700">Egreso</span>
                </div>
              </div>
            </label>
          </div>
        </fieldset>

        <div class="space-y-1">
          <label for="valor-pago" class="block text-sm font-semibold text-gray-700">Valor *</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span class="text-gray-500 text-sm">$</span>
            </div>
            <input 
              id="valor-pago"
              v-model.number="form.PAP_VALOR" 
              type="number" 
              min="0" 
              step="0.01"
              required 
              class="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="0.00"
            >
          </div>
        </div>

        <div class="space-y-1">
          <label for="observacion-pago" class="block text-sm font-semibold text-gray-700">Observación</label>
          <textarea 
            id="observacion-pago"
            v-model="form.PAP_OBSERVACION" 
            rows="3"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none"
            placeholder="Observaciones adicionales..."
          ></textarea>
        </div>

        <div v-if="form.PAP_TIPO === 1" class="border-t border-gray-200 pt-6">
          <div class="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div class="flex items-center space-x-3">
              <div class="p-2 bg-green-100 rounded-lg">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
              <div>
                <label for="generatePrepago" class="text-sm font-semibold text-gray-900">
                  ¿Generar saldo a favor (Prepago)?
                </label>
                <p class="text-xs text-gray-600">Crear un prepago disponible para futuros pagos</p>
              </div>
            </div>
            <input 
              v-model="generatePrepago" 
              type="checkbox" 
              id="generatePrepago"
              class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            >
          </div>
        </div>

        <!-- Footer -->
        <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <BaseButton @click="$emit('close')" variant="secondary">Cancelar</BaseButton>
          <BaseButton type="submit" :disabled="loading">
            {{ loading ? 'Guardando...' : (isEdit ? 'Actualizar Pago' : 'Registrar Pago') }}
          </BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { usePaymentsStore } from '@/stores/payments'
import { usePersonasStore } from '@/stores/personas'
import { useCursosStore } from '@/stores/cursos'
import type { CreatePaymentRequest, PagoPersona } from '@/types/payments'

interface Props {
  pago?: PagoPersona
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  saved: []
}>()

const paymentsStore = usePaymentsStore()
const personasStore = usePersonasStore()
const cursosStore = useCursosStore()
const loading = ref(false)
const generatePrepago = ref(false)

const isEdit = computed(() => !!props.pago)

const { personas } = storeToRefs(personasStore)
const { cursos } = storeToRefs(cursosStore)

const form = reactive<CreatePaymentRequest>({
  PER_ID: 0,
  CUR_ID: 0,
  PAP_TIPO: 0,
  PAP_VALOR: 0,
  PAP_OBSERVACION: ''
})

const handleSubmit = async () => {
  loading.value = true
  try {
    if (isEdit.value && props.pago) {
      await paymentsStore.update(props.pago.PAP_ID, form)
    } else {
      await paymentsStore.create(form)
    }
    
    emit('saved')
  } catch (error) {
    console.error('Error saving payment:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  personasStore.fetchPersonas()
  cursosStore.fetchCursos()
  if (props.pago) {
    Object.assign(form, {
      PER_ID: props.pago.PER_ID,
      CUR_ID: props.pago.CUR_ID,
      PAP_TIPO: props.pago.PAP_TIPO,
      PAP_VALOR: props.pago.PAP_VALOR,
      PAP_OBSERVACION: props.pago.PAP_OBSERVACION
    })
  }
})
</script>
