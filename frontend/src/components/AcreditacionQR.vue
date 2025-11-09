<template>
  <div class="qr-panel">
    <h3>Sistema de Acreditación</h3>

    <div class="qr-scanner-area">
      <div v-if="!isScanning">
        <button @click="startScanning" class="btn-primary">▶️ Iniciar Escáner QR</button>
        <p class="mt-2">O selecciona un participante de la lista.</p>
      </div>
      <div v-else class="scanner-placeholder">
        Cámara activa... (Simulación de escaneo)
        </div>
    </div>
    
    <hr v-if="selectedParticipante">

    <div v-if="selectedParticipante" class="participant-details">
      <h4>Detalles del Participante</h4>
      <p><strong>Nombre:</strong> {{ selectedParticipante.nombre_completo }}</p>
      <p><strong>RUT:</strong> {{ selectedParticipante.rut }}</p>
      <p><strong>Estado Actual:</strong> 
        <span :class="{'status-acreditado': selectedParticipante.estado_acreditacion === 'Acreditado'}">
          {{ selectedParticipante.estado_acreditacion }}
        </span>
      </p>

      <button 
        v-if="selectedParticipante.estado_acreditacion === 'Pendiente'"
        @click="acreditar(selectedParticipante.id)" 
        class="btn-acreditar"
      >
        ✅ Acreditar Ahora
      </button>
      <button 
        v-else 
        disabled 
        class="btn-disabled"
      >
        Ya Acreditado
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';
import { Participante } from '@/types/Participante';
import apiService from '@/services/apiService'; // Reutilizar tu servicio API

const props = defineProps<{
    selectedParticipante: Participante | null;
}>();

const emit = defineEmits(['acreditacionExitosa']);
const isScanning = ref(false);

function startScanning() {
    isScanning.value = true;
    // Lógica para inicializar la librería de escaneo de QR
}

async function acreditar(participanteId: number) {
    if (!confirm('¿Confirmas la acreditación de este participante?')) return;
    
    try {
        // PATCH para actualizar el estado del participante en Django
        await apiService.patch(`/participantes/${participanteId}/`, {
            estado_acreditacion: 'Acreditado'
        });
        
        alert('Acreditación exitosa!');
        emit('acreditacionExitosa'); // Notifica al componente principal para recargar la lista
    } catch (error) {
        console.error('Error al acreditar:', error);
        alert('Error al intentar acreditar. Revisa la consola.');
    }
}

// 🚨 Lógica de escaneo (simulación, requiere librería real):
// function handleScan(decodedQrCode: string) {
//     isScanning.value = false;
//     verifyQr(decodedQrCode);
// }

// async function verifyQr(qrCode: string) {
//     try {
//         const response = await apiService.post('/acreditacion/verificar/', { codigo_qr: qrCode });
//         // Almacena el participante devuelto por la API en el estado principal
//         emit('selectParticipante', response.data); 
//     } catch (error) {
//         console.error('QR no válido:', error);
//         alert('Código QR no encontrado o no válido.');
//     }
// }
</script>

<style scoped>
.qr-panel {
    padding: 20px;
}
.qr-scanner-area {
    border: 2px dashed #ccc;
    padding: 30px;
    text-align: center;
    margin-bottom: 20px;
}
.btn-primary {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;
}
.participant-details {
    border: 1px solid #ddd;
    padding: 15px;
    border-radius: 4px;
}
.btn-acreditar {
    margin-top: 15px;
    background-color: #28a745;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
}
.btn-disabled {
    margin-top: 15px;
    background-color: #6c757d;
    color: #dee2e6;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: not-allowed;
}
</style>