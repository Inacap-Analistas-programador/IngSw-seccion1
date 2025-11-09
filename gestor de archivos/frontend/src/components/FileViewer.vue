<template>
  <div class="file-viewer-panel">
    <button @click="$emit('close')" class="close-btn">X Cerrar</button>
    <h3>{{ file.nombre }}</h3>

    <div class="preview-box">
      <template v-if="['png', 'jpg', 'jpeg', 'gif'].includes(file.extension)">
        <img :src="file.archivo_subido" :alt="file.nombre" class="file-preview-img">
      </template>
      <template v-else-if="file.extension === 'pdf'">
        <p>Vista previa de **PDF**. Puedes integrar librerías Vue para renderizar el PDF.</p>
        
      </template>
      <template v-else>
        <p>No hay vista previa disponible para el tipo: **.{{ file.extension }}**</p>
      </template>
    </div>

    <h4>Detalles</h4>
    <p>Tipo: <strong>{{ file.categoria_nombre }}</strong></p>
    <p>Tamaño: <strong>{{ formatSize(file.size) }}</strong></p>
    <p>Subido el: <strong>{{ formatDate(file.fecha_subida) }}</strong></p>

    <div class="tag-list">
        <span class="tag">Inacap</span>
        <span class="tag">Proyecto</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { Archivo } from '@/types/Archivo';

defineProps<{
    file: Archivo;
}>();

defineEmits(['close']);

// Las funciones de formato deben importarse o definirse aquí también (repetidas del FileList por simplicidad)
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
.file-viewer-panel {
    padding: 20px;
}
.close-btn {
    float: right;
    background: none;
    border: none;
    color: #dc3545;
    cursor: pointer;
    font-weight: bold;
}
.preview-box {
    min-height: 150px;
    background-color: white;
    margin: 15px 0;
    padding: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #ddd;
    text-align: center;
}
.file-preview-img {
    max-width: 100%;
    max-height: 200px;
}
.tag-list {
    margin-top: 15px;
}
.tag {
    display: inline-block;
    background-color: #007bff;
    color: white;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.8em;
    margin-right: 5px;
}
</style>