<template>
  <dialog ref="dialogEl" class="base-modal" @close="onDialogClose">
    <div v-if="$slots.header" class="modal-header">
      <slot name="header"></slot>
    </div>
    <div class="modal-body">
      <slot name="body"></slot>
    </div>
    <div v-if="$slots.footer" class="modal-footer">
      <slot name="footer"></slot>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits(['close']);

const dialogEl = ref<HTMLDialogElement | null>(null);

watch(
  () => props.show,
  (newValue) => {
    if (newValue) {
      dialogEl.value?.showModal();
    } else {
      dialogEl.value?.close();
    }
  }
);

const onDialogClose = () => {
  emit('close');
};
</script>

<style scoped>
.base-modal {
  border: none;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  padding: 0;
  min-width: 400px;
}

.base-modal::backdrop {
  background: rgba(0, 0, 0, 0.5);
}

.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eee;
  font-size: 1.25rem;
  font-weight: 600;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
</style>
