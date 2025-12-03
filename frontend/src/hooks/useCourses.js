import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import maestrosService from '@/services/maestrosService';
import personasService from '@/services/personasService';
import {
  validateCourseData,
  filterCourses,
  getResponsableName,
  getCargoName,
  getIdFromName,
} from '@/utils/courseHelpers';

/**
 * Custom hook for managing courses state and operations
 */
export const useCourses = () => {
  const { toast } = useToast();
  
  // State
  const [courses, setCourses] = useState([]);
  const [masterData, setMasterData] = useState({
    ramas: [],
    niveles: [],
    cargos: [],
    tiposCurso: [],
    personas: [],
  });
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [filters, setFilters] = useState({
    search: '',
    estado: '',
    modalidad: '',
    tipoCurso: '',
  });

  // Fetch master data
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [ramas, niveles, cargos, tiposCurso, personas] = await Promise.all([
          maestrosService.getAll('ramas'),
          maestrosService.getAll('niveles'),
          maestrosService.getAll('cargos'),
          maestrosService.getAll('tipos-curso'),
          personasService.getAll(),
        ]);
        
        setMasterData({
          ramas: ramas.results || ramas || [],
          niveles: niveles.results || niveles || [],
          cargos: cargos.results || cargos || [],
          tiposCurso: tiposCurso.results || tiposCurso || [],
          personas: personas.results || personas || [],
        });
      } catch (error) {
        console.error('Error fetching master data:', error);
        toast({
          title: 'Error',
          description: 'No se pudieron cargar los datos maestros.',
          variant: 'destructive',
        });
      }
    };

    fetchMasterData();
  }, []);

  // Initial course data structure
  const getInitialCourseData = () => ({
    codigo: '',
    descripcion: '',
    fechaHora: new Date().toISOString().slice(0, 16),
    fechaSolicitud: new Date().toISOString().slice(0, 16),
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
    regionId: '',
    provinciaId: '',
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

  const [courseData, setCourseData] = useState(getInitialCourseData());

  // Handlers
  const handleInputChange = (field, value) => {
    setCourseData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddFecha = () => {
    setCourseData((prev) => ({
      ...prev,
      fechas: [
        ...prev.fechas,
        {
          fecha_inicio: '',
          fecha_termino: '',
          tipo: '1',
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

  const resetForm = () => {
    setCourseData(getInitialCourseData());
    setErrors({});
    setShowCreateForm(false);
    setShowEditForm(false);
    setShowViewModal(false);
    setShowDeleteModal(false);
    setSelectedCourse(null);
  };

  // CRUD Operations
  const handleCreateCourse = () => {
    const { errors: validationErrors, isValid } = validateCourseData(courseData);
    
    if (!isValid) {
      setErrors(validationErrors);
      toast({
        title: 'Error de validación',
        description: 'Por favor completa todos los campos obligatorios',
        variant: 'destructive',
      });
      return;
    }

    const newCourse = {
      id: courses.length + 1,
      ...courseData,
      cuotaConAlmuerzo: parseFloat(courseData.cuotaConAlmuerzo) || 0,
      cuotaSinAlmuerzo: parseFloat(courseData.cuotaSinAlmuerzo) || 0,
      responsable: getResponsableName(courseData.responsableId),
      cargo: getCargoName(courseData.cargoResponsableId),
    };

    setCourses((prev) => [...prev, newCourse]);
    setShowCreateForm(false);
    resetForm();
    
    toast({
      title: 'Curso creado',
      description: 'El curso se ha creado exitosamente',
      variant: 'default',
    });
  };

  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setCourseData({
      ...course,
      cuotaConAlmuerzo: course.cuotaConAlmuerzo.toString(),
      cuotaSinAlmuerzo: course.cuotaSinAlmuerzo.toString(),
      responsableId: getIdFromName(course.responsable, 'responsable'),
      cargoResponsableId: getIdFromName(course.cargo, 'cargo'),
      fechas: course.fechas || [],
      secciones: course.secciones || [],
      coordinadores: course.coordinadores || [],
      formadores: course.formadores || [],
      alimentacion: course.alimentacion || [],
    });
    setShowEditForm(true);
  };

  const handleUpdateCourse = () => {
    const { errors: validationErrors, isValid } = validateCourseData(courseData);
    
    if (!isValid) {
      setErrors(validationErrors);
      toast({
        title: 'Error de validación',
        description: 'Por favor completa todos los campos obligatorios',
        variant: 'destructive',
      });
      return;
    }

    const updatedCourse = {
      ...selectedCourse,
      ...courseData,
      cuotaConAlmuerzo: parseFloat(courseData.cuotaConAlmuerzo) || 0,
      cuotaSinAlmuerzo: parseFloat(courseData.cuotaSinAlmuerzo) || 0,
      responsable: getResponsableName(courseData.responsableId),
      cargo: getCargoName(courseData.cargoResponsableId),
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

  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setShowViewModal(true);
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

  // Computed values
  const filteredCourses = filterCourses(courses, filters);

  return {
    // State
    courses,
    masterData,
    selectedCourse,
    courseData,
    showCreateForm,
    showEditForm,
    showViewModal,
    showDeleteModal,
    errors,
    filters,
    filteredCourses,
    
    // Setters
    setShowCreateForm,
    setShowEditForm,
    setShowViewModal,
    setShowDeleteModal,
    setFilters,
    setCourseData,
    
    // Handlers
    handleInputChange,
    handleAddFecha,
    handleRemoveFecha,
    handleFechaChange,
    handleCreateCourse,
    handleEditCourse,
    handleUpdateCourse,
    handleViewCourse,
    handleDeleteCourse,
    confirmDeleteCourse,
    resetForm,
  };
};
