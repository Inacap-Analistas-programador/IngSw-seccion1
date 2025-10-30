import apiClient from './api';
import type { Pago } from '@/types';

export default {
  getPagos() {
    return apiClient.get('/pagos/');
  },
  getPago(id: number) {
    return apiClient.get(`/pagos/${id}/`);
  },
  createPago(pago: Pago) {
    return apiClient.post('/pagos/', pago);
  },
  updatePago(id: number, pago: Pago) {
    return apiClient.put(`/pagos/${id}/`, pago);
  },
  deletePago(id: number) {
    return apiClient.delete(`/pagos/${id}/`);
  },
};
