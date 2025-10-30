<template>
  <div class="datacard-list">
    <DataCard
      v-for="(card, idx) in cards"
      :key="idx"
      :title="card.title"
      :value="card.value"
      :description="card.description"
    >
      <template #icon>
        <i v-if="card.iconClass" :class="card.iconClass"></i>
      </template>
    </DataCard>
  </div>
</template>

<script>
import DataCard from './DataCard.vue'

export default {
  name: "DataCardList",
  components: { DataCard },
  props: {
    cards: {
      type: Array,
      required: true,
      default: () => []
    }
  }
}
</script>

<style scoped>
.datacard-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
