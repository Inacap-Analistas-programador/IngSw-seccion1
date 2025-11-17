import React from 'react';
import GeografiaList from '@/components/geografia/GeografiaList';

const ZonasPage = () => {
  const fields = [
    { key: 'zon_descripcion', label: 'Descripción', type: 'text', fullWidth: true },
    {
      key: 'zon_unilateral',
      label: 'Unilateral',
      type: 'select',
      options: [
        { value: 'true', label: 'Sí' },
        { value: 'false', label: 'No' },
      ],
      render: (value) => (value ? 'Sí' : 'No'),
    },
    {
      key: 'zon_vigente',
      label: 'Vigente',
      type: 'select',
      options: [
        { value: 'true', label: 'Sí' },
        { value: 'false', label: 'No' },
      ],
      render: (value) => (value ? 'Sí' : 'No'),
    },
  ];

  return (
    <GeografiaList
      geografiaType="zonas"
      title="Zonas"
      fields={fields}
      idField="zon_id"
    />
  );
};

export default ZonasPage;
