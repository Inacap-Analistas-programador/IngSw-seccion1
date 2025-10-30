<template>
  <div class="datatable">
    <!-- Barra de búsqueda -->
    <div class="datatable-search">
      <input
        type="text"
        v-model="search"
        placeholder="Buscar..."
      />
    </div>

    <!-- Tabla -->
    <div class="datatable-wrapper">
      <table class="datatable-table">
        <thead>
          <tr>
            <th
              v-for="(col, index) in props.columns"
              :key="col.key || index"
              @click="col.sortable !== false && sortBy(col.key)"
              :class="{ sortable: col.sortable !== false }"
            >
              {{ col.label }}
              <span v-if="sortKey === col.key">
                {{ sortOrder === 'asc' ? '▲' : '▼' }}
              </span>
            </th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, rIndex) in paginatedData"
            :key="row.id || rIndex"
          >
            <td v-for="col in props.columns" :key="col.key">
              <slot :name="`cell(${col.key})`" :item="row">
                {{ row[col.key] }}
              </slot>
            </td>
            <td class="actions">
              <button v-if="!props.actions || props.actions.includes('view')" @click="$emit('view', row)">👁 Ver</button>
              <button v-if="!props.actions || props.actions.includes('edit')" @click="$emit('edit', row)">✏ Editar</button>
              <button v-if="!props.actions || props.actions.includes('delete')" @click="$emit('delete', row)">🗑 Eliminar</button>
              <button v-if="!props.actions || props.actions.includes('anular')" @click="$emit('anular', row)">⚠️ Anular</button>
              <button v-if="!props.actions || props.actions.includes('refund')" @click="$emit('refund', row)">💸 Devolver</button>
              <button v-if="props.actions && props.actions.includes('acreditar')" @click="$emit('acreditar', row)">✔ Acreditar</button>
            </td>
          </tr>
          <tr v-if="paginatedData.length === 0">
            <td :colspan="props.columns.length + 1" class="no-data">No hay datos</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginación -->
    <div class="datatable-pagination">
      <button :disabled="page === 1" @click="prevPage">◀ Anterior</button>
      <span>Página {{ page }} de {{ totalPages }}</span>
      <button :disabled="page === totalPages || totalPages === 0" @click="nextPage">Siguiente ▶</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue"

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
}

interface Row {
  id?: number;
  [key: string]: any;
}

const props = defineProps<{
  columns: Column[];
  items: Row[];
  pageSize?: number;
  actions?: ('view' | 'edit' | 'delete' | 'anular' | 'refund' | 'acreditar')[];
}>()

const search = ref("")
const sortKey = ref<string | null>(null)
const sortOrder = ref("asc")
const page = ref(1)

const filteredData = computed(() => {
  let data = [...props.items]

  if (search.value) {
    const term = search.value.toLowerCase()
    data = data.filter(row =>
      Object.values(row).some(value =>
        String(value).toLowerCase().includes(term)
      )
    )
  }

  if (sortKey.value) {
    data.sort((a, b) => {
      const valA = a[sortKey.value!]
      const valB = b[sortKey.value!]
      if (valA < valB) return sortOrder.value === "asc" ? -1 : 1
      if (valA > valB) return sortOrder.value === "asc" ? 1 : -1
      return 0
    })
  }

  return data
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredData.value.length / (props.pageSize || 5)))
)

const paginatedData = computed(() => {
  const start = (page.value - 1) * (props.pageSize || 5)
  return filteredData.value.slice(start, start + (props.pageSize || 5))
})

function sortBy(key: string) {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc"
  } else {
    sortKey.value = key
    sortOrder.value = "asc"
  }
}

function prevPage() {
  if (page.value > 1) page.value--
}
function nextPage() {
  if (page.value < totalPages.value) page.value++
}

// Reiniciar página si cambia el filtro o los datos
watch([search, filteredData], () => {
  page.value = 1
})
</script>

<style scoped>
.datatable {
  width: 100%;
  font-family: Arial, sans-serif;
}

.datatable-search {
  margin-bottom: 10px;
}

.datatable-search input {
  padding: 6px;
  width: 30%;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.datatable-wrapper {
  overflow-x: auto;
}

.datatable-table {
  width: 100%;
  border-collapse: collapse;
}

.datatable-table th,
.datatable-table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.datatable-table th {
  background-color: #f2f2f2;
  cursor: pointer;
}

.datatable-table th.sortable:hover {
  background-color: #e0e0e0;
}

.datatable-table tr:nth-child(even) {
  background-color: #fafafa;
}

.datatable-table tr:hover {
  background-color: #f1f1f1;
}

.no-data {
  text-align: center;
  color: #888;
  font-style: italic;
}

.actions button {
  margin: 0 2px;
  padding: 4px 8px;
  border: 1px solid #aaa;
  background-color: #eee;
  cursor: pointer;
  font-size: 12px;
}

.actions button:hover {
  background-color: #ddd;
}

.datatable-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.datatable-pagination button {
  padding: 6px 12px;
  border: 1px solid #ccc;
  background-color: #eee;
  cursor: pointer;
}

.datatable-pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
