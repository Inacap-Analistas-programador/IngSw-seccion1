<template>
  <div class="max-w-lg mx-auto p-6">
    <h1 class="text-2xl font-semibold mb-4">Autocompletar por RUT</h1>
    <RutSearchField @autofill="onAutofill" />

    <div class="mt-6 space-y-2">
      <div>
        <label class="block text-sm font-medium text-gray-700">Nombre</label>
        <input v-model="firstName" class="w-full rounded border px-3 py-2" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Apellido</label>
        <input v-model="lastName" class="w-full rounded border px-3 py-2" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Email</label>
        <input v-model="email" class="w-full rounded border px-3 py-2" />
      </div>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { ref } from 'vue'
import RutSearchField from '@/components/RutSearchField.vue'
import type { PersonSummary } from '@/services/persons'

const firstName = ref('')
const lastName = ref('')
const email = ref('')

function onAutofill(p: PersonSummary) {
  firstName.value = p.first_name || ''
  lastName.value = p.last_name || ''
  email.value = p.email || ''
}
</script>

<style scoped>
</style>
