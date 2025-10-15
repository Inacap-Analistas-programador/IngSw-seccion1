/**
 * Tipos TypeScript para SGICS
 * Sistema de Gestión Integral de Cursos Scout
 * 
 * Define las interfaces y tipos utilizados en toda la aplicación.
 */

// =================== INTERFACES DE USUARIO ===================

export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  rut: string
  phone?: string
  isActive: boolean
  isStaff: boolean
  dateJoined: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  rut: string
  phone?: string
}

export interface AuthTokens {
  access: string
  refresh: string
}

// =================== INTERFACES DE CURSOS ===================

export interface Course {
  id: number
  name: string
  description: string
  enrolledCount: number
  maxCapacity: number
  status: CourseStatus
  startDate: string
  endDate: string
  price: number
  duration?: number
  instructor?: string
  location?: string
  requirements?: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type CourseStatus = 'draft' | 'active' | 'suspended' | 'completed' | 'cancelled'

export interface CourseFilters {
  status?: CourseStatus
  dateFrom?: string
  dateTo?: string
  priceMin?: number
  priceMax?: number
  search?: string
}

// =================== INTERFACES DE PREINSCRIPCIONES ===================

export interface Preinscription {
  id: number
  course: Course
  participantName: string
  participantEmail: string
  participantPhone: string
  participantRut: string
  participantAge: number
  emergencyContact: string
  emergencyPhone: string
  status: PreinscriptionStatus
  createdAt: string
  updatedAt: string
  paymentStatus?: PaymentStatus
}

export type PreinscriptionStatus = 'pending' | 'approved' | 'rejected' | 'cancelled'

export interface PreinscriptionForm {
  courseId: number
  participantName: string
  participantEmail: string
  participantPhone: string
  participantRut: string
  participantAge: number
  emergencyContact: string
  emergencyPhone: string
  medicalConditions?: string
  dietaryRestrictions?: string
  comments?: string
}

// =================== INTERFACES DE PAGOS ===================

export interface Payment {
  id: number
  preinscription: Preinscription
  amount: number
  method: PaymentMethod
  status: PaymentStatus
  transactionId?: string
  createdAt: string
  updatedAt: string
}

export type PaymentMethod = 'transfer' | 'webpay' | 'cash' | 'other'
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'

// =================== INTERFACES DE ARCHIVOS ===================

export interface FileUpload {
  id: number
  fileName: string
  originalName: string
  fileSize: number
  mimeType: string
  uploadedBy: User
  uploadedAt: string
  isActive: boolean
}

export interface FileValidation {
  id: number
  file: FileUpload
  validationType: ValidationType
  status: ValidationStatus
  validatedBy?: User
  validatedAt?: string
  comments?: string
}

export type ValidationType = 'identity' | 'medical' | 'payment' | 'other'
export type ValidationStatus = 'pending' | 'approved' | 'rejected'

// =================== INTERFACES DE KPIs Y DASHBOARD ===================

export interface KPIData {
  id: string
  title: string
  value: number | string
  previousValue?: number | string
  trend?: 'up' | 'down' | 'stable'
  trendPercentage?: number
  icon?: string
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple'
  description?: string
  actionLabel?: string
  actionRoute?: string
}

// KPICards component contract used in UI layer
export interface KPICard {
  id: string
  title: string
  subtitle: string
  value: number | string
  secondaryValue?: number | string
  secondaryLabel?: string
  icon: string
  iconBg: string
  valueColor: string
  // Numeric trend percentage: positive = up, negative = down, 0 = stable
  trend?: number
  // Optional progress bar percentage (0..100)
  progress?: number
  progressLabel?: string
  additionalInfo?: string
  actionLabel?: string
  actionRoute?: string
  actionCallback?: () => void
}

export interface DashboardStats {
  totalCourses: number
  activeCourses: number
  totalPreinscriptions: number
  pendingPreinscriptions: number
  totalPayments: number
  pendingPayments: number
  totalRevenue: number
  averageEnrollment: number
}

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
    borderWidth?: number
  }[]
}

// =================== INTERFACES DE API Y RESPUESTAS ===================

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface ApiError {
  message: string
  code?: string
  details?: Record<string, any>
}

// =================== INTERFACES DE FORMULARIOS ===================

export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'select' | 'textarea' | 'file' | 'date'
  required?: boolean
  placeholder?: string
  validation?: any
  options?: SelectOption[]
}

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

export interface FormState {
  values: Record<string, any>
  errors: Record<string, string>
  touched: Record<string, boolean>
  isSubmitting: boolean
  isValid: boolean
}

// =================== INTERFACES DE NOTIFICACIONES ===================

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  autoClose?: boolean
  duration?: number
  actions?: NotificationAction[]
}

export interface NotificationAction {
  label: string
  action: () => void
  style?: 'primary' | 'secondary'
}

// =================== TIPOS AUXILIARES ===================

export type SortDirection = 'asc' | 'desc'

export interface SortConfig {
  field: string
  direction: SortDirection
}

export interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
}

export interface PaginationConfig {
  page: number
  pageSize: number
  total: number
  showSizeChanger?: boolean
  showQuickJumper?: boolean
}