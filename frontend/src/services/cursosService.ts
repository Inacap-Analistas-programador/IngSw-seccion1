import apiClient from './api';
import type { Curso } from '@/types';

export const cursosService = {
  getCursos: async (filters: any = {}): Promise<Curso[]> => {
    const response = await apiClient.get('/cursos/', { params: filters });
    return response.data;
  },
  createCurso: async (curso: Partial<Curso>): Promise<Curso> => {
    const response = await apiClient.post('/cursos/', curso);
    return response.data;
  },
  updateCurso: async (id: number, curso: Partial<Curso>): Promise<Curso> => {
    const response = await apiClient.put(`/cursos/${id}/`, curso);
    return response.data;
  },
  deleteCurso: async (id: number): Promise<void> => {
    await apiClient.delete(`/cursos/${id}/`);
  },
};
