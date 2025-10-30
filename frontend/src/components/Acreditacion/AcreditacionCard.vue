<template>
  <div class="acreditacion-card">
    <div class="participant-info">
      <h3>{{ participant.nombre }}</h3>
      <p>RUT: {{ participant.rut }}</p>
    </div>
    <div class="acreditacion-status">
      <p v-if="isAcredited">Acreditado ✔</p>
      <BaseButton v-else-if="participant.pago_confirmado" @click="acreditar">Acreditar</BaseButton>
      <p v-else>Pago pendiente</p>
    </div>
    <div v-if="qrCodeValue" class="qr-code">
      <qrcode-vue :value="qrCodeValue" :size="100" level="H" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAcreditacionStore } from '@/stores/acreditacion';
import BaseButton from '@/components/shared/BaseButton.vue';
import QrcodeVue from 'qrcode.vue';

const props = defineProps<{
  participant: any; // Replace with actual type
  courseId: number;
}>();

const acreditacionStore = useAcreditacionStore();
const isAcredited = ref(props.participant.acreditado);
const qrCodeValue = ref<string | null>(null);

const acreditar = async () => {
  await acreditacionStore.acreditarParticipante(props.courseId, props.participant.id);
  if (!acreditacionStore.error) {
    isAcredited.value = true;
    // Generate QR code value
    qrCodeValue.value = JSON.stringify({
      participantId: props.participant.id,
      courseId: props.courseId,
      timestamp: new Date().toISOString(),
    });
  }
};
</script>

<style scoped>
.acreditacion-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.qr-code {
  margin-left: 20px;
}
</style>
