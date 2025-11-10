<template>
  <div class="cursos-view">
    <div class="header">
      <h1>Gestión de Cursos</h1>
      <div class="actions">
        <BaseButton @click="exportData" variant="secondary">
          <Icon name="download" /> Exportar
        </BaseButton>
        <BaseButton @click="showFilters = !showFilters" variant="secondary">
          <Icon name="filter" /> Filtros
        </BaseButton>
        <BaseButton @click="openCreateModal()">
          <Icon name="plus" /> Crear Curso
        </BaseButton>
      </div>
    </div>

    <!-- Filtros expandibles -->
    <div v-if="showFilters" class="filter-panel card">
      <div class="filter-grid">
        <InputBase label="Búsqueda" placeholder="Título, descripción, código..." v-model="filters.search" />
        <BaseSelect label="Rama" v-model="filters.rama" :options="ramaOptions" />
        <BaseSelect label="Estado" v-model="filters.estado" :options="estadoOptions" />
        <BaseSelect label="Modalidad" v-model="filters.modalidad" :options="modalidadOptions" />
        <InputBase type="date" label="Fecha Desde" v-model="filters.fechaDesde" />
        <InputBase type="date" label="Fecha Hasta" v-model="filters.fechaHasta" />
        <BaseSelect label="Responsable" v-model="filters.responsable" :options="responsableOptions" />
        <BaseSelect label="Comuna" v-model="filters.comuna" :options="comunaOptions" />
      </div>
      <div class="filter-actions">
        <BaseButton variant="secondary" @click="clearFilters">
          <Icon name="x" /> Limpiar
        </BaseButton>
        <BaseButton @click="applyFilters">
          <Icon name="search" /> Buscar
        </BaseButton>
      </div>
    </div>

    <!-- Estadísticas rápidas -->
    <div class="stats-grid">
      <div class="stat-card">
        <h3>{{ cursosStore.cursos.length }}</h3>
        <p>Total Cursos</p>
      </div>
      <div class="stat-card">
        <h3>{{ cursosActivos }}</h3>
        <p>En Curso</p>
      </div>
      <div class="stat-card">
        <h3>{{ cursosCompletados }}</h3>
        <p>Completados</p>
      </div>
      <div class="stat-card">
        <h3>{{ totalInscritos }}</h3>
        <p>Inscritos Total</p>
      </div>
    </div>

    <!-- Tabla de cursos con acciones -->
    <div class="card">
      <div class="table-header">
        <h2>Lista de Cursos</h2>
        <div class="table-actions">
          <BaseSelect v-model="itemsPerPage" :options="paginationOptions" @change="updatePagination" />
          <BaseButton variant="secondary" @click="refreshData">
            <Icon name="refresh" /> Actualizar
          </BaseButton>
        </div>
      </div>
      
      <DataTable
        :columns="columns"
        :items="paginatedCursos"
        :actions="['view', 'edit', 'delete', 'acreditar']"
        @view="handleView"
        @edit="handleEdit"
        @delete="handleDelete"
        @acreditar="handleAcreditar"
      >
        <template #cell(estado)="{ item }">
          <span :class="getEstadoClass(item)">
            {{ getEstadoLabel(item.estado) }}
          </span>
        </template>
        
        <template #cell(modalidad)="{ item }">
          <span class="modalidad-badge" :class="getModalidadClass(item.modalidad)">
            {{ getModalidadLabel(item.modalidad) }}
          </span>
        </template>
        
        <template #cell(fechas)="{ item }">
          <div v-if="item.fechas && item.fechas.length > 0" class="fechas-list">
            <div v-for="(fecha, index) in item.fechas.slice(0, 2)" :key="index" class="fecha-item">
              {{ formatFecha(fecha.fecha_inicio) }} - {{ formatFecha(fecha.fecha_termino) }}
            </div>
            <small v-if="item.fechas.length > 2" class="text-muted">
              +{{ item.fechas.length - 2 }} más
            </small>
          </div>
          <span v-else class="text-muted">Sin fechas</span>
        </template>
        
        <template #cell(inscripciones)="{ item }">
          <div class="inscripciones-info">
            <span class="count">{{ item.total_inscripciones || 0 }}</span>
            <small class="limit">/ {{ item.cupo_maximo || '∞' }}</small>
          </div>
        </template>

        <template #cell(progreso)="{ item }">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: getProgreso(item) + '%' }"></div>
            <span class="progress-text">{{ getProgreso(item) }}%</span>
          </div>
        </template>

        <template #cell(responsable)="{ item }">
          <div v-if="item.responsable" class="responsable-info">
            <strong>{{ item.responsable.nombre_completo || item.responsable.nombres }}</strong>
            <small v-if="item.cargo_responsable" class="cargo">
              {{ item.cargo_responsable.descripcion || item.cargo_responsable.nombre }}
            </small>
          </div>
          <span v-else class="text-muted">Sin asignar</span>
        </template>
      </DataTable>
      
      <!-- Paginación -->
      <div class="pagination" v-if="totalPages > 1">
        <BaseButton 
          variant="secondary" 
          :disabled="currentPage === 1" 
          @click="goToPage(currentPage - 1)"
        >
          Anterior
        </BaseButton>
        
        <span class="page-info">
          Página {{ currentPage }} de {{ totalPages }} 
          ({{ totalItems }} elementos)
        </span>
        
        <BaseButton 
          variant="secondary" 
          :disabled="currentPage === totalPages" 
          @click="goToPage(currentPage + 1)"
        >
          Siguiente
        </BaseButton>
      </div>
    </div>

    <!-- Modales -->
    <CreateCursoModal 
      :show="showCreateModal" 
      :curso="selectedCurso"
      @close="closeCreateModal" 
    />

    <!-- Modal de confirmación para eliminar -->
    <BaseModal :show="showDeleteModal" @close="showDeleteModal = false">
      <template #header>
        <h2>Confirmar Eliminación</h2>
      </template>
      <template #body>
        <p>¿Estás seguro de que deseas eliminar el curso <strong>{{ cursoToDelete?.titulo || cursoToDelete?.descripcion }}</strong>?</p>
        <p class="text-danger">Esta acción no se puede deshacer.</p>
      </template>
      <template #footer>
        <BaseButton variant="secondary" @click="showDeleteModal = false">
          Cancelar
        </BaseButton>
        <BaseButton variant="danger" @click="confirmDelete">
          Eliminar
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useCursosStore } from '@/stores/cursos';
import { useCatalogoStore } from '@/stores/catalogo';
import { usePersonasStore } from '@/stores/personas';
import DataTable from '@/components/shared/DataTable.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import BaseModal from '@/components/shared/BaseModal.vue';
import CreateCursoModal from '@/components/cursos/CreateCursoModal.vue';
import InputBase from '@/components/shared/InputBase.vue';
import BaseSelect from '@/components/shared/BaseSelect.vue';
import Icon from '@/components/shared/Icon.vue';

const router = useRouter();
const cursosStore = useCursosStore();
const catalogoStore = useCatalogoStore();
const personasStore = usePersonasStore();

const showCreateModal = ref(false);
const showDeleteModal = ref(false);
const showFilters = ref(false);
const selectedCurso = ref<any>(null);
const cursoToDelete = ref<any>(null);

// Paginación
const currentPage = ref(1);
const itemsPerPage = ref(10);

// Filtros expandidos
const filters = reactive({
  search: '',
  titulo: '',
  rama: '',
  estado: '',
  modalidad: '',
  fechaDesde: '',
  fechaHasta: '',
  responsable: '',
  comuna: '',
});

// Columnas de la tabla
const columns = [
  { key: 'codigo', label: 'Código', sortable: true },
  { key: 'descripcion', label: 'Descripción', sortable: true },
  { key: 'modalidad', label: 'Modalidad' },
  { key: 'fechas', label: 'Fechas' },
  { key: 'inscripciones', label: 'Inscritos' },
  { key: 'progreso', label: 'Progreso' },
  { key: 'responsable', label: 'Responsable' },
  { key: 'estado', label: 'Estado', sortable: true },
];

// Opciones para filtros
const ramaOptions = ref([{ value: '', label: 'Todas las ramas' }]);
const estadoOptions = ref([
  { value: '', label: 'Todos los estados' },
  { value: 0, label: 'Planificado' },
  { value: 1, label: 'En curso' },
  { value: 2, label: 'Completado' },
  { value: 3, label: 'Cancelado' },
]);

const modalidadOptions = ref([
  { value: '', label: 'Todas las modalidades' },
  { value: 1, label: 'Presencial' },
  { value: 2, label: 'Online' },
  { value: 3, label: 'Híbrido' },
]);

const responsableOptions = ref([{ value: '', label: 'Todos los responsables' }]);
const comunaOptions = ref([{ value: '', label: 'Todas las comunas' }]);

const paginationOptions = [
  { value: 5, label: '5 por página' },
  { value: 10, label: '10 por página' },
  { value: 25, label: '25 por página' },
  { value: 50, label: '50 por página' },
];

// Computados para estadísticas
const cursosActivos = computed(() => {
  return cursosStore.cursos.filter(curso => curso.estado === 1).length;
});

const cursosCompletados = computed(() => {
  return cursosStore.cursos.filter(curso => curso.estado === 2).length;
});

const totalInscritos = computed(() => {
  return cursosStore.cursos.reduce((total, curso) => {
    return total + ((curso as any).total_inscripciones || 0);
  }, 0);
});

// Cursos filtrados
const filteredCursos = computed(() => {
  let cursos = [...cursosStore.cursos];

  if (filters.search) {
    const search = filters.search.toLowerCase();
    cursos = cursos.filter(curso => 
      (curso.codigo && curso.codigo.toLowerCase().includes(search)) ||
      (curso.descripcion && curso.descripcion.toLowerCase().includes(search)) ||
      ((curso as any).titulo && (curso as any).titulo.toLowerCase().includes(search))
    );
  }

  if (filters.rama && filters.rama !== '') {
    cursos = cursos.filter(curso => 
      curso.rama === filters.rama || 
      (typeof curso.rama === 'object' && (curso.rama as any)?.id === filters.rama)
    );
  }

  if (filters.estado && filters.estado !== '') {
    cursos = cursos.filter(curso => curso.estado === Number(filters.estado));
  }

  if (filters.modalidad && filters.modalidad !== '') {
    cursos = cursos.filter(curso => String(curso.modalidad) === filters.modalidad);
  }

  if (filters.responsable && filters.responsable !== '') {
    cursos = cursos.filter(curso => 
      String(curso.responsable) === filters.responsable ||
      (typeof curso.responsable === 'object' && (curso.responsable as any)?.id === filters.responsable)
    );
  }

  if (filters.comuna && filters.comuna !== '') {
    cursos = cursos.filter(curso => 
      String(curso.comuna) === filters.comuna ||
      (typeof curso.comuna === 'object' && (curso.comuna as any)?.id === filters.comuna)
    );
  }

  if (filters.fechaDesde) {
    cursos = cursos.filter(curso => {
      const fechas = (curso as any).fechas;
      if (!fechas || !Array.isArray(fechas) || fechas.length === 0) return false;
      return fechas.some((fecha: any) => 
        fecha.fecha_inicio && fecha.fecha_inicio >= filters.fechaDesde
      );
    });
  }

  if (filters.fechaHasta) {
    cursos = cursos.filter(curso => {
      const fechas = (curso as any).fechas;
      if (!fechas || !Array.isArray(fechas) || fechas.length === 0) return false;
      return fechas.some((fecha: any) => 
        fecha.fecha_termino && fecha.fecha_termino <= filters.fechaHasta
      );
    });
  }

  return cursos;
});

// Paginación de cursos
const totalItems = computed(() => filteredCursos.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));

const paginatedCursos = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredCursos.value.slice(start, end);
});

// Funciones de utilidad
const getEstadoLabel = (estado: number) => {
  const labels = {
    0: 'Planificado',
    1: 'En curso', 
    2: 'Completado',
    3: 'Cancelado'
  };
  return labels[estado as keyof typeof labels] || 'Desconocido';
};

const getEstadoClass = (curso: any) => {
  const estado = Number(curso.estado);
  if (estado === 3) return 'status-badge red';
  if (estado === 1) return 'status-badge yellow';
  if (estado === 2) return 'status-badge green';
  return 'status-badge gray';
};

const getModalidadLabel = (modalidad: number) => {
  const labels = {
    1: 'Presencial',
    2: 'Online',
    3: 'Híbrido'
  };
  return labels[modalidad as keyof typeof labels] || 'Sin definir';
};

const getModalidadClass = (modalidad: number) => {
  const classes = {
    1: 'presencial',
    2: 'online', 
    3: 'hibrido'
  };
  return classes[modalidad as keyof typeof classes] || 'undefined';
};

const formatFecha = (fecha: string) => {
  if (!fecha) return '';
  return new Date(fecha).toLocaleDateString('es-CL');
};

const getProgreso = (curso: any) => {
  if (!curso.fechas || !Array.isArray(curso.fechas) || curso.fechas.length === 0) return 0;
  
  const now = new Date();
  const fechaInicio = new Date(curso.fechas[0].fecha_inicio);
  const fechaFin = new Date(curso.fechas[curso.fechas.length - 1].fecha_termino);
  
  if (now < fechaInicio) return 0;
  if (now > fechaFin) return 100;
  
  const total = fechaFin.getTime() - fechaInicio.getTime();
  const transcurrido = now.getTime() - fechaInicio.getTime();
  
  return Math.round((transcurrido / total) * 100);
};

// Funciones de acciones
const openCreateModal = (curso?: any) => {
  selectedCurso.value = curso || null;
  showCreateModal.value = true;
};

const closeCreateModal = () => {
  showCreateModal.value = false;
  selectedCurso.value = null;
  refreshData();
};

const handleView = (curso: any) => {
  router.push({ name: 'curso-detail', params: { id: curso.id } });
};

const handleEdit = (curso: any) => {
  openCreateModal(curso);
};

const handleDelete = (curso: any) => {
  cursoToDelete.value = curso;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  if (cursoToDelete.value) {
    try {
      await cursosStore.deleteCurso(cursoToDelete.value.id);
      alert('Curso eliminado correctamente');
      refreshData();
    } catch (error) {
      alert('Error al eliminar el curso');
    }
  }
  showDeleteModal.value = false;
  cursoToDelete.value = null;
};

const handleAcreditar = (curso: any) => {
  router.push({ name: 'acreditacion', params: { id: curso.id } });
};

const handleInscripciones = (curso: any) => {
  router.push({ name: 'curso-inscripciones', params: { id: curso.id } });
};

const handlePagos = (curso: any) => {
  router.push({ name: 'curso-pagos', params: { id: curso.id } });
};

const handleDuplicate = async (curso: any) => {
  if (confirm(`¿Duplicar el curso "${curso.descripcion}"?`)) {
    try {
      const duplicatedCurso = { ...curso };
      delete duplicatedCurso.id;
      duplicatedCurso.codigo = `${curso.codigo}_COPY`;
      duplicatedCurso.descripcion = `${curso.descripcion} (Copia)`;
      
      await cursosStore.createCurso(duplicatedCurso);
      alert('Curso duplicado correctamente');
      refreshData();
    } catch (error) {
      alert('Error al duplicar el curso');
    }
  }
};

const handleExportSingle = (curso: any) => {
  const dataStr = JSON.stringify(curso, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `curso_${curso.codigo || curso.id}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

const exportData = () => {
  const dataStr = JSON.stringify(filteredCursos.value, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `cursos_export_${new Date().getTime()}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

const refreshData = async () => {
  await cursosStore.fetchCursos();
};

const applyFilters = () => {
  currentPage.value = 1;
  // Los filtros ya se aplican automáticamente a través del computed filteredCursos
};

const clearFilters = () => {
  Object.keys(filters).forEach(key => {
    (filters as any)[key] = '';
  });
  currentPage.value = 1;
};

const updatePagination = () => {
  currentPage.value = 1;
};

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

// Cargar datos al montar el componente
onMounted(async () => {
  await Promise.all([
    cursosStore.fetchCursos(),
    catalogoStore.fetchAllCatalogos(),
    personasStore.fetchPersonas()
  ]);
  
  // Actualizar opciones para filtros
  ramaOptions.value = [{ value: '', label: 'Todas las ramas' }].concat(
    catalogoStore.ramas.map((r: any) => ({ 
      value: r.id || r.pk, 
      label: r.descripcion || r.nombre 
    }))
  );
  
  responsableOptions.value = [{ value: '', label: 'Todos los responsables' }].concat(
    personasStore.personas.map((p: any) => ({ 
      value: p.id || p.pk, 
      label: p.nombre_completo || `${p.nombres || ''} ${p.apellidos || ''}`.trim() 
    }))
  );
  
  comunaOptions.value = [
    { value: '', label: 'Todas las comunas' },
    { value: '1', label: 'Concepción' },
    { value: '2', label: 'Talcahuano' },
    { value: '3', label: 'Chiguayante' },
    { value: '4', label: 'San Pedro de la Paz' },
    { value: '5', label: 'Hualpén' },
    { value: '6', label: 'Coronel' },
    { value: '7', label: 'Lota' },
    { value: '8', label: 'Tomé' },
  ];
});

// Watcher para refrescar datos cuando cambien los filtros
watch(() => filteredCursos.value.length, () => {
  if (currentPage.value > totalPages.value && totalPages.value > 0) {
    currentPage.value = totalPages.value;
  }
});
</script>

<style scoped>
.cursos-view {
  padding: 2rem;
  background-color: #f8fafc;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
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

.filter-panel {
  border: 1px solid #e5e7eb;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
}

.stat-card h3 {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.stat-card p {
  font-size: 1rem;
  opacity: 0.9;
  margin: 0;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.table-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.table-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  color: #fff;
  display: inline-block;
}

.status-badge.red { 
  background: linear-gradient(135deg, #ef4444, #dc2626); 
}

.status-badge.yellow { 
  background: linear-gradient(135deg, #f59e0b, #d97706); 
}

.status-badge.green { 
  background: linear-gradient(135deg, #10b981, #059669); 
}

.status-badge.gray { 
  background: linear-gradient(135deg, #6b7280, #4b5563); 
}

.modalidad-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 500;
  color: #fff;
  display: inline-block;
}

.modalidad-badge.presencial { 
  background: linear-gradient(135deg, #3b82f6, #2563eb); 
}

.modalidad-badge.online { 
  background: linear-gradient(135deg, #8b5cf6, #7c3aed); 
}

.modalidad-badge.hibrido { 
  background: linear-gradient(135deg, #06b6d4, #0891b2); 
}

.modalidad-badge.undefined { 
  background: linear-gradient(135deg, #6b7280, #4b5563); 
}

.fechas-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.fecha-item {
  font-size: 0.9rem;
  color: #374151;
}

.text-muted {
  color: #6b7280;
  font-style: italic;
}

.inscripciones-info {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.inscripciones-info .count {
  font-weight: 600;
  color: #1f2937;
}

.inscripciones-info .limit {
  color: #6b7280;
}

.progress-bar {
  position: relative;
  background-color: #e5e7eb;
  border-radius: 10px;
  height: 20px;
  overflow: hidden;
  min-width: 80px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 10px;
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.75rem;
  font-weight: 600;
  color: #1f2937;
}

.responsable-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.responsable-info strong {
  color: #1f2937;
  font-size: 0.9rem;
}

.responsable-info .cargo {
  color: #6b7280;
  font-size: 0.8rem;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.page-info {
  color: #6b7280;
  font-size: 0.9rem;
}

.text-danger {
  color: #ef4444;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 768px) {
  .cursos-view {
    padding: 1rem;
  }
  
  .header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .actions {
    justify-content: center;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .filter-grid {
    grid-template-columns: 1fr;
  }
  
  .table-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .pagination {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
