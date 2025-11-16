// Simple toast hook para desarrollo
export function useToast() {
  function toast(options) {
    // Para desarrollo, simplemente mostrar un alert
    const message = options.title
      ? `${options.title}: ${options.description || ''}`
      : options.description || 'Notificación';
    console.log('Toast:', message);
    // alert(message); // Descomenta si quieres ver alerts
  }

  return {
    toast,
    toasts: [],
  };
}

export { useToast as default };
