<template>
  <Teleport to="body">
    <Transition name="toast" appear>
      <div
        v-if="isVisible"
        :class="[
          'toast',
          `toast--${type}`
        ]"
        @click="hideNotification"
      >
        <span class="toast__message">{{ message }}</span>
        <button class="toast__close" @click="hideNotification">×</button>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useNotification } from '@/composables/useNotification';

const { isVisible, message, type, hideNotification } = useNotification();
</script>

<style scoped>
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  max-width: 400px;
  min-width: 300px;
}

.toast--success {
  background-color: #4caf50;
  color: white;
}

.toast--error {
  background-color: #f44336;
  color: white;
}

.toast--warning {
  background-color: #ff9800;
  color: white;
}

.toast--info {
  background-color: var(--color-primary);
  color: white;
}

.toast__message {
  flex: 1;
  font-size: 14px;
  line-height: 1.4;
}

.toast__close {
  background: none;
  border: none;
  color: inherit;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.8;
}

.toast__close:hover {
  opacity: 1;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>