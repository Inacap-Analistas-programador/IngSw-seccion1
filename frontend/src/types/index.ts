export interface CursoFecha {
  id?: number;
  fecha_inicio: string;
  fecha_termino: string;
  tipo: number;
}

export interface Curso {
  id?: number;
  usuario: number;
  tipo_curso: number;
  persona_responsable: number;
  cargo_responsable: number;
  comuna_lugar?: number;
  fecha_hora: string;
  fecha_solicitud: string;
  codigo: string;
  titulo?: string;
  descripcion?: string;
  observacion?: string;
  administra: number;
  cuota_con_almuerzo: number;
  cuota_sin_almuerzo: number;
  modalidad: string;
  tipo?: string;
  lugar?: string;
  estado: number;
  fechas?: CursoFecha[];
  rama?: string;
  comuna?: string;
  responsable?: string;
}

export interface Pago {
  id?: number;
  persona: number;
  curso: number;
  usuario: number;
  fecha_hora: string;
  tipo: number;
  valor: number;
  observacion?: string;
}

export interface Archivo {
  id?: number;
  tipo_archivo: number;
  usuario_crea: number;
  usuario_modifica?: number;
  fecha_hora: string;
  descripcion: string;
  ruta: string;
  vigente: boolean;
}

export interface Rol {
  id?: number;
  descripcion: string;
  tipo: number;
  vigente: boolean;
}

export interface Cargo {
  id?: number;
  descripcion: string;
  vigente: boolean;
}

export interface Rama {
  id?: number;
  descripcion: string;
  vigente: boolean;
}

export interface Persona {
  id: number;
  esc_id: number;
  com_id: number;
  usu_id: number;
  fecha_hora: string;
  run: number;
  dv: string;
  apelpat: string;
  apelmat?: string;
  nombres: string;
  email: string;
  fecha_nac: string;
  direccion: string;
  tipo_fono: number;
  fono: string;
  alergia_enfermedad?: string;
  limitacion?: string;
  nom_emergencia?: string;
  fono_emergencia?: string;
  otros?: string;
  num_mmaa?: number;
  profesion?: string;
  tiempo_nnaj?: string;
  tiempo_adulto?: string;
  religion?: string;
  apodo: string;
  foto?: string;
  vigente: boolean;
}

export interface User {
  id: number;
  username: string;
  email: string;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
}
