// Map between API backend schema (per_*) and frontend Spanish keys

export const personaFromApi = (p = {}) => {
  if (!p) return {};
  return {
    id: p.per_id || p.id,
    rut: p.per_run || p.rut || '',
    dv: p.per_dv || p.dv || '',
    nombres: p.per_nombres || p.nombres || '',
    apellidoPaterno: p.per_apelpat || p.apellidoPaterno || '',
    apellidoMaterno: p.per_apelmat || p.apellidoMaterno || '',
    correo: p.per_email || p.correo || p.email || '',
    fechaNacimiento: p.per_fecha_nac || p.fechaNacimiento || p.fecha_nac || '',
    direccion: p.per_direccion || p.direccion || p.address || '',
    tipoTelefono: p.per_tipo_fono || p.tipoTelefono || p.phoneType || 1,
    telefono: p.per_fono || p.telefono || p.phone || '',
    profesion: p.per_profesion || p.profesion || p.profession || '',
    religion: p.per_religion || p.religion || '',
    numeroMMAA: p.per_num_mmaa || p.numeroMMAA || '',
    apodo: p.per_apodo || p.apodo || p.nickname || '',
    alergiasEnfermedades: p.per_alergia_enfermedad || p.alergiasEnfermedades || p.allergies || '',
    limitaciones: p.per_limitacion || p.limitaciones || p.limitations || '',
    nombreEmergencia: p.per_nom_emergencia || p.nombreEmergencia || p.emergencyContact || '',
    telefonoEmergencia: p.per_fono_emergencia || p.telefonoEmergencia || p.emergencyPhone || '',
    otros: p.per_otros || p.otros || p.otros || '',
    tiempoNNAJ: p.per_tiempo_nnaj || p.tiempoNNAJ || '',
    tiempoAdulto: p.per_tiempo_adulto || p.tiempoAdulto || '',
    estadoCivilId: p.esc_id || p.estadoCivilId || '',
    comunaId: p.com_id || p.comunaId || p.comuna || '',
    usuarioId: p.usu_id || p.usuarioId || '',
    vigente: typeof p.per_vigente === 'boolean' ? p.per_vigente : p.vigente || true,
    esFormador: p.per_es_formador || p.esFormador || false,
    habilitacion1: p.per_hab_1 || p.habilitacion1 || false,
    habilitacion2: p.per_hab_2 || p.habilitacion2 || false,
    verificacion: p.per_verificacion || p.verificacion || false,
    historialCapacitaciones: p.per_historial || p.historialCapacitaciones || '',
    fechaCreacion: p.per_fecha_hora || p.fechaCreacion || p.createdAt || '',
  };
};
// Proveedores mapper (emparejar per_id -> prv_id)
export const proveedorFromApi = (p = {}) => {
  if (!p) return {};
  return {
    id: p.prv_id || p.id,
    descripcion: p.prv_descripcion || p.descripcion || '',
    celular1: p.prv_celular1 || p.celular1 || '',
    celular2: p.prv_celular2 || p.celular2 || '',
    direccion: p.prv_direccion || p.direccion || '',
    observacion: p.prv_observacion || p.observacion || '',
    vigente: typeof p.prv_vigente === 'boolean' ? p.prv_vigente : p.vigente || true,
  };
};

export const proveedorToApi = (f = {}) => {
  if (!f) return {};
  return {
    prv_id: f.id,
    prv_descripcion: f.descripcion,
    prv_celular1: f.celular1,
    prv_celular2: f.celular2,
    prv_direccion: f.direccion,
    prv_observacion: f.observacion,
    prv_vigente: f.vigente,
  };
};

export const proveedoresFromApi = (arr = []) =>
  Array.isArray(arr) ? arr.map(proveedorFromApi) : [];

export const personaToApi = (f = {}) => {
  if (!f) return {};
  return {
    per_id: f.id,
    per_run: f.rut,
    per_dv: f.dv,
    per_nombres: f.nombres,
    per_apelpat: f.apellidoPaterno,
    per_apelmat: f.apellidoMaterno,
    per_email: f.correo,
    per_fecha_nac: f.fechaNacimiento,
    per_direccion: f.direccion,
    per_tipo_fono: f.tipoTelefono,
    per_fono: f.telefono,
    per_profesion: f.profesion,
    per_religion: f.religion,
    per_num_mmaa: f.numeroMMAA,
    per_apodo: f.apodo,
    per_alergia_enfermedad: f.alergiasEnfermedades,
    per_limitacion: f.limitaciones,
    per_nom_emergencia: f.nombreEmergencia,
    per_fono_emergencia: f.telefonoEmergencia,
    per_otros: f.otros,
    per_tiempo_nnaj: f.tiempoNNAJ,
    per_tiempo_adulto: f.tiempoAdulto,
    per_vigente: f.vigente,
    per_es_formador: f.esFormador,
    per_hab_1: f.habilitacion1,
    per_hab_2: f.habilitacion2,
    per_verificacion: f.verificacion,
    per_historial: f.historialCapacitaciones,
  };
};

export const personasFromApi = (arr = []) => (Array.isArray(arr) ? arr.map(personaFromApi) : []);

export default {
  personaFromApi,
  personaToApi,
  personasFromApi,
};
