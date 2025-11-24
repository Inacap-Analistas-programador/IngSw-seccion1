import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import api from '@/config/api';
import { proveedoresFromApi } from '@/lib/mappers';
import { ChevronLeft, Truck, Plus, Edit, Trash2, Eye, Ban, CheckCircle } from 'lucide-react';

const ProveedoresPage = () => {
  const navigate = useNavigate();
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleDeleteProveedor = async (id) => {
    if (!window.confirm('¿ESTÁ SEGURO DE QUE DESEA ELIMINAR ESTE PROVEEDOR? ESTA ACCIÓN NO SE PUEDE DESHACER.')) return;

    try {
      await api.delete(`/proveedores/${id}/`);
      setProveedores((prev) => prev.filter((p) => p.id !== id));
      // sync localStorage fallback
      const proveedoresLocal = JSON.parse(localStorage.getItem('proveedores') || '[]');
      const filtered = proveedoresLocal.filter((p) => p.id !== id);
      localStorage.setItem('proveedores', JSON.stringify(filtered));
    } catch (err) {
      console.warn('Error eliminando proveedor en API, actualizando localStorage', err);
      const errorMessage = err.response?.data?.message || err.message || '';
      const isCascadeError = errorMessage.includes('referencia') || 
                            errorMessage.includes('relacionado') || 
                            errorMessage.includes('constraint') ||
                            errorMessage.includes('foreign key');
      
      if (isCascadeError) {
        alert('NO SE PUEDE ELIMINAR EL PROVEEDOR PORQUE ESTÁ SIENDO UTILIZADO EN OTROS REGISTROS DEL SISTEMA.');
        return;
      }
      // fallback
      const proveedoresLocal = JSON.parse(localStorage.getItem('proveedores') || '[]');
      const filtered = proveedoresLocal.filter((p) => p.id !== id);
      localStorage.setItem('proveedores', JSON.stringify(filtered));
      setProveedores(filtered);
    }
  };

  const handleToggleStatus = async (proveedor) => {
    const newStatus = !proveedor.vigente;
    const actionText = newStatus ? 'ACTIVAR' : 'ANULAR';
    
    if (!window.confirm(`¿ESTÁ SEGURO DE QUE DESEA ${actionText} ESTE PROVEEDOR? ESTA ACCIÓN NO SE PUEDE DESHACER.`)) {
      return;
    }

    try {
      await api.patch(`/proveedores/${proveedor.id}/`, { vigente: newStatus });
      setProveedores((prev) =>
        prev.map((p) => (p.id === proveedor.id ? { ...p, vigente: newStatus } : p))
      );
    } catch (err) {
      console.warn('Error actualizando proveedor en API', err);
      alert(`ERROR AL ${actionText} EL PROVEEDOR. POR FAVOR, INTENTA NUEVAMENTE.`);
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
    return <div>CARGANDO...</div>;
  }

  if (error) {
    return <div>OCURRIÓ UN ERROR: {String(error.message || error)}</div>;
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
                  VOLVER
                </Button>
                <div>
                  <div className="flex items-center space-x-3">
                    <Truck className="w-8 h-8" />
                    <h1 className="text-2xl font-bold">GESTIÓN DE PROVEEDORES</h1>
                  </div>
                  <p className="text-white/80 text-sm mt-1">VER Y MODIFICAR PROVEEDORES</p>
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
                  LISTA DE PROVEEDORES ({proveedores.length})
                </h1>
                <p className="text-muted-foreground mt-1">
                  VER Y ADMINISTRAR PROVEEDORES REGISTRADOS
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="default" onClick={() => navigate('/proveedores/nuevo')}>
                  <Plus className="w-5 h-5 mr-2" />
                  NUEVO PROVEEDOR
                </Button>
              </div>
            </div>

            {proveedores.length === 0 ? (
              <div className="p-12 text-center">
                <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  NO HAY PROVEEDORES REGISTRADOS
                </h3>
                <Button
                  onClick={() => navigate('/proveedores/nuevo')}
                  className="bg-scout-azul-medio hover:bg-scout-azul-oscuro"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  AGREGAR PROVEEDOR
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        DESCRIPCIÓN
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        CELULAR 1
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        DIRECCIÓN
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ESTADO
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ACCIONES
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
                            {proveedor.vigente ? 'ACTIVO' : 'INACTIVO'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/proveedores/ver/${proveedor.id}`)}
                              title="VER"
                              className="text-gray-600 hover:text-gray-700 hover:bg-gray-100"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/proveedores/editar/${proveedor.id}`)}
                              title="EDITAR"
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleStatus(proveedor)}
                              title={proveedor.vigente ? 'ANULAR' : 'ACTIVAR'}
                              className={proveedor.vigente 
                                ? 'text-red-600 hover:text-red-700 hover:bg-red-50' 
                                : 'text-green-600 hover:text-green-700 hover:bg-green-50'}
                            >
                              {proveedor.vigente ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
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
