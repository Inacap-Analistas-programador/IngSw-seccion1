import { defineStore } from 'pinia';
import { cursosService } from '@/services/cursosService';
import type { Curso } from '@/types';

export const useCursosStore = defineStore('cursos', {
  state: () => ({
    cursos: [] as Curso[],
    curso: null as Curso | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchCursos(filters: any = {}) {
      this.loading = true;
      this.error = null;
      try {
        this.cursos = await cursosService.getCursos(filters);
      } catch (error: any) {
        this.error = error.message || 'Error al cargar los cursos.';
      } finally {
        this.loading = false;
      }
    },

    async createCurso(curso: Curso) {
      this.loading = true;
      this.error = null;
      try {
        const nuevoCurso = await cursosService.createCurso(curso);
        this.cursos.push(nuevoCurso);
      } catch (error: any) {
        this.error = error.message || 'Error al crear el curso.';
      } finally {
        this.loading = false;
      }
    },

    async updateCurso(id: number, curso: Curso) {
      this.loading = true;
      this.error = null;
      try {
        const updatedCurso = await cursosService.updateCurso(id, curso);
        const index = this.cursos.findIndex((c) => c.id === id);
        if (index !== -1) {
          this.cursos[index] = updatedCurso;
        }
      } catch (error: any) {
        this.error = error.message || 'Error al actualizar el curso.';
      } finally {
        this.loading = false;
      }
    },

    async deleteCurso(id: number) {
      this.loading = true;
      this.error = null;
      try {
        await cursosService.deleteCurso(id);
        this.cursos = this.cursos.filter((c) => c.id !== id);
      } catch (error: any) {
        this.error = error.message || 'Error al eliminar el curso.';
      } finally {
        this.loading = false;
      }
    },
  },
});
