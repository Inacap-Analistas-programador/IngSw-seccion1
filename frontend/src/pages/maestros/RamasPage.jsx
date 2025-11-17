import React from 'react';
import MaestrosList from '@/components/maestros/MaestrosList';

const RamasPage = () => {
  const fields = [
    { key: 'ram_descripcion', label: 'Descripción', type: 'text', fullWidth: true },
    {
      key: 'ram_vigente',
      label: 'Vigente',
      type: 'select',
      options: [
        { value: 'true', label: 'Sí' },
        { value: 'false', label: 'No' },
      ],
      render: (value) => (value ? 'Sí' : 'No'),
    },
  ];

  return <MaestrosList maestroType="ramas" title="Ramas Scout" fields={fields} idField="ram_id" />;
};

export default RamasPage;
