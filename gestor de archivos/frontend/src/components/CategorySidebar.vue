<template>
  <nav class="sidebar-nav">
    <h2>📂 Categorías</h2>
    <ul class="category-list">
      <li 
        :class="{ active: selected === 'all' }" 
        @click="selectFilter('all')"
      >
        Todos los Archivos
      </li>
      
      <li 
        :class="{ active: selected === 'favoritos' }" 
        @click="selectFilter('favoritos')"
      >
        ⭐ Favoritos
      </li>

      <hr>

      <li 
        v-for="cat in categories" 
        :key="cat.id" 
        :class="{ active: selected === cat.nombre.toLowerCase() }"
        @click="selectFilter(cat.nombre.toLowerCase())"
      >
        {{ cat.nombre }}
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';
import { Categoria } from '@/types/Archivo'; // Asegúrate de ajustar la ruta si es necesario

const props = defineProps<{
    categories: Categoria[];
}>();

const emit = defineEmits(['filterSelected']);
const selected = ref('all');

function selectFilter(filter: string) {
    selected.value = filter;
    emit('filterSelected', filter);
}
</script>

<style scoped>
.sidebar-nav {
    padding: 20px;
}
.category-list {
    list-style: none;
    padding: 0;
}
.category-list li {
    padding: 8px 10px;
    cursor: pointer;
    border-radius: 4px;
    margin-bottom: 5px;
    transition: background-color 0.2s;
}
.category-list li:hover,
.category-list li.active {
    background-color: #e9ecef;
    font-weight: bold;
}
hr {
    margin: 10px 0;
    border: 0;
    border-top: 1px solid #eee;
}
</style>