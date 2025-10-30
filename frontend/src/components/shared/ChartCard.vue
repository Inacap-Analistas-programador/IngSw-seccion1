<template>
  <div class="chart-card">
    <h3 class="card-title">{{ title }}</h3>
    <div class="chart-wrapper">
      <slot></slot> <!-- El gráfico se insertará aquí -->
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: String,
});
</script>

<style scoped>
.chart-card {
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}
.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}
.chart-wrapper {
  height: 300px; /* Altura fija para el gráfico */
}
</style>
