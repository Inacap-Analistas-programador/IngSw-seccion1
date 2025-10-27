<template>
  <v-card>
    <v-card-title>{{ isEdit ? 'Editar Persona' : 'Agregar Persona' }}</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="submitForm">
        <v-text-field v-model="form.nombres" label="Nombres" required />
        <v-text-field v-model="form.email" label="Email" required />
        <v-text-field v-model="form.telefono" label="Teléfono" />
        <v-text-field v-model="form.direccion" label="Dirección" />
        <v-text-field v-model="form.fecha_nacimiento" label="Fecha de Nacimiento" type="date" />
        <v-switch v-model="form.vigente" label="Vigente" />
        <v-btn color="primary" type="submit">Guardar</v-btn>
        <v-btn @click="cancelar">Cancelar</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';
import axios from 'axios';

const props = defineProps({ persona: Object });
const emit = defineEmits(['saved', 'cancel']);
const isEdit = ref(!!props.persona);
const form = ref({
  nombres: '',
  email: '',
  telefono: '',
  direccion: '',
  fecha_nacimiento: '',
  vigente: true,
});

watch(() => props.persona, (val) => {
  if (val) Object.assign(form.value, val);
});

const submitForm = async () => {
  if (isEdit.value) {
    await axios.patch(`/api/personas/personas/${props.persona.id}/`, form.value);
  } else {
    await axios.post('/api/personas/personas/', form.value);
  }
  emit('saved');
};
const cancelar = () => emit('cancel');
</script>
