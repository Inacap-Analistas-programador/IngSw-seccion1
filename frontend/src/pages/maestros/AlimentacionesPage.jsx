import React from 'react';
import MaestrosList from '@/components/maestros/MaestrosList';

const AlimentacionesPage = () => {
  const fields = [
    { key: 'descripcion', label: 'Descripción', type: 'text', fullWidth: true },
    {
      key: 'tipo',
      label: 'Tipo',
      type: 'select',
      options: [
        { value: '1', label: 'Desayuno' },
        { value: '2', label: 'Almuerzo' },
        { value: '3', label: 'Cena' },
        { value: '4', label: 'Colación' },
      ],
    },
    {
      key: 'vigente',
      label: 'Vigente',
      type: 'select',
      options: [
        { value: 'true', label: 'Sí' },
        { value: 'false', label: 'No' },
      ],
      render: (value) => (value ? 'Sí' : 'No'),
    },
  ];

  return <MaestrosList maestroType="alimentacion" title="Alimentación" fields={fields} />;
};

export default AlimentacionesPage;
