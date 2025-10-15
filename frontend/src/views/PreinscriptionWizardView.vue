<template>
  <div class="page">
    <div class="stack max-w-md">
      <h1 class="h1 text-center">Preinscripción de Curso</h1>
      <div class="card stack">
        <h2 class="h2">Búsqueda por RUT</h2>
        <p class="text-muted">Ingrese su RUT para verificar su registro</p>
        
        <form @submit.prevent="searchByRut" class="stack">
          <div>
            <label for="rut" class="block text-sm font-medium mb-1">RUT (sin puntos, con guión)</label>
            <input
              id="rut"
              v-model="rutInput"
              type="text"
              placeholder="12345678-9"
              class="input"
              :disabled="searching"
              required
            />
          </div>
          
          <button type="submit" :disabled="searching || !rutInput.trim()" class="btn btn-primary">
            {{ searching ? 'Buscando...' : 'Buscar RUT' }}
          </button>
        </form>

        <div v-if="searchError" class="alert alert-error">
          {{ searchError }}
        </div>

        <div v-if="searchResults.length > 0" class="stack">
          <h4 class="text-sm font-semibold">Resultados encontrados:</h4>
          <div v-for="person in searchResults" :key="person.id" class="border rounded p-3 cursor-pointer hover:bg-gray-50" @click="selectPerson(person)">
            <div class="text-sm font-medium">{{ person.first_name }} {{ person.last_name }}</div>
            <div class="text-xs text-muted">{{ person.email }} - RUT: {{ person.rut }}</div>
            <button class="btn btn-primary btn-sm mt-2">Seleccionar</button>
          </div>
        </div>

        <div v-if="searchCompleted && searchResults.length === 0" class="alert alert-warning">
          <h4 class="font-medium mb-2">RUT no encontrado</h4>
          <p class="text-sm mb-3">El RUT no está registrado. Puede crear un nuevo perfil.</p>
          <button @click="proceedWithNewUser" class="btn btn-secondary btn-sm">Proceder con nuevo usuario</button>
        </div>

        <div v-if="selectedPerson || newUserRut" class="flex justify-between pt-4 border-t">
          <button @click="goBack" class="btn btn-secondary btn-sm">Volver</button>
          <button @click="nextStep" class="btn btn-primary btn-sm">Siguiente</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { searchPersonByRut, type PersonSummary } from '@/services/persons'

// Reactive state
const currentStep = ref(1)
const rutInput = ref('')
const searching = ref(false)
const searchError = ref<string | null>(null)
const searchResults = ref<PersonSummary[]>([])
const searchCompleted = ref(false)
const selectedPerson = ref<PersonSummary | null>(null)
const newUserRut = ref<string | null>(null)

// Methods
const searchByRut = async () => {
  if (!rutInput.value.trim()) return

  searchError.value = null
  searching.value = true
  searchResults.value = []
  searchCompleted.value = false

  try {
    const results = await searchPersonByRut(rutInput.value.trim())
    searchResults.value = results
    searchCompleted.value = true
  } catch (error: any) {
    searchError.value = error?.message || 'Error al buscar por RUT'
    searchCompleted.value = true
  } finally {
    searching.value = false
  }
}

const selectPerson = (person: PersonSummary) => {
  selectedPerson.value = person
  newUserRut.value = null
}

const proceedWithNewUser = () => {
  newUserRut.value = rutInput.value.trim()
  selectedPerson.value = null
}

const goBack = () => {
  selectedPerson.value = null
  newUserRut.value = null
  currentStep.value = 1
}

const nextStep = () => {
  // Navigate to step 2 - course data form
  currentStep.value = 2
}
</script> 