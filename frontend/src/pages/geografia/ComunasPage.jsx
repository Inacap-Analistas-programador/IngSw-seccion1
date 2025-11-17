import React, { useState, useEffect } from 'react';
import GeografiaList from '@/components/geografia/GeografiaList';
import geografiaService from '@/services/geografiaService';

const ComunasPage = () => {
  const [provincias, setProvincias] = useState([]);

  useEffect(() => {
    const loadProvincias = async () => {
      try {
        const data = await geografiaService.getList('provincias');
        setProvincias(data);
      } catch (error) {
        console.error('Error loading provincias:', error);
      }
    };
    loadProvincias();
  }, []);

  const fields = [
    {
      key: 'pro_id',
      label: 'Provincia',
      type: 'select',
      options: provincias.map((p) => ({ value: p.pro_id, label: p.pro_descripcion })),
      render: (value) => {
        const provincia = provincias.find((p) => p.pro_id === value);
        return provincia ? provincia.pro_descripcion : value;
      },
    },
    { key: 'com_descripcion', label: 'Descripción', type: 'text', fullWidth: true },
    {
      key: 'com_vigente',
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
      geografiaType="comunas"
      title="Comunas"
      fields={fields}
      idField="com_id"
    />
  );
};

export default ComunasPage;
