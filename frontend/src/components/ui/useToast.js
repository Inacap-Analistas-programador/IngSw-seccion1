import React, { useContext } from 'react';

// Should be one of the parents of the component that calls `useToast`.
const ToastContext = React.createContext(undefined);

// Get the toast state and setter.
function useToastState() {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToastState must be used within a ToastProvider');
  }
  return context;
}

// A custom hook that can be used to show a toast.
function useToast() {
  const [toasts, setToasts] = useToastState();

  function toast(options) {
    setToasts((currentToasts) => [
      ...currentToasts,
      {
        ...options,
        id: +new Date(),
      },
    ]);
  }

  return {
    toasts,
    toast,
  };
}

export { ToastContext, useToast, useToastState };
