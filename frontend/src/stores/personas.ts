import { defineStore } from 'pinia';
import personasService from '@/services/personasService';
import type { Persona } from '@/types';

export const usePersonasStore = defineStore('personas', {
  state: () => ({
    personas: [] as Persona[],
    persona: null as Persona | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchPersonas(filters: any = {}) {
      this.loading = true;
      this.error = null;
      try {
        const response = await personasService.getPersonas(filters);
        this.personas = response.data;
      } catch (error: any) {
        this.error = error.message || 'Error al cargar las personas.';
      } finally {
        this.loading = false;
      }
    },

    async createPersona(persona: Persona) {
      this.loading = true;
      this.error = null;
      try {
        const response = await personasService.createPersona(persona);
        this.personas.push(response.data);
      } catch (error: any) {
        this.error = error.message || 'Error al crear la persona.';
      } finally {
        this.loading = false;
      }
    },

    async updatePersona(id: number, persona: Persona) {
      this.loading = true;
      this.error = null;
      try {
        const response = await personasService.updatePersona(id, persona);
        const index = this.personas.findIndex((p) => p.id === id);
        if (index !== -1) {
          this.personas[index] = response.data;
        }
      } catch (error: any) {
        this.error = error.message || 'Error al actualizar la persona.';
      } finally {
        this.loading = false;
      }
    },

    async deletePersona(id: number) {
      this.loading = true;
      this.error = null;
      try {
        await personasService.deletePersona(id);
        this.personas = this.personas.filter((p) => p.id !== id);
      } catch (error: any) {
        this.error = error.message || 'Error al eliminar la persona.';
      } finally {
        this.loading = false;
      }
    },

    async fetchPersonaByRut(rut: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await personasService.getPersonaByRut(rut);
        return response.data;
      } catch (error: any) {
        this.error = error.message || 'Error al buscar la persona.';
        return null;
      } finally {
        this.loading = false;
      }
    },
  },
});
