import React from 'react';
import MaestrosList from '@/components/maestros/MaestrosList';

const TiposArchivoPage = () => {
  const fields = [
    { key: 'tar_descripcion', label: 'Descripción', type: 'text', fullWidth: true },
    {
      key: 'tar_vigente',
      label: 'Vigente',
      type: 'select',
      options: [
        { value: 'true', label: 'Sí' },
        { value: 'false', label: 'No' },
      ],
      render: (value) => (value ? 'Sí' : 'No'),
    },
  ];

  return <MaestrosList maestroType="tipos-archivo" title="Tipos de Archivo" fields={fields} idField="tar_id" />;
};

export default TiposArchivoPage;
