import React from 'react';
import MaestrosList from '@/components/maestros/MaestrosList';

const TiposArchivoPage = () => {
  const fields = [
    { key: 'tar_descripcion', label: 'DESCRIPCIÓN', type: 'text', fullWidth: true },
  ];

  return <MaestrosList maestroType="tipos-archivo" title="TIPOS DE ARCHIVO" fields={fields} idField="tar_id" statusField="tar_vigente" />;
};

export default TiposArchivoPage;
