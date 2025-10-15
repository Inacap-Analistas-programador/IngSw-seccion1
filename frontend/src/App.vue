<template>
  <div id="app" class="min-h-screen">
    <AppLayout v-if="useLayout">
      <router-view />
    </AppLayout>
    <router-view v-else />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'

const route = useRoute()

// Usa el layout global solo en rutas protegidas (meta.requiresAuth)
const useLayout = computed(() => route.meta?.requiresAuth === true)
</script>

<style scoped>
/* Estilos mínimos; el layout maneja el resto */
</style>
