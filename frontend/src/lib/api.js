const API_URL = 'http://localhost:8000/api';
import api from '@/config/api';

export const getCursos = async () => {
  try {
    const response = await fetch(`${API_URL}/cursos/`);
    if (!response.ok) {
      throw new Error('Respuesta de red no fue correcta');
    }
    return await response.json();
  } catch (error) {
    console.error('Hubo un problema con la operación de fetch:', error);
    throw error;
  }
};

// Pagos API wrappers
export const getPayments = async () => {
  try {
    const response = await api.get('/pagos/pagopersonas/');
    return response.data;
  } catch (err) {
    console.warn('API pagos GET falló, usando localStorage', err);
    return JSON.parse(localStorage.getItem('pagos') || '[]');
  }
};

export const createPayment = async (payload) => {
  try {
    const response = await api.post('/pagos/pagopersonas/', payload);
    return response.data;
  } catch (err) {
    console.warn('API createPayment falló, guardando en localStorage', err);
    const pagos = JSON.parse(localStorage.getItem('pagos') || '[]');
    const newPago = { ...payload, pap_id: Date.now() };
    pagos.push(newPago);
    localStorage.setItem('pagos', JSON.stringify(pagos));
    return newPago;
  }
};

export const updatePayment = async (id, payload) => {
  try {
    const response = await api.put(`/pagos/pagopersonas/${id}/`, payload);
    return response.data;
  } catch (err) {
    console.warn('API updatePayment falló, actualizando localStorage', err);
    const pagos = JSON.parse(localStorage.getItem('pagos') || '[]');
    const index = pagos.findIndex((p) => p.pap_id === id || p.id === id);
    if (index !== -1) {
      pagos[index] = { ...pagos[index], ...payload };
      localStorage.setItem('pagos', JSON.stringify(pagos));
      return pagos[index];
    }
    throw err;
  }
};

export const deletePayment = async (id) => {
  try {
    const response = await api.delete(`/pagos/pagopersonas/${id}/`);
    return response.data;
  } catch (err) {
    console.warn('API deletePayment falló, eliminando en localStorage', err);
    const pagos = JSON.parse(localStorage.getItem('pagos') || '[]');
    const filtered = pagos.filter((p) => p.pap_id !== id && p.id !== id);
    localStorage.setItem('pagos', JSON.stringify(filtered));
    return filtered;
  }
};

export const getComprobantes = async () => {
  try {
    const response = await api.get('/pagos/comprobantes/');
    return response.data;
  } catch (err) {
    console.warn('API comprobantes GET falló, usando localStorage', err);
    return JSON.parse(localStorage.getItem('comprobantes') || '[]');
  }
};

// Personas API
export const getPersonas = async () => {
  try {
    const response = await api.get('/personas/');
    return response.data;
  } catch (err) {
    console.warn('API personas GET falló, usando localStorage', err);
    return JSON.parse(localStorage.getItem('personas') || '[]');
  }
};

// Concepto Contable (maestros)
export const getConceptosContables = async () => {
  try {
    const response = await api.get('/maestros/conceptos-contables/');
    return response.data;
  } catch (err) {
    console.warn('API conceptos contables GET falló, usando localStorage', err);
    return JSON.parse(localStorage.getItem('conceptos-contables') || '[]');
  }
};

export const createComprobante = async (payload) => {
  try {
    const response = await api.post('/pagos/comprobantes/', payload);
    return response.data;
  } catch (err) {
    console.warn('API createComprobante falló, guardando en localStorage', err);
    const comprobantes = JSON.parse(localStorage.getItem('comprobantes') || '[]');
    const newComprobante = { ...payload, cpa_id: Date.now() };
    comprobantes.push(newComprobante);
    localStorage.setItem('comprobantes', JSON.stringify(comprobantes));
    return newComprobante;
  }
};

export const getPrepagos = async () => {
  try {
    const response = await api.get('/pagos/prepagos/');
    return response.data;
  } catch (err) {
    console.warn('API prepagos GET falló, usando localStorage', err);
    return JSON.parse(localStorage.getItem('prepagos') || '[]');
  }
};

export const createPrepago = async (payload) => {
  try {
    const response = await api.post('/pagos/prepagos/', payload);
    return response.data;
  } catch (err) {
    console.warn('API createPrepago falló, guardando en localStorage', err);
    const prepagos = JSON.parse(localStorage.getItem('prepagos') || '[]');
    const newPrepago = { ...payload, ppa_id: Date.now() };
    prepagos.push(newPrepago);
    localStorage.setItem('prepagos', JSON.stringify(prepagos));
    return newPrepago;
  }
};

// PagoComprobante wrappers: asociar un pago con un comprobante
export const getPagoComprobantes = async () => {
  try {
    const response = await api.get('/pagos/pagocomprobantes/');
    return response.data;
  } catch (err) {
    console.warn('API pagocomprobantes GET falló, usando localStorage', err);
    return JSON.parse(localStorage.getItem('pagocomprobantes') || '[]');
  }
};

export const createPagoComprobante = async (payload) => {
  try {
    const response = await api.post('/pagos/pagocomprobantes/', payload);
    return response.data;
  } catch (err) {
    console.warn('API createPagoComprobante falló, guardando en localStorage', err);
    const local = JSON.parse(localStorage.getItem('pagocomprobantes') || '[]');
    const newItem = { ...payload, pco_id: Date.now() };
    local.push(newItem);
    localStorage.setItem('pagocomprobantes', JSON.stringify(local));
    return newItem;
  }
};

export const deletePagoComprobante = async (id) => {
  try {
    const response = await api.delete(`/pagos/pagocomprobantes/${id}/`);
    return response.data;
  } catch (err) {
    console.warn('API deletePagoComprobante falló, actualizando localStorage', err);
    const arr = JSON.parse(localStorage.getItem('pagocomprobantes') || '[]');
    const filtered = arr.filter((x) => x.pco_id !== id && x.id !== id);
    localStorage.setItem('pagocomprobantes', JSON.stringify(filtered));
    return filtered;
  }
};

// PagoCambioPersona wrappers: registrar cambio de persona en pago
export const getPagoCambios = async () => {
  try {
    const response = await api.get('/pagos/pago-cambios/');
    return response.data;
  } catch (err) {
    console.warn('API pago-cambios GET falló, usando localStorage', err);
    return JSON.parse(localStorage.getItem('pagocambios') || '[]');
  }
};

export const createPagoCambio = async (payload) => {
  try {
    const response = await api.post('/pagos/pago-cambios/', payload);
    return response.data;
  } catch (err) {
    console.warn('API createPagoCambio falló, guardando en localStorage', err);
    const local = JSON.parse(localStorage.getItem('pagocambios') || '[]');
    const newItem = { ...payload, pcp_id: Date.now() };
    local.push(newItem);
    localStorage.setItem('pagocambios', JSON.stringify(local));
    return newItem;
  }
};

// Added: update/delete for comprobantes and prepagos
export const updateComprobante = async (id, payload) => {
  try {
    const response = await api.put(`/pagos/comprobantes/${id}/`, payload);
    return response.data;
  } catch (err) {
    console.warn('API updateComprobante falló, actualizando localStorage', err);
    const arr = JSON.parse(localStorage.getItem('comprobantes') || '[]');
    const idx = arr.findIndex((x) => x.cpa_id === id || x.id === id);
    if (idx !== -1) {
      arr[idx] = { ...arr[idx], ...payload };
      localStorage.setItem('comprobantes', JSON.stringify(arr));
      return arr[idx];
    }
    throw err;
  }
};

export const deleteComprobante = async (id) => {
  try {
    const response = await api.delete(`/pagos/comprobantes/${id}/`);
    return response.data;
  } catch (err) {
    console.warn('API deleteComprobante falló, eliminando en localStorage', err);
    const arr = JSON.parse(localStorage.getItem('comprobantes') || '[]');
    const filtered = arr.filter((x) => x.cpa_id !== id && x.id !== id);
    localStorage.setItem('comprobantes', JSON.stringify(filtered));
    return filtered;
  }
};

export const updatePrepago = async (id, payload) => {
  try {
    const response = await api.put(`/pagos/prepagos/${id}/`, payload);
    return response.data;
  } catch (err) {
    console.warn('API updatePrepago falló, actualizando localStorage', err);
    const arr = JSON.parse(localStorage.getItem('prepagos') || '[]');
    const idx = arr.findIndex((x) => x.ppa_id === id || x.id === id);
    if (idx !== -1) {
      arr[idx] = { ...arr[idx], ...payload };
      localStorage.setItem('prepagos', JSON.stringify(arr));
      return arr[idx];
    }
    throw err;
  }
};

export const deletePrepago = async (id) => {
  try {
    const response = await api.delete(`/pagos/prepagos/${id}/`);
    return response.data;
  } catch (err) {
    console.warn('API deletePrepago falló, eliminando en localStorage', err);
    const arr = JSON.parse(localStorage.getItem('prepagos') || '[]');
    const filtered = arr.filter((x) => x.ppa_id !== id && x.id !== id);
    localStorage.setItem('prepagos', JSON.stringify(filtered));
    return filtered;
  }
};

// Sync offline pending items (tries to post what's in localStorage)
export const syncOffline = async () => {
  // This tries to push localStorage records to backend and clear them on success.
  const results = { pagos: 0, comprobantes: 0, prepagos: 0, pagocomprobantes: 0, pagocambios: 0 };
  // Pagos
  const pagosLocal = JSON.parse(localStorage.getItem('pagos') || '[]');
  for (const p of pagosLocal.slice()) {
    try {
      await api.post('/pagos/pagopersonas/', p);
      results.pagos += 1;
      const arr = JSON.parse(localStorage.getItem('pagos') || '[]').filter(
        (x) => (x.pap_id || x.id) !== (p.pap_id || p.id)
      );
      localStorage.setItem('pagos', JSON.stringify(arr));
    } catch (err) {
      // ignore and try next
    }
  }

  // Comprobantes
  const compLocal = JSON.parse(localStorage.getItem('comprobantes') || '[]');
  for (const c of compLocal.slice()) {
    try {
      await api.post('/pagos/comprobantes/', c);
      results.comprobantes += 1;
      const arr = JSON.parse(localStorage.getItem('comprobantes') || '[]').filter(
        (x) => (x.cpa_id || x.id) !== (c.cpa_id || c.id)
      );
      localStorage.setItem('comprobantes', JSON.stringify(arr));
    } catch (err) {
      // Error al sincronizar comprobante, mantener en localStorage
    }
  }

  // Prepagos
  const preLocal = JSON.parse(localStorage.getItem('prepagos') || '[]');
  for (const p of preLocal.slice()) {
    try {
      await api.post('/pagos/prepagos/', p);
      results.prepagos += 1;
      const arr = JSON.parse(localStorage.getItem('prepagos') || '[]').filter(
        (x) => (x.ppa_id || x.id) !== (p.ppa_id || p.id)
      );
      localStorage.setItem('prepagos', JSON.stringify(arr));
    } catch (err) {
      // Error al sincronizar prepago, mantener en localStorage
    }
  }

  // PagoComprobantes
  const pcmLocal = JSON.parse(localStorage.getItem('pagocomprobantes') || '[]');
  for (const pc of pcmLocal.slice()) {
    try {
      await api.post('/pagos/pagocomprobantes/', pc);
      results.pagocomprobantes += 1;
      const arr = JSON.parse(localStorage.getItem('pagocomprobantes') || '[]').filter(
        (x) => (x.pco_id || x.id) !== (pc.pco_id || pc.id)
      );
      localStorage.setItem('pagocomprobantes', JSON.stringify(arr));
    } catch (err) {
      // Error al sincronizar pagocomprobante, mantener en localStorage
    }
  }

  // PagoCambios
  const pcambioLocal = JSON.parse(localStorage.getItem('pagocambios') || '[]');
  for (const pc of pcambioLocal.slice()) {
    try {
      await api.post('/pagos/pago-cambios/', pc);
      results.pagocambios += 1;
      const arr = JSON.parse(localStorage.getItem('pagocambios') || '[]').filter(
        (x) => (x.pcp_id || x.id) !== (pc.pcp_id || pc.id)
      );
      localStorage.setItem('pagocambios', JSON.stringify(arr));
    } catch (err) {
      // Error al sincronizar pagocambio, mantener en localStorage
    }
  }

  return results;
};
