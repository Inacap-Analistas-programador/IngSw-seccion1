import React from 'react';
import MaestrosList from '@/components/maestros/MaestrosList';

const RolesPage = () => {
  const fields = [
    { key: 'rol_descripcion', label: 'Descripción', type: 'text', fullWidth: true },
    {
      key: 'rol_tipo',
      label: 'Tipo',
      type: 'number',
    },
    {
      key: 'rol_vigente',
      label: 'Vigente',
      type: 'select',
      options: [
        { value: 'true', label: 'Sí' },
        { value: 'false', label: 'No' },
      ],
      render: (value) => (value ? 'Sí' : 'No'),
    },
  ];

  return <MaestrosList maestroType="roles" title="Roles" fields={fields} idField="rol_id" />;
};

export default RolesPage;
