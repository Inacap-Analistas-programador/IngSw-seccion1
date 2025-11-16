import React from 'react';
import MaestrosList from '@/components/maestros/MaestrosList';

const ConceptosContablesPage = () => {
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

  return (
    <MaestrosList maestroType="concepto-contable" title="Conceptos Contables" fields={fields} />
  );
};

export default ConceptosContablesPage;
