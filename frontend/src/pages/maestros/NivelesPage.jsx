import React from 'react';
import MaestrosList from '@/components/maestros/MaestrosList';

const NivelesPage = () => {
  const fields = [
    { key: 'niv_descripcion', label: 'DESCRIPCIÓN', type: 'text', fullWidth: true },
    {
      key: 'niv_orden',
      label: 'ORDEN',
      type: 'number',
    },
  ];

  return <MaestrosList maestroType="niveles" title="NIVELES" fields={fields} idField="niv_id" statusField="niv_vigente" />;
};

export default NivelesPage;
