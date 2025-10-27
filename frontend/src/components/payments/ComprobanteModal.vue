<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <div class="flex items-center space-x-3">
          <div class="p-2 bg-green-100 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900">Emitir Comprobante de Pago</h2>
            <p class="text-sm text-gray-500">Genera un comprobante oficial para los pagos seleccionados</p>
          </div>
        </div>
        <button @click="$emit('close')" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Payment Info -->
      <div class="p-6 border-b border-gray-200">
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Pago Seleccionado</h3>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-600">ID del Pago</p>
                  <p class="text-lg font-bold text-gray-900">#{{ pago?.PAP_ID }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Valor</p>
                  <p class="text-lg font-bold text-gray-900">${{ formatCurrency(pago?.PAP_VALOR || 0) }}</p>
                </div>
              </div>
            </div>
            <div class="text-right">
              <div :class="pago?.PAP_TIPO === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium">
                <svg v-if="pago?.PAP_TIPO === 1" class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                </svg>
                <svg v-else class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
                {{ pago?.PAP_TIPO === 1 ? 'Ingreso' : 'Egreso' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <div class="space-y-1">
          <label class="block text-sm font-semibold text-gray-700">Concepto Contable *</label>
          <select v-model="form.COC_ID" required class="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors">
            <option value="">Seleccionar concepto contable</option>
            <option v-for="concepto in conceptos" :key="concepto.COC_ID" :value="concepto.COC_ID">
              {{ concepto.COC_DESCRIPCION }}
            </option>
          </select>
        </div>

        <div class="space-y-1">
          <label class="block text-sm font-semibold text-gray-700">Número de Comprobante</label>
          <input 
            v-model.number="form.CPA_NUMERO" 
            type="number" 
            min="1"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            placeholder="Número automático si se deja vacío"
          >
          <p class="text-xs text-gray-500">Si no especificas un número, se generará automáticamente</p>
        </div>

        <div class="space-y-1">
          <label class="block text-sm font-semibold text-gray-700">Observaciones</label>
          <textarea 
            v-model="form.CPA_OBSERVACION" 
            rows="3"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none"
            placeholder="Observaciones del comprobante..."
          ></textarea>
        </div>

        <div class="border-t border-gray-200 pt-6">
          <h4 class="text-lg font-semibold text-gray-900 mb-4">Pagos a incluir en el comprobante</h4>
          <div class="space-y-3 max-h-40 overflow-y-auto">
            <div v-for="pagoItem in selectedPagos" :key="pagoItem.PAP_ID" 
                 class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
              <div class="flex items-center space-x-3">
                <input 
                  type="checkbox" 
                  :value="pagoItem.PAP_ID"
                  v-model="form.pagos_ids"
                  class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                >
                <div>
                  <p class="text-sm font-medium text-gray-900">Pago #{{ pagoItem.PAP_ID }}</p>
                  <p class="text-xs text-gray-500">{{ formatDate(pagoItem.PAP_FECHA_HORA) }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-semibold text-gray-900">${{ formatCurrency(pagoItem.PAP_VALOR) }}</p>
                <p class="text-xs text-gray-500">{{ pagoItem.PAP_TIPO === 1 ? 'Ingreso' : 'Egreso' }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <div class="p-2 bg-green-100 rounded-lg">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-green-800">Total del Comprobante</p>
                <p class="text-xs text-green-600">{{ form.pagos_ids.length }} pago(s) seleccionado(s)</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-2xl font-bold text-green-900">${{ formatCurrency(totalComprobante) }}</p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button 
            type="button" 
            @click="$emit('close')"
            class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            :disabled="loading || form.pagos_ids.length === 0"
            class="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-if="!loading" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            {{ loading ? 'Emitiendo...' : 'Emitir Comprobante' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { usePaymentsStore } from '@/stores/payments'
import type { PagoPersona, CreateComprobanteRequest } from '@/types/payments'

interface Props {
  pago?: PagoPersona
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  saved: []
}>()

const paymentsStore = usePaymentsStore()
const loading = ref(false)

const conceptos = ref([
  { COC_ID: 1, COC_DESCRIPCION: 'Pago de Curso', COC_VIGENTE: true },
  { COC_ID: 2, COC_DESCRIPCION: 'Material Didáctico', COC_VIGENTE: true },
  { COC_ID: 3, COC_DESCRIPCION: 'Certificación', COC_VIGENTE: true }
])

const selectedPagos = ref<PagoPersona[]>([])

const form = reactive<CreateComprobanteRequest>({
  pagos_ids: [],
  COC_ID: 0,
  CPA_NUMERO: undefined,
  CPA_OBSERVACION: ''
})

const totalComprobante = computed(() => {
  return selectedPagos.value
    .filter(pago => form.pagos_ids.includes(pago.PAP_ID))
    .reduce((total, pago) => total + pago.PAP_VALOR, 0)
})

const handleSubmit = async () => {
  loading.value = true
  try {
    await paymentsStore.emitirComprobante(form)
    emit('saved')
  } catch (error) {
    console.error('Error creating comprobante:', error)
  } finally {
    loading.value = false
  }
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CL').format(value)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-CL')
}

onMounted(() => {
  if (props.pago) {
    selectedPagos.value = [props.pago]
    form.pagos_ids = [props.pago.PAP_ID]
  }
  
  // Cargar conceptos contables
  paymentsStore.fetchConceptos().then(() => {
    conceptos.value = paymentsStore.conceptos
  })
})
</script>