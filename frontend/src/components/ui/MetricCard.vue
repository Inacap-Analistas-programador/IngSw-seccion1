<!-- Componente de tarjeta de métricas moderna -->
<template>
  <div 
    :class="[
      'metric-card',
      `metric-card--${variant}`,
      { 'metric-card--clickable': clickable }
    ]"
    @click="handleClick"
  >
    <!-- Header con icono y badge -->
    <div class="metric-header">
      <div class="metric-icon-wrapper">
        <component 
          v-if="icon" 
          :is="icon" 
          :class="['metric-icon', iconClass]" 
        />
      </div>
      <div v-if="badge" class="metric-badge">
        {{ badge }}
      </div>
    </div>

    <!-- Valor principal -->
    <div class="metric-value">
      <span class="metric-number">{{ formattedValue }}</span>
      <span v-if="unit" class="metric-unit">{{ unit }}</span>
    </div>

    <!-- Título y descripción -->
    <div class="metric-info">
      <h3 class="metric-title">{{ title }}</h3>
      <p v-if="description" class="metric-description">{{ description }}</p>
    </div>

    <!-- Cambio/tendencia -->
    <div v-if="change !== undefined" class="metric-change">
      <div :class="['change-indicator', changeClass]">
        <component :is="changeIcon" class="change-icon" />
        <span class="change-text">{{ changeText }}</span>
      </div>
    </div>

    <!-- Footer con acciones -->
    <div v-if="$slots.footer" class="metric-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon
} from '@heroicons/vue/24/solid'

interface Props {
  title: string
  value: number | string
  unit?: string
  description?: string
  icon?: any
  iconClass?: string
  badge?: string
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
  change?: number
  changeLabel?: string
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  clickable: false
})

const emit = defineEmits<{
  'click': []
}>()

// Formatear el valor principal
const formattedValue = computed(() => {
  if (typeof props.value === 'number') {
    return new Intl.NumberFormat('es-CL').format(props.value)
  }
  return props.value
})

// Determinar el icono y clase para el cambio
const changeIcon = computed(() => {
  if (props.change === undefined) return null
  if (props.change > 0) return ArrowUpIcon
  if (props.change < 0) return ArrowDownIcon
  return MinusIcon
})

const changeClass = computed(() => {
  if (props.change === undefined) return ''
  if (props.change > 0) return 'change-positive'
  if (props.change < 0) return 'change-negative'
  return 'change-neutral'
})

const changeText = computed(() => {
  if (props.change === undefined) return ''
  
  const absChange = Math.abs(props.change)
  const formattedChange = new Intl.NumberFormat('es-CL', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(absChange / 100)
  
  return props.changeLabel || formattedChange
})

const handleClick = () => {
  if (props.clickable) {
    emit('click')
  }
}
</script>

<style scoped>
/* Tarjeta base */
.metric-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease-in-out;
  position: relative;
  overflow: hidden;
}

.metric-card--clickable {
  cursor: pointer;
}

.metric-card--clickable:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Variantes de color */
.metric-card--default {
  border-left: 4px solid #6b7280;
}

.metric-card--primary {
  border-left: 4px solid #3b82f6;
}

.metric-card--success {
  border-left: 4px solid #10b981;
}

.metric-card--warning {
  border-left: 4px solid #f59e0b;
}

.metric-card--danger {
  border-left: 4px solid #ef4444;
}

.metric-card--info {
  border-left: 4px solid #06b6d4;
}

/* Header */
.metric-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
}

.metric-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background-color: #f3f4f6;
}

.metric-icon {
  width: 24px;
  height: 24px;
  color: #6b7280;
}

.metric-card--primary .metric-icon {
  color: #3b82f6;
}

.metric-card--success .metric-icon {
  color: #10b981;
}

.metric-card--warning .metric-icon {
  color: #f59e0b;
}

.metric-card--danger .metric-icon {
  color: #ef4444;
}

.metric-card--info .metric-icon {
  color: #06b6d4;
}

.metric-badge {
  background-color: #f3f4f6;
  color: #6b7280;
  font-size: 12px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Valor */
.metric-value {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 8px;
}

.metric-number {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  line-height: 1;
}

.metric-unit {
  font-size: 1rem;
  color: #6b7280;
  font-weight: 500;
}

/* Información */
.metric-info {
  margin-bottom: 16px;
}

.metric-title {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 4px 0;
}

.metric-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}

/* Cambio/tendencia */
.metric-change {
  margin-bottom: 12px;
}

.change-indicator {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
}

.change-positive {
  background-color: #d1fae5;
  color: #065f46;
}

.change-negative {
  background-color: #fee2e2;
  color: #991b1b;
}

.change-neutral {
  background-color: #f3f4f6;
  color: #6b7280;
}

.change-icon {
  width: 16px;
  height: 16px;
}

.change-text {
  font-size: 0.875rem;
}

/* Footer */
.metric-footer {
  border-top: 1px solid #f3f4f6;
  padding-top: 12px;
  margin-top: 12px;
}

/* Estados hover para variantes */
.metric-card--primary:hover {
  background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%);
}

.metric-card--success:hover {
  background: linear-gradient(135deg, #ffffff 0%, #ecfdf5 100%);
}

.metric-card--warning:hover {
  background: linear-gradient(135deg, #ffffff 0%, #fffbeb 100%);
}

.metric-card--danger:hover {
  background: linear-gradient(135deg, #ffffff 0%, #fef2f2 100%);
}

.metric-card--info:hover {
  background: linear-gradient(135deg, #ffffff 0%, #ecfeff 100%);
}

/* Responsive */
@media (max-width: 640px) {
  .metric-card {
    padding: 20px;
  }
  
  .metric-number {
    font-size: 1.75rem;
  }
  
  .metric-header {
    margin-bottom: 12px;
  }
  
  .metric-icon-wrapper {
    width: 40px;
    height: 40px;
  }
  
  .metric-icon {
    width: 20px;
    height: 20px;
  }
}
</style>