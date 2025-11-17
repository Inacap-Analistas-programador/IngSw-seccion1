import React from 'react';
import MaestrosList from '@/components/maestros/MaestrosList';

const EstadosCivilesPage = () => {
  const fields = [
    { key: 'esc_descripcion', label: 'Descripción', type: 'text', fullWidth: true },
    {
      key: 'esc_vigente',
      label: 'Vigente',
      type: 'select',
      options: [
        { value: 'true', label: 'Sí' },
        { value: 'false', label: 'No' },
      ],
      render: (value) => (value ? 'Sí' : 'No'),
    },
  ];

  return <MaestrosList maestroType="estados-civiles" title="Estados Civiles" fields={fields} idField="esc_id" />;
};

export default EstadosCivilesPage;
