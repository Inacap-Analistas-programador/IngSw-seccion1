import api from '../../config/api';

const proveedorService = {
  getAll: async () => {
    const response = await api.get('/proveedores/proveedores/');
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/proveedores/proveedores/', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/proveedores/proveedores/${id}/`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/proveedores/proveedores/${id}/`);
    return response.data;
  }
};

export default proveedorService;
