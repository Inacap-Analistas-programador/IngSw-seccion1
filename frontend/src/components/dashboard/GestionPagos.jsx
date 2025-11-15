import { useState, useEffect } from 'react';
import api from '../../config/api'; // Asegúrate de que la ruta sea correcta

const GestionPagos = () => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPagos = async () => {
      try {
        const response = await api.get('/pagopersonas/');
        setPagos(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPagos();
  }, []);

  if (loading) return <p>Cargando pagos...</p>;
  if (error) return <p>Error al cargar pagos: {error.message}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Gestión de Pagos</h2>

      <button className="bg-green-500 text-white px-4 py-2 rounded-md mb-4">
        Registrar Nuevo Pago
      </button>

      {pagos.length === 0 ? (
        <p>No hay pagos registrados.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">ID Pago</th>
                <th className="py-2 px-4 border-b">Persona</th>
                <th className="py-2 px-4 border-b">Curso</th>
                <th className="py-2 px-4 border-b">Fecha/Hora</th>
                <th className="py-2 px-4 border-b">Tipo</th>
                <th className="py-2 px-4 border-b">Valor</th>
                <th className="py-2 px-4 border-b">Observación</th>
                <th className="py-2 px-4 border-b">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pagos.map((pago) => (
                <tr key={pago.pap_id}>
                  <td className="py-2 px-4 border-b">{pago.pap_id}</td>
                  <td className="py-2 px-4 border-b">{pago.per_id}</td>{' '}
                  {/* Esto mostrará el ID de la persona, luego lo mejoraremos */}
                  <td className="py-2 px-4 border-b">{pago.cur_id}</td>{' '}
                  {/* Esto mostrará el ID del curso, luego lo mejoraremos */}
                  <td className="py-2 px-4 border-b">
                    {new Date(pago.pap_fecha_hora).toLocaleString()}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {pago.pap_tipo === 1 ? 'Ingreso' : 'Egreso'}
                  </td>
                  <td className="py-2 px-4 border-b">{pago.pap_valor}</td>
                  <td className="py-2 px-4 border-b">{pago.pap_observacion || '-'}</td>
                  <td className="py-2 px-4 border-b">
                    <button className="bg-blue-500 text-white px-2 py-1 rounded-md mr-2">
                      Ver
                    </button>
                    <button className="bg-yellow-500 text-white px-2 py-1 rounded-md mr-2">
                      Editar
                    </button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded-md">Anular</button>
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
