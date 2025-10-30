import { defineStore } from 'pinia';
import apiClient from '@/services/api';

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    stats: null as any | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchStats() {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiClient.get('/cursos/dashboard-stats/');
        this.stats = response.data;
      } catch (error: any) {
        this.error = error.message || 'Error al cargar las estadísticas.';
      } finally {
        this.loading = false;
      }
    },
  },
});
