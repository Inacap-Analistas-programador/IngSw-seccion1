import React from 'react';
import MaestrosList from '@/components/maestros/MaestrosList';

const EstadosCivilesPage = () => {
  const fields = [
    { key: 'esc_descripcion', label: 'DESCRIPCIÓN', type: 'text', fullWidth: true },
  ];

  return <MaestrosList maestroType="estados-civiles" title="ESTADOS CIVILES" fields={fields} idField="esc_id" statusField="esc_vigente" />;
};

export default EstadosCivilesPage;
