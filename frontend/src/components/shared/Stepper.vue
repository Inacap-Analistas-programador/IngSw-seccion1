<template>
  <div class="stepper">
    <div class="steps">
      <div
        v-for="(step, index) in steps"
        :key="index"
        class="step"
        :class="{ active: index === currentStep, completed: index < currentStep }"
      >
        <div class="step-number">{{ index + 1 }}</div>
        <div class="step-title">{{ step }}</div>
      </div>
    </div>
    <div class="step-content">
      <slot :name="`step-${currentStep + 1}`" />
    </div>
    <div class="step-actions">
      <BaseButton @click="prevStep" :disabled="currentStep === 0">Anterior</BaseButton>
      <BaseButton @click="nextStep" :disabled="currentStep === steps.length - 1">Siguiente</BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, provide } from 'vue';
import BaseButton from './BaseButton.vue';

const props = defineProps<{
  steps: string[];
}>();

const currentStep = ref(0);

provide('currentStep', currentStep);

const nextStep = () => {
  if (currentStep.value < props.steps.length - 1) {
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};
</script>

<style scoped>
.stepper {
  width: 100%;
}
.steps {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
}
.step-number {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #6c757d; /* Gris más oscuro para mejor contraste */
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}
.step.active .step-number {
  background-color: var(--color-primary);
}
.step.completed .step-number {
  background-color: #4caf50;
}
.step-title {
  margin-top: 5px;
  font-size: 12px;
  color: #333; /* Color de texto más oscuro para mejor contraste */
}
.step-content {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.step-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
</style>
