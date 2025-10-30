<template>
  <button
    class="base-button"
    :class="[sizeClass, variantClass, { 'is-disabled': disabled, 'is-block': block }]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (val: string) => [
      'primary', 'secondary', 'success', 'info', 'warning', 'danger', 'neutral', 'outline', 'ghost'
    ].includes(val),
  },
  size: {
    type: String,
    default: 'sm',
    validator: (val: string) => ['sm', 'md', 'lg', 'xl'].includes(val),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  block: {
    type: Boolean,
    default: false,
  },
});

const sizeClass = computed(() => `btn--${props.size}`);
const variantClass = computed(() => `btn--${props.variant}`);
</script>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid transparent;
  font-weight: 600;
  line-height: 1.2;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.base-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.3);
}

.base-button.is-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.base-button.is-block {
  width: 100%;
}

/* Sizes */
.btn--sm { padding: 0.5rem 0.75rem; font-size: 0.875rem; }
.btn--md { padding: 0.625rem 1rem; font-size: 1rem; }
.btn--lg { padding: 0.75rem 1.25rem; font-size: 1.125rem; }
.btn--xl { padding: 1rem 1.5rem; font-size: 1.25rem; }

/* Variants */
.btn--primary {
  background-color: var(--color-primary);
  color: #ffffff;
}
.btn--primary:hover {
  background-color: var(--color-primary-soft);
}

.btn--secondary {
  background-color: transparent;
  color: var(--color-primary);
  border-color: var(--color-border);
}
.btn--secondary:hover {
  background-color: rgba(0,0,0,0.05);
}

.btn--accent {
  background-color: var(--color-accent);
  color: #ffffff;
}
.btn--accent:hover {
  opacity: 0.9;
}

.btn--danger {
  background-color: #dc2626;
  color: #ffffff;
}
.btn--danger:hover {
  background-color: #b91c1c;
}
</style>
