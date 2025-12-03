import React from 'react';
import { cn } from '@/lib/utils';

const Textarea = React.forwardRef(({ className, error, onChange, noTransform, ...props }, ref) => {
  const handleChange = (e) => {
    // Transform text input to uppercase unless noTransform is true
    if (!noTransform) {
      const upperValue = e.target.value.toUpperCase();
      e.target.value = upperValue;
    }
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <textarea
      className={cn(
        'flex min-h-[80px] w-full rounded-lg border px-3 py-2 text-sm',
        'bg-slate-800 text-white border-white/10',
        'placeholder:text-white/40',
        'transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-700',
        error ? 'border-red-500 focus-visible:ring-red-500' : 'border-white/10',
        className
      )}
      ref={ref}
      onChange={handleChange}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';

export { Textarea };
