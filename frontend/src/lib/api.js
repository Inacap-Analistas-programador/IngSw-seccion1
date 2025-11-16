import api from '@/config/api';

export const getCursos = async () => {
  try {
    const response = await api.get('/cursos/');
    return response.data;
  } catch (error) {
    console.error('Error fetching cursos:', error);
    throw error;
  }
};

// Pagos API wrappers
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

