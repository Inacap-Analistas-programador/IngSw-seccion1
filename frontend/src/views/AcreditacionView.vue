<template>
  <div class="acreditacion-layout">
    
    <section class="columna-lista">
      <ParticipantesList 
        :participantes="participantes"
        @selectParticipante="handleSelectParticipante"
      />
      <div v-if="isLoading" class="loading-overlay">
        Cargando participantes...
      </div>
      <div v-else-if="fetchError" class="error-message">
        Error al cargar los datos: {{ fetchError }}
      </div>
    </section>

    <aside class="columna-acreditacion">
      <AcreditacionQR 
        :selectedParticipante="selectedParticipante"
        @acreditacionExitosa="handleAcreditacionExitosa"
        @selectParticipante="handleSelectParticipante"
      />
    </aside>
    
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
// 🚨 Asegúrate de que las rutas de importación sean correctas para tu proyecto
import ParticipantesList from '../components/ParticipantesList.vue'; 
import AcreditacionQR from '../components/AcreditacionQR.vue';
import apiService from '../services/apiService'; 
import { Participante } from '../types/Participante';

// --- ESTADO ---
const participantes = ref<Participante[]>([]);
const selectedParticipante = ref<Participante | null>(null);
const isLoading = ref(false);
const fetchError = ref<string | null>(null);

// --- FUNCIONES DE LÓGICA ---

/**
 * Obtiene la lista completa de participantes desde la API de Django.
 */
async function fetchParticipantes() {
  isLoading.value = true;
  fetchError.value = null;
  selectedParticipante.value = null; // Limpia la selección al recargar
  
  try {
    // 🚨 Asegúrate que este endpoint es el que tu compañero te proporcionó
    const response = await apiService.get('/participantes/'); 
    participantes.value = response.data;
  } catch (error) {
    console.error('Error al obtener participantes:', error);
    fetchError.value = 'No se pudo conectar con la API de participantes.';
  } finally {
    isLoading.value = false;
  }
}

/**
 * Establece el participante seleccionado para mostrar sus detalles en el panel QR.
 * @param participante El participante a seleccionar.
 */
function handleSelectParticipante(participante: Participante) {
  selectedParticipante.value = participante;
}

/**
 * Se ejecuta cuando un participante es acreditado exitosamente.
 * Recarga la lista para actualizar el estado del participante en la tabla.
 */
function handleAcreditacionExitosa() {
  alert('¡Acreditación confirmada! Actualizando lista...');
  fetchParticipantes();
}

// --- HOOK DE CICLO DE VIDA ---
onMounted(fetchParticipantes);

</script>

<style scoped>
/* Estilos principales para el layout de dos columnas */
.acreditacion-layout {
  display: flex;
  height: 100vh; /* Altura completa de la ventana */
  overflow: hidden;
  background-color: #f4f7f9;
}

.columna-lista {
  flex-grow: 1; /* Ocupa la mayor parte del espacio */
  overflow-y: auto;
  position: relative;
}

.columna-acreditacion {
  width: 350px; /* Ancho fijo para el panel QR */
  flex-shrink: 0;
  background-color: #ffffff;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

.loading-overlay, .error-message {
    padding: 15px;
    margin: 10px;
    border-radius: 4px;
    text-align: center;
}
.loading-overlay {
    background-color: #fff3cd;
    color: #856404;
}
.error-message {
    background-color: #f8d7da;
    color: #721c24;
}
</style>