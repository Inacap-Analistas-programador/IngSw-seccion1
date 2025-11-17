import React from 'react';
import { FaHistory } from 'react-icons/fa';

const HistorialPagos = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <FaHistory className="mr-2 text-gray-600" />
        Historial de Cambios en Pagos
      </h2>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <p className="text-gray-800 font-medium mb-2">Módulo de Historial</p>
        <p className="text-sm text-gray-600">
          Aquí se mostrará el historial de modificaciones realizadas en los pagos.
        </p>
        <p className="text-xs text-gray-500 mt-4">
          Funcionalidad en desarrollo
        </p>
      </div>
    </div>
  );
};

export default HistorialPagos;
