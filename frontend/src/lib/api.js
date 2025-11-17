import api from '@/config/api';

// ============================================
// CURSOS API
// ============================================
export const getCursos = async () => {
  try {
    const response = await api.get('/cursos/cursos/');
    return response.data;
  } catch (error) {
    console.error('Error fetching cursos:', error);
    throw error;
  }
};

export const getCurso = async (id) => {
  try {
    const response = await api.get(`/cursos/cursos/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching curso:', error);
    throw error;
  }
};

export const createCurso = async (payload) => {
  try {
    const response = await api.post('/cursos/cursos/', payload);
    return response.data;
  } catch (error) {
    console.error('Error creating curso:', error);
    throw error;
  }
};

export const updateCurso = async (id, payload) => {
  try {
    const response = await api.put(`/cursos/cursos/${id}/`, payload);
    return response.data;
  } catch (error) {
    console.error('Error updating curso:', error);
    throw error;
  }
};

export const deleteCurso = async (id) => {
  try {
    const response = await api.delete(`/cursos/cursos/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting curso:', error);
    throw error;
  }
};

// ============================================
// PERSONAS API
// ============================================
export const getPersonas = async () => {
  try {
    const response = await api.get('/personas/personas/');
    return response.data;
  } catch (error) {
    console.error('Error fetching personas:', error);
    throw error;
  }
};

export const getPersona = async (id) => {
  try {
    const response = await api.get(`/personas/personas/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching persona:', error);
    throw error;
  }
};

export const createPersona = async (payload) => {
  try {
    const response = await api.post('/personas/personas/', payload);
    return response.data;
  } catch (error) {
    console.error('Error creating persona:', error);
    throw error;
  }
};

export const updatePersona = async (id, payload) => {
  try {
    const response = await api.put(`/personas/personas/${id}/`, payload);
    return response.data;
  } catch (error) {
    console.error('Error updating persona:', error);
    throw error;
  }
};

export const deletePersona = async (id) => {
  try {
    const response = await api.delete(`/personas/personas/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting persona:', error);
    throw error;
  }
};

// ============================================
// PROVEEDORES API
// ============================================
export const getProveedores = async () => {
  try {
    const response = await api.get('/proveedores/');
    return response.data;
  } catch (error) {
    console.error('Error fetching proveedores:', error);
    throw error;
  }
};

export const getProveedor = async (id) => {
  try {
    const response = await api.get(`/proveedores/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching proveedor:', error);
    throw error;
  }
};

export const createProveedor = async (payload) => {
  try {
    const response = await api.post('/proveedores/', payload);
    return response.data;
  } catch (error) {
    console.error('Error creating proveedor:', error);
    throw error;
  }
};

export const updateProveedor = async (id, payload) => {
  try {
    const response = await api.put(`/proveedores/${id}/`, payload);
    return response.data;
  } catch (error) {
    console.error('Error updating proveedor:', error);
    throw error;
  }
};

export const deleteProveedor = async (id) => {
  try {
    const response = await api.delete(`/proveedores/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting proveedor:', error);
    throw error;
  }
};

// ============================================
// MAESTROS API
// ============================================
export const getRamas = async () => {
  try {
    const response = await api.get('/maestros/ramas/');
    return response.data;
  } catch (error) {
    console.error('Error fetching ramas:', error);
    throw error;
  }
};

export const getNiveles = async () => {
  try {
    const response = await api.get('/maestros/niveles/');
    return response.data;
  } catch (error) {
    console.error('Error fetching niveles:', error);
    throw error;
  }
};

export const getRoles = async () => {
  try {
    const response = await api.get('/maestros/roles/');
    return response.data;
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};

export const getCargos = async () => {
  try {
    const response = await api.get('/maestros/cargos/');
    return response.data;
  } catch (error) {
    console.error('Error fetching cargos:', error);
    throw error;
  }
};

export const getEstadosCiviles = async () => {
  try {
    const response = await api.get('/maestros/estados-civiles/');
    return response.data;
  } catch (error) {
    console.error('Error fetching estados civiles:', error);
    throw error;
  }
};

export const getTiposCurso = async () => {
  try {
    const response = await api.get('/maestros/tipos-curso/');
    return response.data;
  } catch (error) {
    console.error('Error fetching tipos de curso:', error);
    throw error;
  }
};

export const getAlimentaciones = async () => {
  try {
    const response = await api.get('/maestros/alimentaciones/');
    return response.data;
  } catch (error) {
    console.error('Error fetching alimentaciones:', error);
    throw error;
  }
};

export const getConceptosContables = async () => {
  try {
    const response = await api.get('/maestros/conceptos-contables/');
    return response.data;
  } catch (error) {
    console.error('Error fetching conceptos contables:', error);
    throw error;
  }
};

export const getTiposArchivo = async () => {
  try {
    const response = await api.get('/maestros/tipos-archivo/');
    return response.data;
  } catch (error) {
    console.error('Error fetching tipos de archivo:', error);
    throw error;
  }
};

// ============================================
// GEOGRAFIA API
// ============================================
export const getRegiones = async () => {
  try {
    const response = await api.get('/geografia/regiones/');
    return response.data;
  } catch (error) {
    console.error('Error fetching regiones:', error);
    throw error;
  }
};

export const getProvincias = async () => {
  try {
    const response = await api.get('/geografia/provincias/');
    return response.data;
  } catch (error) {
    console.error('Error fetching provincias:', error);
    throw error;
  }
};

export const getComunas = async () => {
  try {
    const response = await api.get('/geografia/comunas/');
    return response.data;
  } catch (error) {
    console.error('Error fetching comunas:', error);
    throw error;
  }
};

export const getZonas = async () => {
  try {
    const response = await api.get('/geografia/zonas/');
    return response.data;
  } catch (error) {
    console.error('Error fetching zonas:', error);
    throw error;
  }
};

export const getDistritos = async () => {
  try {
    const response = await api.get('/geografia/distritos/');
    return response.data;
  } catch (error) {
    console.error('Error fetching distritos:', error);
    throw error;
  }
};

export const getGrupos = async () => {
  try {
    const response = await api.get('/geografia/grupos/');
    return response.data;
  } catch (error) {
    console.error('Error fetching grupos:', error);
    throw error;
  }
};

// ============================================
// USUARIOS API
// ============================================
export const getUsuarios = async () => {
  try {
    const response = await api.get('/usuarios/');
    return response.data;
  } catch (error) {
    console.error('Error fetching usuarios:', error);
    throw error;
  }
};

export const getUsuario = async (id) => {
  try {
    const response = await api.get(`/usuarios/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching usuario:', error);
    throw error;
  }
};

// ============================================
// STATS API
// ============================================
export const getDashboardStats = async () => {
  try {
    // Get multiple stats in parallel
    const [personas, cursos, pagos, inscripciones] = await Promise.all([
      getPersonas().catch(() => ({ count: 0 })),
      getCursos().catch(() => ({ count: 0 })),
      getPayments().catch(() => ({ count: 0 })),
      api.get('/personas/cursos/').then(r => r.data).catch(() => ({ count: 0 }))
    ]);
    
    return {
      total_personas: personas.count || personas.results?.length || 0,
      cursos_activos: cursos.count || cursos.results?.length || 0,
      pagos_pendientes: pagos.count || pagos.results?.length || 0,
      inscripciones_totales: inscripciones.count || inscripciones.results?.length || 0
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      total_personas: 0,
      cursos_activos: 0,
      pagos_pendientes: 0,
      inscripciones_totales: 0
    };
  }
};

// ============================================
// PAGOS API
// ============================================
export const getPayments = async () => {
  try {
    const response = await api.get('/pagos/pagopersonas/');
    return response.data;
  } catch (error) {
    console.error('Error fetching pagos:', error);
    throw error;
  }
};

export const createPayment = async (payload) => {
  try {
    const response = await api.post('/pagos/pagopersonas/', payload);
    return response.data;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
};

export const updatePayment = async (id, payload) => {
  try {
    const response = await api.put(`/pagos/pagopersonas/${id}/`, payload);
    return response.data;
  } catch (error) {
    console.error('Error updating payment:', error);
    throw error;
  }
};

export const deletePayment = async (id) => {
  try {
    const response = await api.delete(`/pagos/pagopersonas/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting payment:', error);
    throw error;
  }
};

export const getComprobantes = async () => {
  try {
    const response = await api.get('/pagos/comprobantes/');
    return response.data;
  } catch (error) {
    console.error('Error fetching comprobantes:', error);
    throw error;
  }
};

// Personas API
export const getPersonas = async () => {
  try {
    const response = await api.get('/personas/');
    return response.data;
  } catch (error) {
    console.error('Error fetching personas:', error);
    throw error;
  }
};

// Concepto Contable (maestros)
export const getConceptosContables = async () => {
  try {
    const response = await api.get('/maestros/conceptos-contables/');
    return response.data;
  } catch (error) {
    console.error('Error fetching conceptos contables:', error);
    throw error;
  }
};

export const createComprobante = async (payload) => {
  try {
    const response = await api.post('/pagos/comprobantes/', payload);
    return response.data;
  } catch (error) {
    console.error('Error creating comprobante:', error);
    throw error;
  }
};

export const getPrepagos = async () => {
  try {
    const response = await api.get('/pagos/prepagos/');
    return response.data;
  } catch (error) {
    console.error('Error fetching prepagos:', error);
    throw error;
  }
};

export const createPrepago = async (payload) => {
  try {
    const response = await api.post('/pagos/prepagos/', payload);
    return response.data;
  } catch (error) {
    console.error('Error creating prepago:', error);
    throw error;
  }
};

// PagoComprobante wrappers: asociar un pago con un comprobante
export const getPagoComprobantes = async () => {
  try {
    const response = await api.get('/pagos/pagocomprobantes/');
    return response.data;
  } catch (error) {
    console.error('Error fetching pagocomprobantes:', error);
    throw error;
  }
};

export const createPagoComprobante = async (payload) => {
  try {
    const response = await api.post('/pagos/pagocomprobantes/', payload);
    return response.data;
  } catch (error) {
    console.error('Error creating pagocomprobante:', error);
    throw error;
  }
};

export const deletePagoComprobante = async (id) => {
  try {
    const response = await api.delete(`/pagos/pagocomprobantes/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting pagocomprobante:', error);
    throw error;
  }
};

// PagoCambioPersona wrappers: registrar cambio de persona en pago
export const getPagoCambios = async () => {
  try {
    const response = await api.get('/pagos/pago-cambios/');
    return response.data;
  } catch (error) {
    console.error('Error fetching pago cambios:', error);
    throw error;
  }
};

export const createPagoCambio = async (payload) => {
  try {
    const response = await api.post('/pagos/pago-cambios/', payload);
    return response.data;
  } catch (error) {
    console.error('Error creating pago cambio:', error);
    throw error;
  }
};

// Added: update/delete for comprobantes and prepagos
export const updateComprobante = async (id, payload) => {
  try {
    const response = await api.put(`/pagos/comprobantes/${id}/`, payload);
    return response.data;
  } catch (error) {
    console.error('Error updating comprobante:', error);
    throw error;
  }
};

export const deleteComprobante = async (id) => {
  try {
    const response = await api.delete(`/pagos/comprobantes/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting comprobante:', error);
    throw error;
  }
};

export const updatePrepago = async (id, payload) => {
  try {
    const response = await api.put(`/pagos/prepagos/${id}/`, payload);
    return response.data;
  } catch (error) {
    console.error('Error updating prepago:', error);
    throw error;
  }
};

export const deletePrepago = async (id) => {
  try {
    const response = await api.delete(`/pagos/prepagos/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting prepago:', error);
    throw error;
  }
};

