<template>
  <div v-if="title === selectedTitle" class="tab-content">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';

const props = defineProps<{
  title: string;
}>();

const selectedTitle = inject('selectedTitle');
</script>

<style scoped>
.tab-content {
  padding: 20px;
  border: 1px solid #ccc;
  border-top: none;
}
</style>
