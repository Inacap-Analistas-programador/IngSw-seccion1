import apiClient from './api';
import type { Persona } from '@/types/persona';

export const personaService = {
  findByRut(rut: string): Promise<Persona> {
    return apiClient.get(`/personas/?run=${rut}`).then(res => res.data[0]);
  },
};
