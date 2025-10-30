<template>
  <header class="navbar">
    <div class="search-container">
      <Icon name="search" size="22" />
      <input type="text" placeholder="Quick search..." />
    </div>
    <div class="user-profile">
      <Icon name="notification" size="24" class="notification-icon" />
      <div class="user-info">
        <span class="user-name">Usuario</span>
        <Icon name="dropdown" size="16" />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import Icon from './Icon.vue';
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  height: 70px;
}

.search-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #999;
}

.search-container input {
  border: none;
  outline: none;
  background: transparent;
  font-size: 1rem;
  color: #333;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.notification-icon {
  color: #777;
  cursor: pointer;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.user-name {
  font-weight: 600;
  color: #333;
}
</style>
