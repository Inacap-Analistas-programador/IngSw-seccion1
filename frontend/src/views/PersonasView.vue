<template>
  <v-container>
    <person-list
      :personas="personasStore.personas"
      :loading="personasStore.loading"
      @ver-detalle="personasStore.selectPersona"
      @editar-persona="personasStore.openForm"
      @eliminar-persona="personasStore.deletePersona"
      @abrir-formulario="() => personasStore.openForm()"
    />
    <person-form
      v-if="personasStore.showForm"
      :persona="personasStore.editPersona"
      @saved="personasStore.fetchPersonas; personasStore.closeForm()"
      @cancel="personasStore.closeForm"
    />
    <person-detail
      v-if="personasStore.showDetail"
      :persona="personasStore.selected"
      @close="personasStore.closeDetail"
    />
  </v-container>
</template>

<script setup>
import { usePersonasStore } from '@/stores/personas';
import PersonList from '@/components/personas/PersonList.vue';
import PersonForm from '@/components/personas/PersonForm.vue';
import PersonDetail from '@/components/personas/PersonDetail.vue';
import { onMounted } from 'vue';

const personasStore = usePersonasStore();
onMounted(() => personasStore.fetchPersonas());
</script>
