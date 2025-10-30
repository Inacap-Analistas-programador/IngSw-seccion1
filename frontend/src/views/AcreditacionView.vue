<template>
  <div class="acreditacion-view">
    <h1>Acreditación de Curso</h1>
    <div v-if="acreditacionStore.loading">Cargando...</div>
    <div v-else-if="acreditacionStore.error">{{ acreditacionStore.error }}</div>
    <div v-else>
      <div v-for="participant in acreditacionStore.participantes" :key="participant.id">
        <AcreditacionCard :participant="participant" :course-id="courseId" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAcreditacionStore } from '@/stores/acreditacion';
import AcreditacionCard from '@/components/Acreditacion/AcreditacionCard.vue';

const route = useRoute();
const acreditacionStore = useAcreditacionStore();
const courseId = computed(() => Number(route.params.id));

onMounted(() => {
  acreditacionStore.fetchParticipantes(courseId.value);
});
</script>

<style scoped>
.acreditacion-view {
  padding: 20px;
}
</style>
