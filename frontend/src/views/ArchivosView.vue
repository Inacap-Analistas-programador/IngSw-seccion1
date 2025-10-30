<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useArchivosStore } from '@/stores/archivos';
import DataTable from '@/components/shared/DataTable.vue';
import BaseModal from '@/components/shared/BaseModal.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import FileUploader from '@/components/shared/FileUploader.vue';
import InputBase from '@/components/shared/InputBase.vue';

const archivosStore = useArchivosStore();

const isModalOpen = ref(false);
const newFile = ref<File | null>(null);
const newFileDescription = ref('');

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'descripcion', label: 'Descripción' },
  { key: 'fecha_hora', label: 'Fecha' },
  { key: 'ruta', label: 'Enlace' }, // Podríamos hacer un enlace de descarga aquí
];

onMounted(() => {
  archivosStore.fetchArchivos();
});

const openUploadModal = () => {
  newFile.value = null;
  newFileDescription.value = '';
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const handleFileSelect = (file: File) => {
  newFile.value = file;
};

const uploadFile = async () => {
  if (!newFile.value) {
    alert('Por favor, selecciona un archivo.');
    return;
  }

  const formData = new FormData();
  formData.append('file', newFile.value);
  formData.append('descripcion', newFileDescription.value);
  // Otros campos necesarios para el backend
  formData.append('tipo_archivo', '1');
  formData.append('usuario_crea', '1');


  await archivosStore.createArchivo(formData);
  closeModal();
};

const deleteArchivo = async (id: number) => {
  if (confirm('¿Estás seguro de que quieres eliminar este archivo?')) {
    await archivosStore.deleteArchivo(id);
  }
};
</script>

<template>
  <div class="archivos-view">
    <header class="view-header">
      <h1>Gestión de Archivos</h1>
      <BaseButton @click="openUploadModal">Subir Archivo</BaseButton>
    </header>

    <div v-if="archivosStore.loading">Cargando...</div>
    <div v-if="archivosStore.error" class="error">{{ archivosStore.error }}</div>

    <DataTable
      v-if="!archivosStore.loading && archivosStore.archivos.length"
      :items="archivosStore.archivos"
      :columns="columns"
      @delete="deleteArchivo"
    />

    <BaseModal :show="isModalOpen" @close="closeModal">
      <template #header>
        <h2>Subir Nuevo Archivo</h2>
      </template>
      <template #body>
        <form @submit.prevent="uploadFile" class="upload-form">
          <InputBase v-model="newFileDescription" label="Descripción del Archivo" />
          <FileUploader @file-selected="handleFileSelect" />
        </form>
      </template>
      <template #footer>
        <BaseButton @click="closeModal" variant="secondary">Cancelar</BaseButton>
        <BaseButton @click="uploadFile">Subir</BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<style scoped>
.archivos-view {
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

.upload-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
