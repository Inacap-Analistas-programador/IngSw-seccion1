import apiClient from './api';
import type { Region, Provincia, Comuna, Cargo, TipoCurso } from '../types/maestros';

export const getRegiones = async (): Promise<Region[]> => {
  const response = await apiClient.get('/maestros/regiones/');
  return response.data;
};

export const getProvincias = async (): Promise<Provincia[]> => {
  const response = await apiClient.get('/maestros/provincias/');
  return response.data;
};

export const getComunas = async (): Promise<Comuna[]> => {
  const response = await apiClient.get('/maestros/comunas/');
  return response.data;
};

export const getCargos = async (): Promise<Cargo[]> => {
  const response = await apiClient.get('/maestros/cargos/');
  return response.data;
};

export const getTiposCurso = async (): Promise<TipoCurso[]> => {
  const response = await apiClient.get('/maestros/tipos-curso/');
  return response.data;
};
