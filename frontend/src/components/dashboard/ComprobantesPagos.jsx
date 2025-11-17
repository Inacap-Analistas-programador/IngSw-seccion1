import React from 'react';
import { FaFileInvoice } from 'react-icons/fa';

const ComprobantesPagos = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <FaFileInvoice className="mr-2 text-blue-600" />
        Gestión de Comprobantes
      </h2>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <p className="text-blue-800 font-medium mb-2">Módulo de Comprobantes</p>
        <p className="text-sm text-blue-600">
          Aquí se emitirán y gestionarán los comprobantes de pago.
        </p>
        <p className="text-xs text-gray-500 mt-4">
          Funcionalidad en desarrollo
        </p>
      </div>
    </div>
  );
};

export default ComprobantesPagos;
