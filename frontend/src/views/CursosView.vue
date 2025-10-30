<template>
  <div class="cursos-view">
    <div class="header">
      <h1>Cursos</h1>
      <div class="actions">
        <BaseButton @click="showFilters = !showFilters" variant="secondary">
          <Icon name="filter" /> Filtros
        </BaseButton>
        <BaseButton @click="showCreateModal = true">Crear Curso</BaseButton>
      </div>
    </div>

    <div v-if="showFilters" class="filter-panel card">
      <div class="filter-grid">
        <InputBase label="Título" v-model="filters.titulo" />
        <BaseSelect label="Rama" v-model="filters.rama" :options="ramaOptions" />
        <InputBase type="date" label="Fecha Desde" v-model="filters.fechaDesde" />
        <InputBase type="date" label="Fecha Hasta" v-model="filters.fechaHasta" />
      </div>
      <div class="filter-actions">
        <BaseButton variant="secondary" @click="clearFilters">Limpiar</BaseButton>
        <BaseButton @click="applyFilters">Buscar</BaseButton>
      </div>
    </div>

    <DataTable
      :columns="columns"
      :items="cursosStore.cursos"
      :actions="['acreditar', 'view', 'edit', 'delete']"
      @acreditar="handleAcreditar"
      @view="handleView"
    >
      <template #cell(estado)="{ item }">
        <span :class="getEstadoClass(item)">{{ item.estado }}</span>
      </template>
    </DataTable>
    <CreateCursoModal :show="showCreateModal" @close="showCreateModal = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCursosStore } from '@/stores/cursos';
import DataTable from '@/components/shared/DataTable.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import CreateCursoModal from '@/components/cursos/CreateCursoModal.vue';
import InputBase from '@/components/shared/InputBase.vue';
import BaseSelect from '@/components/shared/BaseSelect.vue';
import Icon from '@/components/shared/Icon.vue';

const router = useRouter();
const cursosStore = useCursosStore();
const showCreateModal = ref(false);
const showFilters = ref(false);

const filters = reactive({
  titulo: '',
  rama: '',
  fechaDesde: '',
  fechaHasta: '',
});

const columns = [
  { key: 'codigo', label: 'Código' },
  { key: 'descripcion', label: 'Descripción' },
  { key: 'cupos', label: 'Cupos' },
  { key: 'estado', label: 'Estado' },
];

const ramaOptions = [{ value: '', label: 'Todas' }];

const getEstadoClass = (curso: any) => {
  // Lógica de semáforo basada en pagos (simulada por ahora)
  if (curso.estado === 'Cerrado') {
    return 'status-badge red';
  } else if (curso.estado === 'En curso') {
    return 'status-badge yellow';
  } else {
    return 'status-badge green';
  }
};

onMounted(() => {
  cursosStore.fetchCursos();
});

const applyFilters = () => {
  cursosStore.fetchCursos(filters);
};

const clearFilters = () => {
  for (const key of Object.keys(filters)) {
    filters[key as keyof typeof filters] = '';
  }
  applyFilters();
};

const handleAcreditar = (curso: any) => {
  router.push({ name: 'acreditacion', params: { id: curso.id } });
};

const handleView = (curso: any) => {
  router.push({ name: 'curso-detail', params: { id: curso.id } });
};
</script>

<style scoped>
.cursos-view {
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
.actions {
  display: flex;
  gap: 1rem;
}
.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  padding: 2rem;
  margin-bottom: 2rem;
}
.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}
.filter-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  border-top: 1px solid #eee;
  padding-top: 1.5rem;
}
.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.8rem;
  color: #fff;
}
.status-badge.red { background-color: #ef4444; }
.status-badge.yellow { background-color: #f59e0b; }
.status-badge.green { background-color: #10b981; }
</style>
