import React from 'react';
import MaestrosList from '@/components/maestros/MaestrosList';

const TiposCursoPage = () => {
  const fields = [
    { key: 'tcu_descripcion', label: 'Descripción', type: 'text', fullWidth: true },
    {
      key: 'tcu_tipo',
      label: 'Tipo',
      type: 'number',
    },
    {
      key: 'tcu_cant_participante',
      label: 'Cantidad Participantes',
      type: 'number',
    },
    {
      key: 'tcu_vigente',
      label: 'Vigente',
      type: 'select',
      options: [
        { value: 'true', label: 'Sí' },
        { value: 'false', label: 'No' },
      ],
      render: (value) => (value ? 'Sí' : 'No'),
    },
  ];

  return <MaestrosList maestroType="tipos-curso" title="Tipos de Curso" fields={fields} idField="tcu_id" />;
};

export default TiposCursoPage;
