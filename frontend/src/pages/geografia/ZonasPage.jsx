import React from 'react';
import GeografiaList from '@/components/geografia/GeografiaList';

const ZonasPage = () => {
  const fields = [
    { key: 'zon_descripcion', label: 'DESCRIPCIÓN', type: 'text', fullWidth: true },
    {
      key: 'zon_unilateral',
      label: 'UNILATERAL',
      type: 'select',
      options: [
        { value: 'true', label: 'SÍ' },
        { value: 'false', label: 'NO' },
      ],
      render: (value) => (value ? 'SÍ' : 'NO'),
    },
  ];

  return (
    <GeografiaList
      geografiaType="zonas"
      title="ZONAS"
      fields={fields}
      idField="zon_id"
      statusField="zon_vigente"
    />
  );
};

export default ZonasPage;
