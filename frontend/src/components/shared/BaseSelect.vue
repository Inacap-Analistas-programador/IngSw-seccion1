<template>
  <div class="base-select">
    <label v-if="label" :for="id" class="base-label">{{ label }}</label>
    <div class="select-wrapper">
      <select
        :id="id"
        :value="modelValue"
        @change="handleChange"
        :disabled="disabled"
        class="base-select-element"
        :class="{ 'has-error': !!error }"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
    </div>
    <span v-if="error" class="base-error">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface SelectOption {
  value: string | number;
  label: string;
}

const props = defineProps({
  modelValue: [String, Number],
  options: {
    type: Array as () => SelectOption[],
    required: true,
  },
  label: { type: String, default: '' },
  placeholder: { type: String, default: 'Seleccione' },
  disabled: { type: Boolean, default: false },
  error: { type: String, default: '' },
  id: { type: String, default: '' },
});

const emit = defineEmits(['update:modelValue']);

const id = computed(() => props.id || `base-select-${Math.random().toString(36).slice(2, 9)}`);

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('update:modelValue', target.value);
};
</script>

<style scoped>
.base-select {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.base-label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--color-text);
}

.select-wrapper {
  position: relative;
}

.base-select-element {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background-color: var(--color-background-soft);
  color: var(--color-text);
  font-size: 1rem;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.base-select-element:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.2);
}

.base-select-element.has-error {
  border-color: #ef4444;
}

.base-error {
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #ef4444;
}
</style>
