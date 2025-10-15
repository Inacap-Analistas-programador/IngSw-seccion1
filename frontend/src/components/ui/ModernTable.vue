<!-- Componente de tabla moderna y elegante para listas de datos -->
<template>
  <div class="modern-table-container">
    <!-- Header con título y acciones -->
    <div class="table-header" v-if="title || $slots.actions">
      <div class="table-title">
        <h3 v-if="title" class="title-text">{{ title }}</h3>
        <p v-if="subtitle" class="subtitle-text">{{ subtitle }}</p>
      </div>
      <div class="table-actions" v-if="$slots.actions">
        <slot name="actions"></slot>
      </div>
    </div>

    <!-- Filtros y búsqueda -->
    <div class="table-filters" v-if="searchable || $slots.filters">
      <div class="search-box" v-if="searchable">
        <div class="search-input-wrapper">
          <MagnifyingGlassIcon class="search-icon" />
          <input
            type="text"
            :placeholder="searchPlaceholder"
            v-model="searchQuery"
            @input="onSearch"
            class="search-input"
          />
          <button 
            v-if="searchQuery" 
            @click="clearSearch" 
            class="clear-search-btn"
          >
            <XMarkIcon class="w-4 h-4" />
          </button>
        </div>
      </div>
      <div class="custom-filters" v-if="$slots.filters">
        <slot name="filters"></slot>
      </div>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="table-skeleton">
      <div class="skeleton-row" v-for="n in 5" :key="n">
        <div class="skeleton-cell" v-for="col in columns" :key="col.key">
          <div class="skeleton-content"></div>
        </div>
      </div>
    </div>

    <!-- Tabla principal -->
    <div v-else class="table-wrapper">
      <table class="modern-table">
        <thead class="table-head">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              :class="[
                'table-header-cell',
                { 'sortable': column.sortable },
                { 'text-right': column.align === 'right' },
                { 'text-center': column.align === 'center' }
              ]"
              @click="column.sortable && handleSort(column.key)"
            >
              <div class="header-content">
                <span>{{ column.label }}</span>
                <div v-if="column.sortable" class="sort-icons">
                  <ChevronUpIcon 
                    :class="['sort-icon', { 'active': sortKey === column.key && sortOrder === 'asc' }]"
                  />
                  <ChevronDownIcon 
                    :class="['sort-icon', { 'active': sortKey === column.key && sortOrder === 'desc' }]"
                  />
                </div>
              </div>
            </th>
            <th v-if="$slots.actions || rowActions" class="table-header-cell actions-header">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody class="table-body">
          <!-- Mensaje de datos vacíos -->
          <tr v-if="!data.length" class="empty-row">
            <td :colspan="columns.length + (rowActions ? 1 : 0)" class="empty-cell">
              <div class="empty-state">
                <slot name="empty">
                  <div class="empty-content">
                    <DocumentIcon class="empty-icon" />
                    <p class="empty-text">{{ emptyMessage }}</p>
                  </div>
                </slot>
              </div>
            </td>
          </tr>
          
          <!-- Filas de datos -->
          <tr 
            v-for="(item, index) in paginatedData" 
            :key="getRowKey(item, index)"
            class="table-row"
            :class="{ 'clickable': clickable }"
            @click="clickable && $emit('row-click', item)"
          >
            <td 
              v-for="column in columns" 
              :key="column.key"
              :class="[
                'table-cell',
                { 'text-right': column.align === 'right' },
                { 'text-center': column.align === 'center' }
              ]"
            >
              <slot 
                :name="`cell-${column.key}`" 
                :item="item" 
                :value="getNestedValue(item, column.key)"
                :index="index"
              >
                {{ formatCellValue(item, column) }}
              </slot>
            </td>
            
            <!-- Columna de acciones -->
            <td v-if="$slots.actions || rowActions" class="table-cell actions-cell">
              <div class="actions-wrapper">
                <slot name="actions" :item="item" :index="index">
                  <button
                    v-for="action in rowActions"
                    :key="action.key"
                    @click.stop="action.handler(item)"
                    :class="[
                      'action-btn',
                      `action-btn--${action.variant || 'default'}`
                    ]"
                    :disabled="action.disabled?.(item)"
                    :title="action.tooltip"
                  >
                    <component :is="action.icon" class="action-icon" />
                    <span v-if="action.label" class="action-label">{{ action.label }}</span>
                  </button>
                </slot>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginación -->
    <div v-if="paginated && !loading" class="table-pagination">
      <div class="pagination-info">
        <span class="pagination-text">
          Mostrando {{ paginationStart }} a {{ paginationEnd }} de {{ totalItems }} resultados
        </span>
      </div>
      
      <div class="pagination-controls">
        <select v-model="pageSize" @change="onPageSizeChange" class="page-size-select">
          <option v-for="size in pageSizeOptions" :key="size" :value="size">
            {{ size }} por página
          </option>
        </select>
        
        <div class="pagination-buttons">
          <button 
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage <= 1"
            class="pagination-btn"
          >
            <ChevronLeftIcon class="w-4 h-4" />
          </button>
          
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="goToPage(page)"
            :class="[
              'pagination-btn',
              { 'active': page === currentPage }
            ]"
          >
            {{ page }}
          </button>
          
          <button 
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage >= totalPages"
            class="pagination-btn"
          >
            <ChevronRightIcon class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  DocumentIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'

// Props
interface Column {
  key: string
  label: string
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
  formatter?: (value: any, item: any) => string
}

interface RowAction {
  key: string
  label?: string
  icon: any
  variant?: 'default' | 'primary' | 'danger' | 'success'
  handler: (item: any) => void
  disabled?: (item: any) => boolean
  tooltip?: string
}

const props = defineProps<{
  title?: string
  subtitle?: string
  columns: Column[]
  data: any[]
  loading?: boolean
  searchable?: boolean
  searchPlaceholder?: string
  emptyMessage?: string
  paginated?: boolean
  pageSize?: number
  pageSizeOptions?: number[]
  rowKey?: string
  rowActions?: RowAction[]
  clickable?: boolean
}>()

const emit = defineEmits<{
  'row-click': [item: any]
  'search': [query: string]
  'sort': [key: string, order: 'asc' | 'desc']
}>()

// Estado interno
const searchQuery = ref('')
const sortKey = ref<string>('')
const sortOrder = ref<'asc' | 'desc'>('asc')
const currentPage = ref(1)
const pageSize = ref(props.pageSize || 10)

// Opciones de paginación
const pageSizeOptions = computed(() => props.pageSizeOptions || [5, 10, 25, 50])

// Datos filtrados y ordenados
const filteredData = computed(() => {
  let filtered = [...props.data]
  
  // Aplicar búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(item =>
      props.columns.some(column => {
        const value = getNestedValue(item, column.key)
        return String(value).toLowerCase().includes(query)
      })
    )
  }
  
  // Aplicar ordenamiento
  if (sortKey.value) {
    filtered.sort((a, b) => {
      const aValue = getNestedValue(a, sortKey.value)
      const bValue = getNestedValue(b, sortKey.value)
      
      let comparison = 0
      if (aValue > bValue) comparison = 1
      else if (aValue < bValue) comparison = -1
      
      return sortOrder.value === 'asc' ? comparison : -comparison
    })
  }
  
  return filtered
})

// Datos paginados
const paginatedData = computed(() => {
  if (!props.paginated) return filteredData.value
  
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredData.value.slice(start, end)
})

// Información de paginación
const totalItems = computed(() => filteredData.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value))
const paginationStart = computed(() => (currentPage.value - 1) * pageSize.value + 1)
const paginationEnd = computed(() => 
  Math.min(currentPage.value * pageSize.value, totalItems.value)
)

// Páginas visibles en la paginación
const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const pages: number[] = []
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push(-1, total)
    } else if (current >= total - 3) {
      pages.push(1, -1)
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1, -1)
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push(-1, total)
    }
  }
  
  return pages
})

// Métodos
const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

const getRowKey = (item: any, index: number): string => {
  return props.rowKey ? getNestedValue(item, props.rowKey) : index.toString()
}

const formatCellValue = (item: any, column: Column): string => {
  const value = getNestedValue(item, column.key)
  if (column.formatter) {
    return column.formatter(value, item)
  }
  return String(value || '')
}

const onSearch = () => {
  currentPage.value = 1
  emit('search', searchQuery.value)
}

const clearSearch = () => {
  searchQuery.value = ''
  onSearch()
}

const handleSort = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
  currentPage.value = 1
  emit('sort', key, sortOrder.value)
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const onPageSizeChange = () => {
  currentPage.value = 1
}

// Reiniciar página al cambiar datos
watch(() => props.data, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = Math.max(1, totalPages.value)
  }
})
</script>

<style scoped>
/* Contenedor principal */
.modern-table-container {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden;
}

/* Header */
.table-header {
  @apply flex items-center justify-between p-6 border-b border-gray-200;
}

.table-title {
  @apply flex-1;
}

.title-text {
  @apply text-xl font-semibold text-gray-900 mb-1;
}

.subtitle-text {
  @apply text-sm text-gray-600;
}

.table-actions {
  @apply flex items-center space-x-3;
}

/* Filtros */
.table-filters {
  @apply flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200;
}

.search-box {
  @apply flex-1 max-w-md;
}

.search-input-wrapper {
  @apply relative;
}

.search-icon {
  @apply absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400;
}

.search-input {
  @apply w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg 
         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
         transition-colors duration-200;
}

.clear-search-btn {
  @apply absolute right-3 top-1/2 transform -translate-y-1/2 
         text-gray-400 hover:text-gray-600 transition-colors duration-200;
}

.custom-filters {
  @apply flex items-center space-x-3 ml-4;
}

/* Loading skeleton */
.table-skeleton {
  @apply animate-pulse p-6;
}

.skeleton-row {
  @apply flex space-x-4 mb-4;
}

.skeleton-cell {
  @apply flex-1;
}

.skeleton-content {
  @apply h-4 bg-gray-200 rounded;
}

/* Tabla */
.table-wrapper {
  @apply overflow-x-auto;
}

.modern-table {
  @apply w-full;
}

.table-head {
  @apply bg-gray-50;
}

.table-header-cell {
  @apply px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider;
}

.table-header-cell.sortable {
  @apply cursor-pointer select-none hover:bg-gray-100 transition-colors duration-200;
}

.header-content {
  @apply flex items-center justify-between;
}

.sort-icons {
  @apply flex flex-col ml-2;
}

.sort-icon {
  @apply w-3 h-3 text-gray-400 transition-colors duration-200;
}

.sort-icon.active {
  @apply text-blue-500;
}

.actions-header {
  @apply text-center;
}

.table-body {
  @apply bg-white divide-y divide-gray-200;
}

.table-row {
  @apply hover:bg-gray-50 transition-colors duration-200;
}

.table-row.clickable {
  @apply cursor-pointer;
}

.table-cell {
  @apply px-6 py-4 whitespace-nowrap text-sm text-gray-900;
}

.actions-cell {
  @apply text-center;
}

.actions-wrapper {
  @apply flex items-center justify-center space-x-2;
}

/* Botones de acción */
.action-btn {
  @apply inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded-md
         transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1;
}

.action-btn--default {
  @apply text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-gray-500;
}

.action-btn--primary {
  @apply text-blue-700 bg-blue-100 hover:bg-blue-200 focus:ring-blue-500;
}

.action-btn--danger {
  @apply text-red-700 bg-red-100 hover:bg-red-200 focus:ring-red-500;
}

.action-btn--success {
  @apply text-green-700 bg-green-100 hover:bg-green-200 focus:ring-green-500;
}

.action-btn:disabled {
  @apply opacity-50 cursor-not-allowed;
}

.action-icon {
  @apply w-4 h-4;
}

.action-label {
  @apply ml-1;
}

/* Estado vacío */
.empty-row {
  @apply bg-white;
}

.empty-cell {
  @apply px-6 py-12 text-center;
}

.empty-state {
  @apply flex flex-col items-center justify-center;
}

.empty-content {
  @apply flex flex-col items-center;
}

.empty-icon {
  @apply w-12 h-12 text-gray-400 mb-4;
}

.empty-text {
  @apply text-gray-500 text-lg;
}

/* Paginación */
.table-pagination {
  @apply flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200;
}

.pagination-info {
  @apply flex-1;
}

.pagination-text {
  @apply text-sm text-gray-700;
}

.pagination-controls {
  @apply flex items-center space-x-4;
}

.page-size-select {
  @apply text-sm border border-gray-300 rounded-md px-3 py-1.5
         focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
}

.pagination-buttons {
  @apply flex items-center space-x-1;
}

.pagination-btn {
  @apply relative inline-flex items-center px-3 py-2 text-sm font-medium
         text-gray-500 bg-white border border-gray-300 rounded-md
         hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500
         transition-colors duration-200;
}

.pagination-btn:disabled {
  @apply opacity-50 cursor-not-allowed hover:bg-white;
}

.pagination-btn.active {
  @apply bg-blue-600 text-white border-blue-600 hover:bg-blue-700;
}

/* Responsive */
@media (max-width: 768px) {
  .table-header {
    @apply flex-col space-y-4 items-start;
  }
  
  .table-filters {
    @apply flex-col space-y-3 items-stretch;
  }
  
  .custom-filters {
    @apply ml-0;
  }
  
  .table-pagination {
    @apply flex-col space-y-3 items-stretch;
  }
  
  .pagination-controls {
    @apply justify-between;
  }
}
</style>