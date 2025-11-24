import React from 'react';
import MaestrosList from '@/components/maestros/MaestrosList';

const RolesPage = () => {
  const fields = [
    { key: 'rol_descripcion', label: 'DESCRIPCIÓN', type: 'text', fullWidth: true },
    {
      key: 'rol_tipo',
      label: 'TIPO',
      type: 'number',
    },
  ];

  return <MaestrosList maestroType="roles" title="ROLES" fields={fields} idField="rol_id" statusField="rol_vigente" />;
};

export default RolesPage;
