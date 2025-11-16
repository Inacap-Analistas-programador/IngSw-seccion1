import httpClient from './httpClient';

/**
 * Servicio para gestión de maestros/tablas maestras
 */
const maestrosService = {
  /**
   * Obtener lista de un maestro específico
   */
  async getList(maestroType) {
    try {
      const response = await httpClient.get(`/api/maestros/${maestroType}/`);
      return response;
    } catch (error) {
      console.error(`Error getting maestro ${maestroType}:`, error);
      throw error;
    }
  },

  /**
   * Obtener un item de maestro por ID
   */
  async getById(maestroType, id) {
    try {
      const response = await httpClient.get(`/api/maestros/${maestroType}/${id}/`);
      return response;
    } catch (error) {
      console.error(`Error getting ${maestroType} ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crear un nuevo item en maestro
   */
  async create(maestroType, data) {
    try {
      const response = await httpClient.post(`/api/maestros/${maestroType}/`, data);
      return response;
    } catch (error) {
      console.error(`Error creating ${maestroType}:`, error);
      throw error;
    }
  },

  /**
   * Actualizar un item de maestro
   */
  async update(maestroType, id, data) {
    try {
      const response = await httpClient.put(`/api/maestros/${maestroType}/${id}/`, data);
      return response;
    } catch (error) {
      console.error(`Error updating ${maestroType} ${id}:`, error);
      throw error;
    }
  },

  /**
   * Eliminar un item de maestro
   */
  async delete(maestroType, id) {
    try {
      const response = await httpClient.delete(`/api/maestros/${maestroType}/${id}/`);
      return response;
    } catch (error) {
      console.error(`Error deleting ${maestroType} ${id}:`, error);
      throw error;
    }
  },

  // Métodos específicos para cada maestro
  alimentaciones: {
    getAll: () => maestrosService.getList('alimentacion'),
    getById: (id) => maestrosService.getById('alimentacion', id),
    create: (data) => maestrosService.create('alimentacion', data),
    update: (id, data) => maestrosService.update('alimentacion', id, data),
    delete: (id) => maestrosService.delete('alimentacion', id),
  },

  cargos: {
    getAll: () => maestrosService.getList('cargo'),
    getById: (id) => maestrosService.getById('cargo', id),
    create: (data) => maestrosService.create('cargo', data),
    update: (id, data) => maestrosService.update('cargo', id, data),
    delete: (id) => maestrosService.delete('cargo', id),
  },

  conceptosContables: {
    getAll: () => maestrosService.getList('concepto-contable'),
    getById: (id) => maestrosService.getById('concepto-contable', id),
    create: (data) => maestrosService.create('concepto-contable', data),
    update: (id, data) => maestrosService.update('concepto-contable', id, data),
    delete: (id) => maestrosService.delete('concepto-contable', id),
  },

  estadosCiviles: {
    getAll: () => maestrosService.getList('estado-civil'),
    getById: (id) => maestrosService.getById('estado-civil', id),
    create: (data) => maestrosService.create('estado-civil', data),
    update: (id, data) => maestrosService.update('estado-civil', id, data),
    delete: (id) => maestrosService.delete('estado-civil', id),
  },

  grupos: {
    getAll: () => maestrosService.getList('grupo'),
    getById: (id) => maestrosService.getById('grupo', id),
    create: (data) => maestrosService.create('grupo', data),
    update: (id, data) => maestrosService.update('grupo', id, data),
    delete: (id) => maestrosService.delete('grupo', id),
  },

  niveles: {
    getAll: () => maestrosService.getList('nivel'),
    getById: (id) => maestrosService.getById('nivel', id),
    create: (data) => maestrosService.create('nivel', data),
    update: (id, data) => maestrosService.update('nivel', id, data),
    delete: (id) => maestrosService.delete('nivel', id),
  },

  ramas: {
    getAll: () => maestrosService.getList('rama'),
    getById: (id) => maestrosService.getById('rama', id),
    create: (data) => maestrosService.create('rama', data),
    update: (id, data) => maestrosService.update('rama', id, data),
    delete: (id) => maestrosService.delete('rama', id),
  },

  roles: {
    getAll: () => maestrosService.getList('rol'),
    getById: (id) => maestrosService.getById('rol', id),
    create: (data) => maestrosService.create('rol', data),
    update: (id, data) => maestrosService.update('rol', id, data),
    delete: (id) => maestrosService.delete('rol', id),
  },

  tiposArchivo: {
    getAll: () => maestrosService.getList('tipo-archivo'),
    getById: (id) => maestrosService.getById('tipo-archivo', id),
    create: (data) => maestrosService.create('tipo-archivo', data),
    update: (id, data) => maestrosService.update('tipo-archivo', id, data),
    delete: (id) => maestrosService.delete('tipo-archivo', id),
  },

  tiposCurso: {
    getAll: () => maestrosService.getList('tipo-curso'),
    getById: (id) => maestrosService.getById('tipo-curso', id),
    create: (data) => maestrosService.create('tipo-curso', data),
    update: (id, data) => maestrosService.update('tipo-curso', id, data),
    delete: (id) => maestrosService.delete('tipo-curso', id),
  },
};

export default maestrosService;
