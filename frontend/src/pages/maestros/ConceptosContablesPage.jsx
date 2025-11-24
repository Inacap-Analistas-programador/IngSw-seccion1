import React from 'react';
import MaestrosList from '@/components/maestros/MaestrosList';

const ConceptosContablesPage = () => {
  const fields = [
    { key: 'coc_descripcion', label: 'DESCRIPCIÓN', type: 'text', fullWidth: true },
  ];

  return (
    <MaestrosList maestroType="conceptos-contables" title="CONCEPTOS CONTABLES" fields={fields} idField="coc_id" statusField="coc_vigente" />
  );
};

export default ConceptosContablesPage;
