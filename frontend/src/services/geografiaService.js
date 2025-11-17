import api from '../config/api';

const API_URL = '/geografia'; // Base URL for geografia endpoints

const geografiaService = {
  // Generic CRUD operations
  getList: async (geografiaType) => {
    try {
      const response = await api.get(`${API_URL}/${geografiaType}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${geografiaType}:`, error);
      throw error;
    }
  },

  getById: async (geografiaType, id) => {
    try {
      const response = await api.get(`${API_URL}/${geografiaType}/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${geografiaType} by id:`, error);
      throw error;
    }
  },

  create: async (geografiaType, data) => {
    try {
      const response = await api.post(`${API_URL}/${geografiaType}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Error creating ${geografiaType}:`, error);
      throw error;
    }
  },

  update: async (geografiaType, id, data) => {
    try {
      const response = await api.put(`${API_URL}/${geografiaType}/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating ${geografiaType}:`, error);
      throw error;
    }
  },

  delete: async (geografiaType, id) => {
    try {
      await api.delete(`${API_URL}/${geografiaType}/${id}/`);
    } catch (error) {
      console.error(`Error deleting ${geografiaType}:`, error);
      throw error;
    }
  },
};

// Legacy exports for backward compatibility
export const getRegiones = async () => {
  return geografiaService.getList('regiones');
};

export const getProvincias = async () => {
  return geografiaService.getList('provincias');
};

export const getComunas = async () => {
  return geografiaService.getList('comunas');
};

export const getZonas = async () => {
  return geografiaService.getList('zonas');
};

export const getDistritos = async () => {
  return geografiaService.getList('distritos');
};

export const getGrupos = async () => {
  return geografiaService.getList('grupos');
};

export default geografiaService;
