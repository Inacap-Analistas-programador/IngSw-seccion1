<template>
  <output class="notification-toast">
    <div class="message">{{ message }}</div>
    <button class="close" @click="$emit('close')">✕</button>
  </output>
</template>

<script>
export default {
  name: 'NotificationToast',
  props: { message: { type: String, required: true } }
}
</script>

<style scoped>
.notification-toast { position: fixed; bottom: 20px; right: 20px; background: #2c5aa0; color: white; padding: 10px 14px; border-radius: 6px; display:flex; gap:8px; align-items:center }
.notification-toast .close { background: transparent; border: none; color: white; cursor: pointer }
</style>
