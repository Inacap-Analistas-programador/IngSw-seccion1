import { defineStore } from 'pinia';
import acreditacionService from '@/services/acreditacionService';

interface Participante {
  id: number;
  nombre: string;
  rut: string;
  acreditado: boolean;
}

export const useAcreditacionStore = defineStore('acreditacion', {
  state: () => ({
    participantes: [] as Participante[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchParticipantes(cursoId: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await acreditacionService.getParticipantes(cursoId);
        this.participantes = response.data;
      } catch (error: any) {
        this.error = error.message || 'Error al cargar los participantes.';
      } finally {
        this.loading = false;
      }
    },

    async acreditarParticipante(cursoId: number, participanteId: number) {
      this.loading = true;
      this.error = null;
      try {
        await acreditacionService.acreditarParticipante(cursoId, participanteId);
        const participante = this.participantes.find((p) => p.id === participanteId);
        if (participante) {
          participante.acreditado = true;
        }
      } catch (error: any) {
        this.error = error.message || 'Error al acreditar al participante.';
      } finally {
        this.loading = false;
      }
    },
  },
});
