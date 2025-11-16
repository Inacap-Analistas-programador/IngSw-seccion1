import React from 'react';
import MaestrosList from '@/components/maestros/MaestrosList';

const NivelesPage = () => {
  const fields = [
    { key: 'descripcion', label: 'Descripción', type: 'text', fullWidth: true },
    {
      key: 'vigente',
      label: 'Vigente',
      type: 'select',
      options: [
        { value: 'true', label: 'Sí' },
        { value: 'false', label: 'No' },
      ],
      render: (value) => (value ? 'Sí' : 'No'),
    },
  ];

  return <MaestrosList maestroType="nivel" title="Niveles" fields={fields} />;
};

export default NivelesPage;
