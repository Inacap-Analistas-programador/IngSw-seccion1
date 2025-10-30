import apiClient from './api';
import type { Curso } from '@/types/cursos';

export const getCursos = async (): Promise<Curso[]> => {
  const response = await apiClient.get('/cursos/');
  return response.data;
};

export const createCurso = async (curso: Curso): Promise<Curso> => {
  const response = await apiClient.post('/cursos/', curso);
  return response.data;
};

export const updateCurso = async (curso: Curso): Promise<Curso> => {
  const response = await apiClient.put(`/cursos/${curso.id}/`, curso);
  return response.data;
};

export const deleteCurso = async (id: number): Promise<void> => {
  await apiClient.delete(`/cursos/${id}/`);
};

export const coursesService = {
  getMetrics: async () => {
    const response = await apiClient.get('/cursos/dashboard_metrics/');
    return response.data;
  },
  getActiveCourses: async () => {
    const response = await apiClient.get('/cursos/active/');
    return response.data;
  },
};
