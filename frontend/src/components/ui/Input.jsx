import React from 'react';
import { cn } from '@/lib/utils';

const Input = React.forwardRef(({ className, type, error, onChange, noTransform, ...props }, ref) => {
  const handleChange = (e) => {
    // Transform text input to uppercase, except for email, password, and fields with noTransform prop
    if (!noTransform && type !== 'email' && type !== 'password' && type !== 'number' && type !== 'date') {
      const upperValue = e.target.value.toUpperCase();
      e.target.value = upperValue;
    }
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900',
        'placeholder:text-gray-400',
        'transition-colors duration-200',
        'file:border-0 file:bg-transparent file:text-sm file:font-medium',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-scout-azul-claro focus-visible:border-scout-azul-medio',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100',
        error ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300',
        className
      )}
      ref={ref}
      onChange={handleChange}
      data-no-transform={noTransform ? 'true' : undefined}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export { Input };
