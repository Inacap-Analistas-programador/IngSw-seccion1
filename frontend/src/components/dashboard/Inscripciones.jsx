import React from 'react';
import Card from '@/components/ui/Card';

const Inscripciones = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Inscripciones</h1>
        <p className="text-gray-600 mt-2">Gestión de inscripciones a cursos</p>
      </div>

      <Card>
        <p className="text-gray-600">Lista de inscripciones aparecerá aquí.</p>
      </Card>
    </div>
  );
};

export default Inscripciones;