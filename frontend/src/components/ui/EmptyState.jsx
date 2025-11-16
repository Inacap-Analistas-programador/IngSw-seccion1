import React from 'react';
import { FaInbox } from 'react-icons/fa6';
import { Button } from './Button';
import { cn } from '@/lib/utils';

const EmptyState = ({
  icon: Icon = FaInbox,
  title = 'No hay datos',
  description = 'No se encontraron elementos para mostrar',
  action,
  actionLabel,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
    >
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 max-w-md mb-6">{description}</p>
      {action && actionLabel && (
        <Button onClick={action} variant="default">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
