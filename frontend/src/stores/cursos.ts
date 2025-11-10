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
        console.log('Store: Llamando a cursosService.getCursos con filtros:', filters);
        const response = await cursosService.getCursos(filters);
        console.log('Store: Respuesta recibida:', response);
        this.cursos = response;
        console.log('Store: Cursos guardados en el estado:', this.cursos);
      } catch (error: any) {
        console.error('Store: Error al cargar cursos:', error);
        this.error = error.message || 'Error al cargar los cursos.';
      } finally {
        this.loading = false;
      }
    },

    async createCurso(curso: Curso) {
      this.loading = true;
      this.error = null;
      try {
        console.log('Store: Creando curso con datos:', curso);
        const nuevoCurso = await cursosService.createCurso(curso);
        console.log('Store: Curso creado:', nuevoCurso);
        // Agregar el nuevo curso al array
        this.cursos.push(nuevoCurso);
        console.log('Store: Total de cursos después de crear:', this.cursos.length);
        return nuevoCurso;
      } catch (error: any) {
        console.error('Store: Error al crear curso:', error);
        this.error = error.message || 'Error al crear el curso.';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateCurso(id: number, curso: Curso) {
      this.loading = true;
      this.error = null;
      try {
        console.log('Store: Actualizando curso ID:', id, 'con datos:', curso);
        const updatedCurso = await cursosService.updateCurso(id, curso);
        console.log('Store: Curso actualizado desde API:', updatedCurso);
        
        const index = this.cursos.findIndex((c) => c.id === id);
        if (index !== -1) {
          // Reemplazar completamente el curso con los datos actualizados
          this.cursos[index] = {
            ...updatedCurso,
            fechas: Array.isArray(updatedCurso.fechas) ? [...updatedCurso.fechas] : []
          };
          console.log('Store: Curso actualizado en el array en índice:', index);
        } else {
          console.warn('Store: No se encontró el curso con ID:', id, 'en el array');
        }
        
        return updatedCurso;
      } catch (error: any) {
        console.error('Store: Error al actualizar curso:', error);
        this.error = error.message || 'Error al actualizar el curso.';
        throw error;
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
