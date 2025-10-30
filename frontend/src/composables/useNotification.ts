import { ref, readonly } from 'vue';

// Estado reactivo para la notificación.
const isVisible = ref(false);
const message = ref('');
const type = ref<'success' | 'error' | 'warning' | 'info'>('info');

// Interfaz para las opciones de notificación
interface NotificationOptions {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

// Función para mostrar una notificación.
const showNotification = (options: NotificationOptions) => {
  message.value = options.message;
  type.value = options.type || 'info';
  isVisible.value = true;

  // Ocultar la notificación después de la duración especificada.
  const duration = options.duration || 3000;
  setTimeout(() => {
    hideNotification();
  }, duration);
};

// Función para ocultar la notificación.
const hideNotification = () => {
  isVisible.value = false;
  message.value = '';
  type.value = 'info';
};

// El composable exporta el estado (de solo lectura) y las funciones para manipularlo.
export function useNotification() {
  return {
    isVisible: readonly(isVisible),
    message: readonly(message),
    type: readonly(type),
    showNotification,
    hideNotification,
  };
}
