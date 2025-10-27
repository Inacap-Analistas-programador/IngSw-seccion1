export interface PagoPersona {
  PAP_ID: number
  PER_ID: number
  CUR_ID: number
  USU_ID: number
  PAP_FECHA_HORA: string
  PAP_TIPO: number // 1: Ingreso, 2: Egreso
  PAP_VALOR: number
  PAP_OBSERVACION: string
  estado: 'Pendiente' | 'Registrado' | 'Cancelado' | 'Comprobado'
}

export interface Prepago {
  PPA_ID: number
  PER_ID: number
  CUR_ID: number
  PAP_ID: number
  PPA_VALOR: number
  PPA_OBSERVACION: string
  PPA_VIGENTE: boolean
}

export interface ComprobantePago {
  CPA_ID: number
  USU_ID: number
  PEC_ID: number
  COC_ID: number
  CPA_FECHA_HORA: string
  CPA_FECHA: string
  CPA_NUMERO: number
  CPA_VALOR: number
}

export interface PagoComprobante {
  PCO_ID: number
  PAP_ID: number
  CPA_ID: number
}

export interface PagoCambioPersona {
  PCP_ID: number
  PER_ID: number
  PAP_ID: number
  USU_ID: number
  PCP_FECHA_HORA: string
}

export interface ConceptoContable {
  COC_ID: number
  COC_DESCRIPCION: string
  COC_VIGENTE: boolean
}

export interface PaymentFilters {
  group?: string
  course_id?: number
  person_id?: number
  status?: string
  date_from?: string
  date_to?: string
}

export interface PaymentStats {
  count: number
  total_amount: number
  breakdown: {
    ingresos: number
    egresos: number
    pendientes: number
    registrados: number
  }
}

export interface CreatePaymentRequest {
  PER_ID: number
  CUR_ID: number
  PAP_TIPO: number
  PAP_VALOR: number
  PAP_OBSERVACION?: string
}

export interface CreateComprobanteRequest {
  pagos_ids: number[]
  COC_ID: number
  CPA_NUMERO?: number
  CPA_OBSERVACION?: string
}

export interface ChangeTitularidadRequest {
  PAP_ID: number
  new_PER_ID: number
  observacion?: string
}