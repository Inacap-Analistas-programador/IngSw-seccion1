<template>
  <div class="max-w-lg mx-auto p-6">
    <h1 class="text-2xl font-semibold mb-4">Autocompletar por RUT</h1>
    <RutSearchField @autofill="onAutofill" />

    <div class="mt-6 space-y-2">
      <div>
        <label for="firstName" class="block text-sm font-medium text-gray-700">Nombre</label>
        <input id="firstName" v-model="firstName" class="w-full rounded border px-3 py-2" />
      </div>
      <div>
        <label for="lastName" class="block text-sm font-medium text-gray-700">Apellido</label>
        <input id="lastName" v-model="lastName" class="w-full rounded border px-3 py-2" />
      </div>
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <input id="email" v-model="email" class="w-full rounded border px-3 py-2" />
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
/* Empty styles */
</style>
