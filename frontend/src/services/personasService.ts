import apiClient from './api';
import type { Persona } from '@/types'; // Asumiendo que tienes una interfaz Persona en types

export default {
  getPersonas(params: any) {
    return apiClient.get('/personas/', { params });
  },
  getPersona(id: number) {
    return apiClient.get(`/personas/${id}/`);
  },
  createPersona(persona: Persona) {
    return apiClient.post('/personas/', persona);
  },
  updatePersona(id: number, persona: Persona) {
    return apiClient.put(`/personas/${id}/`, persona);
  },
  deletePersona(id: number) {
    return apiClient.delete(`/personas/${id}/`);
  },
  getPersonaByRut(rut: string) {
    return apiClient.get(`/personas/?run=${rut}`);
  },
};
