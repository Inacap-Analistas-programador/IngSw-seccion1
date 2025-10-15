<template>
  <div class="page">
    <div class="card max-w-md w-full">
      <div class="mb-4 text-center">
        <h1 class="text-xl font-semibold">Iniciar sesión</h1>
        <p class="text-sm text-slate-500">Accede al panel de gestión SGICS</p>
      </div>

      <form @submit.prevent="submit" class="space-y-4">
        <div>
          <label for="username" class="block text-sm font-medium mb-1">Usuario</label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            class="input"
            required
            autocomplete="username"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium mb-1">Contraseña</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            class="input"
            required
            autocomplete="current-password"
          />
        </div>

        <button
          :disabled="authStore.loading || !isFormValid"
          class="w-full btn-primary"
        >
          {{ authStore.loading ? 'Ingresando…' : 'Ingresar' }}
        </button>

        <div class="text-right text-sm">
          <router-link to="/reset-request" class="underline text-primary-600">
            ¿Olvidaste tu contraseña?
          </router-link>
        </div>

        <div v-if="authStore.error" class="alert alert-error">
          {{ authStore.error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const form = ref({
  username: '',
  password: ''
})

const isFormValid = computed(() => {
  return form.value.username.trim() && form.value.password.trim()
})

const submit = async () => {
  if (!isFormValid.value) return

  await authStore.login({
    username: form.value.username,
    password: form.value.password
  })

  // Redirigir al dashboard después del login exitoso
  const redirect = (router.currentRoute.value.query.redirect as string) || '/dashboard'
  router.push(redirect)
}
</script>