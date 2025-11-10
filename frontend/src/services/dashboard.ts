import apiClient from './api';

export interface DashboardMetrics {
  cursos_activos: number;
  participantes: number;
  ingresos_totales: number;
  pagos_pendientes: number;
}

export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
  const response = await apiClient.get('/dashboard/metrics/');
  return response.data;
};
