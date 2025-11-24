import React, { useState, useEffect } from 'react';
import GeografiaList from '@/components/geografia/GeografiaList';
import geografiaService from '@/services/geografiaService';

const GruposPage = () => {
  const [distritos, setDistritos] = useState([]);

  useEffect(() => {
    const loadDistritos = async () => {
      try {
        const data = await geografiaService.getList('distritos');
        setDistritos(data);
      } catch (error) {
        console.error('Error loading distritos:', error);
      }
    };
    loadDistritos();
  }, []);

  const fields = [
    {
      key: 'dis_id',
      label: 'DISTRITO',
      type: 'select',
      options: distritos.map((d) => ({ value: d.dis_id, label: d.dis_descripcion })),
      render: (value) => {
        const distrito = distritos.find((d) => d.dis_id === value);
        return distrito ? distrito.dis_descripcion : value;
      },
    },
    { key: 'gru_descripcion', label: 'DESCRIPCIÓN', type: 'text', fullWidth: true },
  ];

  return (
    <GeografiaList
      geografiaType="grupos"
      title="GRUPOS"
      fields={fields}
      idField="gru_id"
      statusField="gru_vigente"
    />
  );
};

export default GruposPage;
