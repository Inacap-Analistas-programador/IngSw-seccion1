import React, { useState, useEffect } from 'react';
import GeografiaList from '@/components/geografia/GeografiaList';
import geografiaService from '@/services/geografiaService';

const ProvinciasPage = () => {
  const [regiones, setRegiones] = useState([]);

  useEffect(() => {
    const loadRegiones = async () => {
      try {
        const data = await geografiaService.getList('regiones');
        setRegiones(data);
      } catch (error) {
        console.error('Error loading regiones:', error);
      }
    };
    loadRegiones();
  }, []);

  const fields = [
    {
      key: 'reg_id',
      label: 'Región',
      type: 'select',
      options: regiones.map((r) => ({ value: r.reg_id, label: r.reg_descripcion })),
      render: (value) => {
        const region = regiones.find((r) => r.reg_id === value);
        return region ? region.reg_descripcion : value;
      },
    },
    { key: 'pro_descripcion', label: 'Descripción', type: 'text', fullWidth: true },
    {
      key: 'pro_vigente',
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
      geografiaType="provincias"
      title="Provincias"
      fields={fields}
      idField="pro_id"
    />
  );
};

export default ProvinciasPage;
