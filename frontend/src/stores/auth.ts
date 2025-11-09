import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { jwtDecode } from 'jwt-decode';

<<<<<<< HEAD
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
=======
export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'));

  const isLoggedIn = computed(() => !!token.value);

  function setToken(newToken: string) {
    token.value = newToken;
    localStorage.setItem('token', newToken);
  }

  function clearToken() {
    token.value = null;
    localStorage.removeItem('token');
  }

  const user = computed(() => {
    if (token.value) {
>>>>>>> 7cdb3e2 (feat: Add accreditation interface)
      try {
        return jwtDecode(token.value);
      } catch (error) {
        console.error('Failed to decode token:', error);
        clearToken();
        return null;
      }
    }
    return null;
  });

  return {
    token,
    isLoggedIn,
    user,
    setToken,
    clearToken,
  };
});