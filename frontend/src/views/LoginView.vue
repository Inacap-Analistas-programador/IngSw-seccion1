<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

import BaseButton from "@/components/shared/BaseButton.vue";
import InputBase from "@/components/shared/InputBase.vue";

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
 * SPRINT 2 - Implementar autenticación JWT completa
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
  const success = await authStore.login({
    username: form.username,
    password: form.password,
  });

  if (success) {
    router.push('/');
  } else {
    error.value = 'Credenciales inválidas. Por favor, inténtalo de nuevo.';
  }
  loading.value = false;
};
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
      
      <div class="backdrop-blur-lg bg-white/80 border-0 shadow-2xl p-6 rounded-2xl">
        <div class="text-center pb-4">
          <h2 class="text-2xl font-bold text-gray-800">
            Iniciar Sesión
          </h2>
          <p class="text-gray-600">
            Ingresa tus credenciales para acceder al sistema
          </p>
        </div>
        <div class="p-6">
          <form @submit.prevent="handleLogin" class="space-y-6">
            <InputBase
              id="username"
              v-model="form.username"
              label="Usuario"
              type="text"
              placeholder="Ingresa tu usuario"
              required
            />
            <InputBase
              id="password"
              v-model="form.password"
              label="Contraseña"
              type="password"
              placeholder="Ingresa tu contraseña"
              required
            />
            <BaseButton 
              type="submit" 
              class="w-full" 
              :disabled="loading"
            >
              <span v-if="loading">Iniciando sesión...</span>
              <span v-else>Iniciar Sesión</span>
            </BaseButton>
          </form>
          
          <div v-if="error" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-red-700 text-sm font-medium">{{ error }}</p>
          </div>
          
          <div class="mt-6 text-center">
            <p class="text-xs text-gray-500">
              © 2025 SGICS - Guías y Scouts de Chile, Zona Biobío
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
