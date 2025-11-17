import React from 'react';
import { FaWallet } from 'react-icons/fa';

const Prepagos = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <FaWallet className="mr-2 text-purple-600" />
        Gestión de Prepagos
      </h2>
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
        <p className="text-purple-800 font-medium mb-2">Módulo de Prepagos</p>
        <p className="text-sm text-purple-600">
          Aquí se registrarán y gestionarán los prepagos de los participantes.
        </p>
        <p className="text-xs text-gray-500 mt-4">
          Funcionalidad en desarrollo
        </p>
      </div>
    </div>
  );
};

export default Prepagos;
