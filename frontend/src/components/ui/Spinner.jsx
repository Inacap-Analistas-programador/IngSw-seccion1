import React from 'react';
import { cn } from '@/lib/utils';

const Spinner = ({ className, size = 'default', variant = 'default' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    default: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const variantClasses = {
    default: 'border-scout-azul-medio border-t-transparent',
    white: 'border-white border-t-transparent',
    primary: 'border-primary border-t-transparent',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

const LoadingOverlay = ({ message = 'Cargando...', fullScreen = false }) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4',
        fullScreen
          ? 'fixed inset-0 bg-white/80 backdrop-blur-sm z-50'
          : 'py-12'
      )}
    >
      <Spinner size="lg" />
      <p className="text-gray-600 font-medium">{message}</p>
    </div>
  );
};

export { Spinner, LoadingOverlay };
