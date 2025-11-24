import { useState } from 'react';
import Card from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { X, Users, DollarSign, Settings, Calendar, AlertCircle, CheckCircle, Clock, Edit, Utensils } from 'lucide-react';

const CursoDashboard = ({ curso, onClose, onNavigateToPersonas, onEditCurso }) => {
  const [showAlimentacionModal, setShowAlimentacionModal] = useState(false);
  const [selectedTipoAlimentacion, setSelectedTipoAlimentacion] = useState(null);
  const [showPersonasModal, setShowPersonasModal] = useState(false);
  const [personasFilter, setPersonasFilter] = useState(null);

  // NOTA: Estos datos deberían venir del backend con el curso completo
  // Por ahora usamos los datos del curso + datos mock para lo que falta
  // TODO: Crear endpoint backend que devuelva curso con todas sus relaciones:
  // - curso_seccion (secciones y participantes)
  // - curso_coordinador (coordinadores)
  // - curso_formador (formadores y directores)
  // - curso_alimentacion (preferencias alimentarias)
  // - pagos de participantes (tabla no mostrada en models)
  
  // Extraer datos del curso (soporta formato cur_* y camelCase)
  const cuotaConAlmuerzo = curso.cuotaConAlmuerzo || curso.cur_cuota_con_almuerzo || 0;
  const cuotaSinAlmuerzo = curso.cuotaSinAlmuerzo || curso.cur_cuota_sin_almuerzo || 0;
  const modalidad = curso.modalidad || curso.cur_modalidad || '1';
  const tipoCurso = curso.tipoCurso || curso.cur_tipo_curso || '1';
  const estado = curso.estado || curso.cur_estado || 0;
  const administra = curso.administra || curso.cur_administra || '1';
  
  // Datos relacionados que deberían venir del backend
  // TODO: Reemplazar con datos reales cuando se implemente el endpoint completo
  const secciones = curso.secciones || [
    { id: 1, nombre: 'Manada', edadMin: 7, edadMax: 11, participantes: 8, rama_id: 1 },
    { id: 2, nombre: 'Tropa', edadMin: 11, edadMax: 15, participantes: 10, rama_id: 2 },
    { id: 3, nombre: 'Comunidad', edadMin: 15, edadMax: 18, participantes: 7, rama_id: 3 },
  ];
  
  const coordinadores = curso.coordinadores || [
    { id: 1, nombre: 'Luis Hernández Pérez', cargo: 'Coordinador Principal', email: 'luis.hernandez@scouts.cl', telefono: '+56 9 7777 1111' },
    { id: 2, nombre: 'Carmen Soto Vargas', cargo: 'Coordinador Adjunto', email: 'carmen.soto@scouts.cl', telefono: '+56 9 8888 2222' },
    { id: 3, nombre: 'Roberto Díaz Muñoz', cargo: 'Coordinador Logística', email: 'roberto.diaz@scouts.cl', telefono: '+56 9 9999 3333' },
  ];
  
  const formadores = curso.formadores || [
    { id: 1, nombre: 'Juan Pérez González', rol: 'Director', esDirector: true, seccion: 'Manada', email: 'juan.perez@scouts.cl', telefono: '+56 9 1234 5678' },
    { id: 2, nombre: 'María González Silva', rol: 'Formador', esDirector: false, seccion: 'Tropa', email: 'maria.gonzalez@scouts.cl', telefono: '+56 9 8765 4321' },
    { id: 3, nombre: 'Carlos López Martínez', rol: 'Formador', esDirector: false, seccion: 'Comunidad', email: 'carlos.lopez@scouts.cl', telefono: '+56 9 5555 1234' },
    { id: 4, nombre: 'Ana Torres Rojas', rol: 'Director Adjunto', esDirector: true, seccion: 'Tropa', email: 'ana.torres@scouts.cl', telefono: '+56 9 4444 5678' },
    { id: 5, nombre: 'Pedro Ramírez Castro', rol: 'Formador', esDirector: false, seccion: 'Manada', email: 'pedro.ramirez@scouts.cl', telefono: '+56 9 3333 9876' },
  ];
  
  const alimentacionData = curso.alimentacion || [
    { id: 1, tipo: 'Vegetariano', cantidad: 5 },
    { id: 2, tipo: 'Regular', cantidad: 15 },
    { id: 3, tipo: 'Vegano', cantidad: 3 },
    { id: 4, tipo: 'Celíaco', cantidad: 2 },
  ];
  
  const participantesPagos = curso.participantesPagos || {
    total: 25,
    pagados: 17,
    pendientes: 8,
  };
  
  // Calcular totales
  const totalParticipantes = secciones.reduce((sum, sec) => sum + sec.participantes, 0);
  const totalCoordinadores = coordinadores.length;
  const totalDirectores = formadores.filter(f => f.esDirector).length;
  const totalFormadores = formadores.filter(f => !f.esDirector).length;
  const alimentacionRegistrada = alimentacionData.length > 0;
  const directoresFormadoresCompleto = formadores.length >= 5; // Criterio configurable
  const hayPagosPendientes = participantesPagos.pendientes > 0;
  
  const dashboardData = {
    totalParticipantes,
    participantesChange: 0, // TODO: Calcular cambio respecto a período anterior
    pagos: {
      pendientes: participantesPagos.pendientes,
      confirmados: participantesPagos.pagados,
      total: participantesPagos.total,
      todosConfirmados: !hayPagosPendientes,
    },
    administracion: {
      tipo: administra === '1' || administra === 1 ? 'Zona' : 'Distrito',
      nombre: administra === '1' || administra === 1 ? 'Zona Santiago Centro' : 'Distrito Centro',
    },
    cuotas: {
      conAlmuerzo: cuotaConAlmuerzo,
      sinAlmuerzo: cuotaSinAlmuerzo,
    },
    modalidad,
    tipoCurso,
    estado,
    lugar: curso.lugar || curso.cur_lugar || '',
    observacion: curso.observacion || curso.cur_observacion || '',
    fechaHora: curso.fechaHora || curso.cur_fecha_hora || '',
    fechaSolicitud: curso.fechaSolicitud || curso.cur_fecha_solicitud || '',
    totalCoordinadores,
    totalDirectores,
    totalFormadores,
    alimentacion: {
      registrada: alimentacionRegistrada,
      tiposRegistrados: alimentacionData.map(a => a.tipo),
    },
    directoresFormadores: {
      registrados: directoresFormadoresCompleto,
      total: formadores.length,
      requeridos: 5, // Criterio configurable
    },
    pagosPendientes: participantesPagos.pendientes,
  };

  const getModalidadName = (modalidad) => {
    const modalidades = { 
      '1': 'Internado', 
      '2': 'Externado', 
      '3': 'Internado/Externado',
      1: 'Internado', 
      2: 'Externado', 
      3: 'Internado/Externado'
    };
    return modalidades[modalidad] || 'Sin definir';
  };

  const getTipoCursoName = (tipoCurso) => {
    const tipos = { 
      '1': 'Presencial', 
      '2': 'Online', 
      '3': 'Híbrido',
      1: 'Presencial', 
      2: 'Online', 
      3: 'Híbrido'
    };
    return tipos[tipoCurso] || 'Sin definir';
  };

  const getEstadoName = (estado) => {
    const estados = {
      '0': 'Pendiente',
      '1': 'Vigente',
      '2': 'Anulado',
      '3': 'Finalizado',
      0: 'Pendiente',
      1: 'Vigente',
      2: 'Anulado',
      3: 'Finalizado'
    };
    return estados[estado] || 'Sin definir';
  };

  const getAdministraName = (administra) => {
    const tipos = {
      '1': 'Zona',
      '2': 'Distrito',
      1: 'Zona',
      2: 'Distrito'
    };
    return tipos[administra] || 'Sin definir';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(amount);
  };

  // Datos mock de alimentación con personas (para modal detallado)
  // TODO: Obtener del backend con la relación curso_alimentacion + personas
  const alimentacion = [
    { 
      id: 1, 
      tipoAlimentacion: 'Vegetariano', 
      cantidadPersonas: 5,
      personas: [
        { nombre: 'Ana María Torres', rut: '18.234.567-8', seccion: 'Manada' },
        { nombre: 'Pedro González Rojas', rut: '19.456.789-0', seccion: 'Tropa' },
        { nombre: 'Carmen Silva López', rut: '17.890.123-4', seccion: 'Comunidad' },
        { nombre: 'Luis Hernández Castro', rut: '20.123.456-7', seccion: 'Tropa' },
        { nombre: 'María José Pérez', rut: '18.765.432-1', seccion: 'Manada' },
      ]
    },
    { 
      id: 2, 
      tipoAlimentacion: 'Regular', 
      cantidadPersonas: 15,
      personas: [
        { nombre: 'Juan Carlos Muñoz', rut: '19.234.567-8', seccion: 'Tropa' },
        { nombre: 'Diego Ramírez Silva', rut: '18.345.678-9', seccion: 'Comunidad' },
        { nombre: 'Sofía González Pérez', rut: '20.456.789-0', seccion: 'Manada' },
        // ... más personas (simulado)
      ]
    },
    { 
      id: 3, 
      tipoAlimentacion: 'Vegano', 
      cantidadPersonas: 3,
      personas: [
        { nombre: 'Valentina Soto Vargas', rut: '19.567.890-1', seccion: 'Comunidad' },
        { nombre: 'Matías Díaz Torres', rut: '20.678.901-2', seccion: 'Tropa' },
        { nombre: 'Camila Rojas Muñoz', rut: '18.789.012-3', seccion: 'Manada' },
      ]
    },
    { 
      id: 4, 
      tipoAlimentacion: 'Celíaco', 
      cantidadPersonas: 2,
      personas: [
        { nombre: 'Roberto Castro López', rut: '17.890.123-4', seccion: 'Tropa' },
        { nombre: 'Patricia Morales Silva', rut: '19.901.234-5', seccion: 'Comunidad' },
      ]
    },
  ];

  // Datos mock de todas las personas del curso
  const todasLasPersonas = [
    { id: 1, nombre: 'Ana María Torres', rut: '18.234.567-8', seccion: 'Manada', email: 'ana.torres@scouts.cl', telefono: '+56 9 1111 1111', estadoPago: 'pagado', alimentacion: 'Vegetariano' },
    { id: 2, nombre: 'Pedro González Rojas', rut: '19.456.789-0', seccion: 'Tropa', email: 'pedro.gonzalez@scouts.cl', telefono: '+56 9 2222 2222', estadoPago: 'pendiente', alimentacion: 'Vegetariano' },
    { id: 3, nombre: 'Carmen Silva López', rut: '17.890.123-4', seccion: 'Comunidad', email: 'carmen.silva@scouts.cl', telefono: '+56 9 3333 3333', estadoPago: 'pagado', alimentacion: 'Vegetariano' },
    { id: 4, nombre: 'Luis Hernández Castro', rut: '20.123.456-7', seccion: 'Tropa', email: 'luis.hernandez@scouts.cl', telefono: '+56 9 4444 4444', estadoPago: 'pendiente', alimentacion: 'Vegetariano' },
    { id: 5, nombre: 'María José Pérez', rut: '18.765.432-1', seccion: 'Manada', email: 'maria.perez@scouts.cl', telefono: '+56 9 5555 5555', estadoPago: 'pagado', alimentacion: 'Vegetariano' },
    { id: 6, nombre: 'Juan Carlos Muñoz', rut: '19.234.567-8', seccion: 'Tropa', email: 'juan.munoz@scouts.cl', telefono: '+56 9 6666 6666', estadoPago: 'pendiente', alimentacion: 'Regular' },
    { id: 7, nombre: 'Diego Ramírez Silva', rut: '18.345.678-9', seccion: 'Comunidad', email: 'diego.ramirez@scouts.cl', telefono: '+56 9 7777 7777', estadoPago: 'pagado', alimentacion: 'Regular' },
    { id: 8, nombre: 'Sofía González Pérez', rut: '20.456.789-0', seccion: 'Manada', email: 'sofia.gonzalez@scouts.cl', telefono: '+56 9 8888 8888', estadoPago: 'pendiente', alimentacion: 'Regular' },
    { id: 9, nombre: 'Valentina Soto Vargas', rut: '19.567.890-1', seccion: 'Comunidad', email: 'valentina.soto@scouts.cl', telefono: '+56 9 9999 9999', estadoPago: 'pagado', alimentacion: 'Vegano' },
    { id: 10, nombre: 'Matías Díaz Torres', rut: '20.678.901-2', seccion: 'Tropa', email: 'matias.diaz@scouts.cl', telefono: '+56 9 1010 1010', estadoPago: 'pendiente', alimentacion: 'Vegano' },
    { id: 11, nombre: 'Camila Rojas Muñoz', rut: '18.789.012-3', seccion: 'Manada', email: 'camila.rojas@scouts.cl', telefono: '+56 9 1111 2222', estadoPago: 'pendiente', alimentacion: 'Vegano' },
    { id: 12, nombre: 'Roberto Castro López', rut: '17.890.123-4', seccion: 'Tropa', email: 'roberto.castro@scouts.cl', telefono: '+56 9 2222 3333', estadoPago: 'pagado', alimentacion: 'Celíaco' },
    { id: 13, nombre: 'Patricia Morales Silva', rut: '19.901.234-5', seccion: 'Comunidad', email: 'patricia.morales@scouts.cl', telefono: '+56 9 3333 4444', estadoPago: 'pendiente', alimentacion: 'Celíaco' },
    { id: 14, nombre: 'Fernando Ruiz Vega', rut: '18.012.345-6', seccion: 'Manada', email: 'fernando.ruiz@scouts.cl', telefono: '+56 9 4444 5555', estadoPago: 'pagado', alimentacion: 'Regular' },
    { id: 15, nombre: 'Isabella Navarro Cruz', rut: '19.123.456-7', seccion: 'Tropa', email: 'isabella.navarro@scouts.cl', telefono: '+56 9 5555 6666', estadoPago: 'pagado', alimentacion: 'Regular' },
    { id: 16, nombre: 'Sebastián Ortiz Pinto', rut: '20.234.567-8', seccion: 'Comunidad', email: 'sebastian.ortiz@scouts.cl', telefono: '+56 9 6666 7777', estadoPago: 'pagado', alimentacion: 'Regular' },
    { id: 17, nombre: 'Francisca Valdés Soto', rut: '17.345.678-9', seccion: 'Manada', email: 'francisca.valdes@scouts.cl', telefono: '+56 9 7777 8888', estadoPago: 'pendiente', alimentacion: 'Regular' },
    { id: 18, nombre: 'Nicolás Campos Fuentes', rut: '18.456.789-0', seccion: 'Tropa', email: 'nicolas.campos@scouts.cl', telefono: '+56 9 8888 9999', estadoPago: 'pagado', alimentacion: 'Regular' },
    { id: 19, nombre: 'Antonia Bravo Medina', rut: '19.567.890-1', seccion: 'Comunidad', email: 'antonia.bravo@scouts.cl', telefono: '+56 9 9999 0000', estadoPago: 'pagado', alimentacion: 'Regular' },
    { id: 20, nombre: 'Martín Figueroa Reyes', rut: '20.678.901-2', seccion: 'Manada', email: 'martin.figueroa@scouts.cl', telefono: '+56 9 0000 1111', estadoPago: 'pagado', alimentacion: 'Regular' },
    { id: 21, nombre: 'Josefina Parra Gómez', rut: '18.789.012-3', seccion: 'Tropa', email: 'josefina.parra@scouts.cl', telefono: '+56 9 1111 2222', estadoPago: 'pagado', alimentacion: 'Regular' },
    { id: 22, nombre: 'Tomás Escobar León', rut: '17.890.123-4', seccion: 'Comunidad', email: 'tomas.escobar@scouts.cl', telefono: '+56 9 2222 3333', estadoPago: 'pagado', alimentacion: 'Regular' },
    { id: 23, nombre: 'Emilia Rojas Castro', rut: '19.901.234-5', seccion: 'Manada', email: 'emilia.rojas@scouts.cl', telefono: '+56 9 3333 4444', estadoPago: 'pagado', alimentacion: 'Regular' },
    { id: 24, nombre: 'Agustín Moreno Silva', rut: '18.012.345-6', seccion: 'Tropa', email: 'agustin.moreno@scouts.cl', telefono: '+56 9 4444 5555', estadoPago: 'pagado', alimentacion: 'Regular' },
    { id: 25, nombre: 'Catalina Vargas Núñez', rut: '19.123.456-7', seccion: 'Comunidad', email: 'catalina.vargas@scouts.cl', telefono: '+56 9 5555 6666', estadoPago: 'pagado', alimentacion: 'Regular' },
  ];

  const openPersonasModal = (filterType) => {
    setPersonasFilter(filterType);
    setShowPersonasModal(true);
  };

  const getFilteredPersonas = () => {
    if (!personasFilter) return todasLasPersonas;
    
    switch (personasFilter) {
      case 'pagos-pendientes':
        return todasLasPersonas.filter(p => p.estadoPago === 'pendiente');
      case 'todos':
        return todasLasPersonas;
      case 'seccion-manada':
        return todasLasPersonas.filter(p => p.seccion === 'Manada');
      case 'seccion-tropa':
        return todasLasPersonas.filter(p => p.seccion === 'Tropa');
      case 'seccion-comunidad':
        return todasLasPersonas.filter(p => p.seccion === 'Comunidad');
      default:
        return todasLasPersonas;
    }
  };

  const getModalTitle = () => {
    switch (personasFilter) {
      case 'pagos-pendientes':
        return 'Participantes con Pagos Pendientes';
      case 'todos':
        return 'Todos los Participantes';
      case 'seccion-manada':
        return 'Participantes - Manada';
      case 'seccion-tropa':
        return 'Participantes - Tropa';
      case 'seccion-comunidad':
        return 'Participantes - Comunidad';
      default:
        return 'Participantes del Curso';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[95vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-purple-600 to-purple-700">
          <div>
            <h2 className="text-2xl font-bold text-white">Gestión del Curso</h2>
            <p className="text-purple-100 text-sm mt-1">{curso.descripcion || curso.cur_descripcion || 'Curso sin nombre'}</p>
            <p className="text-purple-200 text-xs">Código: {curso.codigo || curso.cur_codigo || 'Sin código'}</p>
            <p className="text-purple-200 text-xs">Estado: {getEstadoName(dashboardData.estado)}</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Botón de Editar */}
            <Button
              onClick={() => {
                if (onEditCurso) {
                  onEditCurso(curso);
                }
              }}
              variant="ghost"
              className="text-white hover:bg-white/20 bg-white/10"
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar Curso
            </Button>
            <Button onClick={onClose} variant="ghost" className="text-white hover:bg-white/20 p-2">
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Resumen en Cards */}
        <div className="p-6 bg-gray-50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {/* Total Participantes */}
            <Card 
              className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => openPersonasModal('todos')}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600">Total Participantes</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-2">{dashboardData.totalParticipantes}</h3>
                  <p className="text-xs text-gray-500 mt-1 flex items-center">
                    {dashboardData.participantesChange === 0 ? (
                      <>
                        <span className="text-gray-500">→ 0%</span>
                        <span className="ml-1">vs período anterior</span>
                      </>
                    ) : (
                      <>
                        <span className={dashboardData.participantesChange > 0 ? 'text-green-600' : 'text-red-600'}>
                          {dashboardData.participantesChange > 0 ? '↑' : '↓'} {Math.abs(dashboardData.participantesChange)}%
                        </span>
                        <span className="ml-1">vs período anterior</span>
                      </>
                    )}
                  </p>
                </div>
                <div className="bg-blue-500 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>

            {/* Administrado Por */}
            <Card className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600">Administrado Por</p>
                  <h3 className="text-xl font-bold text-gray-900 mt-2">{dashboardData.administracion.tipo}</h3>
                  <p className="text-xs text-gray-500 mt-1">{dashboardData.administracion.nombre}</p>
                </div>
                <div className="bg-indigo-500 p-3 rounded-lg">
                  <Settings className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>

            {/* Cuotas */}
            <Card className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600">Cuotas</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm font-semibold text-gray-900">
                      Con: {formatCurrency(dashboardData.cuotas.conAlmuerzo)}
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      Sin: {formatCurrency(dashboardData.cuotas.sinAlmuerzo)}
                    </p>
                  </div>
                </div>
                <div className="bg-green-500 p-3 rounded-lg">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>

            {/* Modalidad y Tipo */}
            <Card className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600">Modalidad y Tipo</p>
                  <h3 className="text-base font-bold text-gray-900 mt-2">{getModalidadName(dashboardData.modalidad)}</h3>
                  <p className="text-sm text-gray-600">{getTipoCursoName(dashboardData.tipoCurso)}</p>
                </div>
                <div className="bg-purple-500 p-3 rounded-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>

            {/* Total Coordinadores */}
            <Card className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600">Total Coordinadores</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-2">{dashboardData.totalCoordinadores}</h3>
                </div>
                <div className="bg-orange-500 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>

            {/* Alimentación Registrada */}
            <Card className="p-4">
              <div className="flex justify-between items-start">
                <div className="w-full">
                  <p className="text-sm text-gray-600">Alimentación</p>
                  <div className="flex items-center mt-2">
                    {dashboardData.alimentacion.registrada ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        <span className="text-sm font-semibold text-green-600">Registrada</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                        <span className="text-sm font-semibold text-red-600">No Registrada</span>
                      </>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {dashboardData.alimentacion.tiposRegistrados.map((tipo, index) => (
                      <span key={index} className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                        {tipo}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-orange-500 p-3 rounded-lg">
                  <Utensils className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>

            {/* Directores y Formadores */}
            <Card className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600">Directores/Formadores</p>
                  <div className="flex items-center mt-2">
                    {dashboardData.directoresFormadores.registrados ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        <span className="text-sm font-semibold text-green-600">Completo</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-5 w-5 text-orange-600 mr-2" />
                        <span className="text-sm font-semibold text-orange-600">Incompleto</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {dashboardData.directoresFormadores.total}/{dashboardData.directoresFormadores.requeridos} registrados
                  </p>
                </div>
              </div>
            </Card>

            {/* Pagos Pendientes - Red if not all confirmed */}
            <Card 
              className={`p-4 hover:shadow-lg transition-shadow cursor-pointer ${!dashboardData.pagos.todosConfirmados ? 'border-2 border-red-500 bg-red-50' : ''}`}
              onClick={() => openPersonasModal('pagos-pendientes')}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className={`text-sm ${!dashboardData.pagos.todosConfirmados ? 'text-red-700 font-semibold' : 'text-gray-600'}`}>
                    Pagos Pendientes
                  </p>
                  <h3 className={`text-3xl font-bold mt-2 ${!dashboardData.pagos.todosConfirmados ? 'text-red-600' : 'text-gray-900'}`}>
                    {dashboardData.pagosPendientes}
                  </h3>
                  <p className={`text-xs mt-1 flex items-center ${!dashboardData.pagos.todosConfirmados ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                    <Clock className="h-3 w-3 mr-1" />
                    {dashboardData.pagos.confirmados} confirmados
                    {!dashboardData.pagos.todosConfirmados && ' - ⚠️ Faltan pagos'}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${!dashboardData.pagos.todosConfirmados ? 'bg-red-500' : 'bg-yellow-500'}`}>
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
          </div>

          {/* Listas de Información */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Directores y Formadores */}
            <Card className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Directores y Formadores</h3>
                <Button variant="outline" size="sm" className="text-xs bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-300">
                  Ver todos
                </Button>
              </div>
              <div className="space-y-3">
                {formadores.map((persona) => (
                  <div key={persona.id} className="flex items-start p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <Users className="h-5 w-5 text-purple-600" />
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">{persona.nombre}</p>
                      <p className="text-xs text-gray-500">{persona.rol}{persona.esDirector ? ' (Director)' : ''}</p>
                      <p className="text-xs text-gray-400 mt-1">{persona.email} • Sección: {persona.seccion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Secciones */}
            <Card className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Secciones</h3>
              </div>
              <div className="space-y-3">
                {secciones.map((seccion) => (
                  <div 
                    key={seccion.id} 
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => openPersonasModal(`seccion-${seccion.nombre.toLowerCase()}`)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{seccion.nombre}</p>
                        <p className="text-xs text-gray-500">Edades: {seccion.edadMin} - {seccion.edadMax} años</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{seccion.participantes}</p>
                        <p className="text-xs text-gray-500">participantes</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${(seccion.participantes / dashboardData.totalParticipantes) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Coordinadores */}
            <Card className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Coordinadores</h3>
              </div>
              <div className="space-y-3">
                {coordinadores.map((coord) => (
                  <div key={coord.id} className="flex items-start p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <Users className="h-5 w-5 text-orange-600" />
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">{coord.nombre}</p>
                      <p className="text-xs text-gray-500">{coord.cargo}</p>
                      <p className="text-xs text-gray-400 mt-1">{coord.telefono}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Preferencias Alimentarias */}
            <Card className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Preferencias Alimentarias</h3>
              </div>
              <div className="space-y-3">
                {alimentacionData.map((item) => (
                  <div key={item.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.tipo}</p>
                        <p className="text-xs text-gray-500">{item.cantidad} participantes</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedTipoAlimentacion(item.tipo);
                          setShowAlimentacionModal(true);
                        }}
                        className="text-xs bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-300 font-medium"
                      >
                        <Users className="w-3 h-3 mr-1" />
                        Ver
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t bg-gray-50">
          <Button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium border border-gray-400">
            Cerrar Dashboard
          </Button>
        </div>
      </div>

      {/* Modal de Participantes por Tipo de Alimentación */}
      {showAlimentacionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-hidden">
            <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Participantes con {selectedTipoAlimentacion}</h2>
                <p className="text-sm text-orange-100 mt-1">
                  {alimentacion.find(a => a.tipoAlimentacion === selectedTipoAlimentacion)?.cantidadPersonas || 0} personas
                </p>
              </div>
              <Button 
                onClick={() => setShowAlimentacionModal(false)} 
                variant="ghost" 
                className="text-white hover:bg-white/20"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
              <div className="space-y-2">
                {alimentacion
                  .find(a => a.tipoAlimentacion === selectedTipoAlimentacion)
                  ?.personas.map((persona, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-orange-100 p-2 rounded-full">
                          <Users className="w-4 h-4 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{persona.nombre}</p>
                          <p className="text-sm text-gray-600">RUT: {persona.rut}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          {persona.seccion}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex justify-end p-4 border-t bg-gray-50">
              <Button 
                onClick={() => setShowAlimentacionModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium border border-gray-400"
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Personas (General) */}
      {showPersonasModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className={`text-white p-6 flex justify-between items-center ${
              personasFilter === 'pagos-pendientes' 
                ? 'bg-gradient-to-r from-red-600 to-red-500' 
                : 'bg-gradient-to-r from-blue-600 to-blue-500'
            }`}>
              <div>
                <h2 className="text-2xl font-bold">{getModalTitle()}</h2>
                <p className="text-sm text-white/80 mt-1">
                  {getFilteredPersonas().length} participante{getFilteredPersonas().length !== 1 ? 's' : ''}
                </p>
              </div>
              <Button 
                onClick={() => setShowPersonasModal(false)} 
                variant="ghost" 
                className="text-white hover:bg-white/20"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="grid gap-3">
                {getFilteredPersonas().map((persona) => (
                  <div 
                    key={persona.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`p-3 rounded-full ${
                        persona.estadoPago === 'pendiente' 
                          ? 'bg-red-100' 
                          : 'bg-green-100'
                      }`}>
                        <Users className={`w-5 h-5 ${
                          persona.estadoPago === 'pendiente' 
                            ? 'text-red-600' 
                            : 'text-green-600'
                        }`} />
                      </div>
                      <div className="flex-1 grid grid-cols-4 gap-4">
                        <div>
                          <p className="font-semibold text-gray-900">{persona.nombre}</p>
                          <p className="text-sm text-gray-600">RUT: {persona.rut}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Sección</p>
                          <p className="font-medium text-gray-900">{persona.seccion}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="text-sm text-gray-900">{persona.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Alimentación</p>
                          <p className="text-sm text-gray-900">{persona.alimentacion}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                        persona.estadoPago === 'pagado' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {persona.estadoPago === 'pagado' ? '✓ Pagado' : '⚠ Pendiente'}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300 font-medium"
                      >
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center p-4 border-t bg-gray-50">
              <div className="text-sm text-gray-600">
                {personasFilter === 'pagos-pendientes' && (
                  <span className="font-semibold text-red-600">
                    {getFilteredPersonas().length} participante{getFilteredPersonas().length !== 1 ? 's' : ''} con pago pendiente
                  </span>
                )}
              </div>
              <Button 
                onClick={() => setShowPersonasModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium border border-gray-400"
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CursoDashboard;
