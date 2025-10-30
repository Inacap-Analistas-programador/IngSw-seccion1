<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <span class="app-name">GICS</span>
    </div>
    <nav class="main-nav" aria-label="Navegación principal">
      <RouterLink to="/"><Icon name="dashboard" /> Dashboard</RouterLink>
      <RouterLink to="/cursos"><Icon name="training" /> Cursos</RouterLink>
      <RouterLink to="/preinscripcion"><Icon name="people" /> Preinscripción</RouterLink>
      <RouterLink to="/pagos"><Icon name="payment" /> Pagos</RouterLink>
      <RouterLink to="/personas"><Icon name="people" /> Personas</RouterLink>
      <RouterLink to="/catalogo"><Icon name="book" /> Catálogo</RouterLink>
      <RouterLink to="/reportes"><Icon name="report" /> Reportes</RouterLink>
      <RouterLink to="/email-forwarder"><Icon name="mail" /> Correos</RouterLink>
    </nav>
    <div class="sidebar-footer">
      <nav class="secondary-nav" aria-label="Navegación secundaria">
        <RouterLink v-if="authStore.profile === 'Administrador'" to="/mantenedores"><Icon name="admin" /> Mantenedores</RouterLink>
      </nav>
      <div class="version-info">
        Versión: 1.0.0
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Icon from './Icon.vue'; // Asumimos un componente para iconos

const authStore = useAuthStore();
</script>

<style scoped>
.sidebar {
  width: 260px;
  background-color: #f8f9fa;
  border-right: 1px solid #dee2e6;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1rem;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0 0.5rem 1.5rem 0.5rem;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 1rem;
}

.logo {
  height: 32px;
  width: 32px;
}

.app-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #212529;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

nav a {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  color: #495057;
  font-weight: 500;
  transition: background-color 0.2s ease, color 0.2s ease;
}

nav a:hover {
  background-color: #e9ecef;
}

nav a.router-link-exact-active {
  background-color: var(--color-primary);
  color: #ffffff;
}

.sidebar-footer {
  margin-top: auto;
}

.secondary-nav {
  border-top: 1px solid #e0e0e0;
  padding-top: 1rem;
  margin-top: 1rem;
}

.version-info {
  padding: 1rem;
  text-align: center;
  font-size: 0.8rem;
  color: #999;
}
</style>
