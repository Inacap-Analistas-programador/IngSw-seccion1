import httpClient from './httpClient';

/**
 * Servicio para gestión de cursos
 */
const cursosService = {
  /**
   * Obtener todos los cursos
   */
  async getAll(params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = queryParams ? `/api/cursos/?${queryParams}` : '/api/cursos/';
      const response = await httpClient.get(url);
      return response;
    } catch (error) {
      console.error('Error getting cursos:', error);
      throw error;
    }
  },

  /**
   * Obtener un curso por ID
   */
  async getById(id) {
    try {
      const response = await httpClient.get(`/api/cursos/${id}/`);
      return response;
    } catch (error) {
      console.error(`Error getting curso ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crear un nuevo curso
   */
  async create(data) {
    try {
      const response = await httpClient.post('/api/cursos/', data);
      return response;
    } catch (error) {
      console.error('Error creating curso:', error);
      throw error;
    }
  },

  /**
   * Actualizar un curso
   */
  async update(id, data) {
    try {
      const response = await httpClient.put(`/api/cursos/${id}/`, data);
      return response;
    } catch (error) {
      console.error(`Error updating curso ${id}:`, error);
      throw error;
    }
  },

  /**
   * Eliminar un curso
   */
  async delete(id) {
    try {
      const response = await httpClient.delete(`/api/cursos/${id}/`);
      return response;
    } catch (error) {
      console.error(`Error deleting curso ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtener participantes de un curso
   */
  async getParticipantes(cursoId) {
    try {
      const response = await httpClient.get(`/api/cursos/${cursoId}/participantes/`);
      return response;
    } catch (error) {
      console.error(`Error getting participantes for curso ${cursoId}:`, error);
      throw error;
    }
  },

  /**
   * Obtener tipos de curso
   */
  async getTipos() {
    try {
      const response = await httpClient.get('/api/maestros/tipos-curso/');
      return response;
    } catch (error) {
      console.error('Error getting tipos de curso:', error);
      throw error;
    }
  },
};

export default cursosService;
