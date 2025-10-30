<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCatalogoStore } from '@/stores/catalogo';
import DataTable from '@/components/shared/DataTable.vue';

const catalogoStore = useCatalogoStore();
const activeTab = ref('roles');

const rolColumns = [
  { key: 'id', label: 'ID' },
  { key: 'descripcion', label: 'Descripción' },
  { key: 'tipo', label: 'Tipo' },
  { key: 'vigente', label: 'Vigente' },
];

const cargoColumns = [
  { key: 'id', label: 'ID' },
  { key: 'descripcion', label: 'Descripción' },
  { key: 'vigente', label: 'Vigente' },
];

const ramaColumns = [
  { key: 'id', label: 'ID' },
  { key: 'descripcion', label: 'Descripción' },
  { key: 'vigente', label: 'Vigente' },
];

onMounted(() => {
  catalogoStore.fetchAllCatalogos();
});

const setActiveTab = (tab: string) => {
  activeTab.value = tab;
};
</script>

<template>
  <div class="catalogo-view">
    <header class="view-header">
      <h1>Gestión de Catálogos</h1>
    </header>

    <div class="tabs">
      <button @click="setActiveTab('roles')" :class="{ active: activeTab === 'roles' }">Roles</button>
      <button @click="setActiveTab('cargos')" :class="{ active: activeTab === 'cargos' }">Cargos</button>
      <button @click="setActiveTab('ramas')" :class="{ active: activeTab === 'ramas' }">Ramas</button>
    </div>

    <div v-if="catalogoStore.loading">Cargando...</div>
    <div v-if="catalogoStore.error" class="error">{{ catalogoStore.error }}</div>

    <div v-show="activeTab === 'roles'">
      <DataTable :items="catalogoStore.roles" :columns="rolColumns" />
    </div>
    <div v-show="activeTab === 'cargos'">
      <DataTable :items="catalogoStore.cargos" :columns="cargoColumns" />
    </div>
    <div v-show="activeTab === 'ramas'">
      <DataTable :items="catalogoStore.ramas" :columns="ramaColumns" />
    </div>
  </div>
</template>

<style scoped>
.catalogo-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.view-header h1 {
  color: var(--color-heading);
  font-size: 1.8rem;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

.tabs button {
  padding: 0.8rem 1.5rem;
  border: none;
  background-color: transparent;
  color: var(--color-text-mute);
  cursor: pointer;
  font-size: 1rem;
  border-bottom: 2px solid transparent;
  transition: color 0.3s, border-color 0.3s;
}

.tabs button:hover {
  color: var(--color-text);
}

.tabs button.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}
</style>
