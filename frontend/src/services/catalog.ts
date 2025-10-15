/**
 * Servicio para catálogos maestros
 */

import { BaseApiService } from './api'

export interface Region {
  codigo: string
  nombre: string
  nombre_corto: string
  is_active: boolean
  created_at: string
}

export interface Provincia {
  codigo: string
  nombre: string
  region: string
  region_nombre: string
  is_active: boolean
  created_at: string
}

export interface Comuna {
  codigo: string
  nombre: string
  provincia: string
  provincia_nombre: string
  region_nombre: string
  is_active: boolean
  created_at: string
}

export interface Zona {
  codigo: string
  nombre: string
  descripcion: string
  region_principal?: string
  region_principal_nombre?: string
  is_active: boolean
  created_at: string
}

export interface Distrito {
  codigo: string
  nombre: string
  zona: string
  zona_nombre: string
  descripcion: string
  is_active: boolean
  created_at: string
}

export interface GrupoScout {
  codigo: string
  nombre: string
  distrito: string
  distrito_nombre: string
  zona_nombre: string
  comuna?: string
  comuna_nombre?: string
  direccion: string
  telefono: string
  email: string
  fecha_fundacion?: string
  is_active: boolean
  created_at: string
}

export interface Rama {
  codigo: string
  nombre: string
  descripcion: string
  edad_minima?: number
  edad_maxima?: number
  color_hex: string
  is_active: boolean
  created_at: string
}

export interface TipoCurso {
  codigo: string
  nombre: string
  descripcion: string
  duracion_default_horas?: number
  precio_sugerido?: string
  is_active: boolean
  created_at: string
}

class CatalogService extends BaseApiService {
  constructor() {
    super('/catalog/')
  }

  // Regiones
  async getRegiones(): Promise<Region[]> {
    const response = await this.customAction('', 'regiones')
    return response
  }

  // Provincias
  async getProvincias(regionId?: string): Promise<Provincia[]> {
    const params = regionId ? { region: regionId } : undefined
    const response = await this.customAction('', 'provincias', params)
    return response
  }

  // Comunas
  async getComunas(provinciaId?: string): Promise<Comuna[]> {
    const params = provinciaId ? { provincia: provinciaId } : undefined
    const response = await this.customAction('', 'comunas', params)
    return response
  }

  async getComunasByRegion(regionId: string): Promise<Comuna[]> {
    const response = await this.customAction('comunas', 'by_region', { region_id: regionId })
    return response
  }

  // Zonas Scout
  async getZonas(): Promise<Zona[]> {
    const response = await this.customAction('', 'zonas')
    return response
  }

  // Distritos Scout
  async getDistritos(zonaId?: string): Promise<Distrito[]> {
    const params = zonaId ? { zona: zonaId } : undefined
    const response = await this.customAction('', 'distritos', params)
    return response
  }

  // Grupos Scout
  async getGrupos(distritoId?: string): Promise<GrupoScout[]> {
    const params = distritoId ? { distrito: distritoId } : undefined
    const response = await this.customAction('', 'grupos', params)
    return response
  }

  async getGruposByZona(zonaId: string): Promise<GrupoScout[]> {
    const response = await this.customAction('grupos', 'by_zona', { zona_id: zonaId })
    return response
  }

  // Ramas Scout
  async getRamas(): Promise<Rama[]> {
    const response = await this.customAction('', 'ramas')
    return response
  }

  // Tipos de Curso
  async getTiposCurso(): Promise<TipoCurso[]> {
    const response = await this.customAction('', 'tipos-curso')
    return response
  }
}

export const catalogService = new CatalogService()