import React from 'react';
import MaestrosList from '@/components/maestros/MaestrosList';

const RamasPage = () => {
  const fields = [
    { key: 'ram_descripcion', label: 'DESCRIPCIÓN', type: 'text', fullWidth: true },
  ];

  return <MaestrosList maestroType="ramas" title="RAMAS SCOUT" fields={fields} idField="ram_id" statusField="ram_vigente" />;
};

export default RamasPage;
