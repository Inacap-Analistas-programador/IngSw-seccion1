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
  Award, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  User,
  ChevronLeft,
  BookOpen,
  Clock
} from 'lucide-react';

const MaestrosPage = () => {
  const navigate = useNavigate();
  const [maestros, setMaestros] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMaestros, setFilteredMaestros] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Cargar maestros y personas desde localStorage
  useEffect(() => {
    const storedPersonas = JSON.parse(localStorage.getItem('personas') || '[]');
    const storedFormadores = JSON.parse(localStorage.getItem('formadores') || '[]');
    
    // Combinar datos de personas y formadores
    const maestrosConDatos = storedFormadores.map(formador => {
      const persona = storedPersonas.find(p => p.id === formador.personaId);
      return {
        ...formador,
        ...persona,
        formadorId: formador.id
      };
    }).filter(maestro => maestro.nombres); // Filtrar solo los que tienen datos de persona válidos
    
    setPersonas(storedPersonas);
    setMaestros(maestrosConDatos);
    setFilteredMaestros(maestrosConDatos);
  }, []);

  // Filtrar maestros por término de búsqueda
  useEffect(() => {
    const filtered = maestros.filter(maestro =>
      `${maestro.nombres} ${maestro.apellidoPaterno} ${maestro.apellidoMaterno}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      maestro.rut?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      maestro.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      maestro.profesion?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMaestros(filtered);
  }, [searchTerm, maestros]);

  const handleEditMaestro = (id) => {
    navigate(`/maestros/edit/${id}`);
  };

  const handleDeleteMaestro = (formadorId, personaId) => {
    if (window.confirm('¿Está seguro de que desea eliminar este maestro/formador?')) {
      // Eliminar de la lista de formadores
      const formadores = JSON.parse(localStorage.getItem('formadores') || '[]');
      const updatedFormadores = formadores.filter(f => f.id !== formadorId);
      localStorage.setItem('formadores', JSON.stringify(updatedFormadores));
      
      // Actualizar persona para quitar el flag de formador
      const personas = JSON.parse(localStorage.getItem('personas') || '[]');
      const updatedPersonas = personas.map(p => 
        p.id === personaId ? { ...p, esFormador: false } : p
      );
      localStorage.setItem('personas', JSON.stringify(updatedPersonas));
      
      // Actualizar estado local
      const updatedMaestros = maestros.filter(m => m.formadorId !== formadorId);
      setMaestros(updatedMaestros);
    }
  };

  const getEstadoFormador = (maestro) => {
    const habilitaciones = [maestro.habilitacion1, maestro.habilitacion2].filter(Boolean).length;
    
    if (maestro.verificacion && habilitaciones >= 2) {
      return { estado: 'Completo', color: 'green' };
    } else if (maestro.verificacion || habilitaciones >= 1) {
      return { estado: 'En proceso', color: 'yellow' };
    } else {
      return { estado: 'Inicial', color: 'red' };
    }
  };

  return (
    <>
      <Helmet>
        <title>Gestión de Maestros/Formadores - Scout Formación</title>
        <meta name="description" content="Administración de maestros y formadores Scout." />
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
                  <Award className="w-8 h-8" />
                  <h1 className="text-2xl font-bold">Gestión de Maestros/Formadores</h1>
                </div>
              </div>
              <Button 
                onClick={() => navigate('/maestros/create')}
                className="bg-white text-scout-azul-oscuro hover:bg-scout-azul-muy-claro"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nuevo Formador
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
                  placeholder="Buscar por nombre, RUT, email o profesión..."
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <select className="input-scout">
                    <option value="">Todas las habilitaciones</option>
                    <option value="hab1">Con Habilitación 1</option>
                    <option value="hab2">Con Habilitación 2</option>
                    <option value="ambas">Con ambas habilitaciones</option>
                  </select>
                  <select className="input-scout">
                    <option value="">Estado de verificación</option>
                    <option value="verificado">Verificado</option>
                    <option value="no-verificado">No verificado</option>
                  </select>
                  <select className="input-scout">
                    <option value="">Todas las profesiones</option>
                    <option value="profesor">Profesor</option>
                    <option value="ingeniero">Ingeniero</option>
                    <option value="medico">Médico</option>
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-scout-azul-muy-claro rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-scout-azul-medio" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Formadores</p>
                  <p className="text-2xl font-bold text-scout-azul-oscuro">{maestros.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Verificados</p>
                  <p className="text-2xl font-bold text-scout-azul-oscuro">
                    {maestros.filter(m => m.verificacion).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Con Hab. 1</p>
                  <p className="text-2xl font-bold text-scout-azul-oscuro">
                    {maestros.filter(m => m.habilitacion1).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Con Hab. 2</p>
                  <p className="text-2xl font-bold text-scout-azul-oscuro">
                    {maestros.filter(m => m.habilitacion2).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">En proceso</p>
                  <p className="text-2xl font-bold text-scout-azul-oscuro">
                    {maestros.filter(m => {
                      const { estado } = getEstadoFormador(m);
                      return estado === 'En proceso';
                    }).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Maestros List */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-scout-azul-oscuro">
                Lista de Formadores ({filteredMaestros.length})
              </h2>
            </div>
            
            {filteredMaestros.length === 0 ? (
              <div className="p-12 text-center">
                <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {maestros.length === 0 ? 'No hay formadores registrados' : 'No se encontraron formadores'}
                </h3>
                <p className="text-gray-500 mb-4">
                  {maestros.length === 0 
                    ? 'Comienza agregando el primer formador al sistema.' 
                    : 'Intenta cambiar los criterios de búsqueda.'}
                </p>
                {maestros.length === 0 && (
                  <Button 
                    onClick={() => navigate('/maestros/create')}
                    className="bg-scout-azul-medio hover:bg-scout-azul-oscuro"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Agregar Primer Formador
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Formador
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contacto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Habilitaciones
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Experiencia
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredMaestros.map((maestro, index) => {
                      const estadoFormador = getEstadoFormador(maestro);
                      
                      return (
                        <motion.tr 
                          key={maestro.formadorId || index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-scout-azul-muy-claro rounded-full flex items-center justify-center">
                                <Award className="w-5 h-5 text-scout-azul-medio" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {maestro.nombres} {maestro.apellidoPaterno} {maestro.apellidoMaterno}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {maestro.rut}-{maestro.dv}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {maestro.profesion || 'Sin profesión especificada'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 flex items-center">
                              <Mail className="w-4 h-4 mr-2 text-gray-400" />
                              {maestro.email}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center mt-1">
                              <Phone className="w-4 h-4 mr-2 text-gray-400" />
                              {maestro.telefono}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col space-y-1">
                              <div className="flex items-center">
                                {maestro.habilitacion1 ? (
                                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-red-500 mr-2" />
                                )}
                                <span className="text-sm">Habilitación 1</span>
                              </div>
                              <div className="flex items-center">
                                {maestro.habilitacion2 ? (
                                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-red-500 mr-2" />
                                )}
                                <span className="text-sm">Habilitación 2</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col space-y-2">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                estadoFormador.color === 'green' ? 'bg-green-100 text-green-800' :
                                estadoFormador.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {estadoFormador.estado}
                              </span>
                              <div className="flex items-center">
                                {maestro.verificacion ? (
                                  <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-red-500 mr-1" />
                                )}
                                <span className="text-xs text-gray-600">
                                  {maestro.verificacion ? 'Verificado' : 'No verificado'}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              <div className="flex items-center mb-1">
                                <Clock className="w-4 h-4 mr-2 text-gray-400" />
                                <span>NNAJ: {maestro.tiempoNNAJ || 'No especificado'}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2 text-gray-400" />
                                <span>Adultos: {maestro.tiempoAdulto || 'No especificado'}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditMaestro(maestro.id)}
                                className="text-scout-azul-medio hover:text-scout-azul-oscuro"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteMaestro(maestro.formadorId, maestro.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
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

export default MaestrosPage;