<template>
  <div class="reportes-view">
    <header class="view-header">
      <h1>Reportes</h1>
      <BaseButton @click="exportarReportes" variant="secondary">
        <Icon name="download" /> Exportar
      </BaseButton>
    </header>

    <div class="dashboard-grid">
      <ChartCard title="Inscripciones por Mes">
        <div class="placeholder-chart">Gráfico de Inscripciones por Mes</div>
      </ChartCard>

      <ChartCard title="Pagos por Curso">
        <div class="placeholder-chart">Gráfico de Pagos por Curso</div>
      </ChartCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/shared/BaseButton.vue';
import ChartCard from '@/components/shared/ChartCard.vue';
import Icon from '@/components/shared/Icon.vue';

const exportarReportes = () => {
  // Lógica para exportar reportes
  alert('Exportando reportes...');
};
</script>

<style scoped>
.reportes-view {
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
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}
.placeholder-chart {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--color-text-mute);
  font-style: italic;
}
</style>
