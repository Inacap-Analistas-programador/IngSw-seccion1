import httpClient from './httpClient';

/**
 * Servicio para gestión de personas
 */
const personasService = {
  /**
   * Obtener todas las personas
   */
  async getAll(params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = queryParams ? `/api/personas/personas/?${queryParams}` : '/api/personas/personas/';
      const response = await httpClient.get(url);
      return response;
    } catch (error) {
      console.error('Error getting personas:', error);
      throw error;
    }
  },

  /**
   * Obtener una persona por ID
   */
  async getById(id) {
    try {
      const response = await httpClient.get(`/api/personas/personas/${id}/`);
      return response;
    } catch (error) {
      console.error(`Error getting persona ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crear una nueva persona
   */
  async create(data) {
    try {
      const response = await httpClient.post('/api/personas/personas/', data);
      return response;
    } catch (error) {
      console.error('Error creating persona:', error);
      throw error;
    }
  },

  /**
   * Actualizar una persona
   */
  async update(id, data) {
    try {
      const response = await httpClient.put(`/api/personas/personas/${id}/`, data);
      return response;
    } catch (error) {
      console.error(`Error updating persona ${id}:`, error);
      throw error;
    }
  },

  /**
   * Actualización parcial de una persona
   */
  async patch(id, data) {
    try {
      const response = await httpClient.patch(`/api/personas/personas/${id}/`, data);
      return response;
    } catch (error) {
      console.error(`Error patching persona ${id}:`, error);
      throw error;
    }
  },

  /**
   * Eliminar una persona
   */
  async delete(id) {
    try {
      const response = await httpClient.delete(`/api/personas/personas/${id}/`);
      return response;
    } catch (error) {
      console.error(`Error deleting persona ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtener grupos de personas
   */
  async getGrupos() {
    try {
      const response = await httpClient.get('/api/personas/grupos/');
      return response;
    } catch (error) {
      console.error('Error getting grupos:', error);
      throw error;
    }
  },

  /**
   * Obtener niveles de personas
   */
  async getNiveles() {
    try {
      const response = await httpClient.get('/api/personas/niveles/');
      return response;
    } catch (error) {
      console.error('Error getting niveles:', error);
      throw error;
    }
  },

  /**
   * Obtener formadores
   */
  async getFormadores() {
    try {
      const response = await httpClient.get('/api/personas/formadores/');
      return response;
    } catch (error) {
      console.error('Error getting formadores:', error);
      throw error;
    }
  },

  /**
   * Buscar personas por RUT
   */
  async searchByRut(rut) {
    try {
      const response = await httpClient.get(`/api/personas/personas/?rut=${rut}`);
      return response;
    } catch (error) {
      console.error(`Error searching persona by RUT ${rut}:`, error);
      throw error;
    }
  },

  /**
   * Buscar personas por correo
   */
  async searchByEmail(email) {
    try {
      const response = await httpClient.get(`/api/personas/personas/?correo=${email}`);
      return response;
    } catch (error) {
      console.error(`Error searching persona by email ${email}:`, error);
      throw error;
    }
  },
};

export default personasService;
