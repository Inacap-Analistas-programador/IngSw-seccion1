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
      label: 'REGIÓN',
      type: 'select',
      options: regiones.map((r) => ({ value: r.reg_id, label: r.reg_descripcion })),
      render: (value) => {
        const region = regiones.find((r) => r.reg_id === value);
        return region ? region.reg_descripcion : value;
      },
    },
    { key: 'pro_descripcion', label: 'DESCRIPCIÓN', type: 'text', fullWidth: true },
  ];

  return (
    <GeografiaList
      geografiaType="provincias"
      title="PROVINCIAS"
      fields={fields}
      idField="pro_id"
      statusField="pro_vigente"
    />
  );
};

export default ProvinciasPage;
