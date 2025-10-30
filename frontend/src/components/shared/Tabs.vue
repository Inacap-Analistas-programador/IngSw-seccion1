<template>
  <div class="tabs">
    <ul class="tabs-header">
      <li
        v-for="title in tabTitles"
        :key="title"
        :class="{ active: title === selectedTitle }"
        @click="selectedTitle = title"
      >
        {{ title }}
      </li>
    </ul>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, provide, useSlots, onMounted } from 'vue';

const slots = useSlots();
const tabTitles = ref<string[]>([]);
const selectedTitle = ref<string>('');

provide('selectedTitle', selectedTitle);

onMounted(() => {
  if (slots.default) {
    tabTitles.value = slots.default().map((slot) => slot.props?.title);
    if (tabTitles.value.length) {
      selectedTitle.value = tabTitles.value[0];
    }
  }
});
</script>

<style scoped>
.tabs-header {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  border-bottom: 1px solid #ccc;
}
.tabs-header li {
  padding: 10px 20px;
  cursor: pointer;
  position: relative;
}
.tabs-header li.active {
  font-weight: bold;
  color: var(--color-primary);
}
.tabs-header li.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--color-primary);
}
</style>
