import React from 'react';
import GeografiaList from '@/components/geografia/GeografiaList';

const RegionesPage = () => {
  const fields = [
    { key: 'reg_descripcion', label: 'DESCRIPCIÓN', type: 'text', fullWidth: true },
  ];

  return (
    <GeografiaList
      geografiaType="regiones"
      title="REGIONES"
      fields={fields}
      idField="reg_id"
      statusField="reg_vigente"
    />
  );
};

export default RegionesPage;
