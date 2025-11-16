import httpClient from './httpClient';

/**
 * Servicio para gestión de preinscripciones/inscripciones
 */
const preinscripcionService = {
  /**
   * Obtener todas las preinscripciones
   */
  async getAll() {
    try {
      const response = await httpClient.get('/api/preinscripcion/');
      return response;
    } catch (error) {
      console.error('Error getting preinscripciones:', error);
      throw error;
    }
  },

  /**
   * Obtener una preinscripción por ID
   */
  async getById(id) {
    try {
      const response = await httpClient.get(`/api/preinscripcion/${id}/`);
      return response;
    } catch (error) {
      console.error(`Error getting preinscripcion ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crear una nueva preinscripción
   */
  async create(data) {
    try {
      const response = await httpClient.post('/api/preinscripcion/', data);
      return response;
    } catch (error) {
      console.error('Error creating preinscripcion:', error);
      throw error;
    }
  },

  /**
   * Actualizar una preinscripción
   */
  async update(id, data) {
    try {
      const response = await httpClient.put(`/api/preinscripcion/${id}/`, data);
      return response;
    } catch (error) {
      console.error(`Error updating preinscripcion ${id}:`, error);
      throw error;
    }
  },

  /**
   * Eliminar una preinscripción
   */
  async delete(id) {
    try {
      const response = await httpClient.delete(`/api/preinscripcion/${id}/`);
      return response;
    } catch (error) {
      console.error(`Error deleting preinscripcion ${id}:`, error);
      throw error;
    }
  },

  /**
   * Actualizar estado de preinscripción
   */
  async updateStatus(id, status) {
    try {
      const response = await httpClient.patch(`/api/preinscripcion/${id}/`, {
        estado: status,
      });
      return response;
    } catch (error) {
      console.error(`Error updating status for preinscripcion ${id}:`, error);
      throw error;
    }
  },

  /**
   * Exportar preinscripciones a CSV
   */
  async exportCSV(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const url = `/api/preinscripcion/export/?${queryParams}`;
      const response = await httpClient.get(url);
      return response;
    } catch (error) {
      console.error('Error exporting preinscripciones:', error);
      throw error;
    }
  },
};

export default preinscripcionService;
