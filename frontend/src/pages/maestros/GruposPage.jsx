import React from 'react';
import MaestrosList from '@/components/maestros/MaestrosList';

const GruposPage = () => {
  const fields = [
    { key: 'numero', label: 'Número', type: 'text' },
    { key: 'nombre', label: 'Nombre', type: 'text' },
    { key: 'direccion', label: 'Dirección', type: 'text', fullWidth: true },
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

  return <MaestrosList maestroType="grupo" title="Grupos Scout" fields={fields} />;
};

export default GruposPage;
