import { defineStore } from 'pinia';
import emailForwarderService, { type EmailPayload } from '@/services/emailForwarderService';

export const useEmailForwarderStore = defineStore('emailForwarder', {
  state: () => ({
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async sendEmail(payload: EmailPayload) {
      this.loading = true;
      this.error = null;
      try {
        await emailForwarderService.sendEmail(payload);
      } catch (error: any) {
        this.error = error.message || 'Error al enviar el correo.';
      } finally {
        this.loading = false;
      }
    },
  },
});
