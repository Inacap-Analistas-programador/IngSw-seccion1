<template>
  <div class="stat-card">
    <div class="icon-wrapper" :style="{ backgroundColor: iconBgColor }">
      <Icon :name="icon" size="24" />
    </div>
    <div class="info">
      <span class="title">{{ title }}</span>
      <span class="value">{{ value }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from './Icon.vue';

defineProps({
  title: String,
  value: [String, Number],
  icon: {
    type: String,
    default: 'default-icon',
  },
  iconBgColor: {
    type: String,
    default: '#e3f2fd',
  },
});
</script>

<style scoped>
.stat-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}
.icon-wrapper {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
}
.info {
  display: flex;
  flex-direction: column;
}
.title {
  font-size: 0.9rem;
  color: var(--color-text-mute);
  margin-bottom: 0.25rem;
}
.value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-heading);
}
</style>
