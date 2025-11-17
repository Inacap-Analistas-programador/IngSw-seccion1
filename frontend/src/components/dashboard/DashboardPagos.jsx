import React from 'react';

const DashboardPagos = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
        <h3 className="text-sm font-medium text-green-800 mb-1">Total Ingresos</h3>
        <p className="text-2xl font-bold text-green-900">$0</p>
        <p className="text-xs text-green-600 mt-1">Este mes</p>
      </div>
      
      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
        <h3 className="text-sm font-medium text-yellow-800 mb-1">Pagos Pendientes</h3>
        <p className="text-2xl font-bold text-yellow-900">0</p>
        <p className="text-xs text-yellow-600 mt-1">Por confirmar</p>
      </div>
      
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
        <h3 className="text-sm font-medium text-blue-800 mb-1">Cursos Pagados</h3>
        <p className="text-2xl font-bold text-blue-900">0</p>
        <p className="text-xs text-blue-600 mt-1">Total registrados</p>
      </div>
    </div>
  );
};

export default DashboardPagos;
