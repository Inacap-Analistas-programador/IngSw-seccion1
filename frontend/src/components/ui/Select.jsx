import * as React from 'react';
import { cn } from '@/lib/utils';

const Select = React.forwardRef(({ className, error, children, ...props }, ref) => {
  return (
    <select
      className={cn(
        'flex h-10 w-full rounded-lg border px-3 py-2 text-sm',
        'bg-slate-800 text-white border-white/10',
        'transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-700',
        error ? 'border-red-500 focus-visible:ring-red-500' : 'border-white/10',
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
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';

export { Select, Textarea };
