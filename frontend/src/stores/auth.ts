import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('access_token'))

  const login = async (username: string, password: string) => {
    // Mock login - replace with actual API call
    console.log('Login attempt:', username, password)
    return { success: false, message: 'Backend not connected' }
  }

  const logout = async () => {
    user.value = null
    token.value = null
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }

  return {
    user,
    token,
    login,
    logout
  }
})