<template>
  <div class="dashboard-grid">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DashboardGrid',
});
</script>

<style scoped>
.dashboard-grid {
  display: grid;
  /* Crea una cuadrícula responsive con columnas de tamaño mínimo 250px */
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem; /* Espacio entre las tarjetas */
}
</style>
