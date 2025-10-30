e<template>
  <BaseModal :show="show" @close="$emit('close')">
    <template #header>
      <h2>{{ isEdit ? 'Editar Persona' : 'Crear Persona' }}</h2>
    </template>
    <template #body>
      <form @submit.prevent="submitForm" class="form-grid">
        <InputBase label="Nombres" v-model="form.nombres" required />
        <InputBase label="Apellido Paterno" v-model="form.apelpat" required />
        <InputBase label="Apellido Materno" v-model="form.apelmat" />
        <InputBase label="Email" v-model="form.email" type="email" required />
        <InputBase label="RUN" v-model.number="form.run" type="number" required />
        <InputBase label="DV" v-model="form.dv" required />
      </form>
    </template>
    <template #footer>
      <BaseButton @click="$emit('close')" variant="secondary">Cancelar</BaseButton>
      <BaseButton @click="submitForm">{{ isEdit ? 'Guardar Cambios' : 'Crear' }}</BaseButton>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { usePersonasStore } from '@/stores/personas';
import type { Persona } from '@/types';
import BaseModal from '@/components/shared/BaseModal.vue';
import InputBase from '@/components/shared/InputBase.vue';
import BaseButton from '@/components/shared/BaseButton.vue';

const props = defineProps<{
  show: boolean;
  persona?: Persona;
}>();

const emit = defineEmits(['close']);

const personasStore = usePersonasStore();
const isEdit = ref(false);

const form = reactive<Partial<Persona>>({
  nombres: '',
  apelpat: '',
  apelmat: '',
  email: '',
  run: undefined,
  dv: '',
});

watch(() => props.persona, (newVal) => {
  if (newVal) {
    isEdit.value = true;
    Object.assign(form, newVal);
  } else {
    isEdit.value = false;
    for (const key of Object.keys(form)) {
      form[key as keyof typeof form] = undefined;
    }
  }
});

const submitForm = async () => {
  if (isEdit.value) {
    await personasStore.updatePersona(props.persona!.id, form as Persona);
  } else {
    await personasStore.createPersona(form as Persona);
  }
  if (!personasStore.error) {
    emit('close');
  }
};
</script>

<style scoped>
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}
</style>
