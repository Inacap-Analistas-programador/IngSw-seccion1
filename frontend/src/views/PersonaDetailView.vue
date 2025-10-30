<template>
  <div v-if="persona">
    <PersonaDetail :persona="persona" />
  </div>
  <div v-else>
    <p>Cargando...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { usePersonasStore } from '@/stores/personas';
import type { Persona } from '@/types';
import PersonaDetail from '@/components/personas/PersonaDetail.vue';

const route = useRoute();
const personasStore = usePersonasStore();
const persona = ref<Persona | null>(null);

onMounted(async () => {
  const personaId = Number(route.params.id);
  await personasStore.fetchPersonas(); // Asegurarse de que las personas estén cargadas
  persona.value = personasStore.personas.find(p => p.id === personaId) || null;
});
</script>
