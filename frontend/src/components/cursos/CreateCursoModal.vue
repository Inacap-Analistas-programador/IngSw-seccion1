<template>
  <BaseModal :show="props.show" @close="$emit('close')">
    <template #header>
      <h2>{{ isEditing ? 'Editar Curso' : 'Crear Nuevo Curso' }}</h2>
    </template>
    <template #body>
      <Stepper :steps="['Información General', 'Detalles', 'Fechas', 'Responsables']">
        <template #step-1>
          <div class="form-grid">
            <InputBase label="Título" v-model="form.titulo" required />
            <InputBase label="Descripción" v-model="form.descripcion" required />
            <BaseSelect label="Rama" v-model="selectedRama" :options="ramaOptions" required />
            <BaseSelect label="Tipo" v-model="selectedTipo" :options="tipoOptions" required />
          </div>
        </template>
        <template #step-2>
          <div class="form-grid">
            <InputBase label="Lugar" v-model="form.lugar" required />
            <BaseSelect label="Comuna" v-model="selectedComuna" :options="comunaOptions" required />
            <BaseSelect label="Modalidad" v-model="form.modalidad" :options="modalidadOptions" required />
            <BaseSelect label="Cargo Responsable" v-model="selectedCargo" :options="cargoOptions" required />
            <InputBase type="date" label="Fecha de Solicitud" v-model="form.fecha_solicitud" />
            <InputBase label="Quien Administra" v-model="form.administra" />
            <InputBase type="number" label="Cuota con Almuerzo" v-model.number="form.cuota_con_almuerzo" />
            <InputBase type="number" label="Cuota sin Almuerzo" v-model.number="form.cuota_sin_almuerzo" />
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
            <BaseSelect label="Responsable" v-model="selectedResponsable" :options="responsableOptions" required />
          </div>
        </template>
      </Stepper>
    </template>
    <template #footer>
      <BaseButton @click="$emit('close')" variant="secondary">Cancelar</BaseButton>
      <div style="flex:1;display:flex;align-items:center;justify-content:flex-start;margin-right:1rem;">
        <span v-if="cursosStore.error" class="form-error">{{ cursosStore.error }}</span>
      </div>
      <BaseButton @click="submitForm" :disabled="cursosStore.loading">{{ isEditing ? 'Guardar cambios' : 'Crear' }}</BaseButton>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, reactive, watch, toRaw, onMounted } from 'vue';
import { useCursosStore } from '@/stores/cursos';
import { useCatalogoStore } from '@/stores/catalogo';
import { usePersonasStore } from '@/stores/personas';
import BaseModal from '@/components/shared/BaseModal.vue';
import InputBase from '@/components/shared/InputBase.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import BaseSelect from '@/components/shared/BaseSelect.vue';
import Stepper from '@/components/shared/Stepper.vue';
import type { Curso } from '@/types';


const props = defineProps<{
  show: boolean;
  curso?: Partial<Curso> | null;
}>();

const emit = defineEmits(['close']);

const cursosStore = useCursosStore();

const defaultForm = () => ({
  titulo: '',
  descripcion: '',
  rama: '',
  tipo: '',
  lugar: '',
  comuna: '',
  modalidad: '',
  fechas: [] as any[],
  responsable: '',
  cargo_responsable: '',
  fecha_solicitud: '',
  administra: '',
  cuota_con_almuerzo: null as number | null,
  cuota_sin_almuerzo: null as number | null,
  estado: 0, // Default state
});

const form = reactive<any>(defaultForm());

const isEditing = ref(false);

const catalogoStore = useCatalogoStore();
const personasStore = usePersonasStore();

// Opciones para los selects
const ramaOptions = ref<any[]>([{ value: '', label: 'Seleccione una rama' }]);
const tipoOptions = ref<any[]>([{ value: '', label: 'Seleccione un tipo' }]);
const comunaOptions = ref<any[]>([{ value: '', label: 'Seleccione una comuna' }]);
const modalidadOptions = ref<any[]>([
  { value: '', label: 'Seleccione una modalidad' },
  { value: 1, label: 'Presencial' },
  { value: 2, label: 'Online' },
  { value: 3, label: 'Híbrido' },
]);
const responsableOptions = ref<any[]>([{ value: '', label: 'Seleccione un responsable' }]);
const cargoOptions = ref<any[]>([{ value: '', label: 'Seleccione un cargo' }]);

// Selected ids for controlled selects (DEBEN declararse ANTES de los watchers)
const selectedRama = ref<string | number | undefined>('');
const selectedTipo = ref<string | number | undefined>('');
const selectedComuna = ref<string | number | undefined>('');
const selectedResponsable = ref<string | number | undefined>('');
const selectedCargo = ref<string | number | undefined>('');

// Watchers para sincronizar los selects con el formulario
watch(selectedRama, (val) => (form.rama = val));
watch(selectedTipo, (val) => (form.tipo = val));
watch(selectedComuna, (val) => (form.comuna = val));
watch(selectedResponsable, (val) => (form.responsable = val));
watch(selectedCargo, (val) => (form.cargo_responsable = val));

// Cuando cambie la prop curso o se abra el modal, precargar datos
watch(
  () => [props.show, props.curso],
  () => {
    if (props.show && props.curso) {
      // Resetear el formulario primero
      const defaultValues = defaultForm();
      Object.assign(form, defaultValues);
      
      // Copiar valores del curso al formulario
      const rawCurso: any = toRaw(props.curso);
      
      // Copiar campos básicos
      if (rawCurso.titulo) form.titulo = rawCurso.titulo;
      if (rawCurso.descripcion) form.descripcion = rawCurso.descripcion;
      if (rawCurso.lugar) form.lugar = rawCurso.lugar;
      if (rawCurso.modalidad !== undefined) form.modalidad = rawCurso.modalidad;
      if (rawCurso.cargo_responsable) form.cargo_responsable = rawCurso.cargo_responsable;
      if (rawCurso.fecha_solicitud) form.fecha_solicitud = rawCurso.fecha_solicitud;
      if (rawCurso.administra) form.administra = rawCurso.administra;
      if (rawCurso.cuota_con_almuerzo !== undefined) form.cuota_con_almuerzo = rawCurso.cuota_con_almuerzo;
      if (rawCurso.cuota_sin_almuerzo !== undefined) form.cuota_sin_almuerzo = rawCurso.cuota_sin_almuerzo;
      if (rawCurso.estado !== undefined) form.estado = rawCurso.estado;
      
      // Copiar fechas
      if (Array.isArray(rawCurso.fechas)) {
        form.fechas = rawCurso.fechas.map((fecha: any) => ({
          fecha_inicio: fecha.fecha_inicio,
          fecha_termino: fecha.fecha_termino,
          tipo: fecha.tipo || 1
        }));
      }
      
      // Actualizar los selects - manejar objetos o IDs
      selectedRama.value = (typeof rawCurso.rama === 'object' && rawCurso.rama?.id) ? rawCurso.rama.id : rawCurso.rama || '';
      selectedTipo.value = (typeof rawCurso.tipo_curso === 'object' && rawCurso.tipo_curso?.id) ? rawCurso.tipo_curso.id : rawCurso.tipo_curso || '';
      selectedComuna.value = (typeof rawCurso.comuna === 'object' && rawCurso.comuna?.id) ? rawCurso.comuna.id : rawCurso.comuna || '';
      selectedResponsable.value = (typeof rawCurso.responsable === 'object' && rawCurso.responsable?.id) ? rawCurso.responsable.id : rawCurso.responsable || '';
  selectedCargo.value = (typeof rawCurso.cargo_responsable === 'object' && rawCurso.cargo_responsable?.id) ? rawCurso.cargo_responsable.id : rawCurso.cargo_responsable || '';
      
      isEditing.value = true;
    } else {
      // Resetear todo para nuevo curso
      const defaultValues = defaultForm();
      Object.assign(form, defaultValues);
      selectedRama.value = '';
      selectedTipo.value = '';
      selectedComuna.value = '';
      selectedResponsable.value = '';
      selectedCargo.value = '';
      isEditing.value = false;
    }
  },
  { immediate: true }
);

onMounted(async () => {
  // cargar catálogos y personas para selects
  await catalogoStore.fetchAllCatalogos();
  await personasStore.fetchPersonas();
  // map opciones
  ramaOptions.value = [{ value: '', label: 'Seleccione una rama' }].concat(
    catalogoStore.ramas.map((r: any) => ({ value: r.id || r.pk || r.ram_id || r.code || r.descripcion || r.nombre, label: r.descripcion || r.nombre }))
  );
  // map tipos de curso
  tipoOptions.value = [{ value: '', label: 'Seleccione un tipo' }].concat(
    catalogoStore.tiposCurso.map((t: any) => ({ value: t.id || t.tcu_id, label: t.descripcion || t.nombre }))
  );
  responsableOptions.value = [{ value: '', label: 'Seleccione un responsable' }].concat(
    personasStore.personas.map((p: any) => ({ value: p.id || p.per_id || p.pk, label: p.nombre_completo || `${p.nombres || ''} ${p.apellidos || ''}`.trim() }))
  );
  cargoOptions.value = [{ value: '', label: 'Seleccione un cargo' }].concat(
    catalogoStore.cargos.map((c: any) => ({ value: c.id || c.car_id, label: c.descripcion || c.nombre }))
  );
  // map comunas
  comunaOptions.value = [{ value: '', label: 'Seleccione una comuna' }].concat(
    catalogoStore.comunas.map((c: any) => ({ value: c.id || c.com_id, label: c.descripcion || c.nombre }))
  );
});

const addFecha = () => {
  if (!form.fechas) form.fechas = [];
  form.fechas.push({ fecha_inicio: '', fecha_termino: '', tipo: 1 });
};

const removeFecha = (index: number) => {
  if (form.fechas) form.fechas.splice(index, 1);
};

const submitForm = async () => {
  if (!confirm(isEditing.value ? '¿Guardar los cambios en este curso?' : '¿Crear este curso?')) return;
  
  cursosStore.loading = true;
  cursosStore.error = null;
  
  try {
    // Validar campos requeridos
    if (!selectedTipo.value) {
      alert('Debe seleccionar un tipo de curso');
      return;
    }
    if (!selectedResponsable.value) {
      alert('Debe seleccionar un responsable');
      return;
    }
    if (!selectedCargo.value) {
      alert('Debe seleccionar un cargo responsable');
      return;
    }
    
    // Generar código corto (máximo 10 caracteres)
    const generateCodigo = () => {
      const timestamp = Date.now().toString().slice(-6);
      return `CUR${timestamp}`;
    };
    
    // Preparar el payload con los nombres correctos de campos del backend
    const payload: any = {
      tipo_curso: Number(selectedTipo.value),
      persona_responsable: Number(selectedResponsable.value),
      cargo_responsable: Number(selectedCargo.value),
      comuna_lugar: selectedComuna.value ? Number(selectedComuna.value) : null,
      codigo: form.codigo || generateCodigo(),
      descripcion: form.descripcion || form.titulo || 'Sin descripción',
      observacion: form.observacion || '',
      administra: Number(form.administra) || 1,
      cuota_con_almuerzo: Number(form.cuota_con_almuerzo) || 0,
      cuota_sin_almuerzo: Number(form.cuota_sin_almuerzo) || 0,
      modalidad: Number(form.modalidad) || 1,
      tipo_curso_enum: Number(form.tipo_curso_enum) || 1,
      lugar: form.lugar || '',
      estado: Number(form.estado) || 0,
      fecha_solicitud: form.fecha_solicitud || new Date().toISOString().split('T')[0],
      fecha_hora: form.fecha_hora || new Date().toISOString(),
    };

    // Solo incluir el usuario si estamos editando (ya existe)
    if (isEditing.value && props.curso && (props.curso as any).usuario) {
      payload.usuario = Number((props.curso as any).usuario);
    }

    console.debug('Modal: Enviando payload:', payload);
    console.debug('Modal: isEditing:', isEditing.value);

    if (isEditing.value && props.curso && (props.curso as any).id) {
      console.log('Modal: Actualizando curso ID:', (props.curso as any).id);
      await cursosStore.updateCurso((props.curso as any).id, payload);
      alert('Curso actualizado correctamente');
    } else {
      console.log('Modal: Creando nuevo curso');
      await cursosStore.createCurso(payload);
      alert('Curso creado correctamente');
    }

    // Limpiar el formulario
    Object.assign(form, defaultForm());
    selectedRama.value = '';
    selectedTipo.value = '';
    selectedComuna.value = '';
    selectedResponsable.value = '';
    
    // Cerrar el modal
    emit('close');
    
  } catch (err: any) {
    console.error('Modal: Error al guardar curso:', err);
    console.error('Modal: Detalles del error:', err?.response?.data);
    
    // Extraer mensajes de error más legibles
    let errorMsg = 'Error al guardar el curso';
    if (err?.response?.data?.error?.detail) {
      const details = err.response.data.error.detail;
      const errorMessages = Object.entries(details).map(([field, msgs]: [string, any]) => {
        return `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`;
      });
      errorMsg = errorMessages.join('\n');
    } else if (err?.response?.data?.message) {
      errorMsg = err.response.data.message;
    } else if (err?.message) {
      errorMsg = err.message;
    }
    
    alert('Error:\n' + errorMsg);
    cursosStore.error = errorMsg;
  } finally {
    cursosStore.loading = false;
  }
};
</script>

<style scoped>
.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .form-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
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
