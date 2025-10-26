<template>
  <v-card>
    <v-card-title>Detalle de Persona</v-card-title>
    <v-card-text>
      <div><strong>ID:</strong> {{ persona.id }}</div>
      <div><strong>Nombres:</strong> {{ persona.nombres }}</div>
      <div><strong>Email:</strong> {{ persona.email }}</div>
      <div><strong>Teléfono:</strong> {{ persona.telefono }}</div>
      <div><strong>Dirección:</strong> {{ persona.direccion }}</div>
      <div><strong>Fecha de Nacimiento:</strong> {{ persona.fecha_nacimiento }}</div>
      <div><strong>Vigente:</strong> {{ persona.vigente ? 'Sí' : 'No' }}</div>
    </v-card-text>
    <v-card-actions>
      <v-btn @click="$emit('close')">Cerrar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { defineProps } from 'vue';
defineProps({ persona: Object });
</script>
