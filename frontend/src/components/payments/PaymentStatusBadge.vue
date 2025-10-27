<template>
  <div class="inline-flex items-center">
    <div :class="dotClasses" class="w-2 h-2 rounded-full mr-2"></div>
    <span :class="textClasses" class="px-3 py-1 text-xs font-semibold rounded-full border">
      {{ status }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  status: 'Pendiente' | 'Registrado' | 'Cancelado' | 'Comprobado' | 'CambioTitularidad' | 'ConSaldo'
}

const props = defineProps<Props>()

const dotClasses = computed(() => {
  const classes = {
    'Pendiente': 'bg-yellow-400 animate-pulse',
    'Registrado': 'bg-blue-500',
    'Cancelado': 'bg-red-500',
    'Comprobado': 'bg-green-500',
    'CambioTitularidad': 'bg-purple-500',
    'ConSaldo': 'bg-indigo-500'
  }
  return classes[props.status] || 'bg-gray-400'
})

const textClasses = computed(() => {
  const classes = {
    'Pendiente': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    'Registrado': 'bg-blue-50 text-blue-700 border-blue-200',
    'Cancelado': 'bg-red-50 text-red-700 border-red-200',
    'Comprobado': 'bg-green-50 text-green-700 border-green-200',
    'CambioTitularidad': 'bg-purple-50 text-purple-700 border-purple-200',
    'ConSaldo': 'bg-indigo-50 text-indigo-700 border-indigo-200'
  }
  return classes[props.status] || 'bg-gray-50 text-gray-700 border-gray-200'
})
</script>