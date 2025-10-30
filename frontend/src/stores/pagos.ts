import { defineStore } from 'pinia';
import pagosService from '@/services/pagosService';
import type { Pago } from '@/types';

export const usePagosStore = defineStore('pagos', {
  state: () => ({
    pagos: [] as Pago[],
    pago: null as Pago | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchPagos() {
      this.loading = true;
      this.error = null;
      try {
        const response = await pagosService.getPagos();
        this.pagos = response.data;
      } catch (error: any) {
        this.error = error.message || 'Error al cargar los pagos.';
      } finally {
        this.loading = false;
      }
    },

    async createPago(pago: Pago) {
      this.loading = true;
      this.error = null;
      try {
        const response = await pagosService.createPago(pago);
        this.pagos.push(response.data);
      } catch (error: any) {
        this.error = error.message || 'Error al crear el pago.';
      } finally {
        this.loading = false;
      }
    },

    async updatePago(id: number, pago: Pago) {
      this.loading = true;
      this.error = null;
      try {
        const response = await pagosService.updatePago(id, pago);
        const index = this.pagos.findIndex((p) => p.id === id);
        if (index !== -1) {
          this.pagos[index] = response.data;
        }
      } catch (error: any) {
        this.error = error.message || 'Error al actualizar el pago.';
      } finally {
        this.loading = false;
      }
    },

    async deletePago(id: number) {
      this.loading = true;
      this.error = null;
      try {
        await pagosService.deletePago(id);
        this.pagos = this.pagos.filter((p) => p.id !== id);
      } catch (error: any) {
        this.error = error.message || 'Error al eliminar el pago.';
      } finally {
        this.loading = false;
      }
    },
  },
});
