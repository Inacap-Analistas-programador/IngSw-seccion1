<template>
  <MainLayout>
    <div class="preinscripcion-form">
      <h1>Formulario de Preinscripción</h1>
      <div class="p-fluid grid">
        <div class="field col-12">
          <label for="curso">Curso</label>
          <Dropdown id="curso" v-model="selectedCurso" :options="cursos" optionLabel="descripcion" optionValue="id" placeholder="Seleccione un curso" />
        </div>
        <div class="field col-12 md:col-6">
          <label for="rut">RUT</label>
          <div class="p-inputgroup">
            <InputText id="rut" v-model="rut" placeholder="Ingrese el RUT sin puntos ni guión" />
            <Button icon="pi pi-search" @click="buscarPorRut" />
          </div>
        </div>
        <div class="field col-12 md:col-6">
          <label for="nombres">Nombres</label>
          <InputText id="nombres" v-model="persona.nombres" />
        </div>
        <div class="field col-12 md:col-6">
          <label for="apellido_paterno">Apellido Paterno</label>
          <InputText id="apellido_paterno" v-model="persona.apellido_paterno" />
        </div>
        <div class="field col-12 md:col-6">
          <label for="apellido_materno">Apellido Materno</label>
          <InputText id="apellido_materno" v-model="persona.apellido_materno" />
        </div>
        <div class="field col-12">
          <label for="email">Email</label>
          <InputText id="email" v-model="persona.email" />
        </div>
      </div>
      <Button label="Preinscribir" @click="preinscribir" class="mt-2" />
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCursosStore } from '@/stores/cursos';
import { personaService } from '@/services/personaService';
import MainLayout from '@/components/layout/MainLayout.vue';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import { preinscripcionService } from '@/services/preinscripcionService';
import type { Persona } from '@/types/persona';
import type { Curso } from '@/types/curso';

const cursoStore = useCursosStore();

const cursos = ref<Curso[]>([]);
const selectedCurso = ref<number | null>(null);
const rut = ref('');
const persona = ref<Partial<Persona>>({});

onMounted(async () => {
  await cursoStore.fetchCursos();
  cursos.value = cursoStore.cursos;
});

const buscarPorRut = async () => {
  if (rut.value) {
    const personaEncontrada = await personaService.findByRut(rut.value);
    if (personaEncontrada) {
      persona.value = personaEncontrada;
    } else {
      alert('Persona no encontrada.');
    }
  }
};

const preinscribir = async () => {
  if (selectedCurso.value && persona.value.id) {
    try {
      await preinscripcionService.create({
        curso: selectedCurso.value,
        persona: persona.value.id,
      });
      alert('Preinscripción exitosa!');
      // Reset form
      selectedCurso.value = null;
      rut.value = '';
      persona.value = {};
    } catch (error) {
      alert('Error al preinscribir.');
      console.error(error);
    }
  } else {
    alert('Por favor, complete todos los campos.');
  }
};
</script>

<style scoped>
.preinscripcion-form {
  max-width: 800px;
  margin: 0 auto;
}
</style>
