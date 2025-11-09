<template>
  <div class="file-manager-layout">
    <aside class="sidebar-container">
      <CategorySidebar 
        :categories="categories" 
        @filter-selected="handleFilter" 
      />
    </aside>

    <main class="file-list-main-area">
      <FileList 
        :files="filteredFiles" 
        @view-file="showViewer" 
        @refresh="fetchFiles" 
      />
    </main>

    <aside class="viewer-container" :class="{ 'visible': isViewerOpen }">
      <FileViewer 
        v-if="selectedFile" 
        :file="selectedFile" 
        @close="isViewerOpen = false"
      />
      <div v-else-if="isViewerOpen" class="viewer-placeholder">
        Selecciona un archivo para ver los detalles.
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import FileList from '../components/FileList.vue';
import CategorySidebar from '../components/CategorySidebar.vue';
import FileViewer from '../components/FileViewer.vue';
import apiService from '../services/apiService';
import { Archivo, Categoria } from '../types/Archivo';

const files = ref<Archivo[]>([]);
const categories = ref<Categoria[]>([]);
const selectedFilter = ref('all');
const selectedFile = ref<Archivo | null>(null);
const isViewerOpen = ref(false);

// Filtra los archivos basándose en la categoría seleccionada
const filteredFiles = computed(() => {
  if (selectedFilter.value === 'all') {
    return files.value;
  }
  if (selectedFilter.value === 'favoritos') {
      return files.value.filter(file => file.es_favorito);
  }
  // Filtra por el nombre de la categoría (asumiendo que viene en minúsculas)
  return files.value.filter(file => file.categoria_nombre.toLowerCase() === selectedFilter.value);
});

async function fetchFiles() {
  try {
    // 1. Obtener archivos
    const fileResponse = await apiService.get('/archivos/');
    files.value = fileResponse.data;
    
    // 2. Obtener categorías
    const catResponse = await apiService.get('/categorias/');
    categories.value = catResponse.data;

  } catch (error) {
    console.error('Error fetching data:', error);
    // Aquí podrías mostrar un mensaje de error en la UI
  }
}

function handleFilter(filter: string) {
  selectedFilter.value = filter;
  selectedFile.value = null; 
  isViewerOpen.value = false;
}

function showViewer(file: Archivo) {
  selectedFile.value = file;
  isViewerOpen.value = true;
}

onMounted(fetchFiles); // Cargar los datos al montar el componente
</script>

<style scoped>
.file-manager-layout {
  display: flex;
  height: 100vh; /* O la altura que necesites menos tu barra de navegación */
  overflow: hidden;
  background-color: #f4f7f9;
}
.sidebar-container {
  width: 250px;
  background-color: #ffffff;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
}
.file-list-main-area {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
}
.viewer-container {
  width: 0;
  overflow: hidden;
  transition: width 0.3s ease;
  background-color: #ffffff;
  flex-shrink: 0;
}
.viewer-container.visible {
  width: 350px; 
  border-left: 1px solid #ccc;
}
.viewer-placeholder {
    padding: 20px;
    color: #6c757d;
}
</style>