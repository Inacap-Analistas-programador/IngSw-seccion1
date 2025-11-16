import React from 'react';
import MaestrosList from '@/components/maestros/MaestrosList';

const TiposArchivoPage = () => {
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

  return <MaestrosList maestroType="tipo-archivo" title="Tipos de Archivo" fields={fields} />;
};

export default TiposArchivoPage;
