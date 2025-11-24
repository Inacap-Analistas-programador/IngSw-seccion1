import React from 'react';
import MaestrosList from '@/components/maestros/MaestrosList';

const TiposCursoPage = () => {
  const fields = [
    { key: 'tcu_descripcion', label: 'DESCRIPCIÓN', type: 'text', fullWidth: true },
    {
      key: 'tcu_tipo',
      label: 'TIPO',
      type: 'number',
    },
    {
      key: 'tcu_cant_participante',
      label: 'CANTIDAD PARTICIPANTES',
      type: 'number',
    },
  ];

  return <MaestrosList maestroType="tipos-curso" title="TIPOS DE CURSO" fields={fields} idField="tcu_id" statusField="tcu_vigente" />;
};

export default TiposCursoPage;
