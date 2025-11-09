import apiClient from './api';
import type { Persona } from '@/types/persona';

export const getPersonas = async (): Promise<Persona[]> => {
  const response = await apiClient.get('/personas/');
  return response.data;
};

export const createPersona = async (persona: Persona): Promise<Persona> => {
  const response = await apiClient.post('/personas/', persona);
  return response.data;
};

export const updatePersona = async (persona: Persona): Promise<Persona> => {
  const response = await apiClient.put(`/personas/${persona.id}/`, persona);
  return response.data;
};

export const deletePersona = async (id: number): Promise<void> => {
  await apiClient.delete(`/personas/${id}/`);
};

export const searchPersonByRut = async (rut: string): Promise<Persona[]> => {
  const response = await apiClient.get(`/personas/search/?rut=${rut}`);
  return response.data.results;
};
