import React from 'react';

const Preinscripcion = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Estado del Formulario</h2>
        <p className="text-gray-600">
          Información sobre el estado del formulario de preinscripción (RF-03).
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Envíos Recientes</h2>
        <p className="text-gray-600">Tabla con los últimos envíos del formulario (RF-03).</p>
      </div>
    </div>
  );
};

export default Preinscripcion;
