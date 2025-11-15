import React from 'react';
import Card from '@/components/ui/Card';

const GestionPersonas = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Personas</h1>
        <p className="text-gray-600 mt-2">Administración avanzada de personas</p>
      </div>

      <Card>
        <p className="text-gray-600">Herramientas de gestión de personas aparecerán aquí.</p>
      </Card>
    </div>
  );
};

export default GestionPersonas;