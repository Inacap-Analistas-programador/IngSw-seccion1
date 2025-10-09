<template>
  <div class="min-h-screen bg-gray-100">
    <h1 class="text-3xl font-bold text-center py-8">
      SGICS - Sistema de Gestión Integral de Cursos Scout
    </h1>
    <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl mb-4">Página de Inicio</h2>
      <p class="mb-4">Bienvenido al sistema de gestión de cursos Scout.</p>
      <div class="space-y-2">
        <router-link 
          to="/login" 
          class="block w-full bg-blue-500 text-white text-center py-2 px-4 rounded hover:bg-blue-600"
        >
          Iniciar Sesión
        </router-link>
        <router-link 
          to="/dashboard" 
          class="block w-full bg-green-500 text-white text-center py-2 px-4 rounded hover:bg-green-600"
        >
          Dashboard
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Lógica del componente Home
</script>