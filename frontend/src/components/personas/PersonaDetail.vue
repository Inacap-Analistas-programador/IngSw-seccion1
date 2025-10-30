<template>
  <div class="persona-detail-view">
    <div class="card profile-header">
      <div class="profile-main">
        <img :src="persona.foto || '/default-avatar.png'" alt="Foto de perfil" class="avatar" />
        <div>
          <h1>{{ persona.nombres }} {{ persona.apelpat }}</h1>
        </div>
      </div>
      <div class="profile-actions">
        <BaseButton variant="secondary">Editar</BaseButton>
      </div>
    </div>

    <div class="card">
      <h2>Información de Contacto</h2>
      <div class="details-grid">
        <div>
          <label for="email">Email</label>
          <p id="email">{{ persona.email }}</p>
        </div>
        <div>
          <label for="telefono">Teléfono</label>
          <p id="telefono">{{ persona.fono }}</p>
        </div>
        <div>
          <label for="direccion">Dirección</label>
          <p id="direccion">{{ persona.direccion }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Persona } from '@/types';
import BaseButton from '@/components/shared/BaseButton.vue';

defineProps<{
  persona: Persona;
}>();
</script>

<style scoped>
.persona-detail-view {
  padding: 2rem;
}
.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  padding: 2rem;
  margin-bottom: 2rem;
}
.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.profile-main {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}
.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}
h1 {
  font-size: 2rem;
  font-weight: 700;
}
.text-muted {
  color: #6c757d;
}
.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}
.details-grid label {
  font-weight: 600;
  color: #495057;
}
</style>
