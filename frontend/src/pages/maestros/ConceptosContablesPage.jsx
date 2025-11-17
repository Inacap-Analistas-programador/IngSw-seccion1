import React from 'react';
import MaestrosList from '@/components/maestros/MaestrosList';

const ConceptosContablesPage = () => {
  const fields = [
    { key: 'coc_descripcion', label: 'Descripción', type: 'text', fullWidth: true },
    {
      key: 'coc_vigente',
      label: 'Vigente',
      type: 'select',
      options: [
        { value: 'true', label: 'Sí' },
        { value: 'false', label: 'No' },
      ],
      render: (value) => (value ? 'Sí' : 'No'),
    },
  ];

  return (
    <MaestrosList maestroType="conceptos-contables" title="Conceptos Contables" fields={fields} idField="coc_id" />
  );
};

export default ConceptosContablesPage;
