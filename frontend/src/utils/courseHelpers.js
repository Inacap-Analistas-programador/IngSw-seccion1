/**
 * Utility functions for Course Management
 */

// Date formatting
export const formatDate = (dateString) => {
  if (!dateString) return 'Sin fecha';
  const date = new Date(dateString);
  return (
    date.toLocaleDateString('es-CL') +
    ' ' +
    date.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
  );
};

//Currency formatting
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
  }).format(amount);
};

// Estado (Status) helpers
export const getEstadoName = (estado) => {
  const estados = {
    pendiente: { name: 'Pendiente', color: 'bg-amber-500/10 text-amber-200' },
    1: { name: 'Activo', color: 'bg-emerald-500/10 text-emerald-200' },
    2: { name: 'Inactivo', color: 'bg-gray-500/10 text-gray-200' },
    3: { name: 'En Proceso', color: 'bg-blue-500/10 text-blue-200' },
    4: { name: 'Finalizado', color: 'bg-indigo-500/10 text-indigo-200' },
    5: { name: 'Cancelado', color: 'bg-rose-500/10 text-rose-200' },
  };
  return estados[estado] || { name: 'Desconocido', color: 'bg-gray-500/10 text-gray-200' };
};

// Modalidad helpers
export const getModalidadName = (modalidad) => {
  const modalidades = {
    1: 'Presencial',
    2: 'Online',
    3: 'Híbrida',
  };
  return modalidades[modalidad] || 'Sin definir';
};

// Tipo de Curso helpers
export const getTipoCursoName = (tipoCurso) => {
  const tipos = {
    1: 'Presencial',
    2: 'Online',
    3: 'Híbrido',
  };
  return tipos[tipoCurso] || 'Sin definir';
};

// Responsable helpers
export const getResponsableName = (id) => {
  const responsables = {
    1: 'Juan Pérez',
    2: 'María González',
    3: 'Carlos López',
  };
  return responsables[id] || 'Sin asignar';
};

// Cargo helpers
export const getCargoName = (id) => {
  const cargos = {
    1: 'Coordinador',
    2: 'Instructor',
    3: 'Jefe de Grupo',
    4: 'Dirigente',
  };
  return cargos[id] || 'Sin cargo';
};

// ID mapping helpers
export const getIdFromName = (name, type) => {
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

// Course statistics calculator
export const calcularEstadisticasCurso = (course) => {
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
      if (formador.seccionId) {
        formadoresPorSeccion[formador.seccionId] = (formadoresPorSeccion[formador.seccionId] || 0) + 1;
      }
    });
  }

  // Directores (formadores con esDirector = true)
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

// Validation helper
export const validateCourseData = (courseData) => {
  const errors = {};

  if (!courseData.codigo?.trim()) errors.codigo = 'El código es obligatorio';
  if (!courseData.fechaHora) errors.fechaHora = 'La fecha y hora es obligatoria';
  if (!courseData.fechaSolicitud) errors.fechaSolicitud = 'La fecha de solicitud es obligatoria';
  if (!courseData.modalidad) errors.modalidad = 'La modalidad es obligatoria';
  if (!courseData.tipoCurso) errors.tipoCurso = 'El tipo de curso es obligatorio';
  if (!courseData.responsableId) errors.responsableId = 'El responsable es obligatorio';
  if (!courseData.cargoResponsableId) errors.cargoResponsableId = 'El cargo del responsable es obligatorio';
  if (!courseData.comunaId) errors.comunaId = 'La comuna es obligatoria';
  if (!courseData.administra) errors.administra = 'El tipo de administración es obligatorio';

  return { errors, isValid: Object.keys(errors).length === 0 };
};

// Filter courses helper
export const filterCourses = (courses, filters) => {
  return courses.filter((course) => {
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
};
