<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePagosStore } from '@/stores/pagos';
import type { Pago } from '@/types';
import DataTable from '@/components/shared/DataTable.vue';
import BaseModal from '@/components/shared/BaseModal.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import InputBase from '@/components/shared/InputBase.vue';

const pagosStore = usePagosStore();

const isModalOpen = ref(false);
const isEditing = ref(false);
const selectedPago = ref<Pago | null>(null);

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'persona', label: 'Persona ID' },
  { key: 'curso', label: 'Curso ID' },
  { key: 'valor', label: 'Valor' },
  { key: 'fecha_hora', label: 'Fecha' },
];

onMounted(() => {
  pagosStore.fetchPagos();
});

const openCreateModal = () => {
  isEditing.value = false;
  selectedPago.value = {
    persona: 1, // Debería ser seleccionado de una lista
    curso: 1, // Debería ser seleccionado de una lista
    usuario: 1, // Debería venir del usuario autenticado
    fecha_hora: new Date().toISOString(),
    tipo: 1,
    valor: 0,
  };
  isModalOpen.value = true;
};

const openEditModal = (pago: Pago) => {
  isEditing.value = true;
  selectedPago.value = { ...pago };
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedPago.value = null;
};

const savePago = async () => {
  if (!selectedPago.value) return;

  if (isEditing.value) {
    await pagosStore.updatePago(selectedPago.value.id!, selectedPago.value);
  } else {
    await pagosStore.createPago(selectedPago.value);
  }
  closeModal();
};

const deletePago = async (id: number) => {
  if (confirm('¿Estás seguro de que quieres eliminar este pago?')) {
    await pagosStore.deletePago(id);
  }
};
</script>

<template>
  <div class="pagos-view">
    <header class="view-header">
      <h1>Gestión de Pagos</h1>
      <BaseButton @click="openCreateModal">Registrar Pago</BaseButton>
    </header>

    <div v-if="pagosStore.loading">Cargando...</div>
    <div v-if="pagosStore.error" class="error">{{ pagosStore.error }}</div>

    <DataTable
      v-if="!pagosStore.loading && pagosStore.pagos.length"
      :items="pagosStore.pagos"
      :columns="columns"
      @edit="openEditModal"
      @delete="deletePago"
    />

    <BaseModal :show="isModalOpen" @close="closeModal">
      <template #header>
        <h2>{{ isEditing ? 'Editar Pago' : 'Registrar Pago' }}</h2>
      </template>
      <template #body>
        <form v-if="selectedPago" @submit.prevent="savePago" class="pago-form">
          <InputBase v-model="selectedPago.valor" label="Valor" type="number" />
          <InputBase v-model="selectedPago.observacion" label="Observación" />
          <!-- Aquí irían selects para Persona y Curso -->
        </form>
      </template>
      <template #footer>
        <BaseButton @click="closeModal" variant="secondary">Cancelar</BaseButton>
        <BaseButton @click="savePago">Guardar</BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<style scoped>
.pagos-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h1 {
  color: var(--color-heading);
  font-size: 1.8rem;
}

.error {
  color: #ff5555;
}

.pago-form {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
</style>
