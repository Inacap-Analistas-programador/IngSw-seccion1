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

<style scoped>
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>

<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 flex items-center justify-center p-4">
    <!-- Background Pattern -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div class="absolute top-40 left-40 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
    </div>
    
    <!-- Login Card -->
    <div class="relative z-10 w-full max-w-md">
      <!-- Logo Section -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-lg mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
        </div>
        <h1 class="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
          SGICS
        </h1>
        <p class="text-gray-600">Sistema de Gestión Integral de Cursos Scout</p>
      </div>
      
      <Card class="backdrop-blur-lg bg-white/80 border-0 shadow-2xl">
        <CardHeader class="text-center pb-4">
          <CardTitle class="text-2xl font-bold text-gray-800">
            Iniciar Sesión
          </CardTitle>
          <CardDescription class="text-gray-600">
            Ingresa tus credenciales para acceder al sistema
          </CardDescription>
        </CardHeader>
        <CardContent class="p-6">
          <form @submit.prevent="handleLogin" class="space-y-6">
            <div class="space-y-2">
              <Label for="username" class="text-sm font-semibold text-gray-700">Usuario</Label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <Input
                  id="username"
                  v-model="form.username"
                  type="text"
                  placeholder="Ingresa tu usuario"
                  class="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
            </div>
            
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <Label for="password" class="text-sm font-semibold text-gray-700">Contraseña</Label>
                <router-link
                  to="/forgot-password"
                  class="text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </router-link>
              </div>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
                <Input
                  id="password"
                  v-model="form.password"
                  type="password"
                  placeholder="Ingresa tu contraseña"
                  class="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              class="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200" 
              :disabled="loading"
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
                Iniciando sesión...
              </span>
              <span v-else class="flex items-center justify-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                Iniciar Sesión
              </span>
            </Button>
          </form>
          
          <!-- Error Message -->
          <div
            v-if="error"
            class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <div class="flex items-center">
              <svg class="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p class="text-red-700 text-sm font-medium">{{ error }}</p>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="mt-6 text-center">
            <p class="text-xs text-gray-500">
              © 2025 SGICS - Guías y Scouts de Chile, Zona Biobío
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
