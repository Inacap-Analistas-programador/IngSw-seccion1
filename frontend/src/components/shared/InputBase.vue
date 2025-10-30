<template>
  <div class="base-input">
    <label v-if="label" :for="inputId" class="base-label">{{ label }}</label>
    <div class="input-wrapper">
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        @input="onInput"
        class="base-field"
        :class="{ 'has-error': !!error }"
        :disabled="disabled"
      />
    </div>
    <span v-if="error" class="base-error">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  modelValue: [String, Number],
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  type: { type: String, default: 'text' },
  disabled: { type: Boolean, default: false },
  error: { type: String, default: '' },
  id: { type: String, default: '' },
  autocomplete: { type: String, default: '' },
});

const emit = defineEmits(['update:modelValue']);

const inputId = computed(() => props.id || `base-input-${Math.random().toString(36).slice(2, 9)}`);

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};
</script>

<style scoped>
.base-input {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.base-label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--color-text);
}

.base-field {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background-color: var(--color-background-soft);
  color: var(--color-text);
  font-size: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.base-field:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.2);
}

.base-field.has-error {
  border-color: #ef4444;
}

.base-error {
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #ef4444;
}
</style>
