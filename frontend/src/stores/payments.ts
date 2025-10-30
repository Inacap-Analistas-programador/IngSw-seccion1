import { defineStore } from 'pinia';
import type { PagoPersona, CreateComprobanteRequest } from '@/types/payments';

export const usePaymentsStore = defineStore('payments', {
  state: () => ({
    pagos: [] as PagoPersona[],
    conceptos: [] as any[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchConceptos() {
      // This should be replaced with a call to the maestros service
      this.conceptos = [];
    },
    async emitirComprobante(comprobante: CreateComprobanteRequest) {
      console.log('Emitiendo comprobante', comprobante);
    },
    async create(pago: any) {
      console.log('Creando pago', pago);
    },
    async update(id: number, pago: any) {
      console.log('Actualizando pago', id, pago);
    },
  },
});
