import React from 'react';
import GeografiaList from '@/components/geografia/GeografiaList';

const RegionesPage = () => {
  const fields = [
    { key: 'reg_descripcion', label: 'Descripción', type: 'text', fullWidth: true },
    {
      key: 'reg_vigente',
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
      geografiaType="regiones"
      title="Regiones"
      fields={fields}
      idField="reg_id"
    />
  );
};

export default RegionesPage;
