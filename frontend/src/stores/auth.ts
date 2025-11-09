import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { jwtDecode } from 'jwt-decode';

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