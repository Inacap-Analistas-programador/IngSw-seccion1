<template>
  <div class="curso-detail-view">
    <div v-if="curso">
      <h1>{{ curso.descripcion }}</h1>
      <Tabs>
        <Tab title="Detalles">
          <p><strong>Código:</strong> {{ curso.codigo }}</p>
          <p><strong>Estado:</strong> {{ curso.estado }}</p>
          <div class="fechas-list">
            <h3>Fechas</h3>
            <ul>
              <li v-for="fecha in curso.fechas" :key="fecha.id">
                {{ fecha.fecha_inicio }} - {{ fecha.fecha_termino }} ({{ fecha.tipo }})
              </li>
            </ul>
          </div>
        </Tab>
        <Tab title="Participantes">
          <p>Gestiona los participantes y sus acreditaciones.</p>
          <BaseButton @click="goToAcreditacion">Ir a Acreditación</BaseButton>
        </Tab>
      </Tabs>
    </div>
    <div v-else>
      <p>Cargando...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCursosStore } from '@/stores/cursos';
import type { Curso } from '@/types';
import Tabs from '@/components/shared/Tabs.vue';
import Tab from '@/components/shared/Tab.vue';
import BaseButton from '@/components/shared/BaseButton.vue';

const route = useRoute();
const router = useRouter();
const cursosStore = useCursosStore();
const curso = ref<Curso | null>(null);

onMounted(async () => {
  const cursoId = Number(route.params.id);
  await cursosStore.fetchCursos();
  curso.value = cursosStore.cursos.find(c => c.id === cursoId) || null;
});

const goToAcreditacion = () => {
  router.push({ name: 'acreditacion', params: { id: curso.value?.id } });
};
</script>

<style scoped>
.curso-detail-view {
  padding: 20px;
}
.fechas-list {
  margin-top: 20px;
}
</style>
