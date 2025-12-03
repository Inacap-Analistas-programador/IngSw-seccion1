import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import {
  X, Calendar, MapPin, Settings, Filter, Eye, Edit2,
  Plus, Search, Loader2, AlertCircle
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import CascadingGeographySelector from './CascadingGeographySelector';
import CourseTypeSelector from './CourseTypeSelector';
import CourseModalitySelector from './CourseModalitySelector';

const Cursos = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    estado: '',
    modalidad: '',
    tipoCurso: '',
  });
  const [errors, setErrors] = useState({});

  const [courseData, setCourseData] = useState({
    codigo: '',
    descripcion: '',
    fechaHora: new Date().toISOString().slice(0, 16), // Auto-fill with current date/time
    fechaSolicitud: new Date().toISOString().slice(0, 16), // Auto-fill
    lugar: '',
    coordLatitud: '',
    coordLongitud: '',
    cuotaConAlmuerzo: '',
    cuotaSinAlmuerzo: '',
    modalidad: '',
    tipoCurso: '',
    estado: 'pendiente',
    observacion: '',
    responsableId: '',
    cargoResponsableId: '',
    regionId: '', // New
    provinciaId: '', // New
    comunaId: '',
    administra: '1',
    fechas: [],
    secciones: [],
    coordinadores: [],
    formadores: [],
    alimentacionRegistrada: false,
    directoresFormadoresCompleto: false,
    pagosPendientes: false,
    totalFormadoresPorSeccion: {},
    alimentacion: [],
  });

  const handleInputChange = (field, value) => {
    setCourseData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Limpiar error del campo al modificarlo
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Funciones para manejar fechas múltiples
  const handleAddFecha = () => {
    setCourseData((prev) => ({
      ...prev,
      fechas: [
        ...prev.fechas,
        {
          fecha_inicio: '',
          fecha_termino: '',
          tipo: '1', // 1: Presencial, 2: Online, 3: Híbrido
        },
      ],
    }));
  };

  const handleRemoveFecha = (index) => {
    setCourseData((prev) => ({
      ...prev,
      fechas: prev.fechas.filter((_, i) => i !== index),
    }));
  };

  const handleFechaChange = (index, field, value) => {
    setCourseData((prev) => ({
      ...prev,
      fechas: prev.fechas.map((fecha, i) =>
        i === index ? { ...fecha, [field]: value } : fecha
      ),
    }));
  };

  const validateCourseData = () => {
    const newErrors = {};

    if (!courseData.codigo.trim()) newErrors.codigo = 'El código es obligatorio';
    if (!courseData.fechaHora) newErrors.fechaHora = 'La fecha y hora es obligatoria';
    if (!courseData.fechaSolicitud)
      newErrors.fechaSolicitud = 'La fecha de solicitud es obligatoria';
    if (!courseData.modalidad) newErrors.modalidad = 'La modalidad es obligatoria';
    if (!courseData.tipoCurso) newErrors.tipoCurso = 'El tipo de curso es obligatorio';
    if (!courseData.responsableId) newErrors.responsableId = 'El responsable es obligatorio';
    if (!courseData.cargoResponsableId)
      newErrors.cargoResponsableId = 'El cargo del responsable es obligatorio';
    if (!courseData.comunaId) newErrors.comunaId = 'La comuna es obligatoria';
    if (!courseData.administra) newErrors.administra = 'El tipo de administración es obligatorio';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateCourse = () => {
    if (!validateCourseData()) {
      toast({
        title: 'Error de validación',
        description: 'Por favor completa todos los campos obligatorios',
        variant: 'destructive',
      });
      return;
    }

    // Crear nuevo curso con ID único
    const newCourse = {
      id: courses.length + 1,
      codigo: courseData.codigo,
      descripcion: courseData.descripcion,
      fechaHora: courseData.fechaHora,
      lugar: courseData.lugar,
      estado: courseData.estado,
      modalidad: courseData.modalidad,
      tipoCurso: courseData.tipoCurso,
      cuotaConAlmuerzo: parseFloat(courseData.cuotaConAlmuerzo) || 0,
      cuotaSinAlmuerzo: parseFloat(courseData.cuotaSinAlmuerzo) || 0,
      responsable: getResponsableName(courseData.responsableId),
      cargo: getCargoName(courseData.cargoResponsableId),
      observacion: courseData.observacion,
      fechaSolicitud: courseData.fechaSolicitud,
      coordLatitud: courseData.coordLatitud,
      coordLongitud: courseData.coordLongitud,
      comunaId: courseData.comunaId,
      fechas: courseData.fechas, // Incluir fechas múltiples
      secciones: courseData.secciones, // Incluir secciones
      coordinadores: courseData.coordinadores, // Incluir coordinadores
      formadores: courseData.formadores, // Incluir formadores
      alimentacionRegistrada: courseData.alimentacionRegistrada,
      directoresFormadoresCompleto: courseData.directoresFormadoresCompleto,
      pagosPendientes: courseData.pagosPendientes,
      totalFormadoresPorSeccion: courseData.totalFormadoresPorSeccion,
      alimentacion: courseData.alimentacion,
    };

    // Agregar el nuevo curso a la lista
    setCourses((prev) => [...prev, newCourse]);

    // Limpiar formulario y cerrar modal
    setShowCreateForm(false);
    resetForm();
    toast({
      title: 'Curso creado',
      description: 'El curso se ha creado exitosamente',
      variant: 'default',
    });
  };

  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setShowViewModal(true);
  };

  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setCourseData({
      codigo: course.codigo,
      descripcion: course.descripcion,
      fechaHora: course.fechaHora,
      fechaSolicitud: course.fechaSolicitud,
      lugar: course.lugar,
      coordLatitud: course.coordLatitud,
      coordLongitud: course.coordLongitud,
      cuotaConAlmuerzo: course.cuotaConAlmuerzo.toString(),
      cuotaSinAlmuerzo: course.cuotaSinAlmuerzo.toString(),
      modalidad: course.modalidad,
      tipoCurso: course.tipoCurso,
      estado: course.estado,
      observacion: course.observacion,
      responsableId: getIdFromName(course.responsable, 'responsable'),
      cargoResponsableId: getIdFromName(course.cargo, 'cargo'),
      comunaId: course.comunaId,
      administra: '1',
      fechas: course.fechas || [], // Incluir fechas existentes
      secciones: course.secciones || [], // Incluir secciones existentes
      coordinadores: course.coordinadores || [], // Incluir coordinadores existentes
      formadores: course.formadores || [], // Incluir formadores existentes
      alimentacionRegistrada: course.alimentacionRegistrada || false,
      directoresFormadoresCompleto: course.directoresFormadoresCompleto || false,
      pagosPendientes: course.pagosPendientes || false,
      totalFormadoresPorSeccion: course.totalFormadoresPorSeccion || {},
      alimentacion: course.alimentacion || [],
    });
    setShowEditForm(true);
  };

  const handleUpdateCourse = () => {
    if (!validateCourseData()) {
      toast({
        title: 'Error de validación',
        description: 'Por favor completa todos los campos obligatorios',
        variant: 'destructive',
      });
      return;
    }

    const updatedCourse = {
      ...selectedCourse,
      codigo: courseData.codigo,
      descripcion: courseData.descripcion,
      fechaHora: courseData.fechaHora,
      lugar: courseData.lugar,
      estado: courseData.estado,
      modalidad: courseData.modalidad,
      tipoCurso: courseData.tipoCurso,
      cuotaConAlmuerzo: parseFloat(courseData.cuotaConAlmuerzo) || 0,
      cuotaSinAlmuerzo: parseFloat(courseData.cuotaSinAlmuerzo) || 0,
      responsable: getResponsableName(courseData.responsableId),
      cargo: getCargoName(courseData.cargoResponsableId),
      observacion: courseData.observacion,
      fechaSolicitud: courseData.fechaSolicitud,
      coordLatitud: courseData.coordLatitud,
      coordLongitud: courseData.coordLongitud,
      comunaId: courseData.comunaId,
      fechas: courseData.fechas, // Incluir fechas actualizadas
      secciones: courseData.secciones, // Incluir secciones actualizadas
      coordinadores: courseData.coordinadores, // Incluir coordinadores actualizados
      formadores: courseData.formadores, // Incluir formadores actualizados
      alimentacionRegistrada: courseData.alimentacionRegistrada,
      directoresFormadoresCompleto: courseData.directoresFormadoresCompleto,
      pagosPendientes: courseData.pagosPendientes,
      totalFormadoresPorSeccion: courseData.totalFormadoresPorSeccion,
      alimentacion: courseData.alimentacion,
    };

    setCourses((prev) =>
      prev.map((course) => (course.id === selectedCourse.id ? updatedCourse : course))
    );

    setShowEditForm(false);
    setSelectedCourse(null);
    resetForm();
    toast({
      title: 'Curso actualizado',
      description: 'Los cambios se han guardado exitosamente',
      variant: 'default',
    });
  };

  const handleDeleteCourse = (course) => {
    setSelectedCourse(course);
    setShowDeleteModal(true);
  };

  const confirmDeleteCourse = () => {
    setCourses((prev) => prev.filter((course) => course.id !== selectedCourse.id));
    setShowDeleteModal(false);
    setSelectedCourse(null);
    toast({
      title: 'Curso eliminado',
      description: 'El curso ha sido eliminado exitosamente',
      variant: 'default',
    });
  };

  const getIdFromName = (name, type) => {
    if (type === 'responsable') {
      const responsableMap = {
        'Juan Pérez': '1',
        'María González': '2',
        'Carlos López': '3',
      };
      return responsableMap[name] || '1';
    }
    if (type === 'cargo') {
      const cargoMap = {
        Coordinador: '1',
        Instructor: '2',
        'Jefe de Grupo': '3',
        Dirigente: '4',
      };
      return cargoMap[name] || '1';
    }
    return '1';
  };

  const resetForm = () => {
    setCourseData({
      codigo: '',
      descripcion: '',
      fechaHora: '',
      fechaSolicitud: '',
      lugar: '',
      coordLatitud: '',
      coordLongitud: '',
      cuotaConAlmuerzo: '',
      cuotaSinAlmuerzo: '',
      modalidad: '',
      tipoCurso: '',
      estado: 'pendiente',
      observacion: '',
      responsableId: '',
      cargoResponsableId: '',
      comunaId: '',
      administra: '1',
      fechas: [], // Limpiar fechas múltiples
      secciones: [], // Limpiar secciones
      coordinadores: [], // Limpiar coordinadores
      formadores: [], // Limpiar formadores
      alimentacionRegistrada: false,
      directoresFormadoresCompleto: false,
      pagosPendientes: false,
      totalFormadoresPorSeccion: {},
      alimentacion: [],
    });
    setErrors({});
    setShowCreateForm(false);
    setShowEditForm(false);
    setShowViewModal(false);
    setShowDeleteModal(false);
    setSelectedCourse(null);
  };

  const getResponsableName = (id) => {
    const responsables = {
      1: 'Juan Pérez',
      2: 'María González',
      3: 'Carlos López',
    };
    return responsables[id] || 'Sin asignar';
  };

  const getCargoName = (id) => {
    const cargos = {
      1: 'Coordinador',
      2: 'Instructor',
      3: 'Jefe de Grupo',
      4: 'Dirigente',
    };
    return cargos[id] || 'Sin cargo';
  };

  const getEstadoName = (estado) => {
    const estados = {
      pendiente: { name: 'Pendiente', color: 'bg-orange-100 text-orange-800' },
      1: { name: 'Activo', color: 'bg-primary text-primary-foreground' },
      2: { name: 'Inactivo', color: 'bg-gray-100 text-gray-800' },
      3: { name: 'En Proceso', color: 'bg-yellow-100 text-yellow-800' },
      4: { name: 'Finalizado', color: 'bg-blue-100 text-blue-800' },
      5: { name: 'Cancelado', color: 'bg-red-100 text-red-800' },
    };
    return estados[estado] || { name: 'Desconocido', color: 'bg-gray-100 text-gray-800' };
  };

  const getModalidadName = (modalidad) => {
    const modalidades = {
      1: 'Presencial',
      2: 'Online',
      3: 'Híbrida',
    };
    return modalidades[modalidad] || 'Sin definir';
  };

  const getTipoCursoName = (tipoCurso) => {
    const tipos = {
      1: 'Presencial',
      2: 'Online',
      3: 'Híbrido',
    };
    return tipos[tipoCurso] || 'Sin definir';
  };

  const filteredCourses = courses.filter((course) => {
    const matchSearch =
      !filters.search ||
      course.codigo.toLowerCase().includes(filters.search.toLowerCase()) ||
      course.descripcion.toLowerCase().includes(filters.search.toLowerCase()) ||
      course.lugar.toLowerCase().includes(filters.search.toLowerCase());

    const matchEstado = !filters.estado || course.estado === filters.estado;
    const matchModalidad = !filters.modalidad || course.modalidad === filters.modalidad;
    const matchTipoCurso = !filters.tipoCurso || course.tipoCurso === filters.tipoCurso;

    return matchSearch && matchEstado && matchModalidad && matchTipoCurso;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    const date = new Date(dateString);
    return (
      date.toLocaleDateString('es-CL') +
      ' ' +
      date.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(amount);
  };

  const agregarCursoEjemplo = () => {
    // TODO: Implementar la lógica para agregar un curso de ejemplo
  };

  // Calcular estadísticas totales de un curso
  const calcularEstadisticasCurso = (course) => {
    // Total de participantes (suma de todas las secciones)
    const totalParticipantes = course.secciones?.reduce(
      (sum, seccion) => sum + (seccion.cantParticipantes || 0),
      0
    ) || 0;

    // Total de coordinadores
    const totalCoordinadores = course.coordinadores?.length || 0;

    // Total de directores (formadores marcados como directores)
    const totalDirectores = course.formadores?.filter(f => f.esDirector)?.length || 0;

    // Total de formadores
    const totalFormadores = course.formadores?.length || 0;

    // Total de formadores por sección
    const formadoresPorSeccion = course.totalFormadoresPorSeccion || {};

    // Si no está precalculado, calcularlo
    if (Object.keys(formadoresPorSeccion).length === 0 && course.formadores) {
      course.formadores.forEach(formador => {
        const seccionId = formador.seccionId;
        if (!formadoresPorSeccion[seccionId]) {
          formadoresPorSeccion[seccionId] = 0;
        }
        formadoresPorSeccion[seccionId]++;
      });
    }

    // Lista de directores
    const directores = course.formadores?.filter(f => f.esDirector) || [];

    // Lista de formadores (no directores)
    const formadoresRegulares = course.formadores?.filter(f => !f.esDirector) || [];

    return {
      totalParticipantes,
      totalCoordinadores,
      totalDirectores,
      totalFormadores,
      formadoresPorSeccion,
      totalSecciones: course.secciones?.length || 0,
      alimentacionRegistrada: course.alimentacionRegistrada || false,
      directoresFormadoresCompleto: course.directoresFormadoresCompleto || false,
      pagosPendientes: course.pagosPendientes || false,
      directores,
      formadoresRegulares,
    };
  };

  return (
    <div className="space-y-6">
      {/* Resumen de estadísticas */}
      {courses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-blue-500/10 backdrop-blur-xl p-4 rounded-2xl border border-blue-500/20"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-blue-200/60 text-xs font-medium uppercase tracking-wider">Total Cursos</p>
                <h3 className="text-2xl font-bold text-blue-100 mt-1">{courses.length}</h3>
              </div>
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Calendar className="text-blue-400" size={20} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-emerald-500/10 backdrop-blur-xl p-4 rounded-2xl border border-emerald-500/20"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-emerald-200/60 text-xs font-medium uppercase tracking-wider">Activos</p>
                <h3 className="text-2xl font-bold text-emerald-100 mt-1">
                  {courses.filter(c => c.estado === '1' || c.estado === '3').length}
                </h3>
              </div>
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <Filter className="text-emerald-400" size={20} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-purple-500/10 backdrop-blur-xl p-4 rounded-2xl border border-purple-500/20"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-purple-200/60 text-xs font-medium uppercase tracking-wider">Participantes</p>
                <h3 className="text-2xl font-bold text-purple-100 mt-1">
                  {courses.reduce((sum, course) => {
                    const stats = calcularEstadisticasCurso(course);
                    return sum + stats.totalParticipantes;
                  }, 0)}
                </h3>
              </div>
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <MapPin className="text-purple-400" size={20} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-amber-500/10 backdrop-blur-xl p-4 rounded-2xl border border-amber-500/20"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-amber-200/60 text-xs font-medium uppercase tracking-wider">Coordinadores</p>
                <h3 className="text-2xl font-bold text-amber-100 mt-1">
                  {courses.reduce((sum, course) => {
                    const stats = calcularEstadisticasCurso(course);
                    return sum + stats.totalCoordinadores;
                  }, 0)}
                </h3>
              </div>
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <Settings className="text-amber-400" size={20} />
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal de Creación de Curso */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-primary-foreground">Crear Nuevo Curso</h2>
              <Button onClick={resetForm} variant="ghost" className="p-2">
                <X className="h-6 w-6" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              {/* Información Básica */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Información Básica
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="codigo">Código del Curso *</Label>
                    <Input
                      id="codigo"
                      value={courseData.codigo}
                      onChange={(e) => handleInputChange('codigo', e.target.value)}
                      placeholder="ej: FORM001"
                      maxLength={10}
                      className={errors.codigo ? 'border-red-500' : ''}
                    />
                    {errors.codigo && <p className="text-xs text-red-600">{errors.codigo}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="descripcion">Descripción</Label>
                    <Input
                      id="descripcion"
                      value={courseData.descripcion}
                      onChange={(e) => handleInputChange('descripcion', e.target.value)}
                      placeholder="Nombre del curso"
                      maxLength={50}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fechaHora">Fecha y Hora *</Label>
                    <Input
                      id="fechaHora"
                      type="datetime-local"
                      value={courseData.fechaHora}
                      onChange={(e) => handleInputChange('fechaHora', e.target.value)}
                      className={errors.fechaHora ? 'border-red-500' : ''}
                    />
                    {errors.fechaHora && <p className="text-xs text-red-600">{errors.fechaHora}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fechaSolicitud">Fecha de Solicitud *</Label>
                    <Input
                      id="fechaSolicitud"
                      type="datetime-local"
                      value={courseData.fechaSolicitud}
                      onChange={(e) => handleInputChange('fechaSolicitud', e.target.value)}
                      className={errors.fechaSolicitud ? 'border-red-500' : ''}
                    />
                    {errors.fechaSolicitud && (
                      <p className="text-xs text-red-600">{errors.fechaSolicitud}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Fechas Múltiples del Curso */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Fechas del Curso
                  </h3>
                  <Button type="button" onClick={handleAddFecha} size="sm" variant="outline">
                    + Agregar Fecha
                  </Button>
                </div>
                {courseData.fechas.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">
                    No hay fechas adicionales. Haz clic en &quot;Agregar Fecha&quot; para añadir períodos al curso.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {courseData.fechas.map((fecha, index) => (
                      <div
                        key={index}
                        className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            Fecha {index + 1}
                          </span>
                          <Button
                            type="button"
                            onClick={() => handleRemoveFecha(index)}
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Eliminar
                          </Button>
                        </div>
                        <div className="grid md:grid-cols-3 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor={`fecha_inicio_${index}`}>Fecha Inicio *</Label>
                            <Input
                              id={`fecha_inicio_${index}`}
                              type="datetime-local"
                              value={fecha.fecha_inicio}
                              onChange={(e) =>
                                handleFechaChange(index, 'fecha_inicio', e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`fecha_termino_${index}`}>Fecha Término *</Label>
                            <Input
                              id={`fecha_termino_${index}`}
                              type="datetime-local"
                              value={fecha.fecha_termino}
                              onChange={(e) =>
                                handleFechaChange(index, 'fecha_termino', e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`tipo_${index}`}>Tipo *</Label>
                            <select
                              id={`tipo_${index}`}
                              value={fecha.tipo}
                              onChange={(e) => handleFechaChange(index, 'tipo', e.target.value)}
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                              <option value="1">Presencial</option>
                              <option value="2">Online</option>
                              <option value="3">Híbrido</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Ubicación */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Ubicación
                </h3>
                <CascadingGeographySelector
                  selectedRegion={courseData.regionId}
                  selectedProvincia={courseData.provinciaId}
                  selectedComuna={courseData.comunaId}
                  onRegionChange={(value) => handleInputChange('regionId', value)}
                  onProvinciaChange={(value) => handleInputChange('provinciaId', value)}
                  onComunaChange={(value) => handleInputChange('comunaId', value)}
                  errors={errors}
                />
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="lugar">Lugar del Curso</Label>
                    <Input
                      id="lugar"
                      value={courseData.lugar}
                      onChange={(e) => handleInputChange('lugar', e.target.value)}
                      placeholder="Dirección o lugar donde se realizará el curso"
                      maxLength={100}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="coordLatitud">Latitud</Label>
                    <Input
                      id="coordLatitud"
                      value={courseData.coordLatitud}
                      onChange={(e) => handleInputChange('coordLatitud', e.target.value)}
                      placeholder="-33.4489"
                      maxLength={50}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="coordLongitud">Longitud</Label>
                    <Input
                      id="coordLongitud"
                      value={courseData.coordLongitud}
                      onChange={(e) => handleInputChange('coordLongitud', e.target.value)}
                      placeholder="-70.6693"
                      maxLength={50}
                    />
                  </div>

                </div>
              </div>

              {/* Configuración del Curso */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Configuración
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <CourseTypeSelector
                    value={courseData.tipoCurso}
                    onChange={(value) => handleInputChange('tipoCurso', value)}
                    error={errors.tipoCurso}
                  />
                  <CourseModalitySelector
                    value={courseData.modalidad}
                    onChange={(value) => handleInputChange('modalidad', value)}
                    error={errors.modalidad}
                  />
                  <div className="space-y-2">
                    <Label htmlFor="cuotaConAlmuerzo">Cuota con Almuerzo</Label>
                    <Input
                      id="cuotaConAlmuerzo"
                      type="number"
                      value={courseData.cuotaConAlmuerzo}
                      onChange={(e) => handleInputChange('cuotaConAlmuerzo', e.target.value)}
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cuotaSinAlmuerzo">Cuota sin Almuerzo</Label>
                    <Input
                      id="cuotaSinAlmuerzo"
                      type="number"
                      value={courseData.cuotaSinAlmuerzo}
                      onChange={(e) => handleInputChange('cuotaSinAlmuerzo', e.target.value)}
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>

              {/* Responsabilidad y Estado */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Responsabilidad</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="responsableId">Persona Responsable *</Label>
                    <select
                      id="responsableId"
                      value={courseData.responsableId}
                      onChange={(e) => handleInputChange('responsableId', e.target.value)}
                      className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.responsableId ? 'border-red-500' : 'border-input'}`}
                    >
                      <option value="">Seleccionar responsable</option>
                      {/* Aquí irían las personas desde la BD */}
                    </select>
                    {errors.responsableId && (
                      <p className="text-xs text-red-600">{errors.responsableId}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cargoResponsableId">Cargo del Responsable *</Label>
                    <select
                      id="cargoResponsableId"
                      value={courseData.cargoResponsableId}
                      onChange={(e) => handleInputChange('cargoResponsableId', e.target.value)}
                      className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.cargoResponsableId ? 'border-red-500' : 'border-input'}`}
                    >
                      <option value="">Seleccionar cargo</option>
                      <option value="1">Coordinador</option>
                      <option value="2">Instructor</option>
                      <option value="3">Jefe de Grupo</option>
                      <option value="4">Dirigente</option>
                    </select>
                    {errors.cargoResponsableId && (
                      <p className="text-xs text-red-600">{errors.cargoResponsableId}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado del Curso *</Label>
                    <select
                      id="estado"
                      value={courseData.estado}
                      onChange={(e) => handleInputChange('estado', e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="1">Activo</option>
                      <option value="2">Inactivo</option>
                      <option value="3">En Proceso</option>
                      <option value="4">Finalizado</option>
                      <option value="5">Cancelado</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="administra">Administrado por *</Label>
                    <select
                      id="administra"
                      value={courseData.administra}
                      onChange={(e) => handleInputChange('administra', e.target.value)}
                      className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.administra ? 'border-red-500' : 'border-input'}`}
                    >
                      <option value="">Seleccionar</option>
                      <option value="1">Zona</option>
                      <option value="2">Distrito</option>
                    </select>
                    {errors.administra && (
                      <p className="text-xs text-red-600">{errors.administra}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Observaciones */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Observaciones</h3>
                <div className="space-y-2">
                  <Label htmlFor="observacion">Observaciones adicionales</Label>
                  <textarea
                    id="observacion"
                    value={courseData.observacion}
                    onChange={(e) => handleInputChange('observacion', e.target.value)}
                    placeholder="Información adicional sobre el curso..."
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    rows={3}
                    maxLength={250}
                  />
                  <p className="text-xs text-gray-500">
                    {courseData.observacion.length}/250 caracteres
                  </p>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button onClick={resetForm} variant="outline">
                  Cancelar
                </Button>
                <Button onClick={handleCreateCourse} className="bg-primary hover:bg-primary">
                  Crear Curso
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Visualización de Curso */}
      {showViewModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-primary-foreground">Detalles del Curso</h2>
              <h2 className="text-2xl font-bold text-primary-foreground">Detalles del Curso</h2>
              <Button onClick={() => setShowViewModal(false)} variant="ghost" className="p-2">
                <X className="h-6 w-6" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              {/* Estadísticas del Curso */}
              {(() => {
                const stats = calcularEstadisticasCurso(selectedCourse);
                return (
                  <>
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <Filter className="h-5 w-5 mr-2" />
                        Estadísticas del Curso
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <button
                          onClick={() => {
                            setShowViewModal(false);
                            navigate('/dashboard/gestion-participantes', { state: { cursoId: selectedCourse.id, cursoNombre: selectedCourse.descripcion } });
                          }}
                          className="text-center hover:bg-blue-100 p-3 rounded-lg transition-colors cursor-pointer"
                        >
                          <p className="text-3xl font-bold text-blue-600">{stats.totalParticipantes}</p>
                          <p className="text-sm text-gray-600 mt-1">Total Participantes</p>
                          <p className="text-xs text-blue-500 mt-1">Click para ver lista</p>
                        </button>
                        <div className="text-center">
                          <p className="text-3xl font-bold text-green-600">{stats.totalCoordinadores}</p>
                          <p className="text-sm text-gray-600 mt-1">Coordinadores</p>
                        </div>
                        <div className="text-center">
                          <p className="text-3xl font-bold text-purple-600">{stats.totalDirectores}</p>
                          <p className="text-sm text-gray-600 mt-1">Directores</p>
                        </div>
                        <div className="text-center">
                          <p className="text-3xl font-bold text-orange-600">{stats.totalSecciones}</p>
                          <p className="text-sm text-gray-600 mt-1">Secciones</p>
                        </div>
                        <div className="text-center">
                          <p className="text-3xl font-bold text-pink-600">{stats.totalFormadores}</p>
                          <p className="text-sm text-gray-600 mt-1">Total Formadores</p>
                        </div>
                      </div>
                    </div>

                    {/* Indicadores de Estado */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`p-4 rounded-lg border-2 ${stats.alimentacionRegistrada ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Alimentación</p>
                            <p className={`text-lg font-bold ${stats.alimentacionRegistrada ? 'text-green-700' : 'text-red-700'}`}>
                              {stats.alimentacionRegistrada ? 'Registrada' : 'No Registrada'}
                            </p>
                          </div>
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${stats.alimentacionRegistrada ? 'bg-green-200' : 'bg-red-200'}`}>
                            <span className="text-xl">{stats.alimentacionRegistrada ? '✓' : '✗'}</span>
                          </div>
                        </div>
                      </div>

                      <div className={`p-4 rounded-lg border-2 ${stats.directoresFormadoresCompleto ? 'bg-green-50 border-green-300' : 'bg-yellow-50 border-yellow-300'}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Dir./Formadores</p>
                            <p className={`text-lg font-bold ${stats.directoresFormadoresCompleto ? 'text-green-700' : 'text-yellow-700'}`}>
                              {stats.directoresFormadoresCompleto ? 'Completo' : 'Incompleto'}
                            </p>
                          </div>
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${stats.directoresFormadoresCompleto ? 'bg-green-200' : 'bg-yellow-200'}`}>
                            <span className="text-xl">{stats.directoresFormadoresCompleto ? '✓' : '!'}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (stats.pagosPendientes) {
                            setShowViewModal(false);
                            navigate('/dashboard/gestion-pagos', { state: { cursoId: selectedCourse.id, cursoNombre: selectedCourse.descripcion, soloNoPagados: true } });
                          }
                        }}
                        disabled={!stats.pagosPendientes}
                        className={`p-4 rounded-lg border-2 w-full text-left ${stats.pagosPendientes ? 'bg-red-50 border-red-300 hover:bg-red-100 cursor-pointer' : 'bg-green-50 border-green-300 cursor-default'} transition-colors`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Pagos Pendientes</p>
                            <p className={`text-lg font-bold ${stats.pagosPendientes ? 'text-red-700' : 'text-green-700'}`}>
                              {stats.pagosPendientes ? 'Sí' : 'No'}
                            </p>
                            {stats.pagosPendientes && (
                              <p className="text-xs text-red-500 mt-1">Click para ver lista</p>
                            )}
                          </div>
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${stats.pagosPendientes ? 'bg-red-200' : 'bg-green-200'}`}>
                            <span className="text-xl">{stats.pagosPendientes ? '!' : '✓'}</span>
                          </div>
                        </div>
                      </button>
                    </div>

                    {/* Total de Formadores por Sección */}
                    {Object.keys(stats.formadoresPorSeccion).length > 0 && (
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="text-md font-semibold text-gray-800 mb-3">Formadores por Sección</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {Object.entries(stats.formadoresPorSeccion).map(([seccionId, total]) => (
                            <div key={seccionId} className="bg-white p-3 rounded border border-gray-300 text-center">
                              <p className="text-2xl font-bold text-blue-600">{total}</p>
                              <p className="text-xs text-gray-600">Sección {seccionId}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Información Básica</h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Código:</span> {selectedCourse.codigo}
                    </p>
                    <p>
                      <span className="font-medium">Descripción:</span> {selectedCourse.descripcion}
                    </p>
                    <p>
                      <span className="font-medium">Fecha y Hora:</span>{' '}
                      {formatDate(selectedCourse.fechaHora)}
                    </p>
                    <p>
                      <span className="font-medium">Fecha Solicitud:</span>{' '}
                      {formatDate(selectedCourse.fechaSolicitud)}
                    </p>
                  </div>
                </div>

                {/* Fechas Múltiples */}
                {selectedCourse.fechas && selectedCourse.fechas.length > 0 && (
                  <div className="space-y-4 md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-800">Fechas del Curso</h3>
                    <div className="space-y-2">
                      {selectedCourse.fechas.map((fecha, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <p>
                            <span className="font-medium">Inicio:</span>{' '}
                            {formatDate(fecha.fecha_inicio)}
                          </p>
                          <p>
                            <span className="font-medium">Término:</span>{' '}
                            {formatDate(fecha.fecha_termino)}
                          </p>
                          <p>
                            <span className="font-medium">Tipo:</span>{' '}
                            {fecha.tipo === '1'
                              ? 'Presencial'
                              : fecha.tipo === '2'
                                ? 'Online'
                                : 'Híbrido'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Ubicación</h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Lugar:</span> {selectedCourse.lugar}
                    </p>
                    {selectedCourse.coordLatitud && selectedCourse.coordLongitud && (
                      <p>
                        <span className="font-medium">Coordenadas:</span>{' '}
                        {selectedCourse.coordLatitud}, {selectedCourse.coordLongitud}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Configuración</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Modalidad:</span>
                      <span className="inline-flex px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                        {getModalidadName(selectedCourse.modalidad)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Tipo de Curso:</span>
                      <span className="inline-flex px-3 py-1 text-sm rounded-full bg-green-100 text-green-800">
                        {getTipoCursoName(selectedCourse.tipoCurso)}
                      </span>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <p className="text-sm font-medium text-green-800">Cuota con almuerzo:</p>
                      <p className="text-xl font-bold text-green-700">
                        {formatCurrency(selectedCourse.cuotaConAlmuerzo)}
                      </p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                      <p className="text-sm font-medium text-orange-800">Cuota sin almuerzo:</p>
                      <p className="text-xl font-bold text-orange-700">
                        {formatCurrency(selectedCourse.cuotaSinAlmuerzo)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Responsabilidad</h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Responsable:</span> {selectedCourse.responsable}
                    </p>
                    <p>
                      <span className="font-medium">Cargo:</span> {selectedCourse.cargo}
                    </p>
                    <p>
                      <span className="font-medium">Estado:</span>
                      <span
                        className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoName(selectedCourse.estado).color}`}
                      >
                        {getEstadoName(selectedCourse.estado).name}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Detalle de Secciones */}
              {selectedCourse.secciones && selectedCourse.secciones.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Secciones del Curso</h3>
                  <div className="grid gap-3">
                    {selectedCourse.secciones.map((seccion, idx) => {
                      const formadoresSeccion = selectedCourse.formadores?.filter(
                        f => f.seccionId === seccion.id
                      ) || [];
                      return (
                        <div key={idx} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-blue-900">
                              Sección {seccion.numero} - {seccion.rama || 'Sin rama'}
                            </h4>
                            <span className="px-3 py-1 bg-blue-200 text-blue-900 rounded-full text-sm font-medium">
                              {seccion.cantParticipantes || 0} participantes
                            </span>
                          </div>
                          {formadoresSeccion.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm font-medium text-gray-700 mb-1">Formadores:</p>
                              <div className="flex flex-wrap gap-2">
                                {formadoresSeccion.map((formador, fIdx) => (
                                  <span
                                    key={fIdx}
                                    className={`px-2 py-1 text-xs rounded ${formador.esDirector
                                      ? 'bg-purple-100 text-purple-800 font-semibold'
                                      : 'bg-gray-100 text-gray-800'
                                      }`}
                                  >
                                    {formador.nombre}
                                    {formador.esDirector && ' (Director)'}
                                    {formador.rol && ` - ${formador.rol}`}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Coordinadores del Curso */}
              {selectedCourse.coordinadores && selectedCourse.coordinadores.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Coordinadores del Curso</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {selectedCourse.coordinadores.map((coordinador, idx) => (
                      <div key={idx} className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="font-medium text-green-900">{coordinador.nombre}</p>
                        <p className="text-sm text-green-700">{coordinador.cargo}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Directores del Curso */}
              {(() => {
                const stats = calcularEstadisticasCurso(selectedCourse);
                return stats.directores.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                      <span className="mr-2">🎯</span>
                      Directores del Curso ({stats.directores.length})
                    </h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {stats.directores.map((director, idx) => (
                        <div key={idx} className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <p className="font-medium text-purple-900">{director.nombre}</p>
                          <p className="text-sm text-purple-700">{director.rol}</p>
                          {director.seccionId && (
                            <p className="text-xs text-purple-600 mt-1">Sección {director.seccionId}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Formadores del Curso */}
              {(() => {
                const stats = calcularEstadisticasCurso(selectedCourse);
                return stats.formadoresRegulares.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                      <span className="mr-2">👥</span>
                      Formadores del Curso ({stats.formadoresRegulares.length})
                    </h3>
                    <div className="grid md:grid-cols-3 gap-3">
                      {stats.formadoresRegulares.map((formador, idx) => (
                        <div key={idx} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="font-medium text-blue-900">{formador.nombre}</p>
                          <p className="text-sm text-blue-700">{formador.rol}</p>
                          {formador.seccionId && (
                            <p className="text-xs text-blue-600 mt-1">Sección {formador.seccionId}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Alimentación del Curso */}
              {selectedCourse.alimentacion && selectedCourse.alimentacion.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <span className="mr-2">🍽️</span>
                    Alimentación del Curso ({selectedCourse.alimentacion.length} servicios)
                  </h3>
                  <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                    <div className="grid gap-2 p-3">
                      {selectedCourse.alimentacion.map((alimentacion, idx) => (
                        <div key={idx} className={`p-3 rounded-lg border ${alimentacion.vigente ? 'bg-teal-50 border-teal-200' : 'bg-gray-50 border-gray-200'}`}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-teal-900">{alimentacion.tiempo}</p>
                                {!alimentacion.vigente && (
                                  <span className="text-xs px-2 py-1 bg-gray-300 text-gray-700 rounded">No vigente</span>
                                )}
                              </div>
                              <p className="text-sm text-gray-700 mt-1">{alimentacion.descripcion}</p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                                <span>📅 {formatDate(alimentacion.fecha)}</span>
                                {alimentacion.cantidadAdicional > 0 && (
                                  <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded">
                                    +{alimentacion.cantidadAdicional} adicionales
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {selectedCourse.observacion && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-800">Observaciones</h3>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                    {selectedCourse.observacion}
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button onClick={() => setShowViewModal(false)} variant="outline">
                  Cerrar
                </Button>
                <Button
                  onClick={() => {
                    setShowViewModal(false);
                    handleEditCourse(selectedCourse);
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Editar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edición de Curso */}
      {showEditForm && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-primary-foreground">Editar Curso</h2>
              <h2 className="text-2xl font-bold text-primary-foreground">Editar Curso</h2>
              <Button onClick={resetForm} variant="ghost" className="p-2">
                <X className="h-6 w-6" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              {/* Información Básica */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Información Básica
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="codigo-edit">Código del Curso *</Label>
                    <Input
                      id="codigo-edit"
                      value={courseData.codigo}
                      onChange={(e) => handleInputChange('codigo', e.target.value)}
                      placeholder="ej: FORM001"
                      maxLength={10}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="descripcion-edit">Descripción</Label>
                    <Input
                      id="descripcion-edit"
                      value={courseData.descripcion}
                      onChange={(e) => handleInputChange('descripcion', e.target.value)}
                      placeholder="Nombre del curso"
                      maxLength={50}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fechaHora-edit">Fecha y Hora *</Label>
                    <Input
                      id="fechaHora-edit"
                      type="datetime-local"
                      value={courseData.fechaHora}
                      onChange={(e) => handleInputChange('fechaHora', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fechaSolicitud-edit">Fecha de Solicitud *</Label>
                    <Input
                      id="fechaSolicitud-edit"
                      type="datetime-local"
                      value={courseData.fechaSolicitud}
                      onChange={(e) => handleInputChange('fechaSolicitud', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Fechas Múltiples del Curso */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Fechas del Curso
                  </h3>
                  <Button type="button" onClick={handleAddFecha} size="sm" variant="outline">
                    + Agregar Fecha
                  </Button>
                </div>
                {courseData.fechas.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">
                    No hay fechas adicionales. Haz clic en &quot;Agregar Fecha&quot; para añadir períodos al curso.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {courseData.fechas.map((fecha, index) => (
                      <div
                        key={index}
                        className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            Fecha {index + 1}
                          </span>
                          <Button
                            type="button"
                            onClick={() => handleRemoveFecha(index)}
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Eliminar
                          </Button>
                        </div>
                        <div className="grid md:grid-cols-3 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor={`fecha_inicio_edit_${index}`}>Fecha Inicio *</Label>
                            <Input
                              id={`fecha_inicio_edit_${index}`}
                              type="datetime-local"
                              value={fecha.fecha_inicio}
                              onChange={(e) =>
                                handleFechaChange(index, 'fecha_inicio', e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`fecha_termino_edit_${index}`}>Fecha Término *</Label>
                            <Input
                              id={`fecha_termino_edit_${index}`}
                              type="datetime-local"
                              value={fecha.fecha_termino}
                              onChange={(e) =>
                                handleFechaChange(index, 'fecha_termino', e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`tipo_edit_${index}`}>Tipo *</Label>
                            <select
                              id={`tipo_edit_${index}`}
                              value={fecha.tipo}
                              onChange={(e) => handleFechaChange(index, 'tipo', e.target.value)}
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                              <option value="1">Presencial</option>
                              <option value="2">Online</option>
                              <option value="3">Híbrido</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Ubicación */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Ubicación
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="lugar-edit">Lugar del Curso</Label>
                    <Input
                      id="lugar-edit"
                      value={courseData.lugar}
                      onChange={(e) => handleInputChange('lugar', e.target.value)}
                      placeholder="Dirección o lugar donde se realizará el curso"
                      maxLength={100}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="coordLatitud-edit">Latitud</Label>
                    <Input
                      id="coordLatitud-edit"
                      value={courseData.coordLatitud}
                      onChange={(e) => handleInputChange('coordLatitud', e.target.value)}
                      placeholder="-33.4489"
                      maxLength={50}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="coordLongitud-edit">Longitud</Label>
                    <Input
                      id="coordLongitud-edit"
                      value={courseData.coordLongitud}
                      onChange={(e) => handleInputChange('coordLongitud', e.target.value)}
                      placeholder="-70.6693"
                      maxLength={50}
                    />
                  </div>
                </div>
              </div>

              {/* Configuración del Curso */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Configuración
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="modalidad-edit">Modalidad *</Label>
                    <select
                      id="modalidad-edit"
                      value={courseData.modalidad}
                      onChange={(e) => handleInputChange('modalidad', e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Seleccionar modalidad</option>
                      <option value="1">Presencial</option>
                      <option value="2">Virtual</option>
                      <option value="3">Mixta</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estado-edit">Estado del Curso *</Label>
                    <select
                      id="estado-edit"
                      value={courseData.estado}
                      onChange={(e) => handleInputChange('estado', e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="1">Activo</option>
                      <option value="2">Inactivo</option>
                      <option value="3">En Proceso</option>
                      <option value="4">Finalizado</option>
                      <option value="5">Cancelado</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cuotaConAlmuerzo-edit">Cuota con Almuerzo</Label>
                    <Input
                      id="cuotaConAlmuerzo-edit"
                      type="number"
                      value={courseData.cuotaConAlmuerzo}
                      onChange={(e) => handleInputChange('cuotaConAlmuerzo', e.target.value)}
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cuotaSinAlmuerzo-edit">Cuota sin Almuerzo</Label>
                    <Input
                      id="cuotaSinAlmuerzo-edit"
                      type="number"
                      value={courseData.cuotaSinAlmuerzo}
                      onChange={(e) => handleInputChange('cuotaSinAlmuerzo', e.target.value)}
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>

              {/* Observaciones */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Observaciones</h3>
                <div className="space-y-2">
                  <Label htmlFor="observacion-edit">Observaciones adicionales</Label>
                  <textarea
                    id="observacion-edit"
                    value={courseData.observacion}
                    onChange={(e) => handleInputChange('observacion', e.target.value)}
                    placeholder="Información adicional sobre el curso..."
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    rows={3}
                    maxLength={250}
                  />
                  <p className="text-xs text-gray-500">
                    {courseData.observacion.length}/250 caracteres
                  </p>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button onClick={resetForm} variant="outline">
                  Cancelar
                </Button>
                <Button onClick={handleUpdateCourse} className="bg-blue-600 hover:bg-blue-700">
                  Guardar Cambios
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full m-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <X className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="flex justify-center space-x-4">
                <Button onClick={() => setShowDeleteModal(false)} variant="outline">
                  Cancelar
                </Button>
                <Button
                  Limpiar filtros
              </Button>
            </div>
          )}
          </div>

          {filteredCourses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Código
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Descripción
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Fecha Solicitud
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Fecha y Hora
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Modalidad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Cuotas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Participantes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Equipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCourses.map((course) => {
                    const estadoInfo = getEstadoName(course.estado);
                    const stats = calcularEstadisticasCurso(course);
                    return (
                      <tr key={course.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {course.codigo}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="max-w-xs">
                            <p className="truncate font-medium">{course.descripcion}</p>
                            <p className="text-xs text-gray-500 truncate">{course.lugar}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(course.fechaSolicitud)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {course.fechas && course.fechas.length > 0 ? (
                            <div className="space-y-1">
                              {course.fechas.map((fecha, idx) => (
                                <div key={idx} className="text-xs">
                                  <span className="font-medium">
                                    {formatDate(fecha.fecha_inicio)}
                                  </span>
                                  {' - '}
                                  <span>{formatDate(fecha.fecha_termino)}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            formatDate(course.fechaHora)
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="inline-flex px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            {getTipoCursoName(course.tipoCurso)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="inline-flex px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            {getModalidadName(course.modalidad)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="text-xs space-y-1">
                            <p className="font-medium text-green-700">Con: {formatCurrency(course.cuotaConAlmuerzo)}</p>
                            <p className="font-medium text-orange-700">Sin: {formatCurrency(course.cuotaSinAlmuerzo)}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="text-xs space-y-1">
                            <p className="font-semibold text-blue-700">{stats.totalParticipantes} personas</p>
                            <p className="text-gray-500">{stats.totalSecciones} {stats.totalSecciones === 1 ? 'sección' : 'secciones'}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="text-xs space-y-1">
                            <p><span className="font-medium">Coord:</span> {stats.totalCoordinadores}</p>
                            <p><span className="font-medium">Dir:</span> {stats.totalDirectores}</p>
                            <p><span className="font-medium">Form:</span> {course.formadores?.length || 0}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${estadoInfo.color}`}
                          >
                            {estadoInfo.name}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleViewCourse(course)}
                              className="p-2 hover:bg-blue-50 text-blue-600 hover:text-blue-700"
                              title="Ver detalles"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditCourse(course)}
                              className="p-2 hover:bg-green-50 text-green-600 hover:text-green-700"
                              title="Editar curso"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : courses.length > 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">
                No se encontraron cursos con los filtros aplicados
              </p>
              <p className="text-gray-400 text-sm mt-2">Intenta ajustar los filtros de búsqueda</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">No hay cursos registrados</p>
              <p className="text-gray-400 text-sm mt-2">
                Crea tu primer curso haciendo clic en "Nuevo Curso"
              </p>
            </div>
          )}
        </Card>
    </div>
  );
};

export default Cursos;
