<template>
  <!-- Dashboard moderno inspirado en Evently -->
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
    <!-- Header/Navbar -->
    <header class="bg-white/10 backdrop-blur-lg border-b border-white/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-4">
            <h1 class="text-2xl font-bold text-white">
              <span class="text-purple-400">SGICS</span>
            </h1>
            <div class="hidden md:block text-slate-300">
              Sistema de Gestión Integral de Cursos Scout
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- TODO: El equipo debe agregar notificaciones -->
            <div class="text-slate-300">
              Bienvenido, {{ user?.full_name || 'Usuario' }}
            </div>
            
            <button 
              @click="handleLogout"
              class="bg-red-500/80 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </header>
    
    <!-- Contenido Principal -->
    <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Título del Dashboard -->
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-white mb-2">Panel de Control</h2>
        <p class="text-slate-300">Resumen del estado actual del sistema</p>
      </div>
      
      <!-- Cards de Métricas -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- TODO: El equipo debe conectar con APIs reales para obtener métricas -->
        
        <div class="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
          <h3 class="text-lg font-medium text-slate-200 mb-2">Cursos Activos</h3>
          <p class="text-3xl font-bold text-blue-400">
            {{ metrics.activeCourses ?? '--' }}
          </p>
          <p class="text-sm text-slate-400 mt-2">TODO: Conectar API</p>
        </div>
        
        <div class="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
          <h3 class="text-lg font-medium text-slate-200 mb-2">Preinscripciones</h3>
          <p class="text-3xl font-bold text-green-400">
            {{ metrics.preinscriptions ?? '--' }}
          </p>
          <p class="text-sm text-slate-400 mt-2">TODO: Conectar API</p>
        </div>
        
        <div class="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
          <h3 class="text-lg font-medium text-slate-200 mb-2">Pagos Pendientes</h3>
          <p class="text-3xl font-bold text-yellow-400">
            {{ metrics.pendingPayments ?? '--' }}
          </p>
          <p class="text-sm text-slate-400 mt-2">TODO: Conectar API</p>
        </div>
        
        <div class="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
          <h3 class="text-lg font-medium text-slate-200 mb-2">Archivos</h3>
          <p class="text-3xl font-bold text-purple-400">
            {{ metrics.uploadedFiles ?? '--' }}
          </p>
          <p class="text-sm text-slate-400 mt-2">TODO: Conectar API</p>
        </div>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Módulos del Sistema -->
        <div class="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
          <h3 class="text-xl font-semibold text-white mb-6">Módulos del Sistema</h3>
          <div class="space-y-3">
            <!-- TODO: El equipo debe conectar con Vue Router para navegación real -->
            
            <router-link 
              to="/courses" 
              class="block w-full text-left p-4 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg transition-all group"
            >
              <div class="flex items-center space-x-3">
                <span class="text-2xl">📚</span>
                <div>
                  <div class="text-white font-medium">Gestión de Cursos</div>
                  <div class="text-slate-300 text-sm">Administrar cursos y contenidos</div>
                </div>
              </div>
            </router-link>
            
            <router-link 
              to="/preinscriptions" 
              class="block w-full text-left p-4 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg transition-all group"
            >
              <div class="flex items-center space-x-3">
                <span class="text-2xl">📝</span>
                <div>
                  <div class="text-white font-medium">Preinscripciones</div>
                  <div class="text-slate-300 text-sm">Gestionar solicitudes de inscripción</div>
                </div>
              </div>
            </router-link>
            
            <router-link 
              to="/payments" 
              class="block w-full text-left p-4 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 rounded-lg transition-all group"
            >
              <div class="flex items-center space-x-3">
                <span class="text-2xl">💰</span>
                <div>
                  <div class="text-white font-medium">Gestión de Pagos</div>
                  <div class="text-slate-300 text-sm">Administrar pagos y facturación</div>
                </div>
              </div>
            </router-link>
            
            <router-link 
              to="/files" 
              class="block w-full text-left p-4 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg transition-all group"
            >
              <div class="flex items-center space-x-3">
                <span class="text-2xl">📁</span>
                <div>
                  <div class="text-white font-medium">Archivos y Documentos</div>
                  <div class="text-slate-300 text-sm">Gestionar archivos del sistema</div>
                </div>
              </div>
            </router-link>
            
          </div>
        </div>
          </div>
        </div>
        
        <!-- Actividad Reciente -->
        <div class="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
          <h3 class="text-xl font-semibold text-white mb-6">Actividad Reciente</h3>
          
          <!-- Loading State -->
          <div v-if="loading" class="space-y-3">
            <div class="animate-pulse">
              <div class="h-12 bg-white/10 rounded-lg"></div>
            </div>
            <div class="animate-pulse">
              <div class="h-12 bg-white/10 rounded-lg"></div>
            </div>
            <div class="animate-pulse">
              <div class="h-12 bg-white/10 rounded-lg"></div>
            </div>
          </div>
          
          <!-- TODO: El equipo debe conectar con API real de actividades -->
          <div v-else-if="activities.length === 0" class="text-center py-8">
            <div class="text-slate-400 mb-4">📋</div>
            <p class="text-slate-300">No hay actividad reciente</p>
            <p class="text-slate-400 text-sm mt-2">TODO: Conectar con API de actividades</p>
          </div>
          
          <!-- Lista de Actividades -->
          <div v-else class="space-y-3">
            <div 
              v-for="activity in activities" 
              :key="activity.id"
              class="flex items-center p-3 bg-white/5 border border-white/10 rounded-lg"
            >
              <div 
                class="w-3 h-3 rounded-full mr-3"
                :class="getActivityColor(activity.type)"
              ></div>
              <div class="flex-1">
                <div class="text-white text-sm">{{ activity.message }}</div>
                <div class="text-slate-400 text-xs">{{ activity.timestamp }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Configuración de composables
const router = useRouter()
const authStore = useAuthStore()

// Estado reactivo para métricas y actividades
const loading = ref(true)
const metrics = ref({
  activeCourses: null as number | null,
  preinscriptions: null as number | null,
  pendingPayments: null as number | null,
  uploadedFiles: null as number | null
})

// TODO: El equipo debe definir la estructura de actividades según la API
interface Activity {
  id: number
  type: 'course' | 'preinscription' | 'payment' | 'file'
  message: string
  timestamp: string
}

const activities = ref<Activity[]>([])

// Computed para obtener usuario actual
const user = computed(() => authStore.user)

/**
 * Maneja el logout del usuario
 */
const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Error durante logout:', error)
    // Forzar limpieza en caso de error
    authStore.clearAuth()
    router.push('/login')
  }
}

/**
 * Obtiene el color para cada tipo de actividad
 */
const getActivityColor = (type: Activity['type']): string => {
  const colors = {
    course: 'bg-blue-400',
    preinscription: 'bg-green-400', 
    payment: 'bg-yellow-400',
    file: 'bg-purple-400'
  }
  return colors[type] || 'bg-gray-400'
}

/**
 * SPRINT 2 - Cargar métricas del dashboard desde APIs Django
 * 
 * TODO SPRINT 2: El equipo debe implementar:
 * 1. Conexión con endpoints de métricas del backend Django
 * 2. Manejo de autenticación JWT en headers
 * 3. Cache de métricas para mejorar performance
 * 4. Manejo de errores y estados de carga
 */
const loadMetrics = async () => {
  try {
    // SPRINT 2 TODO: Implementar llamadas reales a APIs Django REST Framework
    // const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
    // const headers = {
    //   'Authorization': `Bearer ${authStore.token}`,
    //   'Content-Type': 'application/json'
    // }
    
    // SPRINT 2 TODO: Llamadas paralelas a endpoints de métricas
    // const [coursesRes, preinscriptionsRes, paymentsRes, filesRes] = await Promise.all([
    //   fetch(`${API_BASE_URL}/api/courses/metrics/`, { headers }),
    //   fetch(`${API_BASE_URL}/api/preinscriptions/metrics/`, { headers }),
    //   fetch(`${API_BASE_URL}/api/payments/metrics/`, { headers }),
    //   fetch(`${API_BASE_URL}/api/files/metrics/`, { headers })
    // ])
    
    // SPRINT 2 TODO: Verificar respuestas exitosas y procesar datos
    // if (coursesRes.ok && preinscriptionsRes.ok && paymentsRes.ok && filesRes.ok) {
    //   const [courses, preinscriptions, payments, files] = await Promise.all([
    //     coursesRes.json(),
    //     preinscriptionsRes.json(), 
    //     paymentsRes.json(),
    //     filesRes.json()
    //   ])
    //   
    //   metrics.value = {
    //     activeCourses: courses.active_count,
    //     preinscriptions: preinscriptions.total_count,
    //     pendingPayments: payments.pending_count,
    //     uploadedFiles: files.file_count
    //   }
    // }

    // TEMPORAL - SPRINT 2 TODO: Remover simulación
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.warn('SPRINT 2 TODO: Conectar métricas con APIs Django REST Framework')
    
  } catch (error) {
    console.error('Error cargando métricas del dashboard:', error)
    // SPRINT 2 TODO: Implementar fallbacks y notificaciones de error
  } finally {
    loading.value = false
  }
}

/**
 * Carga la actividad reciente del sistema
 * TODO: El equipo debe implementar API de actividades
 */
const loadActivities = async () => {
  try {
    // TODO: Implementar llamada a API de actividades
    // const response = await fetch('/api/activities/recent')
    // activities.value = await response.json()
    
    console.log('TODO: Implementar carga de actividades recientes')
    
  } catch (error) {
    console.error('Error cargando actividades:', error)
  }
}

/**
 * Inicialización del componente
 */
onMounted(async () => {
  // TODO: El equipo puede agregar verificación de autenticación aquí
  // if (!authStore.isAuthenticated) {
  //   router.push('/login')
  //   return
  // }

  // Cargar datos del dashboard
  await Promise.all([
    loadMetrics(),
    loadActivities()
  ])
})

// TODO: El equipo debe implementar funciones adicionales según necesidades:
// - refreshData(): refrescar datos del dashboard
// - setupAutoRefresh(): auto-refresh periódico
// - handleNotifications(): manejo de notificaciones en tiempo real
// - exportMetrics(): exportar métricas a Excel/PDF
</script>