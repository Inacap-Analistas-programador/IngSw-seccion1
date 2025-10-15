<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <!-- KPI Card Component -->
    <div
      v-for="kpi in kpis"
      :key="kpi.id"
      data-testid="kpi-card"
      class="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300"
    >
      <!-- Icon and Title -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center space-x-3">
          <div
            data-testid="kpi-icon"
            class="w-12 h-12 rounded-lg flex items-center justify-center"
            :class="kpi.iconBg"
          >
            <span class="text-2xl">{{ kpi.icon }}</span>
          </div>

          <div>
            <h3 class="text-lg font-medium text-slate-200">{{ kpi.title }}</h3>
            <p class="text-sm text-slate-400">{{ kpi.subtitle }}</p>
          </div>
        </div>

        <!-- Trend Indicator -->
        <div v-if="kpi.trend !== undefined" class="flex items-center">
          <span data-testid="trend-indicator" class="text-sm font-medium" :class="getTrendColor(kpi.trend as number)">
            {{ getTrendSymbol(kpi.trend as number) }} {{ Math.abs(kpi.trend as number) }}%
          </span>
        </div>
      </div>

      <!-- Main Value -->
      <div class="mb-4">
        <p data-testid="kpi-value" class="text-3xl font-bold mb-1" :class="kpi.valueColor">
          {{ formatValue(kpi.value) }}
        </p>

        <!-- Secondary Value -->
        <p v-if="kpi.secondaryValue" class="text-sm text-slate-400">
          {{ kpi.secondaryLabel }}: {{ formatValue(kpi.secondaryValue) }}
        </p>
      </div>

      <!-- Progress Bar (if applicable) -->
      <div v-if="kpi.progress !== undefined" class="mb-4">
        <div class="flex justify-between text-sm text-slate-400 mb-1">
          <span>{{ kpi.progressLabel || "Progreso" }}</span>
          <span>{{ kpi.progress }}%</span>
        </div>
        <div class="w-full bg-slate-700 rounded-full h-2">
          <div
            class="h-2 rounded-full transition-all duration-300"
            :class="getProgressColor(kpi.progress)"
            :style="{ width: kpi.progress + '%' }"
          ></div>
        </div>
      </div>

      <!-- Additional Info -->
      <div v-if="kpi.additionalInfo" class="text-xs text-slate-500">
        {{ kpi.additionalInfo }}
      </div>

      <!-- Action Button (optional) -->
      <button
        v-if="kpi.actionLabel"
        @click="handleAction(kpi)"
        data-testid="kpi-action-btn"
        class="w-full mt-4 bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg transition-colors text-sm border border-white/10"
      >
        {{ kpi.actionLabel }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

// Types
interface KPICard {
  id: string;
  title: string;
  subtitle: string;
  value: number | string;
  secondaryValue?: number | string;
  secondaryLabel?: string;
  icon: string;
  iconBg: string;
  valueColor: string;
  trend?: number; // Percentage change (+/-)
  progress?: number; // 0-100 percentage
  progressLabel?: string;
  additionalInfo?: string;
  actionLabel?: string;
  actionRoute?: string;
  actionCallback?: () => void;
}

// Props
const props = defineProps<{
  kpis: KPICard[];
}>();

// Composables
const router = useRouter();

// Methods
const formatValue = (value: number | string): string => {
  if (typeof value === "string") return value;

  // Format large numbers
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + "M";
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + "K";
  }

  return value.toLocaleString();
};

const getTrendColor = (trend: number): string => {
  if (trend > 0) return "text-green-400";
  if (trend < 0) return "text-red-400";
  return "text-slate-400";
};

const getTrendSymbol = (trend: number): string => {
  if (trend > 0) return "↗";
  if (trend < 0) return "↘";
  return "→";
};

const getProgressColor = (progress: number): string => {
  if (progress >= 80) return "bg-green-400";
  if (progress >= 60) return "bg-yellow-400";
  if (progress >= 40) return "bg-orange-400";
  return "bg-red-400";
};

const handleAction = (kpi: KPICard) => {
  if (kpi.actionCallback) {
    kpi.actionCallback();
  } else if (kpi.actionRoute) {
    router.push(kpi.actionRoute);
  }
};
</script>

<style scoped>
/* Custom animations */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
