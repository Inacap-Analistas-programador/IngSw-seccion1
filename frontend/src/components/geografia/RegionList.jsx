import React, { useEffect, useState } from 'react';
import { getRegiones } from '../../services/geografiaService';

const RegionList = () => {
  const [regiones, setRegiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRegiones = async () => {
      try {
        const data = await getRegiones();
        setRegiones(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRegiones();
  }, []);

  if (loading) {
    return <div>Cargando regiones...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h2>Lista de Regiones</h2>
      {regiones.length === 0 ? (
        <p>No hay regiones disponibles.</p>
      ) : (
        <ul>
          {regiones.map((region) => (
            <li key={region.reg_id}>{region.reg_descripcion}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RegionList;
