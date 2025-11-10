<template>
  <div class="cursos-view">
    <div class="header">
      <h1>Cursos</h1>
      <div class="actions">
          <BaseButton @click="showFilters = !showFilters" variant="secondary">
          <Icon name="filter" /> Filtros
        </BaseButton>
          <BaseButton @click="openCreateModal">Crear Curso</BaseButton>
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

    <!-- depuración eliminada -->

    <DataTable
      :columns="columns"
      :items="cursosStore.cursos"
    >
      <template #cell(estado)="{ item }">
        <div style="display:flex;align-items:center;gap:0.5rem;justify-content:center;">
          <select
            :value="estadoMap[String(item.id)] ?? item.estado"
            @change="onEstadoSelectChange($event, item)"
            :disabled="loadingEstado[String(item.id)]"
            :class="getEstadoClass(item)"
          >
            <option value="0">Pendiente</option>
            <option value="1">Vigente</option>
            <option value="2">Anulado</option>
            <option value="3">Finalizado</option>
          </select>
        </div>
      </template>
      <template #cell(persona_responsable)="{ item }">
        <span>
          {{ item.persona_responsable?.nombre_completo || item.persona_responsable?.nombres || item.responsable?.nombres || item.responsable || '-' }}
        </span>
      </template>
      <template #cell(comuna)="{ item }">
        <span>
          {{ item.comuna_lugar?.nombre || item.comuna_lugar?.descripcion || item.comuna?.descripcion || item.comuna || '-' }}
        </span>
      </template>
      <template #cell(lugar)="{ item }">
        <span>{{ item.lugar || '-' }}</span>
      </template>
      <template #cell(modalidad)="{ item }">
        <span>{{ getModalidadLabel(item.modalidad) }}</span>
      </template>
      <template #cell(tipo_curso)="{ item }">
        <span>
          {{ item.tipo_curso?.descripcion || item.tipo_curso?.nombre || item.tipo_curso || '-' }}
        </span>
      </template>
      <template #cell(cuota_con_almuerzo)="{ item }">
        <span>{{ formatMonto(item.cuota_con_almuerzo) }}</span>
      </template>
      <template #cell(cuota_sin_almuerzo)="{ item }">
        <span>{{ formatMonto(item.cuota_sin_almuerzo) }}</span>
      </template>
      <template #cell(fechas)="{ item }">
        <span v-if="Array.isArray(item.fechas) && item.fechas.length > 0">
          <span v-for="(fecha, idx) in item.fechas" :key="idx">
            <span class="fecha-range">
              {{ formatFecha(fecha.fecha_inicio) }}
              <template v-if="fecha.fecha_termino">
                - {{ formatFecha(fecha.fecha_termino) }}
              </template>
              <span class="fecha-tipo">({{ getFechaTipoLabel(fecha.tipo) }})</span>
            </span>
            <span v-if="idx < item.fechas.length - 1">, </span>
          </span>
        </span>
        <span v-else>-</span>
      </template>
      <template #cell(actions)="{ item }">
        <div class="actions-group">
          <BaseButton size="sm" variant="info" @click="handleView(item)">Ver</BaseButton>
          <BaseButton size="sm" variant="primary" @click="handleEdit(item)">Editar</BaseButton>
          <BaseButton size="sm" variant="warning" @click="handleAnular(item)">Anular</BaseButton>
          <BaseButton size="sm" variant="danger" @click="handleDelete(item)">Borrar</BaseButton>
        </div>
      </template>
    </DataTable>
    <CreateCursoModal :show="showCreateModal" :curso="editCurso" @close="handleCloseModal" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useCursosStore } from '@/stores/cursos';
import DataTable from '@/components/shared/DataTable.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import CreateCursoModal from '@/components/cursos/CreateCursoModal.vue';
import InputBase from '@/components/shared/InputBase.vue';
import BaseSelect from '@/components/shared/BaseSelect.vue';
import Icon from '@/components/shared/Icon.vue';
import { cursosService } from '@/services/cursosService';

const router = useRouter();
const cursosStore = useCursosStore();
const showCreateModal = ref(false);
const showFilters = ref(false);
const showRaw = ref(false);
// editCurso se pasa al modal para editar; si es null -> crear
const editCurso = ref(null as any);

const filters = reactive({
  titulo: '',
  rama: '',
  fechaDesde: '',
  fechaHasta: '',
});

const columns = [
  { key: 'codigo', label: 'Código', align: 'center', width: '90px' },
  { key: 'descripcion', label: 'Nombre del Curso', align: 'left', width: '180px' },
  { key: 'persona_responsable', label: 'Responsable', align: 'left', width: '140px' },
  { key: 'comuna', label: 'Comuna', align: 'left', width: '120px' },
  { key: 'lugar', label: 'Lugar', align: 'left', width: '120px' },
  { key: 'modalidad', label: 'Modalidad', align: 'center', width: '110px' },
  { key: 'tipo_curso', label: 'Tipo', align: 'center', width: '110px' },
  { key: 'cuota_con_almuerzo', label: 'Cuota c/Almuerzo', align: 'right', width: '120px' },
  { key: 'cuota_sin_almuerzo', label: 'Cuota s/Almuerzo', align: 'right', width: '120px' },
  { key: 'fechas', label: 'Fechas', align: 'center', width: '170px' },
  { key: 'estado', label: 'Estado', align: 'center', width: '90px' },
  { key: 'actions', label: '', align: 'center', width: '180px' },
];

const ramaOptions = [{ value: '', label: 'Todas' }];


const getEstadoClass = (curso: any) => {
  // 0: Pendiente (amarillo), 1: Vigente (verde), 2: Anulado (rojo), 3: Finalizado (gris)
  switch (curso.estado) {
    case 1:
      return 'status-badge green';
    case 2:
      return 'status-badge red';
    case 0:
      return 'status-badge yellow';
    case 3:
      return 'status-badge gray';
    default:
      return 'status-badge';
  }
};

const getEstadoLabel = (estado: number) => {
  switch (estado) {
    case 1:
      return 'Vigente';
    case 2:
      return 'Anulado';
    case 0:
      return 'Pendiente';
    case 3:
      return 'Finalizado';
    default:
      return '-';
  }
};

const getFechaTipoLabel = (tipo: number) => {
  switch (tipo) {
    case 1:
      return 'Presencial';
    case 2:
      return 'Online';
    case 3:
      return 'Híbrido';
    default:
      return '-';
  }
};

const getModalidadLabel = (modalidad: number) => {
  switch (modalidad) {
    case 1:
      return 'Presencial';
    case 2:
      return 'Online';
    case 3:
      return 'Híbrido';
    default:
      return '-';
  }
};

const formatFecha = (fecha: string) => {
  if (!fecha) return '-';
  return new Date(fecha).toLocaleDateString();
};

const formatMonto = (monto: number|string) => {
  if (monto === undefined || monto === null || monto === '') return '-';
  return Number(monto).toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 });
};

const handleEdit = (curso: any) => {
  openEditModal(curso);
};

// estado inline map and loading per-row (use string keys to avoid TS index issues)
const estadoMap = reactive<Record<string, number>>({});
const loadingEstado = reactive<Record<string, boolean>>({});

// populate estadoMap when cursos change
const populateEstadoMap = () => {
  (cursosStore.cursos || []).forEach((c: any) => {
    const key = String(c.id);
    estadoMap[key] = c.estado;
    loadingEstado[key] = false;
  });
};

onMounted(() => {
  populateEstadoMap();
});

// watch store changes
watch(() => cursosStore.cursos, () => {
  populateEstadoMap();
});

const onEstadoSelectChange = (e: Event, curso: any) => {
  const value = (e.target as HTMLSelectElement).value;
  changeEstado(curso, value);
};

const changeEstado = (curso: any, nuevo: string|number) => {
  const nuevoEstado = Number(nuevo);
  if (Number(curso.estado) === nuevoEstado) return;
  if (!confirm('¿Cambiar estado del curso?')) return;
  const key = String(curso.id);
  loadingEstado[key] = true;
  // call service
  cursosService.changeStatus(Number(curso.id), nuevoEstado)
    .then((res: any) => {
      // update local store and map
      curso.estado = res.estado ?? nuevoEstado;
      estadoMap[key] = curso.estado;
      alert('Estado actualizado.');
    })
    .catch((err: any) => {
      console.error(err);
      alert('Error al actualizar estado: ' + (err?.message || err));
      // revert selection
      estadoMap[key] = curso.estado;
    })
    .finally(() => { loadingEstado[key] = false; });
};

const handleAnular = (curso: any) => {
  if (!confirm('¿Seguro que deseas anular este curso?')) return;
  // intentar cambiar estado a 2 (Anulado) usando el servicio
  cursosStore.loading = true;
  cursosService.changeStatus(Number(curso.id), 2)
    .then(() => {
      cursosStore.fetchCursos();
      alert('Curso anulado correctamente.');
    })
    .catch((err: any) => {
      console.error(err);
      alert('Error al anular: ' + (err?.message || err));
    })
    .finally(() => { cursosStore.loading = false; });
};

const handleDelete = (curso: any) => {
  if (!confirm('¿Seguro que deseas borrar este curso? Esta acción no se puede deshacer.')) return;
  cursosStore.deleteCurso(Number(curso.id))
    .then(() => {
      alert('Curso eliminado.');
    })
    .catch((err: any) => {
      console.error(err);
      alert('Error al eliminar: ' + (err?.message || err));
    });
};

onMounted(async () => {
  console.log('Cargando cursos...');
  await cursosStore.fetchCursos();
  console.log('Cursos cargados:', cursosStore.cursos);
  console.log('Total de cursos:', cursosStore.cursos?.length || 0);
});

// Abrir modal en modo creación
const openCreateModal = () => {
  editCurso.value = null;
  showCreateModal.value = true;
};

// Abrir modal en modo edición
const openEditModal = (curso: any) => {
  editCurso.value = curso;
  showCreateModal.value = true;
};

// Cerrar modal y refrescar datos
const handleCloseModal = async () => {
  showCreateModal.value = false;
  editCurso.value = null;
  // Refrescar la lista de cursos después de cerrar el modal
  console.log('Modal cerrado, refrescando lista de cursos...');
  await cursosStore.fetchCursos();
};

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
.status-badge.gray { background-color: #6b7280; }

.actions-group {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
}

.fecha-range {
  white-space: nowrap;
  font-size: 0.95em;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.fecha-tipo {
  font-size: 0.85em;
  color: #666;
  font-style: italic;
}

/* Mejorar legibilidad de la tabla */
.datatable {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.datatable th, .datatable td {
  padding: 0.75rem 0.5rem;
  text-align: center;
  vertical-align: middle;
}
.datatable th {
  background: #f3f4f6;
  font-weight: 600;
  color: #374151;
}
.datatable tr:nth-child(even) {
  background: #f9fafb;
}
.datatable tr:hover {
  background: #e0f2fe;
}

/* Estado select styling: usar los mismos colores de semáforo pero aplicados al select */
select.status-badge {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border: none;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  min-width: 100px;
  text-align: center;
  font-weight: 600;
  color: #fff;
}
select.status-badge.green { background-color: #10b981; }
select.status-badge.yellow { background-color: #f59e0b; }
select.status-badge.red { background-color: #ef4444; }
select.status-badge.gray { background-color: #6b7280; }

/* ajustar el foco para accesibilidad */
select.status-badge:focus {
  outline: 2px solid rgba(16,185,129,0.16);
}
</style>
