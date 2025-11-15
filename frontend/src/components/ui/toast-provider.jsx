import React, { useState } from 'react';
import { ToastContext } from '@/components/ui/use-toast';

function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([]);
  return <ToastContext.Provider value={[toasts, setToasts]}>{children}</ToastContext.Provider>;
}

export { ToastProvider };
