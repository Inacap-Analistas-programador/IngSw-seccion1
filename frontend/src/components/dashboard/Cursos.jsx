import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { X, Calendar, MapPin, Settings, Filter } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Cursos = () => {
  const { toast } = useToast();
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

    console.log('Datos del curso:', courseData);

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

  const getAdministraName = (administra) => {
    const tipos = {
      1: 'Zona',
      2: 'Distrito',
    };
    return tipos[administra] || 'Sin definir';
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

  return (
    <div className="space-y-6">
      {/* Modal de Creación de Curso */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
            <div className="flex justify-between items-center p-6 border-b">
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
                <div className="grid md:grid-cols-2 gap-4">
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

              {/* Ubicación */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Ubicación
                </h3>
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
                  <div className="space-y-2">
                    <Label htmlFor="comunaId">Comuna *</Label>
                    <Input
                      id="comunaId"
                      value={courseData.comunaId}
                      onChange={(e) => handleInputChange('comunaId', e.target.value)}
                      placeholder="Ingrese la comuna"
                      maxLength={50}
                      className={errors.comunaId ? 'border-red-500' : ''}
                    />
                    {errors.comunaId && <p className="text-xs text-red-600">{errors.comunaId}</p>}
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
                    <Label htmlFor="tipoCurso">Tipo de Curso *</Label>
                    <select
                      id="tipoCurso"
                      value={courseData.tipoCurso}
                      onChange={(e) => handleInputChange('tipoCurso', e.target.value)}
                      className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.tipoCurso ? 'border-red-500' : 'border-input'}`}
                    >
                      <option value="">Seleccionar tipo</option>
                      <option value="1">Presencial</option>
                      <option value="2">Online</option>
                      <option value="3">Híbrido</option>
                    </select>
                    {errors.tipoCurso && <p className="text-xs text-red-600">{errors.tipoCurso}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="modalidad">Modalidad *</Label>
                    <select
                      id="modalidad"
                      value={courseData.modalidad}
                      onChange={(e) => handleInputChange('modalidad', e.target.value)}
                      className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.modalidad ? 'border-red-500' : 'border-input'}`}
                    >
                      <option value="">Seleccionar modalidad</option>
                      <option value="1">Presencial</option>
                      <option value="2">Online</option>
                      <option value="3">Híbrida</option>
                    </select>
                    {errors.modalidad && <p className="text-xs text-red-600">{errors.modalidad}</p>}
                  </div>
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
                      <option value="1">Juan Pérez</option>
                      <option value="2">María González</option>
                      <option value="3">Carlos López</option>
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
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Modalidad:</span>{' '}
                      {getModalidadName(selectedCourse.modalidad)}
                    </p>
                    <p>
                      <span className="font-medium">Cuota con almuerzo:</span>{' '}
                      {formatCurrency(selectedCourse.cuotaConAlmuerzo)}
                    </p>
                    <p>
                      <span className="font-medium">Cuota sin almuerzo:</span>{' '}
                      {formatCurrency(selectedCourse.cuotaSinAlmuerzo)}
                    </p>
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
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Eliminar Curso</h3>
                <p className="text-sm text-gray-500 mb-4">
                  ¿Estás seguro de que deseas eliminar el curso "{selectedCourse.descripcion}" con
                  código "{selectedCourse.codigo}"?
                </p>
                <p className="text-sm text-red-600 mb-6">Esta acción no se puede deshacer.</p>
              </div>
              <div className="flex justify-center space-x-4">
                <Button onClick={() => setShowDeleteModal(false)} variant="outline">
                  Cancelar
                </Button>
                <Button
                  onClick={confirmDeleteCourse}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Eliminar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Cursos */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Cursos Disponibles ({filteredCourses.length} de {courses.length})
          </h2>
          <Button onClick={() => setShowCreateForm(true)} className="bg-primary hover:bg-primary">
            Nuevo Curso
          </Button>
        </div>

        {/* Filtros */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center mb-3">
            <Filter className="h-5 w-5 mr-2 text-gray-600" />
            <h3 className="font-semibold text-gray-700">Filtros</h3>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="filter-search">Buscar</Label>
              <Input
                id="filter-search"
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                placeholder="Código, descripción, lugar..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="filter-estado">Estado</Label>
              <select
                id="filter-estado"
                value={filters.estado}
                onChange={(e) => setFilters((prev) => ({ ...prev, estado: e.target.value }))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Todos</option>
                <option value="pendiente">Pendiente</option>
                <option value="1">Activo</option>
                <option value="2">Inactivo</option>
                <option value="3">En Proceso</option>
                <option value="4">Finalizado</option>
                <option value="5">Cancelado</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="filter-modalidad">Modalidad</Label>
              <select
                id="filter-modalidad"
                value={filters.modalidad}
                onChange={(e) => setFilters((prev) => ({ ...prev, modalidad: e.target.value }))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Todas</option>
                <option value="1">Presencial</option>
                <option value="2">Online</option>
                <option value="3">Híbrida</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="filter-tipoCurso">Tipo de Curso</Label>
              <select
                id="filter-tipoCurso"
                value={filters.tipoCurso}
                onChange={(e) => setFilters((prev) => ({ ...prev, tipoCurso: e.target.value }))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Todos</option>
                <option value="1">Presencial</option>
                <option value="2">Online</option>
                <option value="3">Híbrido</option>
              </select>
            </div>
          </div>
          {(filters.search || filters.estado || filters.modalidad || filters.tipoCurso) && (
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilters({ search: '', estado: '', modalidad: '', tipoCurso: '' })}
              >
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
                    Responsable
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(course.fechaHora)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="inline-flex px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {getTipoCursoName(course.tipoCurso)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getModalidadName(course.modalidad)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="text-xs">
                          <p>Con almuerzo: {formatCurrency(course.cuotaConAlmuerzo)}</p>
                          <p>Sin almuerzo: {formatCurrency(course.cuotaSinAlmuerzo)}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <p className="font-medium">{course.responsable}</p>
                          <p className="text-xs text-gray-500">{course.cargo}</p>
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
                            variant="outline"
                            onClick={() => handleViewCourse(course)}
                          >
                            Ver
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditCourse(course)}
                          >
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteCourse(course)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Eliminar
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
      </div>
    </div>
  );
};

export default Cursos;
