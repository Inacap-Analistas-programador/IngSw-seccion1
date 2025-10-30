<template>
  <BaseModal :show="show" @close="$emit('close')">
    <template #header>
      <h2>Crear Nuevo Curso</h2>
    </template>
    <template #body>
      <Stepper :steps="['Información General', 'Detalles', 'Fechas', 'Responsables']">
        <template #step-1>
          <div class="form-grid">
            <InputBase label="Título" v-model="form.titulo" required />
            <InputBase label="Descripción" v-model="form.descripcion" required />
            <BaseSelect label="Rama" v-model="form.rama" :options="ramaOptions" required />
            <BaseSelect label="Tipo" v-model="form.tipo" :options="tipoOptions" required />
          </div>
        </template>
        <template #step-2>
          <div class="form-grid">
            <InputBase label="Lugar" v-model="form.lugar" required />
            <BaseSelect label="Comuna" v-model="form.comuna" :options="comunaOptions" required />
            <BaseSelect label="Modalidad" v-model="form.modalidad" :options="modalidadOptions" required />
          </div>
        </template>
        <template #step-3>
          <div class="fechas-section">
            <div class="fechas-header">
              <h3>Fechas del Curso</h3>
              <BaseButton @click="addFecha" type="button" variant="secondary">Añadir Fecha</BaseButton>
            </div>
            <div v-for="(fecha, index) in form.fechas" :key="index" class="fecha-item">
              <InputBase type="date" label="Fecha de Inicio" v-model="fecha.fecha_inicio" required />
              <InputBase type="date" label="Fecha de Término" v-model="fecha.fecha_termino" required />
              <BaseSelect label="Tipo" v-model.number="fecha.tipo" :options="[{value: 1, label: 'Presencial'}, {value: 2, label: 'Online'}, {value: 3, label: 'Híbrido'}]" required />
              <BaseButton @click="removeFecha(index)" variant="danger" size="sm">Eliminar</BaseButton>
            </div>
          </div>
        </template>
        <template #step-4>
          <div class="form-grid">
            <BaseSelect label="Responsable" v-model="form.responsable" :options="responsableOptions" required />
          </div>
        </template>
      </Stepper>
    </template>
    <template #footer>
      <BaseButton @click="$emit('close')" variant="secondary">Cancelar</BaseButton>
      <BaseButton @click="submitForm">Crear</BaseButton>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCursosStore } from '@/stores/cursos';
import BaseModal from '@/components/shared/BaseModal.vue';
import InputBase from '@/components/shared/InputBase.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import BaseSelect from '@/components/shared/BaseSelect.vue';
import Stepper from '@/components/shared/Stepper.vue';
import type { Curso } from '@/types';

defineProps<{
  show: boolean;
}>();

const emit = defineEmits(['close']);

const cursosStore = useCursosStore();
const form = ref<Partial<Curso>>({
  titulo: '',
  descripcion: '',
  rama: '',
  tipo: '',
  lugar: '',
  comuna: '',
  modalidad: '',
  fechas: [],
  responsable: '',
  estado: 0, // Default state
});

const ramaOptions = [{ value: '', label: 'Seleccione una rama' }];
const tipoOptions = [{ value: '', label: 'Seleccione un tipo' }];
const comunaOptions = [{ value: '', label: 'Seleccione una comuna' }];
const modalidadOptions = [{ value: '', label: 'Seleccione una modalidad' }];
const responsableOptions = [{ value: '', label: 'Seleccione un responsable' }];

const addFecha = () => {
  if (!form.value.fechas) {
    form.value.fechas = [];
  }
  form.value.fechas.push({ fecha_inicio: '', fecha_termino: '', tipo: 1 });
};

const removeFecha = (index: number) => {
  if (form.value.fechas) {
    form.value.fechas.splice(index, 1);
  }
};

const submitForm = async () => {
  await cursosStore.createCurso(form.value as Curso);
  if (!cursosStore.error) {
    emit('close');
  }
};
</script>

<style scoped>
.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.fechas-section {
  margin-top: 1.5rem;
}

.fechas-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.fecha-item {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: 1rem;
  align-items: flex-end;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.fecha-item:last-child {
  border-bottom: none;
}
</style>
