import { defineStore } from 'pinia';
import archivosService from '@/services/archivosService';
import type { Archivo } from '@/types';

export const useArchivosStore = defineStore('archivos', {
  state: () => ({
    archivos: [] as Archivo[],
    archivo: null as Archivo | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchArchivos() {
      this.loading = true;
      this.error = null;
      try {
        const response = await archivosService.getArchivos();
        this.archivos = response.data;
      } catch (error: any) {
        this.error = error.message || 'Error al cargar los archivos.';
      } finally {
        this.loading = false;
      }
    },

    async createArchivo(archivo: FormData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await archivosService.createArchivo(archivo);
        this.archivos.push(response.data);
      } catch (error: any) {
        this.error = error.message || 'Error al crear el archivo.';
      } finally {
        this.loading = false;
      }
    },

    async deleteArchivo(id: number) {
      this.loading = true;
      this.error = null;
      try {
        await archivosService.deleteArchivo(id);
        this.archivos = this.archivos.filter((a) => a.id !== id);
      } catch (error: any) {
        this.error = error.message || 'Error al eliminar el archivo.';
      } finally {
        this.loading = false;
      }
    },
  },
});
