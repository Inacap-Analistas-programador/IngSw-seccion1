import React from 'react';
import MaestrosList from '@/components/maestros/MaestrosList';

const AlimentacionesPage = () => {
  const fields = [
    { key: 'ali_descripcion', label: 'Descripción', type: 'text', fullWidth: true },
    {
      key: 'ali_tipo',
      label: 'Tipo',
      type: 'select',
      options: [
        { value: '1', label: 'Desayuno' },
        { value: '2', label: 'Almuerzo' },
        { value: '3', label: 'Cena' },
        { value: '4', label: 'Colación' },
      ],
    },
    {
      key: 'ali_vigente',
      label: 'Vigente',
      type: 'select',
      options: [
        { value: 'true', label: 'Sí' },
        { value: 'false', label: 'No' },
      ],
      render: (value) => (value ? 'Sí' : 'No'),
    },
  ];

  return <MaestrosList maestroType="alimentaciones" title="Alimentación" fields={fields} idField="ali_id" />;
};

export default AlimentacionesPage;
