<script setup lang="ts">
import SideBar from './components/shared/SideBar.vue';
import NavBar from './components/shared/NavBar.vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
</script>

<template>
  <div class="app-layout">
    <SideBar v-if="authStore.isLoggedIn" />
    <div class="content-wrapper">
      <NavBar v-if="authStore.isLoggedIn" />
      <main class="main-content">
        <router-view v-slot="{ Component, route }">
          <Transition :name="route.meta.transition || 'fade'" mode="out-in">
            <component :is="Component" :key="route.path" />
          </Transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  background-color: #f4f7fa; /* Color de fondo principal claro */
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}

/* ====== Animaciones de transición entre vistas ====== */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
