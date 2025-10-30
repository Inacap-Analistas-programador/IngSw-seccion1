import apiClient from './api';
import type { Preinscripcion } from '@/types/preinscripciones';

export const getPreinscripciones = async (): Promise<Preinscripcion[]> => {
  const response = await apiClient.get('/preinscripciones/');
  return response.data;
};
