import apiClient from './api';
import type { Archivo } from '@/types/archivos';

export const getArchivos = async (): Promise<Archivo[]> => {
  const response = await apiClient.get('/archivos/');
  return response.data;
};

export const createArchivo = async (archivo: Archivo): Promise<Archivo> => {
  const response = await apiClient.post('/archivos/', archivo);
  return response.data;
};

export const updateArchivo = async (archivo: Archivo): Promise<Archivo> => {
  const response = await apiClient.put(`/archivos/${archivo.id}/`, archivo);
  return response.data;
};

export const deleteArchivo = async (id: number): Promise<void> => {
  await apiClient.delete(`/archivos/${id}/`);
};
