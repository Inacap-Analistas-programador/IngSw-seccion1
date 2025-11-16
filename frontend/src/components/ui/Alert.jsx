import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { FaCircleCheck, FaCircleExclamation, FaCircleInfo, FaTriangleExclamation } from 'react-icons/fa6';

const alertVariants = cva(
  'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground border-gray-300',
        success: 
          'border-green-200 bg-green-50 text-green-900 [&>svg]:text-green-600',
        destructive:
          'border-red-200 bg-red-50 text-red-900 [&>svg]:text-red-600',
        warning: 
          'border-yellow-200 bg-yellow-50 text-yellow-900 [&>svg]:text-yellow-600',
        info: 
          'border-blue-200 bg-blue-50 text-blue-900 [&>svg]:text-blue-600',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Alert = React.forwardRef(({ className, variant, children, ...props }, ref) => {
  const Icon = {
    success: FaCircleCheck,
    destructive: FaTriangleExclamation,
    warning: FaCircleExclamation,
    info: FaCircleInfo,
    default: FaCircleInfo,
  }[variant || 'default'];

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <Icon className="h-4 w-4" />
      {children}
    </div>
  );
});
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('mb-1 font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('text-sm [&_p]:leading-relaxed', className)} {...props} />
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };
