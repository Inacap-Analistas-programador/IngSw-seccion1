import { defineStore } from 'pinia';
import apiClient from '@/services/api';
import type { User } from '@/types';
import { jwtDecode } from 'jwt-decode';

// Definimos el store de autenticación con Pinia.
export const useAuthStore = defineStore('auth', {
  // El estado inicial del store.
  state: () => ({
    token: localStorage.getItem('authToken') || null,
    user: null as User | null, // Aquí se podría almacenar la información del usuario.
    profile: null as string | null,
    isAuthenticated: !!localStorage.getItem('authToken'),
    loading: false,
    error: null as string | null,
  }),

  // Los getters son como propiedades computadas para los stores.
  getters: {
    // Un getter para verificar si el usuario está autenticado.
    isLoggedIn: (state) => state.isAuthenticated,
  },

  // Las acciones son donde se define la lógica de negocio.
  actions: {
    // Acción para manejar el login de un usuario.
    async login(credentials: { username: string; password: string }) {
      this.loading = true;
      this.error = null;
      try {
        // Se hace la petición a la API para obtener el token.
        const response = await apiClient.post('/auth/login/', credentials);
        const token = response.data.access;

        // Se guarda el token en el estado y en localStorage.
        this.token = token;
        localStorage.setItem('authToken', token);
        this.isAuthenticated = true;

        // Decodificar el token para obtener el perfil
        const decodedToken: { perfil?: string } = jwtDecode(token);
        this.profile = decodedToken.perfil || null;

        // Opcional: Se podría hacer otra petición para obtener los datos del usuario.
        // await this.fetchUser();

        return true;
      } catch (error) {
        // En caso de error, se limpia el estado.
        this.logout();
        console.error('Error de autenticación:', error);
        return false;
      } finally {
        this.loading = false;
      }
    },

    // Acción para manejar el logout.
    logout() {
      this.token = null;
      this.user = null;
      this.profile = null;
      this.isAuthenticated = false;
      localStorage.removeItem('authToken');
      // Aquí se podría redirigir al usuario a la página de login.
    },

    // Acción de ejemplo para obtener los datos del usuario.
    async fetchUser() {
      if (this.token) {
        try {
          const response = await apiClient.get('/auth/user/');
          this.user = response.data;
        } catch (error) {
          console.error('Error al obtener datos del usuario:', error);
          this.logout();
        }
      }
    },
  },
});
