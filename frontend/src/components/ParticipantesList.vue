<template>
  <div class="list-panel">
    <h3>Lista de Participantes ({{ participantes.length }})</h3>
    <input type="text" v-model="searchText" placeholder="Buscar por Nombre o RUT..." class="search-input">
    
    <table class="data-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>RUT</th>
          <th>Estado</th>
          <th>Acción Rápida</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in filteredParticipantes" :key="p.id">
          <td>{{ p.nombre_completo }}</td>
          <td>{{ p.rut }}</td>
          <td>
            <span :class="{'status-acreditado': p.estado_acreditacion === 'Acreditado', 'status-pendiente': p.estado_acreditacion === 'Pendiente'}">
              {{ p.estado_acreditacion }}
            </span>
          </td>
          <td>
            <button 
              @click="$emit('selectParticipante', p)" 
              class="btn-view"
            >
              Ver/Acreditar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue';
import { Participante } from '@/types/Participante';

const props = defineProps<{
    participantes: Participante[];
}>();

defineEmits(['selectParticipante']);

const searchText = ref('');

const filteredParticipantes = computed(() => {
  if (!searchText.value) {
    return props.participantes;
  }
  const search = searchText.value.toLowerCase();
  return props.participantes.filter(p => 
    p.nombre_completo.toLowerCase().includes(search) ||
    p.rut.toLowerCase().includes(search)
  );
});
</script>

<style scoped>
/* Estilos básicos de la tabla */
.list-panel {
    padding: 20px;
    border-right: 1px solid #eee;
}
.search-input {
    width: 95%;
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ccc;
    border-radius: 4px;
}
.data-table {
    width: 100%;
    border-collapse: collapse;
}
.data-table th, .data-table td {
    padding: 10px;
    border-bottom: 1px solid #eee;
    text-align: left;
}
.status-acreditado { color: #28a745; font-weight: bold; }
.status-pendiente { color: #ffc107; font-weight: bold; }
.btn-view {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
}
</style>