/**
 * Servicio de cursos: CRUD completo, métricas y operaciones avanzadas
 */
import { BaseApiService } from './api'

// Interfaces
export interface Category {
  id: number
  name: string
  description: string
  is_active: boolean
  courses_count: number
}

export interface Course {
  id: number
  title: string
  description: string
  code: string
  category?: Category
  category_id?: number
  rama: string
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'ARCHIVED'
  price: string
  max_participants: number
  available_slots: number
  start_date: string
  end_date: string
  is_enrollment_open: boolean
  team_members: TeamMember[]
  created_by?: number
  created_at: string
  updated_at: string
}

export interface TeamMember {
  id: number
  user_name: string
  role: string
  assigned_at: string
}

export interface CourseTeam {
  id: number
  course: number
  course_title: string
  user: number
  user_name: string
  user_email: string
  role: string
  role_display: string
  assigned_at: string
}

// Métricas para tablero (semáforo de cursos)
export interface CoursesMetrics {
  total_courses: number
  active_courses: number
  draft_courses: number
  inactive_courses: number
  archived_courses: number
  warning_courses: number
  overdue_courses: number
}

// Filtros y parámetros de listado
export interface CourseListParams {
  page?: number
  page_size?: number
  search?: string
  status?: string
  rama?: string
  ordering?: string
}

class CoursesService extends BaseApiService {
  constructor() {
    super('/courses/')
  }

  async getMetrics(): Promise<CoursesMetrics> {
    return await this.customAction('', 'dashboard_metrics')
  }

  async getActiveCourses(): Promise<Course[]> {
    return await this.customAction('', 'active')
  }

  async getByRama(rama: string): Promise<Course[]> {
    return await this.customAction('', 'by_rama', { rama })
  }

  async getCourseMetrics(id: number): Promise<any> {
    return await this.customAction(id, 'metrics')
  }

  async getCategories(): Promise<Category[]> {
    return await this.customAction('', '../categories')
  }

  async getTeams(courseId?: number): Promise<CourseTeam[]> {
    return await this.customAction('', '../teams', courseId ? { courseId } : undefined)
  }
}

class CategoriesService extends BaseApiService {
  constructor() {
    super('/courses/categories/')
  }
}

class TeamsService extends BaseApiService {
  constructor() {
    super('/courses/teams/')
  }
}

export const coursesService = new CoursesService()
export const categoriesService = new CategoriesService()
export const teamsService = new TeamsService()
