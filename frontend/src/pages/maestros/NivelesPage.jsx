import React from 'react';
import MaestrosList from '@/components/maestros/MaestrosList';

const NivelesPage = () => {
  const fields = [
    { key: 'niv_descripcion', label: 'Descripción', type: 'text', fullWidth: true },
    {
      key: 'niv_orden',
      label: 'Orden',
      type: 'number',
    },
    {
      key: 'niv_vigente',
      label: 'Vigente',
      type: 'select',
      options: [
        { value: 'true', label: 'Sí' },
        { value: 'false', label: 'No' },
      ],
      render: (value) => (value ? 'Sí' : 'No'),
    },
  ];

  return <MaestrosList maestroType="niveles" title="Niveles" fields={fields} idField="niv_id" />;
};

export default NivelesPage;
