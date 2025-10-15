<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8 text-center">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-4">
          Gestión de Cursos
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Administra y supervisa todos los cursos del sistema de manera eficiente
        </p>
        <div class="mt-6">
          <button class="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
            <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Nuevo Curso
          </button>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Cursos"
          :value="String(stats.total)"
          description="Todos los cursos"
          variant="primary"
        />
        <MetricCard
          title="Activos"
          :value="String(stats.active)"
          description="En progreso"
          variant="success"
        />
        <MetricCard
          title="Por Vencer"
          :value="String(stats.warning)"
          description="Próximos a finalizar"
          variant="warning"
        />
        <MetricCard
          title="Vencidos"
          :value="String(stats.overdue)"
          description="Requieren atención"
          variant="danger"
        />
      </div>

      <!-- Modern Table -->
      <ModernTable
        title="Listado de Cursos"
        :columns="tableColumns"
        :data="courses"
        :loading="loading"
        :search-placeholder="'Buscar por título, código o rama...'"
        :filters="tableFilters"
        :actions="tableActions"
        @action="handleTableAction"
        @search="handleSearch"
        @filter="handleFilter"
      >
        <!-- Custom status column -->
        <template #column-status="{ row }">
          <span :class="getStatusBadgeClass(row.status)">
            {{ getStatusLabel(row.status) }}
          </span>
        </template>

        <!-- Custom progress column -->
        <template #column-progress="{ row }">
          <div class="flex items-center space-x-2">
            <div class="flex-1">
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${getProgressPercentage(row)}%` }"
                ></div>
              </div>
            </div>
            <span class="text-sm font-medium text-gray-600">
              {{ row.current_participants || 0 }}/{{ row.max_participants || 0 }}
            </span>
          </div>
        </template>

        <!-- Custom dates column -->
        <template #column-dates="{ row }">
          <div class="text-sm">
            <div class="font-medium text-gray-900">
              {{ formatDate(row.start_date) }}
            </div>
            <div class="text-gray-500">
              {{ formatDate(row.end_date) }}
            </div>
          </div>
        </template>
      </ModernTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ModernTable from '@/components/ui/ModernTable.vue'
import MetricCard from '@/components/ui/MetricCard.vue'
import { coursesService } from '@/services/courses'
import { useRouter } from 'vue-router'

interface CourseListItem {
  id: number
  title: string
  code: string
  rama: string
  start_date: string
  end_date: string
  max_participants: number
  current_participants?: number
  payments_received?: number
  price?: number
  status?: string
}

const router = useRouter()
const loading = ref(true)
const courses = ref<CourseListItem[]>([])

// Quick stats computed from courses data
const stats = computed(() => {
  const total = courses.value.length
  const active = courses.value.filter(c => c.status === 'ACTIVE').length
  const warning = courses.value.filter(c => {
    const endDate = new Date(c.end_date)
    const now = new Date()
    const daysUntilEnd = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilEnd <= 7 && daysUntilEnd > 0
  }).length
  const overdue = courses.value.filter(c => {
    const endDate = new Date(c.end_date)
    const now = new Date()
    return endDate < now
  }).length
  
  return { total, active, warning, overdue }
})

// Table configuration
const tableColumns = [
  { key: 'code', label: 'Código', sortable: true },
  { key: 'title', label: 'Título', sortable: true },
  { key: 'rama', label: 'Rama', sortable: true },
  { key: 'dates', label: 'Fechas', sortable: false },
  { key: 'progress', label: 'Participantes', sortable: false },
  { key: 'status', label: 'Estado', sortable: true },
  { key: 'price', label: 'Precio', sortable: true, format: 'currency' }
]

const tableFilters = [
  {
    key: 'status',
    label: 'Estado',
    type: 'select' as const,
    options: [
      { value: '', label: 'Todos los estados' },
      { value: 'ACTIVE', label: 'Activos' },
      { value: 'DRAFT', label: 'Borrador' },
      { value: 'INACTIVE', label: 'Inactivos' },
      { value: 'ARCHIVED', label: 'Archivados' }
    ]
  },
  {
    key: 'rama',
    label: 'Rama',
    type: 'select' as const,
    options: [
      { value: '', label: 'Todas las ramas' },
      { value: 'MANADA', label: 'Manada' },
      { value: 'TROPA', label: 'Tropa' },
      { value: 'CLAN', label: 'Clan' },
      { value: 'APODERADOS', label: 'Apoderados' }
    ]
  }
]

const tableActions = [
  { key: 'view', label: 'Ver', variant: 'primary' as const },
  { key: 'edit', label: 'Editar', variant: 'warning' as const },
  { key: 'delete', label: 'Eliminar', variant: 'danger' as const }
]

// Event handlers
const handleTableAction = (action: string, row: CourseListItem) => {
  switch (action) {
    case 'view':
      router.push(`/courses/${row.id}`)
      break
    case 'edit':
      router.push(`/courses/${row.id}/edit`)
      break
    case 'delete':
      if (confirm(`¿Estás seguro de que deseas eliminar el curso "${row.title}"?`)) {
        // Aquí podrías llamar a coursesService.delete(row.id)
      }
      break
  }
}

const handleSearch = (searchTerm: string) => {
  loadCourses({ search: searchTerm })
}

const handleFilter = (filters: Record<string, any>) => {
  loadCourses(filters)
}

// Load courses with optional filters
const loadCourses = async (filters: Record<string, any> = {}) => {
  loading.value = true
  try {
    const { results } = await coursesService.list({
      page: 1,
      page_size: 100, // Load more for better filtering
      ...filters,
      ordering: '-created_at'
    })
    courses.value = results
  } finally {
    loading.value = false
  }
}

// Utility functions
const getStatusBadgeClass = (status: string) => {
  const classes = {
    'ACTIVE': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800',
    'DRAFT': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800',
    'INACTIVE': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800',
    'ARCHIVED': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800'
  }
  return classes[status as keyof typeof classes] || classes.DRAFT
}

const getStatusLabel = (status: string) => {
  const labels = {
    'ACTIVE': 'Activo',
    'DRAFT': 'Borrador',
    'INACTIVE': 'Inactivo',
    'ARCHIVED': 'Archivado'
  }
  return labels[status as keyof typeof labels] || 'Desconocido'
}

const getProgressPercentage = (course: CourseListItem) => {
  const current = course.current_participants || 0
  const max = course.max_participants || 1
  return Math.round((current / max) * 100)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(() => loadCourses())
</script>

<style scoped>
/* Custom badge animations */
.status-badge {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.status-badge:hover {
  transform: scale(1.05);
}

/* Progress bar animation */
.progress-bar {
  transition: width 0.5s ease-in-out;
}

/* Card hover effects */
.metric-card-hover {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.metric-card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Button animations */
.btn-primary {
  position: relative;
  overflow: hidden;
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.5s;
}

.btn-primary:hover::before {
  left: 100%;
}

/* Gradient text animation */
@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.gradient-text {
  background: linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #f5576c);
  background-size: 400% 400%;
  animation: gradient 3s ease infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Table hover effects */
.table-row {
  transition: all 0.2s ease;
}

.table-row:hover {
  background-color: rgba(99, 102, 241, 0.05);
  transform: translateX(4px);
}

/* Loading animation */
@keyframes shimmer {
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
}

.loading-shimmer {
  animation: shimmer 1.2s ease-in-out infinite;
  background: linear-gradient(to right, #f6f7f8 8%, #edeef1 18%, #f6f7f8 33%);
  background-size: 800px 104px;
}
</style>
