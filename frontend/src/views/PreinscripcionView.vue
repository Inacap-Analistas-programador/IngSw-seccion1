<template>
  <div class="preinscripcion-view">
    <h1>Wizard de Preinscripciรณn</h1>
    <Stepper :steps="['Selecciรณn de curso', 'Datos personales', 'Validaciones', 'Confirmaciรณn']">
      <template #step-1>
        <div class="curso-selection">
          <h2>Selecciona un curso</h2>
          <div v-if="cursosStore.loading">Cargando cursos...</div>
          <div v-else>
            <div v-for="curso in cursosStore.cursos" :key="curso.id" class="curso-item" @click="selectCurso(curso)">
              {{ curso.descripcion }}
            </div>
          </div>
        </div>
      </template>
      <template #step-2>
        <div class="form-grid">
          <InputBase label="RUT" v-model="form.rut" @blur="buscarPersona" />
          <InputBase label="Nombre" v-model="form.nombre" required />
          <InputBase label="Correo" v-model="form.email" type="email" required />
          <InputBase label="Telรฉfono" v-model="form.telefono" required />
        </div>
      </template>
      <template #step-3>
        <div class="validation-step">
          <h2>Validaciones</h2>
          <div v-if="!isValidRut" class="error">RUT invรกlido.</div>
          <div v-if="!isAgeCompatible" class="error">Edad no compatible con el curso.</div>
          <div v-if="!areCuposAvailable" class="error">No hay cupos disponibles.</div>
          <div v-if="isValidRut && isAgeCompatible && areCuposAvailable" class="success">
            ยกTodo en orden! Puedes continuar.
          </div>
        </div>
      </template>
      <template #step-4>
        <div class="confirmation-step">
          <h2>Resumen de la Preinscripción</h2>
          <p><strong>Curso:</strong> {{ selectedCurso?.descripcion }}</p>
          <p><strong>Nombre:</strong> {{ form.nombre }}</p>
          <p><strong>RUT:</strong> {{ form.rut }}</p>
          <p><strong>Email:</strong> {{ form.email }}</p>
          <p><strong>Teléfono:</strong> {{ form.telefono }}</p>
          <BaseButton @click="submitPreinscripcion">Enviar Preinscripción</BaseButton>
        </div>
      </template>
    </Stepper>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useCursosStore } from '@/stores/cursos';
import type { Curso } from '@/types';
import Stepper from '@/components/shared/Stepper.vue';
import InputBase from '@/components/shared/InputBase.vue';
import { usePersonasStore } from '@/stores/personas';

const cursosStore = useCursosStore();
const personasStore = usePersonasStore();
const selectedCurso = ref<Curso | null>(null);

const form = reactive({
  rut: '',
  nombre: '',
  email: '',
  telefono: '',
});

const isValidRut = computed(() => {
  // Lรณgica de validaciรณn de RUT (simulada)
  return form.rut.length > 5;
});

const isAgeCompatible = computed(() => {
  // Lรณgica de validaciรณn de edad (simulada)
  return true;
});

const areCuposAvailable = computed(() => {
  // Lรณgica de validaciรณn de cupos (simulada)
  return true;
});

onMounted(() => {
  cursosStore.fetchCursos();
});

const selectCurso = (curso: Curso) => {
  selectedCurso.value = curso;
  // Avanzar al siguiente paso
};

const buscarPersona = async () => {
  if (form.rut) {
    const persona = await personasStore.fetchPersonaByRut(form.rut);
    if (persona) {
      form.nombre = persona.nombres;
      form.email = persona.email;
      form.telefono = persona.fono;
    }
  }
};

const submitPreinscripcion = () => {
  // Lógica para enviar la preinscripción
  alert('Preinscripción enviada');
};
</script>

<style scoped>
.preinscripcion-view {
  padding: 2rem;
}
</style>
