import React, { useState, useEffect } from 'react';
import api from '../config/api';

function TestPage() {
  const [regiones, setRegiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRegiones = async () => {
      try {
        const response = await api.get('/maestros/regiones/');
        setRegiones(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchRegiones();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Ocurrió un error: {String(error.message || error)}</div>;
  }

  return (
    <div>
      <h1>Regiones de Chile</h1>
      <ul>
        {regiones.map((region) => (
          <li key={region.reg_id}>{region.reg_descripcion}</li>
        ))}
      </ul>
    </div>
  );
}

export default TestPage;
