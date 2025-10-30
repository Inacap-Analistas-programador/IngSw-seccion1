<template>
  <div class="personas-view">
    <header class="view-header">
      <h1>Personas</h1>
      <div class="actions">
        <BaseButton @click="showFilters = !showFilters" variant="secondary">
          <Icon name="filter" /> Filtros
        </BaseButton>
        <BaseButton @click="openCreateModal">+ Crear Persona</BaseButton>
      </div>
    </header>

    <div v-if="showFilters" class="filter-panel card">
      <div class="filter-grid">
        <InputBase label="Nombre" v-model="filters.nombre" />
        <InputBase label="Email" v-model="filters.email" />
        <InputBase label="Login" v-model="filters.login" />
        <BaseSelect label="Rama" v-model="filters.rama" :options="ramaOptions" />
        <InputBase label="1C ID" v-model="filters.id_1c" />
        <BaseSelect label="Práctica" v-model="filters.practica" :options="practicaOptions" />
        <BaseSelect label="Tipo de Usuario" v-model="filters.tipo_usuario" :options="tipoUsuarioOptions" />
        <BaseSelect label="Tipo de Contrato" v-model="filters.tipo_contrato" :options="tipoContratoOptions" />
      </div>
      <div class="filter-actions">
        <BaseButton variant="secondary" @click="clearFilters">Limpiar</BaseButton>
        <BaseButton @click="applyFilters">Buscar</BaseButton>
      </div>
    </div>

    <div class="card">
      <DataTable
        :columns="columns"
        :items="personasStore.personas"
        :actions="['view', 'edit', 'delete']"
        @view="openViewModal"
        @edit="openEditModal"
        @delete="deletePersona"
      />
    </div>

    <PersonaFormModal
      :show="showModal"
      :persona="selectedPersona"
      @close="showModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePersonasStore } from '@/stores/personas';
import type { Persona } from '@/types';
import BaseButton from '@/components/shared/BaseButton.vue';
import InputBase from '@/components/shared/InputBase.vue';
import BaseSelect from '@/components/shared/BaseSelect.vue';
import Icon from '@/components/shared/Icon.vue';
import DataTable from '@/components/shared/DataTable.vue';
import PersonaFormModal from '@/components/personas/PersonaFormModal.vue';

const router = useRouter();
const personasStore = usePersonasStore();
const showFilters = ref(false);
const showModal = ref(false);
const selectedPersona = ref<Persona | undefined>(undefined);

const filters = reactive({
  nombre: '',
  email: '',
  login: '',
  rama: '',
  id_1c: '',
  practica: '',
  tipo_usuario: '',
  tipo_contrato: '',
});

const columns = [
  { key: 'nombres', label: 'Nombre' },
  { key: 'email', label: 'Email' },
  { key: 'rama', label: 'Rama' },
  { key: 'rol', label: 'Rol' },
  { key: 'estado', label: 'Estado' },
];

// Opciones para los filtros (deberían venir del backend en un futuro)
const ramaOptions = [{ value: '', label: 'Todas' }];
const practicaOptions = [{ value: '', label: 'Todas' }];
const tipoUsuarioOptions = [{ value: '', label: 'Todos' }];
const tipoContratoOptions = [{ value: '', label: 'Todos' }];

onMounted(() => {
  personasStore.fetchPersonas();
});

const applyFilters = () => {
  personasStore.fetchPersonas(filters);
};

const clearFilters = () => {
  for (const key of Object.keys(filters)) {
    filters[key as keyof typeof filters] = '';
  }
  applyFilters();
};

const openCreateModal = () => {
  selectedPersona.value = undefined;
  showModal.value = true;
};

const openViewModal = (persona: Persona) => {
  router.push({ name: 'persona-detail', params: { id: persona.id } });
};

const openEditModal = (persona: Persona) => {
  selectedPersona.value = persona;
  showModal.value = true;
};

const deletePersona = (persona: Persona) => {
  // Lógica para eliminar persona
};
</script>

<style scoped>
.personas-view {
  padding: 2rem;
}
.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
h1 {
  font-size: 2rem;
  font-weight: 700;
}
.actions {
  display: flex;
  gap: 1rem;
}
.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  padding: 2rem;
  margin-bottom: 2rem;
}
.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}
.filter-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  border-top: 1px solid #eee;
  padding-top: 1.5rem;
}
</style>
