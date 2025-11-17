import React, { useState, useEffect } from 'react';
import GeografiaList from '@/components/geografia/GeografiaList';
import geografiaService from '@/services/geografiaService';

const DistritosPage = () => {
  const [zonas, setZonas] = useState([]);

  useEffect(() => {
    const loadZonas = async () => {
      try {
        const data = await geografiaService.getList('zonas');
        setZonas(data);
      } catch (error) {
        console.error('Error loading zonas:', error);
      }
    };
    loadZonas();
  }, []);

  const fields = [
    {
      key: 'zon_id',
      label: 'Zona',
      type: 'select',
      options: zonas.map((z) => ({ value: z.zon_id, label: z.zon_descripcion })),
      render: (value) => {
        const zona = zonas.find((z) => z.zon_id === value);
        return zona ? zona.zon_descripcion : value;
      },
    },
    { key: 'dis_descripcion', label: 'Descripción', type: 'text', fullWidth: true },
    {
      key: 'dis_vigente',
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
      geografiaType="distritos"
      title="Distritos"
      fields={fields}
      idField="dis_id"
    />
  );
};

export default DistritosPage;
