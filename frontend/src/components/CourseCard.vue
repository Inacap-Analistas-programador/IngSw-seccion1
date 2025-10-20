<template>
  <div
    class="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300"
  >
    <!-- Course Header -->
    <div class="flex justify-between items-start mb-4">
      <div class="flex-1">
        <h3 class="text-xl font-semibold text-white mb-2">
          {{ course.title }}
        </h3>
        <p class="text-slate-300 text-sm mb-2">Código: {{ course.code }}</p>
        <div class="flex items-center gap-2 text-sm text-slate-400">
          <span>🏕️ {{ course.rama }}</span>
          <span>•</span>
          <span>📅 {{ formatDate(course.start_date) }}<template v-if="course.end_date"> - {{ formatDate(course.end_date) }}</template></span>
        </div>
      </div>

      <!-- Status Traffic Light -->
      <div class="flex flex-col items-center">
        <div data-testid="status-badge" class="w-4 h-4 rounded-full mb-1" :class="getStatusColor()"></div>
        <span data-testid="status-text" class="text-xs text-slate-400">{{ getStatusText() }}</span>
      </div>
    </div>

    <!-- Course Stats -->
    <div class="grid grid-cols-3 gap-4 mb-4">
      <div class="text-center">
        <div class="text-2xl font-bold text-blue-400">
          {{ course.current_participants || 0 }}
        </div>
        <div class="text-xs text-slate-400">Inscritos</div>
      </div>

      <div class="text-center">
        <div class="text-2xl font-bold text-green-400">
          {{ pendingPayments === null ? (course.payments_received || 0) : pendingPayments }}
        </div>
        <div class="text-xs text-slate-400">Pagos</div>
      </div>

      <div class="text-center">
        <div class="text-2xl font-bold text-purple-400">
          {{ course.max_participants || 0 }}
        </div>
        <div class="text-xs text-slate-400">Cupos</div>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="mb-4">
      <div class="flex justify-between text-sm text-slate-400 mb-1">
        <span>Progreso de inscripción</span>
        <span>{{ enrollmentPercentage }}%</span>
      </div>
      <div class="w-full bg-slate-700 rounded-full h-2">
        <div
          data-testid="progress-bar"
          class="h-2 rounded-full transition-all duration-300"
          :class="getProgressBarColor()"
          :style="{ width: enrollmentPercentage + '%' }"
        ></div>
      </div>
    </div>

    <!-- Course Actions -->
    <div class="flex gap-2">
      <button
        data-testid="view-course-btn"
        @click="viewDetails"
        class="flex-1 bg-purple-500/80 hover:bg-purple-500 text-white py-2 px-4 rounded-lg transition-colors text-sm"
      >
        Ver Detalles
      </button>

      <button
        data-testid="payments-btn"
        @click="managePayments"
        class="flex-1 bg-green-500/80 hover:bg-green-500 text-white py-2 px-4 rounded-lg transition-colors text-sm"
      >
        Pagos
      </button>
    </div>

    <!-- Quick Info -->
    <div class="mt-4 pt-4 border-t border-white/10">
      <div class="flex justify-between text-xs text-slate-400">
        <span>Precio: ${{ course.price?.toLocaleString() || "0" }}</span>
        <span>Estado: {{ course.status || "Activo" }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getPaymentsByGroup } from '@/services/payments'

// Types
interface Course {
  id: number;
  title: string;
  code: string;
  rama: string;
  start_date: string;
  end_date: string;
  current_participants: number;
  max_participants: number;
  payments_received: number;
  price: number;
  status: string;
}

// Props
const props = defineProps<{
  course: Course;
}>();

// Composables
const router = useRouter();

// Computed properties
const enrollmentPercentage = computed(() => {
  if (!props.course.max_participants) return 0;
  return Math.round(
    (props.course.current_participants / props.course.max_participants) * 100,
  );
});

// Methods
const getStatusColor = () => {
  const percentage = enrollmentPercentage.value;

  // Traffic light logic
  if (percentage >= 80) return "bg-red-500"; // Red - Almost full/full
  if (percentage >= 50) return "bg-yellow-500"; // Yellow - Half full
  return "bg-green-500"; // Green - Low enrollment
};

const getStatusText = () => {
  const percentage = enrollmentPercentage.value;

  if (percentage >= 80) return "Lleno";
  if (percentage >= 50) return "Medio";
  return "Disponible";
};

const getProgressBarColor = () => {
  const percentage = enrollmentPercentage.value;

  if (percentage >= 80) return "bg-red-400";
  if (percentage >= 50) return "bg-yellow-400";
  return "bg-green-400";
};

const formatDate = (dateString: string) => {
  if (!dateString) return "Sin fecha";

  try {
  // Parse YYYY-MM-DD safely as local date to avoid timezone shifts
  const [y, m, d] = dateString.split("-").map((v) => Number.parseInt(v, 10));
    const date = new Date(y, (m || 1) - 1, d || 1);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "Fecha inválida";
  }
};

const viewDetails = () => {
  // Navigate to course details
  router.push(`/courses/${props.course.id}`);
};

const managePayments = () => {
  // Navigate to course payments
  router.push(`/courses/${props.course.id}/payments`);
};

// Pending payments for this course (fetched from canonical payments API)
const pendingPayments = ref<number | null>(null)

onMounted(async () => {
  try {
    const res = await getPaymentsByGroup('course', props.course.id)
    pendingPayments.value = res?.count ?? 0
  } catch {
    // In case of error, default to 0 (non-blocking)
    pendingPayments.value = 0
  }
})
</script>

<style scoped>
/* Custom transitions for hover effects */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
