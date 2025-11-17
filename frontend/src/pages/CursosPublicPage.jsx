import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import cursosService from '@/services/cursosService';
import {
  FaCalendar,
  FaMapMarkerAlt,
  FaClock,
  FaDollarSign,
  FaUsers,
  FaBook,
  FaArrowRight,
  FaFilter,
  FaSearch,
} from 'react-icons/fa';

const CursosPublicPage = () => {
  const navigate = useNavigate();
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalidadFilter, setModalidadFilter] = useState('all');

  useEffect(() => {
    fetchCursos();
  }, []);

  const fetchCursos = async () => {
    try {
      setLoading(true);
      const response = await cursosService.getAll();
      setCursos(response.data || response);
      setError(null);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('No se pudieron cargar los cursos. Por favor, intenta más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const getModalidadLabel = (modalidad) => {
    const modalidades = {
      1: 'Presencial',
      2: 'Online',
      3: 'Híbrido',
    };
    return modalidades[modalidad] || 'Modalidad no especificada';
  };

  const getModalidadColor = (modalidad) => {
    const colors = {
      1: 'bg-blue-100 text-blue-800',
      2: 'bg-green-100 text-green-800',
      3: 'bg-purple-100 text-purple-800',
    };
    return colors[modalidad] || 'bg-gray-100 text-gray-800';
  };

  const getEstadoLabel = (estado) => {
    const estados = {
      1: 'Activo',
      2: 'Inscripción abierta',
      3: 'Finalizado',
      4: 'Cancelado',
    };
    return estados[estado] || 'Estado desconocido';
  };

  const getEstadoColor = (estado) => {
    const colors = {
      1: 'bg-green-100 text-green-800 border-green-200',
      2: 'bg-blue-100 text-blue-800 border-blue-200',
      3: 'bg-gray-100 text-gray-800 border-gray-200',
      4: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[estado] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const filteredCursos = cursos.filter((curso) => {
    const matchesSearch =
      curso.cur_descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      curso.cur_codigo?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModalidad =
      modalidadFilter === 'all' || curso.cur_modalidad === parseInt(modalidadFilter);
    return matchesSearch && matchesModalidad;
  });

  const handleInscribirse = (cursoId) => {
    navigate(`/preinscripcion?curso=${cursoId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando cursos...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Cursos Disponibles - GIC Platform</title>
        <meta
          name="description"
          content="Explora nuestros cursos disponibles y encuentra la capacitación perfecta para ti."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-600 text-white py-12">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold mb-2">Cursos Disponibles</h1>
                  <p className="text-blue-100 text-lg">
                    Encuentra el curso perfecto para desarrollar tus habilidades
                  </p>
                </div>
                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="bg-white/10 text-white border-white/30 hover:bg-white/20"
                >
                  Volver al inicio
                </Button>
              </div>

              {/* Search and Filters */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
                    <input
                      type="text"
                      placeholder="Buscar cursos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                  </div>
                  <div className="relative">
                    <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
                    <select
                      value={modalidadFilter}
                      onChange={(e) => setModalidadFilter(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                    >
                      <option value="all">Todas las modalidades</option>
                      <option value="1">Presencial</option>
                      <option value="2">Online</option>
                      <option value="3">Híbrido</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="container mx-auto px-4 py-12">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {filteredCursos.length === 0 && !error && (
            <div className="text-center py-16">
              <FaBook className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                No se encontraron cursos
              </h3>
              <p className="text-gray-500">
                {searchTerm || modalidadFilter !== 'all'
                  ? 'Intenta ajustar tus filtros de búsqueda'
                  : 'Pronto habrá nuevos cursos disponibles'}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCursos.map((curso, index) => (
              <motion.div
                key={curso.cur_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                {/* Course Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-mono opacity-90">{curso.cur_codigo}</span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getEstadoColor(curso.cur_estado)}`}
                    >
                      {getEstadoLabel(curso.cur_estado)}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold">{curso.cur_descripcion}</h3>
                </div>

                {/* Course Details */}
                <div className="p-6 space-y-3">
                  <div className="flex items-start">
                    <FaMapMarkerAlt className="w-4 h-4 text-gray-400 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{curso.cur_lugar}</span>
                  </div>

                  <div className="flex items-center">
                    <FaClock className="w-4 h-4 text-gray-400 mr-2" />
                    <span
                      className={`text-xs px-2 py-1 rounded ${getModalidadColor(curso.cur_modalidad)}`}
                    >
                      {getModalidadLabel(curso.cur_modalidad)}
                    </span>
                  </div>

                  {curso.cur_observacion && (
                    <p className="text-sm text-gray-500 line-clamp-2">{curso.cur_observacion}</p>
                  )}

                  {/* Pricing */}
                  <div className="border-t pt-3 mt-3">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Con almuerzo:</span>
                      <span className="font-bold text-blue-600">
                        ${parseInt(curso.cur_cuota_con_almuerzo).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Sin almuerzo:</span>
                      <span className="font-bold text-blue-600">
                        ${parseInt(curso.cur_cuota_sin_almuerzo).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => handleInscribirse(curso.cur_id)}
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={curso.cur_estado === 3 || curso.cur_estado === 4}
                  >
                    {curso.cur_estado === 3 ? (
                      'Curso Finalizado'
                    ) : curso.cur_estado === 4 ? (
                      'Curso Cancelado'
                    ) : (
                      <>
                        Inscribirse
                        <FaArrowRight className="ml-2 inline" />
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CursosPublicPage;
