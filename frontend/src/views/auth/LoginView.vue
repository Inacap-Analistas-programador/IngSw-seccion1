<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// TODO: El equipo debe verificar las rutas y store configurados
const router = useRouter();
const authStore = useAuthStore();

// Formulario reactivo para mejor manejo
const form = reactive({
  username: "",
  password: "",
});

const loading = ref(false);
const error = ref("");

/**
 * SPRINT 2 - TODO: Implementar autenticación JWT completa
 *
 * El equipo debe completar:
 * 1. Integración con endpoint /api/auth/login/ del backend Django
 * 2. Manejo de tokens JWT (access + refresh)
 * 3. Almacenamiento seguro de tokens
 * 4. Validación de formularios con errores específicos
 * 5. Redirección basada en roles de usuario
 */
const handleLogin = async () => {
  loading.value = true;
  error.value = "";

  try {
    // SPRINT 2 TODO: Implementar validación robusta
    if (!form.username.trim() || !form.password.trim()) {
      throw new Error("Usuario y contraseña son requeridos");
    }

    // SPRINT 2 TODO: Conectar con API real Django REST Framework
    // Estructura esperada del endpoint:
    // POST /api/auth/login/
    // Body: { username: string, password: string }
    // Response: { access_token: string, refresh_token: string, user: UserData }

    // TEMPORAL - TODO SPRINT 2: Reemplazar con llamada real
    console.warn("SPRINT 2 TODO: Implementar llamada a API real");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // SPRINT 2 TODO: Implementar lógica real de autenticación
    // const loginData = await authStore.login(form.username, form.password)
    // if (loginData.success) {
    //   router.push('/dashboard')
    // }

    error.value = "SPRINT 2 TODO: Conectar con backend Django";
  } catch (err) {
    // SPRINT 2 TODO: Manejo de errores específicos de la API
    // - 401: Credenciales inválidas
    // - 429: Demasiados intentos
    // - 500: Error del servidor
    error.value = err instanceof Error ? err.message : "Error de autenticación";
  } finally {
    loading.value = false;
  }
};

// TODO: El equipo debe agregar funciones adicionales según necesidades:
// - validateForm(): validación del formulario
// - handleForgotPassword(): manejo de recuperación de contraseña
// - handleRememberMe(): funcionalidad "recordarme"
// - redirectIfAuthenticated(): redirigir si ya está autenticado
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <Card class="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle class="text-2xl">
          Login
        </CardTitle>
        <CardDescription>
          Enter your username below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleLogin" class="grid gap-4">
          <div class="grid gap-2">
            <Label for="username">Username</Label>
            <Input
              id="username"
              v-model="form.username"
              type="text"
              placeholder="scout"
              required
            />
          </div>
          <div class="grid gap-2">
            <div class="flex items-center">
              <Label for="password">Password</Label>
              <router-link
                to="/forgot-password"
                class="ml-auto inline-block text-sm underline"
              >
                Forgot your password?
              </router-link>
            </div>
            <Input
              id="password"
              v-model="form.password"
              type="password"
              required
            />
          </div>
          <Button type="submit" class="w-full" :disabled="loading">
            <span v-if="loading" class="flex items-center justify-center">
              <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Logging in...
            </span>
            <span v-else>Login</span>
          </Button>
        </form>
        <div
          v-if="error"
          class="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg"
        >
          <p class="text-red-200 text-sm">{{ error }}</p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
