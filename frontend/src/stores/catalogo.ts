import { defineStore } from 'pinia';
import catalogoService from '@/services/catalogoService';
import type { Rol, Cargo, Rama } from '@/types';

export const useCatalogoStore = defineStore('catalogo', {
  state: () => ({
    roles: [] as Rol[],
    cargos: [] as Cargo[],
    ramas: [] as Rama[],
  tiposCurso: [] as any[],
  comunas: [] as any[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchAllCatalogos() {
      this.loading = true;
      this.error = null;
      try {
  const [rolesRes, cargosRes, ramasRes, tiposCursoRes, comunasRes] = await Promise.all([
          catalogoService.getRoles(),
          catalogoService.getCargos(),
          catalogoService.getRamas(),
          catalogoService.getTiposCurso(),
          catalogoService.getComunas(),
        ]);
        this.roles = rolesRes.data;
        this.cargos = cargosRes.data;
        this.ramas = ramasRes.data;
  this.tiposCurso = tiposCursoRes.data;
  this.comunas = comunasRes.data;
      } catch (error: any) {
        this.error = error.message || 'Error al cargar los catálogos.';
      } finally {
        this.loading = false;
      }
    },
  },
});
