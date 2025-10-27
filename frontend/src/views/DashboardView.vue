<template>
  <div class="space-y-8 px-4 py-6 sm:px-6 lg:px-8">
    <!-- Header -->
    <section class="card p-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-semibold text-slate-900">Dashboard SGICS</h1>
          <p class="text-slate-600 mt-2">Sistema de Gestión Integral de Cursos Scout</p>
        </div>
        <button @click="refreshData" class="btn-primary">
          Actualizar
        </button>
      </div>
    </section>

    <!-- KPIs -->
    <section class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <div class="card p-6">
        <h3 class="text-sm font-medium text-slate-600">Cursos Activos</h3>
        <p class="text-2xl font-semibold text-slate-900 mt-2">{{ metrics.activeCourses || 0 }}</p>
      </div>
  <div class="card p-6">
        <h3 class="text-sm font-medium text-slate-600">Preinscripciones</h3>
        <p class="text-2xl font-semibold text-slate-900 mt-2">{{ metrics.preinscriptions || 0 }}</p>
      </div>
  <div class="card p-6">
        <h3 class="text-sm font-medium text-slate-600">Pagos Pendientes</h3>
        <p class="text-2xl font-semibold text-slate-900 mt-2">{{ metrics.pendingPayments || 0 }}</p>
      </div>
  <div class="card p-6">
        <h3 class="text-sm font-medium text-slate-600">Usuarios</h3>
        <p class="text-2xl font-semibold text-slate-900 mt-2">{{ metrics.totalUsers || 0 }}</p>
      </div>
    </section>

    <!-- Quick Actions -->
  <section class="card p-6">
      <h3 class="text-lg font-semibold text-slate-900 mb-4">Acciones Rápidas</h3>
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <router-link to="/preinscriptions" class="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
          <h4 class="font-medium text-slate-900">Preinscripciones</h4>
          <p class="text-sm text-slate-600 mt-1">Gestionar solicitudes</p>
        </router-link>
        <router-link to="/courses" class="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
          <h4 class="font-medium text-slate-900">Cursos</h4>
          <p class="text-sm text-slate-600 mt-1">Administrar cursos</p>
        </router-link>
        <router-link to="/payments" class="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
          <h4 class="font-medium text-slate-900">Pagos</h4>
          <p class="text-sm text-slate-600 mt-1">Gestionar pagos</p>
        </router-link>
        <router-link to="/reports" class="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
          <h4 class="font-medium text-slate-900">Reportes</h4>
          <p class="text-sm text-slate-600 mt-1">Ver estadísticas</p>
        </router-link>
      </div>
    </section>

    <!-- Recent Activity -->
  <section class="card p-6">
      <h3 class="text-lg font-semibold text-slate-900 mb-4">Actividad Reciente</h3>
      <div v-if="activities.length === 0" class="text-slate-600 text-sm">
        No hay actividad reciente
      </div>
      <ul v-else class="space-y-3">
        <li v-for="activity in activities" :key="activity.id" class="flex items-center justify-between p-3 bg-slate-50 rounded">
          <div>
            <p class="text-sm font-medium text-slate-900">{{ activity.description }}</p>
            <p class="text-xs text-slate-600">{{ formatDate(activity.timestamp) }}</p>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { coursesService } from '@/services/courses'
import { getPaymentsByGroup } from '@/services/payments'

const metrics = ref({
  activeCourses: 0,
  preinscriptions: 0,
  pendingPayments: 0,
  totalUsers: 0
})

const activities = ref([
  {
    id: 1,
    description: 'Nueva preinscripción recibida',
    timestamp: new Date().toISOString()
  },
  {
    id: 2,
    description: 'Pago confirmado para curso de formación',
    timestamp: new Date(Date.now() - 3600000).toISOString()
  }
])

const refreshData = async () => {
  try {
    // Cargar métricas de cursos
    const courseMetrics = await coursesService.getMetrics()
    metrics.value.activeCourses = courseMetrics.active_courses || 0
    
    // Simular otras métricas
    metrics.value.preinscriptions = Math.floor(Math.random() * 50) + 10
    // Intentar obtener pagos pendientes desde el servicio de pagos (usa grupo 'pending' asumido)
    try {
      const paymentsRes = await getPaymentsByGroup('pending')
      // Prefer backend-provided count, else try breakdown pending key, else fallback
      metrics.value.pendingPayments = paymentsRes?.count ?? (paymentsRes?.breakdown?.PENDING ?? paymentsRes?.breakdown?.pending) ?? Math.floor(Math.random() * 15) + 2
    } catch (_err) {
      // Fallback si el endpoint no responde o no existe
      metrics.value.pendingPayments = Math.floor(Math.random() * 15) + 2
    }
    metrics.value.totalUsers = Math.floor(Math.random() * 100) + 50
  } catch (_error) {
    // Usar datos simulados en caso de error
    metrics.value = {
      activeCourses: Math.floor(Math.random() * 20) + 5,
      preinscriptions: Math.floor(Math.random() * 50) + 10,
      pendingPayments: Math.floor(Math.random() * 15) + 2,
      totalUsers: Math.floor(Math.random() * 100) + 50
    }
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-CL', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  refreshData()
})
</script>