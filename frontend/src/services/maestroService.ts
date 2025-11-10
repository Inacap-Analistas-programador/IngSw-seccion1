import apiClient from './api';

export const maestroService = {
  getTiposCurso(): Promise<any[]> {
    return apiClient.get('/maestros/tipos-curso/').then(res => res.data);
  },
  getPersonas(): Promise<any[]> {
    return apiClient.get('/personas/').then(res => res.data);
  },
  getCargos(): Promise<any[]> {
    return apiClient.get('/maestros/cargos/').then(res => res.data);
  },
  getComunas(): Promise<any[]> {
    return apiClient.get('/maestros/comunas/').then(res => res.data);
  },
};
