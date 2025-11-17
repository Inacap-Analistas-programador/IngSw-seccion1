import React, { useState, useEffect } from 'react';
import api from '../../config/api';

const GestionPagos = () => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPagos = async () => {
      try {
        const response = await api.get('/pagos/pagopersonas/');
        // Handle paginated response from Django REST Framework
        const data = response.data;
        const pagosArray = Array.isArray(data) ? data : (data.results || []);
        setPagos(pagosArray);
        setError(null);
      } catch (err) {
        console.error('Error fetching pagos:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPagos();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Cargando pagos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">
          <strong>Advertencia:</strong> No se pudieron cargar los pagos. {error.message}
        </p>
        <p className="text-sm text-yellow-700 mt-2">
          Esto es normal si no hay datos de prueba en la base de datos.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Gestión de Pagos</h2>

      <button className="bg-green-500 text-white px-4 py-2 rounded-md mb-4 hover:bg-green-600 transition-colors">
        Registrar Nuevo Pago
      </button>

      {pagos.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <p className="text-blue-800 font-medium">No hay pagos registrados.</p>
          <p className="text-sm text-blue-600 mt-2">
            Los pagos aparecerán aquí una vez que se registren en el sistema.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">ID Pago</th>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Persona</th>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Curso</th>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Fecha/Hora</th>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Tipo</th>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Valor</th>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Observación</th>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pagos.map((pago) => (
                <tr key={pago.pap_id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{pago.pap_id}</td>
                  <td className="py-2 px-4 border-b">{pago.per_id}</td>
                  <td className="py-2 px-4 border-b">{pago.cur_id}</td>
                  <td className="py-2 px-4 border-b">
                    {new Date(pago.pap_fecha_hora).toLocaleString()}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <span className={`px-2 py-1 rounded text-xs ${pago.pap_tipo === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {pago.pap_tipo === 1 ? 'Ingreso' : 'Egreso'}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b font-medium">${pago.pap_valor}</td>
                  <td className="py-2 px-4 border-b text-sm text-gray-600">{pago.pap_observacion || '-'}</td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex gap-2">
                      <button className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600">
                        Ver
                      </button>
                      <button className="bg-yellow-500 text-white px-2 py-1 rounded text-xs hover:bg-yellow-600">
                        Editar
                      </button>
                      <button className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600">
                        Anular
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GestionPagos;
