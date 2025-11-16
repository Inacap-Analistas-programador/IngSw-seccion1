import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import api from '@/config/api';
import { personasFromApi } from '@/lib/mappers';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Award,
  ChevronLeft,
  Eye,
  Clock,
} from 'lucide-react';
import Card from '@/components/ui/Card';

const PersonasPage = () => {
  const navigate = useNavigate();
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        const response = await api.get('/personas/');
        setPersonas(personasFromApi(response.data));
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchPersonas();
  }, []);

  const handleEditPersona = (id) => {
    navigate(`/personas/editar/${id}`);
  };

  const handleDeletePersona = (id) => {
    // This should be implemented to make an API call to delete the persona
    if (window.confirm('¿Está seguro de que desea eliminar esta persona?')) {
      // TODO: Implement API call to delete persona
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Ocurrió un error: {String(error.message || error)}</div>;
  }

  return (
    <>
      <Helmet>
        <title>Gestión de Personas - Scout Formación</title>
        <meta
          name="description"
          content="Gestión CRUD de personas registradas - Ver, modificar y eliminar registros."
        />
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
                    <User className="w-8 h-8" />
                    <h1 className="text-2xl font-bold">Gestión de Personas</h1>
                  </div>
                  <p className="text-white/80 text-sm mt-1">
                    Ver, modificar y eliminar personas registradas
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Personas List */}
        <div className="container mx-auto px-4 py-6">
          <Card>
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-scout-azul-oscuro">
                Lista de Personas ({personas.length})
              </h2>
            </div>

            {personas.length === 0 ? (
              <div className="p-12 text-center">
                <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay personas registradas
                </h3>
                <p className="text-gray-500 mb-4">
                  Las personas se registran a través del proceso de preinscripción.
                </p>
                <Button
                  onClick={() => navigate('/preinscripcion')}
                  className="bg-scout-azul-medio hover:bg-scout-azul-oscuro"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Ir a Preinscripción
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        RUT
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Correo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Teléfono
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
                    {personas.map((persona, index) => (
                      <motion.tr
                        key={persona.id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {persona.nombres} {persona.apellidoPaterno} {persona.apellidoMaterno}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {persona.rut}-{persona.dv}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 flex items-center">
                            <Mail className="w-4 h-4 mr-2 text-gray-400" />
                            {persona.correo}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <Phone className="w-4 h-4 mr-2 text-gray-400" />
                            {persona.telefono}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              persona.vigente
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {persona.vigente ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditPersona(persona.id)}
                              className="text-scout-azul-medio hover:text-scout-azul-oscuro"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeletePersona(persona.id)}
                              className="text-red-600 hover:text-red-800"
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
          </Card>
        </div>
      </div>
    </>
  );
};

export default PersonasPage;
