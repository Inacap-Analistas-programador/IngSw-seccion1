import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import api from '@/config/api';
import { proveedoresFromApi } from '@/lib/mappers';
import { ChevronLeft, Truck, Plus, Edit, Trash2 } from 'lucide-react';

const ProveedoresPage = () => {
  const navigate = useNavigate();
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleDeleteProveedor = async (id) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este proveedor?')) return;

    try {
      await api.delete(`/proveedores/${id}/`);
      setProveedores((prev) => prev.filter((p) => p.id !== id));
      // sync localStorage fallback
      const proveedoresLocal = JSON.parse(localStorage.getItem('proveedores') || '[]');
      const filtered = proveedoresLocal.filter((p) => p.id !== id);
      localStorage.setItem('proveedores', JSON.stringify(filtered));
    } catch (err) {
      console.warn('Error eliminando proveedor en API, actualizando localStorage', err);
      // fallback
      const proveedoresLocal = JSON.parse(localStorage.getItem('proveedores') || '[]');
      const filtered = proveedoresLocal.filter((p) => p.id !== id);
      localStorage.setItem('proveedores', JSON.stringify(filtered));
      setProveedores(filtered);
    }
  };

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await api.get('/proveedores/');
        setProveedores(proveedoresFromApi(response.data));
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchProveedores();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Ocurrió un error: {String(error.message || error)}</div>;
  }

  return (
    <>
      <Helmet>
        <title>Gestión de Proveedores - Scout Formación</title>
        <meta name="description" content="Gestión de proveedores." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-scout-azul-oscuro text-white shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/dashboard')}
                  className="text-white hover:bg-scout-azul-medio"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Volver
                </Button>
                <div>
                  <div className="flex items-center space-x-3">
                    <Truck className="w-8 h-8" />
                    <h1 className="text-2xl font-bold">Gestión de Proveedores</h1>
                  </div>
                  <p className="text-white/80 text-sm mt-1">Ver y modificar proveedores</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Proveedores List */}
        <div className="container mx-auto px-4 py-6">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Lista de Proveedores ({proveedores.length})
                </h1>
                <p className="text-muted-foreground mt-1">
                  Ver y administrar proveedores registrados
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="default" onClick={() => navigate('/proveedores/nuevo')}>
                  <Plus className="w-5 h-5 mr-2" />
                  Nuevo Proveedor
                </Button>
              </div>
            </div>

            {proveedores.length === 0 ? (
              <div className="p-12 text-center">
                <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay proveedores registrados
                </h3>
                <Button
                  onClick={() => navigate('/proveedores/nuevo')}
                  className="bg-scout-azul-medio hover:bg-scout-azul-oscuro"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Agregar Proveedor
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descripción
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Celular 1
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dirección
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {proveedores.map((proveedor, index) => (
                      <motion.tr
                        key={proveedor.id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {proveedor.descripcion}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{proveedor.celular1}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{proveedor.direccion}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              proveedor.vigente
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {proveedor.vigente ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/proveedores/editar/${proveedor.id}`)}
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteProveedor(proveedor.id)}
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProveedoresPage;
