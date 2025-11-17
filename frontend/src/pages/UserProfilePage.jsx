import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import authService from '@/services/authService';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendar,
  FaBook,
  FaEdit,
  FaSave,
  FaTimes,
  FaIdCard,
  FaMapMarkerAlt,
  FaArrowLeft,
} from 'react-icons/fa';

const UserProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});
  const [misCursos, setMisCursos] = useState([]);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      // Get current user from auth service
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        navigate('/coordinador/login');
        return;
      }

      // In a real app, fetch from API
      // For now, use mock data
      const mockUser = {
        per_id: 1,
        per_rut: '12345678-9',
        per_nombre: 'Juan',
        per_apellido_paterno: 'Pérez',
        per_apellido_materno: 'González',
        per_correo: currentUser.correo || 'juan.perez@example.com',
        per_celular: '+56 9 1234 5678',
        per_fecha_nacimiento: '1990-01-15',
        per_direccion: 'Av. Principal 123',
        per_ciudad: 'Santiago',
      };

      setUser(mockUser);
      setFormData(mockUser);

      // Mock enrolled courses
      setMisCursos([
        {
          id: 1,
          codigo: 'LID-001',
          nombre: 'Liderazgo y Gestión de Equipos',
          fecha_inscripcion: '2024-01-15',
          estado: 'En curso',
          progreso: 65,
        },
        {
          id: 2,
          codigo: 'COM-003',
          nombre: 'Comunicación Efectiva',
          fecha_inscripcion: '2024-02-01',
          estado: 'Completado',
          progreso: 100,
        },
      ]);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setFormData(user);
    setEditing(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // In a real app, save to API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setUser(formData);
      setEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getEstadoCursoColor = (estado) => {
    const colors = {
      'En curso': 'bg-blue-100 text-blue-800 border-blue-200',
      Completado: 'bg-green-100 text-green-800 border-green-200',
      Pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    };
    return colors[estado] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Mi Perfil - GIC Platform</title>
        <meta name="description" content="Gestiona tu perfil y revisa tus cursos inscritos." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-600 text-white py-8">
          <div className="container mx-auto px-4">
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              className="text-white hover:bg-white/10 mb-4"
            >
              <FaArrowLeft className="mr-2" />
              Volver al inicio
            </Button>
            <h1 className="text-4xl font-bold">Mi Perfil</h1>
            <p className="text-blue-100 mt-2">Gestiona tu información personal y cursos</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <FaUser className="mr-2 text-blue-600" />
                    Información Personal
                  </h2>
                  {!editing ? (
                    <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700">
                      <FaEdit className="mr-2" />
                      Editar
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <FaSave className="mr-2" />
                        {saving ? 'Guardando...' : 'Guardar'}
                      </Button>
                      <Button
                        onClick={handleCancel}
                        disabled={saving}
                        variant="outline"
                        className="border-gray-300"
                      >
                        <FaTimes className="mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FaIdCard className="inline mr-1 text-gray-400" />
                      RUT
                    </label>
                    <input
                      type="text"
                      name="per_rut"
                      value={formData.per_rut || ''}
                      onChange={handleChange}
                      disabled={!editing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FaUser className="inline mr-1 text-gray-400" />
                      Nombre
                    </label>
                    <input
                      type="text"
                      name="per_nombre"
                      value={formData.per_nombre || ''}
                      onChange={handleChange}
                      disabled={!editing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apellido Paterno
                    </label>
                    <input
                      type="text"
                      name="per_apellido_paterno"
                      value={formData.per_apellido_paterno || ''}
                      onChange={handleChange}
                      disabled={!editing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apellido Materno
                    </label>
                    <input
                      type="text"
                      name="per_apellido_materno"
                      value={formData.per_apellido_materno || ''}
                      onChange={handleChange}
                      disabled={!editing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FaEnvelope className="inline mr-1 text-gray-400" />
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      name="per_correo"
                      value={formData.per_correo || ''}
                      onChange={handleChange}
                      disabled={!editing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FaPhone className="inline mr-1 text-gray-400" />
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="per_celular"
                      value={formData.per_celular || ''}
                      onChange={handleChange}
                      disabled={!editing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FaCalendar className="inline mr-1 text-gray-400" />
                      Fecha de Nacimiento
                    </label>
                    <input
                      type="date"
                      name="per_fecha_nacimiento"
                      value={formData.per_fecha_nacimiento || ''}
                      onChange={handleChange}
                      disabled={!editing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FaMapMarkerAlt className="inline mr-1 text-gray-400" />
                      Ciudad
                    </label>
                    <input
                      type="text"
                      name="per_ciudad"
                      value={formData.per_ciudad || ''}
                      onChange={handleChange}
                      disabled={!editing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección
                    </label>
                    <input
                      type="text"
                      name="per_direccion"
                      value={formData.per_direccion || ''}
                      onChange={handleChange}
                      disabled={!editing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Acciones Rápidas</h3>
                <div className="space-y-2">
                  <Button
                    onClick={() => navigate('/cursos')}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <FaBook className="mr-2" />
                    Explorar Cursos
                  </Button>
                  <Button
                    onClick={() => navigate('/preinscripcion')}
                    variant="outline"
                    className="w-full"
                  >
                    Inscribirse en Curso
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Estadísticas</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Cursos Inscritos</span>
                    <span className="font-bold text-blue-600">{misCursos.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Completados</span>
                    <span className="font-bold text-green-600">
                      {misCursos.filter((c) => c.estado === 'Completado').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">En Curso</span>
                    <span className="font-bold text-yellow-600">
                      {misCursos.filter((c) => c.estado === 'En curso').length}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* My Courses Section */}
          <div className="mt-8">
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FaBook className="mr-2 text-blue-600" />
                Mis Cursos
              </h2>

              {misCursos.length === 0 ? (
                <div className="text-center py-12">
                  <FaBook className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No estás inscrito en ningún curso todavía</p>
                  <Button onClick={() => navigate('/cursos')} className="bg-blue-600 hover:bg-blue-700">
                    Explorar Cursos Disponibles
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {misCursos.map((curso) => (
                    <motion.div
                      key={curso.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="text-xs font-mono text-gray-500">{curso.codigo}</span>
                          <h3 className="font-bold text-gray-900">{curso.nombre}</h3>
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getEstadoCursoColor(curso.estado)}`}
                        >
                          {curso.estado}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Inscrito: {new Date(curso.fecha_inscripcion).toLocaleDateString()}
                      </p>
                      {curso.progreso !== undefined && (
                        <div>
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Progreso</span>
                            <span>{curso.progreso}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${curso.progreso}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfilePage;
