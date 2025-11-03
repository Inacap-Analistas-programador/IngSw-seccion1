import { useNotification } from '@/composables/useNotification';

const { showNotification } = useNotification();

export const toast = {
  success: (message: string, duration?: number) => 
    showNotification({ message, type: 'success', duration }),
  
  error: (message: string, duration?: number) => 
    showNotification({ message, type: 'error', duration }),
  
  warning: (message: string, duration?: number) => 
    showNotification({ message, type: 'warning', duration }),
  
  info: (message: string, duration?: number) => 
    showNotification({ message, type: 'info', duration })
};