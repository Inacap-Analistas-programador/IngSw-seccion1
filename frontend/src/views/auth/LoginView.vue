<template>
  <!-- Página de login inspirada en Evently con gradiente moderno -->
  <div
    class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4"
  >
    <div class="max-w-md w-full">
      <!-- Logo/Título Principal -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-white mb-2">
          <span class="text-purple-400">SGICS</span>
        </h1>
        <p class="text-slate-300">
          Sistema de Gestión Integral de Cursos Scout
        </p>
      </div>

      <!-- Card de Login -->
      <div
        class="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl"
      >
        <h2 class="text-2xl font-semibold text-white mb-6 text-center">
          Iniciar Sesión
        </h2>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Campo Usuario -->
          <div>
            <label
              for="username"
              class="block text-sm font-medium text-slate-200 mb-2"
            >
              Usuario
            </label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              required
              class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="Ingresa tu usuario"
            />
          </div>

          <!-- Campo Contraseña -->
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-slate-200 mb-2"
            >
              Contraseña
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="Ingresa tu contraseña"
            />
          </div>

          <!-- Botón de Login -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
              Ingresando...
            </span>
            <span v-else>Ingresar</span>
          </button>
        </form>

        <!-- Mensaje de Error -->
        <div
          v-if="error"
          class="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg"
        >
          <p class="text-red-200 text-sm">{{ error }}</p>
        </div>

        <!-- Links adicionales -->
        <div class="mt-6 text-center">
          <router-link
            to="/forgot-password"
            class="text-purple-300 hover:text-purple-200 text-sm transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </router-link>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center mt-8 text-slate-400 text-sm">
        <p>&copy; 2025 SGICS - Sistema Scout. Todos los derechos reservados.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

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
