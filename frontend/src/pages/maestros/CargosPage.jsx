import React from 'react';
import MaestrosList from '@/components/maestros/MaestrosList';

const CargosPage = () => {
  const fields = [
    { key: 'car_descripcion', label: 'DESCRIPCIÓN', type: 'text', fullWidth: true },
  ];

  return <MaestrosList maestroType="cargos" title="CARGOS" fields={fields} idField="car_id" statusField="car_vigente" />;
};

export default CargosPage;
