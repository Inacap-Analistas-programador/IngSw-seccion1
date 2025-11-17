import React from 'react';
import MaestrosList from '@/components/maestros/MaestrosList';

const CargosPage = () => {
  const fields = [
    { key: 'car_descripcion', label: 'Descripción', type: 'text', fullWidth: true },
    {
      key: 'car_vigente',
      label: 'Vigente',
      type: 'select',
      options: [
        { value: 'true', label: 'Sí' },
        { value: 'false', label: 'No' },
      ],
      render: (value) => (value ? 'Sí' : 'No'),
    },
  ];

  return <MaestrosList maestroType="cargos" title="Cargos" fields={fields} idField="car_id" />;
};

export default CargosPage;
