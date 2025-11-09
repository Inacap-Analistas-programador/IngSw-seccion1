<template>
  <div class="file-list-content">
    <header class="list-header">
      <h1>Mis Archivos</h1>
      <div class="actions">
        <button class="upload-btn">⬆️ Subir Archivo</button>
        <input type="text" placeholder="Buscar..." class="search-input">
      </div>
    </header>

    <table class="file-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Tipo</th>
          <th>Tamaño</th>
          <th>Fecha</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="file in files" :key="file.id" @click="$emit('viewFile', file)">
          <td>{{ file.nombre }}</td>
          <td>{{ file.categoria_nombre }}</td>
          <td>{{ formatSize(file.size) }}</td>
          <td>{{ formatDate(file.fecha_subida) }}</td>
          <td>
            <button @click.stop="$emit('viewFile', file)">Ver</button>
            </td>
        </tr>
        <tr v-if="files.length === 0">
            <td colspan="5">No se encontraron archivos con el filtro seleccionado.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { Archivo } from '@/types/Archivo';

defineProps<{
    files: Archivo[];
}>();

defineEmits(['viewFile', 'refresh']); // 'viewFile' para abrir el visualizador

// Funciones de utilidad para mejor presentación
function formatSize(bytes: number = 0) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString();
}
</script>

<style scoped>
/* Adaptar estilos de la tabla y encabezado del CSS anterior */
.list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}
.upload-btn {
    background-color: #28a745; 
    color: white; 
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
.file-table {
    width: 100%;
    border-collapse: collapse;
}
.file-table th, .file-table td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: left;
}
.file-table tbody tr:hover {
    background-color: #f1f1f1;
    cursor: pointer;
}
</style>