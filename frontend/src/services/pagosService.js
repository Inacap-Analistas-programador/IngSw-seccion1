import httpClient from './httpClient';

const pagosService = {
  // Obtener todos los pagos (con filtros opcionales)
  getAll: async (params) => {
    const response = await httpClient.get('/pagos/pagopersona/', { params });
    return response.data;
  },

  // Crear un pago individual
  create: async (data) => {
    const response = await httpClient.post('/pagos/pagopersona/', data);
    return response.data;
  },

  // Registro masivo (dividir monto entre varios)
  createMasivo: async (data) => {
    const response = await httpClient.post('/pagos/pagopersona/masivo/', data);
    return response.data;
  },

  // Registro multi-persona (un pagador, múltiples beneficiarios)
  createMultiPersona: async (data) => {
    const response = await httpClient.post('/pagos/pagopersona/multi-persona/', data);
    return response.data;
  },

  // Obtener estado de cuenta de una persona en un curso
  getEstadoCuenta: async (cur_id, per_id) => {
    const response = await httpClient.get('/pagos/pagopersona/estado-cuenta/', { params: { cur_id, per_id } });
    return response.data;
  },

  // Obtener dashboard financiero del curso
  getDashboard: async (cur_id) => {
    const response = await httpClient.get('/pagos/pagopersona/dashboard/', { params: { cur_id } });
    return response.data;
  },

  // --- Comprobantes ---
  getComprobantes: async (params) => {
    const response = await httpClient.get('/pagos/comprobantepago/', { params });
    return response.data;
  },

  createComprobante: async (formData) => {
    // formData debe contener los campos y el archivo si aplica
    const response = await httpClient.post('/pagos/comprobantepago/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // --- Prepagos ---
  getPrepagos: async (params) => {
    const response = await httpClient.get('/pagos/prepago/', { params });
    return response.data;
  },

  createPrepago: async (data) => {
    const response = await httpClient.post('/pagos/prepago/', data);
    return response.data;
  }
};

export default pagosService;
