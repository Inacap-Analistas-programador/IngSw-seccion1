import React from 'react';
import Card from '@/components/ui/Card';

const Preinscripcion = () => {
  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Estado del Formulario</h2>
        <p className="text-gray-600">Información sobre el estado del formulario de preinscripción (RF-03).</p>
      </Card>

      <Card>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Envíos Recientes</h2>
        <p className="text-gray-600">Tabla con los últimos envíos del formulario (RF-03).</p>
      </Card>
    </div>
  );
};

export default Preinscripcion;