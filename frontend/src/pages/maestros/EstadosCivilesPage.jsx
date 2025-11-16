import React from 'react';
import MaestrosList from '@/components/maestros/MaestrosList';

const EstadosCivilesPage = () => {
  const fields = [
    { key: 'descripcion', label: 'Descripción', type: 'text', fullWidth: true },
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

  return <MaestrosList maestroType="estado-civil" title="Estados Civiles" fields={fields} />;
};

export default EstadosCivilesPage;
