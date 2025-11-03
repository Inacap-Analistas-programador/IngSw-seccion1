import apiClient from './api';
import type { Pago, PaymentBreakdown } from '@/types/pagos';

export const getPagos = async (): Promise<Pago[]> => {
  const response = await apiClient.get('/pagos/');
  return response.data;
};

export const createPago = async (pago: Pago): Promise<Pago> => {
  const response = await apiClient.post('/pagos/', pago);
  return response.data;
};

export const updatePago = async (pago: Pago): Promise<Pago> => {
  const response = await apiClient.put(`/pagos/${pago.id}/`, pago);
  return response.data;
};

export const deletePago = async (id: number): Promise<void> => {
  await apiClient.delete(`/pagos/${id}/`);
};

export const getPaymentsByGroup = async (group: string): Promise<{ count: number; total_amount: number; breakdown: PaymentBreakdown }> => {
  const response = await apiClient.get(`/pagos/by_group/${group}/`);
  return response.data;
};
