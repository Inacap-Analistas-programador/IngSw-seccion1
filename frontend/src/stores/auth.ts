import { defineStore } from 'pinia';
import apiClient from '@/services/api';
import type { User } from '@/types';
import { jwtDecode } from 'jwt-decode';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('authToken') || null,
    user: null as User | null,
    profile: null as string | null,
    isAuthenticated: !!localStorage.getItem('authToken'),
    loading: false,
    error: null as string | null,
  }),

  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
  },

  actions: {
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
