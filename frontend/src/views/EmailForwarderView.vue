<template>
  <div class="email-forwarder-view">
    <div class="header">
      <h1>Reenviador de Correos</h1>
    </div>
    <div class="card">
      <form @submit.prevent="sendEmail">
        <div class="form-grid">
          <InputBase v-model="from" label="De" type="email" required />
          <InputBase v-model="to" label="Para" type="email" required />
        </div>
        <InputBase v-model="subject" label="Asunto" required />
        <textarea v-model="body" placeholder="Cuerpo del correo" required></textarea>
        <BaseButton type="submit" :disabled="emailForwarderStore.loading">
          {{ emailForwarderStore.loading ? 'Enviando...' : 'Enviar' }}
        </BaseButton>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useEmailForwarderStore } from '@/stores/emailForwarder';
import { useNotification } from '@/composables/useNotification';
import InputBase from '@/components/shared/InputBase.vue';
import BaseButton from '@/components/shared/BaseButton.vue';

const emailForwarderStore = useEmailForwarderStore();
const { showNotification } = useNotification();

const from = ref('');
const to = ref('');
const subject = ref('');
const body = ref('');

const sendEmail = async () => {
  await emailForwarderStore.sendEmail({
    from: from.value,
    to: to.value,
    subject: subject.value,
    body: body.value,
  });

  if (emailForwarderStore.error) {
    showNotification({ message: emailForwarderStore.error, type: 'error' });
  } else {
    showNotification({ message: 'Correo enviado exitosamente.', type: 'success' });
    // Reset form
    from.value = '';
    to.value = '';
    subject.value = '';
    body.value = '';
  }
};
</script>

<style scoped>
.email-forwarder-view {
  padding: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.card {
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}
textarea {
  width: 100%;
  min-height: 200px;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: inherit;
  font-size: 1rem;
}
</style>
