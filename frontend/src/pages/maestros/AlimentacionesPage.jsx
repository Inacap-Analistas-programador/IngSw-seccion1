import React from 'react';
import MaestrosList from '@/components/maestros/MaestrosList';

const AlimentacionesPage = () => {
  const fields = [
    { key: 'ali_descripcion', label: 'DESCRIPCIÓN', type: 'text', fullWidth: true },
    {
      key: 'ali_tipo',
      label: 'TIPO',
      type: 'select',
      options: [
        { value: '1', label: 'DESAYUNO' },
        { value: '2', label: 'ALMUERZO' },
        { value: '3', label: 'CENA' },
        { value: '4', label: 'COLACIÓN' },
      ],
    },
  ];

  return <MaestrosList maestroType="alimentaciones" title="ALIMENTACIÓN" fields={fields} idField="ali_id" statusField="ali_vigente" />;
};

export default AlimentacionesPage;
