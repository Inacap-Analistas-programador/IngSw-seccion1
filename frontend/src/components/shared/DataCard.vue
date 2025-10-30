<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
  icon: {
    type: String,
    default: '',
  },
});
</script>

<template>
  <div class="data-card">
    <div v-if="icon" class="icon">
      <i :class="icon"></i>
    </div>
    <div class="content">
      <h3 class="title">{{ title }}</h3>
      <p class="value">{{ value }}</p>
    </div>
  </div>
</template>

<style scoped>
.data-card {
  background-color: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: border-color 0.3s, background-color 0.3s;
}

.data-card:hover {
  border-color: var(--color-border-hover);
}

.icon {
  font-size: 2rem;
  color: var(--color-primary);
}

.content {
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 0.9rem;
  color: var(--color-text-mute);
  margin: 0;
  font-weight: 500;
}

.value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-heading);
  margin: 0;
}
</style>
