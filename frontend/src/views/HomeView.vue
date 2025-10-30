<template>
  <div class="dashboard-view">
    <header class="view-header">
      <h1>Dashboard</h1>
      <BaseButton variant="accent">+ Añadir Widget</BaseButton>
    </header>

    <div class="dashboard-grid">
      <StatCard title="Total de Cursos" :value="dashboardStore.stats?.total_cursos || 0" icon="training" />
      <StatCard title="Cursos Activos" :value="dashboardStore.stats?.cursos_activos || 0" icon="check-circle" />
      <StatCard title="Total de Participantes" :value="dashboardStore.stats?.total_participantes || 0" icon="users" />

      <ChartCard title="Participantes por Rama" class="span-3">
        <DoughnutChart :chart-data="chartData" />
      </ChartCard>

      <ChartCard title="Riesgos Asignados">
        <div class="placeholder-list">
          <p>No hay riesgos asignados.</p>
        </div>
      </ChartCard>

      <ChartCard title="Acciones Asignadas">
        <div class="placeholder-list">
          <p>No hay acciones asignadas.</p>
        </div>
      </ChartCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useDashboardStore } from '@/stores/dashboard';
import BaseButton from '@/components/shared/BaseButton.vue';
import ChartCard from '@/components/shared/ChartCard.vue';
import DoughnutChart from '@/components/charts/DoughnutChart.vue';
import StatCard from '@/components/shared/StatCard.vue';

const dashboardStore = useDashboardStore();

onMounted(() => {
  dashboardStore.fetchStats();
});

const chartData = computed(() => {
  const statsData = dashboardStore.stats?.participantes_por_rama;

  if (statsData && Array.isArray(statsData) && statsData.length > 0) {
    const labels = statsData.map(item => item.nombre);
    const data = statsData.map(item => item.num_participantes);

    return {
      labels,
      datasets: [
        {
          backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16', '#FFA500', '#36A2EB'],
          data
        }
      ]
    };
  }

  return {
    labels: ['Sin datos'],
    datasets: [
      {
        backgroundColor: ['#CCCCCC'],
        data: [1]
      }
    ]
  };
});
</script>

<style scoped>
.dashboard-view {
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
.span-3 {
  grid-column: span 3;
}
.placeholder-chart, .placeholder-list {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--color-text-mute);
  font-style: italic;
}
</style>
