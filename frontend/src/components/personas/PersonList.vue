<template>
  <v-card>
    <v-card-title>Lista de Personas</v-card-title>
    <v-data-table :headers="headers" :items="personas" :loading="loading">
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn icon @click="$emit('ver-detalle', item)"><v-icon>mdi-eye</v-icon></v-btn>
        <v-btn icon @click="$emit('editar-persona', item)"><v-icon>mdi-pencil</v-icon></v-btn>
        <v-btn icon @click="$emit('eliminar-persona', item.id)"><v-icon>mdi-delete</v-icon></v-btn>
      </template>
    </v-data-table>
  <v-btn color="primary" @click="$emit('abrir-formulario')">Agregar Persona</v-btn>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const personas = ref([]);
const loading = ref(false);
const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Nombres', key: 'nombres' },
  { title: 'Email', key: 'email' },
  { title: 'Teléfono', key: 'telefono' },
  { title: 'Acciones', key: 'actions', sortable: false },
];

const fetchPersonas = async () => {
  loading.value = true;
  try {
    const res = await axios.get('/api/personas/personas/');
    personas.value = res.data;
  } finally {
    loading.value = false;
  }
};

onMounted(fetchPersonas);

// Lógica delegada a eventos emitidos
</script>
