import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
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
  ChevronLeft
} from 'lucide-react';

const PersonasPage = () => {
  const navigate = useNavigate();
  const [personas, setPersonas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPersonas, setFilteredPersonas] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Cargar personas desde localStorage (simulación)
  useEffect(() => {
    const storedPersonas = JSON.parse(localStorage.getItem('personas') || '[]');
    setPersonas(storedPersonas);
    setFilteredPersonas(storedPersonas);
  }, []);

  // Filtrar personas por término de búsqueda
  useEffect(() => {
    const filtered = personas.filter(persona =>
      `${persona.nombres} ${persona.apellidoPaterno} ${persona.apellidoMaterno}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      persona.rut?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      persona.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPersonas(filtered);
  }, [searchTerm, personas]);

  const handleEditPersona = (id) => {
    navigate(`/personas/edit/${id}`);
  };

  const handleDeletePersona = (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta persona?')) {
      const updatedPersonas = personas.filter(p => p.id !== id);
      setPersonas(updatedPersonas);
      localStorage.setItem('personas', JSON.stringify(updatedPersonas));
    }
  };

  return (
    <>
      <Helmet>
        <title>Gestión de Personas - Scout Formación</title>
        <meta name="description" content="Administración de personas registradas en el sistema Scout." />
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
                <div className="flex items-center space-x-3">
                  <User className="w-8 h-8" />
                  <h1 className="text-2xl font-bold">Gestión de Personas</h1>
                </div>
              </div>
              <Button 
                onClick={() => navigate('/personas/create')}
                className="bg-white text-scout-azul-oscuro hover:bg-scout-azul-muy-claro"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nueva Persona
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, RUT o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-scout-azul-medio focus:border-scout-azul-medio transition-colors"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="border-scout-azul-medio text-scout-azul-medio hover:bg-scout-azul-muy-claro"
              >
                <Filter className="w-5 h-5 mr-2" />
                Filtros
              </Button>
            </div>

            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <select className="input-scout">
                    <option value="">Todas las comunas</option>
                    <option value="santiago">Santiago</option>
                    <option value="providencia">Providencia</option>
                    <option value="las-condes">Las Condes</option>
                  </select>
                  <select className="input-scout">
                    <option value="">Todos los estados civiles</option>
                    <option value="soltero">Soltero/a</option>
                    <option value="casado">Casado/a</option>
                    <option value="divorciado">Divorciado/a</option>
                  </select>
                  <select className="input-scout">
                    <option value="">Estado</option>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              </motion.div>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-scout-azul-muy-claro rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-scout-azul-medio" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Personas</p>
                  <p className="text-2xl font-bold text-scout-azul-oscuro">{personas.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Formadores</p>
                  <p className="text-2xl font-bold text-scout-azul-oscuro">
                    {personas.filter(p => p.esFormador).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Nuevos este mes</p>
                  <p className="text-2xl font-bold text-scout-azul-oscuro">
                    {personas.filter(p => {
                      const fechaCreacion = new Date(p.fechaCreacion);
                      const ahora = new Date();
                      return fechaCreacion.getMonth() === ahora.getMonth() && 
                             fechaCreacion.getFullYear() === ahora.getFullYear();
                    }).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Activos</p>
                  <p className="text-2xl font-bold text-scout-azul-oscuro">
                    {personas.filter(p => p.vigente).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Personas List */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-scout-azul-oscuro">
                Lista de Personas ({filteredPersonas.length})
              </h2>
            </div>
            
            {filteredPersonas.length === 0 ? (
              <div className="p-12 text-center">
                <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay personas registradas</h3>
                <p className="text-gray-500 mb-4">Comienza agregando la primera persona al sistema.</p>
                <Button 
                  onClick={() => navigate('/personas/create')}
                  className="bg-scout-azul-medio hover:bg-scout-azul-oscuro"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Agregar Primera Persona
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Persona
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contacto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Información
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
                    {filteredPersonas.map((persona, index) => (
                      <motion.tr 
                        key={persona.id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-scout-azul-muy-claro rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-scout-azul-medio" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {persona.nombres} {persona.apellidoPaterno} {persona.apellidoMaterno}
                              </div>
                              <div className="text-sm text-gray-500">
                                {persona.rut}-{persona.dv}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 flex items-center">
                            <Mail className="w-4 h-4 mr-2 text-gray-400" />
                            {persona.email}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <Phone className="w-4 h-4 mr-2 text-gray-400" />
                            {persona.telefono}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {persona.profesion || 'No especificada'}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                            {persona.comuna || 'No especificada'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            persona.vigente ? 
                            'bg-green-100 text-green-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {persona.vigente ? 'Activo' : 'Inactivo'}
                          </span>
                          {persona.esFormador && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 ml-2">
                              Formador
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditPersona(persona.id)}
                              className="text-scout-azul-medio hover:text-scout-azul-oscuro"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeletePersona(persona.id)}
                              className="text-red-600 hover:text-red-800"
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

export default PersonasPage;