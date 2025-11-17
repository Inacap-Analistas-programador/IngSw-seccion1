import { useState, useEffect } from 'react';
import api from '@/lib/api';

const DashboardPagos = () => {
  const [stats, setStats] = useState({
    total_ingresos: 0,
    pagos_pendientes: 0,
    cursos_pagados: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPaymentStats();
  }, []);

  const loadPaymentStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/usuarios/dashboard/payment-stats/');
      setStats(response.data);
    } catch (error) {
      console.error('Error loading payment stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
        <h3 className="text-sm font-medium text-green-800 mb-1">Total Ingresos</h3>
        {loading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-green-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-green-200 rounded w-1/3"></div>
          </div>
        ) : (
          <>
            <p className="text-2xl font-bold text-green-900">{formatCurrency(stats.total_ingresos)}</p>
            <p className="text-xs text-green-600 mt-1">Este mes</p>
          </>
        )}
      </div>
      
      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
        <h3 className="text-sm font-medium text-yellow-800 mb-1">Pagos Pendientes</h3>
        {loading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-yellow-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-yellow-200 rounded w-1/3"></div>
          </div>
        ) : (
          <>
            <p className="text-2xl font-bold text-yellow-900">{stats.pagos_pendientes}</p>
            <p className="text-xs text-yellow-600 mt-1">Por confirmar</p>
          </>
        )}
      </div>
      
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
        <h3 className="text-sm font-medium text-blue-800 mb-1">Cursos Pagados</h3>
        {loading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-blue-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-blue-200 rounded w-1/3"></div>
          </div>
        ) : (
          <>
            <p className="text-2xl font-bold text-blue-900">{stats.cursos_pagados}</p>
            <p className="text-xs text-blue-600 mt-1">Total registrados</p>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPagos;
