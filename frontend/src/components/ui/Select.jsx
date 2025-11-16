import * as React from 'react';
import { cn } from '@/lib/utils';

const Select = React.forwardRef(({ className, error, children, ...props }, ref) => {
  return (
    <select
      className={cn(
        'flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900',
        'transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-scout-azul-claro focus-visible:border-scout-azul-medio',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100',
        error ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300',
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = 'Select';

const Textarea = React.forwardRef(({ className, error, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'flex min-h-[80px] w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900',
        'placeholder:text-gray-400',
        'transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-scout-azul-claro focus-visible:border-scout-azul-medio',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100',
        error ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';

export { Select, Textarea };
