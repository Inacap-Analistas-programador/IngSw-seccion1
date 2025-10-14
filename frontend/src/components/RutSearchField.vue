<template>
  <div class="space-y-2">
    <label class="block text-sm font-medium text-gray-700">RUT</label>
    <div class="flex gap-2">
      <input
        v-model="rutInput"
        @blur="onBlur"
        type="text"
        placeholder="12.345.678-9"
        class="flex-1 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        :disabled="loading || !isRutPossible"
        @click="onSearch"
        type="button"
      >
        Buscar
      </button>
    </div>
    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

    <div v-if="results.length > 1" class="rounded border border-gray-200 p-2">
      <p class="text-sm text-gray-600 mb-1">Resultados:</p>
      <ul class="divide-y divide-gray-100">
        <li v-for="p in results" :key="p.id" class="py-1 flex items-center justify-between">
          <span class="text-sm">{{ p.first_name }} {{ p.last_name }} — {{ p.email }}</span>
          <button class="text-blue-600 text-sm hover:underline" @click="select(p)">Usar</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { validateRut, formatRutInput } from '@/utils/rutValidator'
import { searchPersonByRut, type PersonSummary } from '@/services/persons'

const emit = defineEmits<{ (e: 'autofill', person: PersonSummary): void }>()

const rutInput = ref('')
const loading = ref(false)
const error = ref('')
const results = ref<PersonSummary[]>([])

const isRutPossible = computed(() => rutInput.value.replace(/[^0-9kK]/g, '').length >= 2)

function normalizeInput() {
  rutInput.value = formatRutInput(rutInput.value) || rutInput.value
}

async function doSearch() {
  error.value = ''
  results.value = []

  if (!validateRut(rutInput.value)) {
    error.value = 'RUT inválido'
    return
  }
  loading.value = true
  try {
    const list = await searchPersonByRut(rutInput.value)
    results.value = list
    if (list.length === 1) {
      emit('autofill', list[0])
    }
  } catch (e) {
    error.value = 'Error buscando RUT'
  } finally {
    loading.value = false
  }
}

function select(p: PersonSummary) {
  emit('autofill', p)
}

function onBlur() {
  normalizeInput()
  // Optionally auto-search on blur if looks valid
  if (validateRut(rutInput.value)) {
    void doSearch()
  }
}

function onSearch() {
  normalizeInput()
  void doSearch()
}
</script>

<style scoped>
</style>
