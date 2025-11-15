import api from '../config/api';

const API_URL = '/geografia'; // Base URL for geografia endpoints

export const getRegiones = async () => {
  try {
    const response = await api.get(`${API_URL}/regiones/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching regiones:', error);
    throw error;
  }
};

export const getProvincias = async () => {
  try {
    const response = await api.get(`${API_URL}/provincias/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching provincias:', error);
    throw error;
  }
};

export const getComunas = async () => {
  try {
    const response = await api.get(`${API_URL}/comunas/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comunas:', error);
    throw error;
  }
};

export const getZonas = async () => {
  try {
    const response = await api.get(`${API_URL}/zonas/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching zonas:', error);
    throw error;
  }
};

export const getDistritos = async () => {
  try {
    const response = await api.get(`${API_URL}/distritos/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching distritos:', error);
    throw error;
  }
};

export const getGrupos = async () => {
  try {
    const response = await api.get(`${API_URL}/grupos/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching grupos:', error);
    throw error;
  }
};
