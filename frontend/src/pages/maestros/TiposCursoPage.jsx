import React from 'react';
import MaestrosList from '@/components/maestros/MaestrosList';

const TiposCursoPage = () => {
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

  return <MaestrosList maestroType="tipo-curso" title="Tipos de Curso" fields={fields} />;
};

export default TiposCursoPage;
