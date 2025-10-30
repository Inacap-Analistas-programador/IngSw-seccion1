import apiClient from './api';

export default {
  // Métodos para Roles
  getRoles() {
    return apiClient.get('/catalogo/roles/');
  },
  createRol(data: { descripcion: string; tipo: number }) {
    return apiClient.post('/catalogo/roles/', data);
  },
  updateRol(id: number, data: { descripcion: string; tipo: number; vigente: boolean }) {
    return apiClient.put(`/catalogo/roles/${id}/`, data);
  },
  deleteRol(id: number) {
    return apiClient.delete(`/catalogo/roles/${id}/`);
  },

  // Métodos para Cargos
  getCargos() {
    return apiClient.get('/catalogo/cargos/');
  },
  createCargo(data: { descripcion: string }) {
    return apiClient.post('/catalogo/cargos/', data);
  },
  updateCargo(id: number, data: { descripcion: string; vigente: boolean }) {
    return apiClient.put(`/catalogo/cargos/${id}/`, data);
  },
  deleteCargo(id: number) {
    return apiClient.delete(`/catalogo/cargos/${id}/`);
  },

  // Métodos para Ramas
  getRamas() {
    return apiClient.get('/catalogo/ramas/');
  },
  createRama(data: { descripcion: string }) {
    return apiClient.post('/catalogo/ramas/', data);
  },
  updateRama(id: number, data: { descripcion: string; vigente: boolean }) {
    return apiClient.put(`/catalogo/ramas/${id}/`, data);
  },
  deleteRama(id: number) {
    return apiClient.delete(`/catalogo/ramas/${id}/`);
  },
};
