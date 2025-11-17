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
      label: 'Distrito',
      type: 'select',
      options: distritos.map((d) => ({ value: d.dis_id, label: d.dis_descripcion })),
      render: (value) => {
        const distrito = distritos.find((d) => d.dis_id === value);
        return distrito ? distrito.dis_descripcion : value;
      },
    },
    { key: 'gru_descripcion', label: 'Descripción', type: 'text', fullWidth: true },
    {
      key: 'gru_vigente',
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
    <GeografiaList
      geografiaType="grupos"
      title="Grupos"
      fields={fields}
      idField="gru_id"
    />
  );
};

export default GruposPage;
