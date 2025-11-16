import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa6';
import { cn } from '@/lib/utils';

const StatCard = ({ 
  icon: Icon, 
  label, 
  value, 
  change, 
  trend, 
  color = 'bg-blue-500',
  index = 0,
  className 
}) => {
  const isPositive = trend === 'up';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        'relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg transition-all duration-300',
        className
      )}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 opacity-50" />
      
      <div className="relative flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900 tracking-tight">{value}</p>
          
          {change && (
            <div className="flex items-center gap-1 mt-2">
              <div
                className={cn(
                  'flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold',
                  isPositive 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                )}
              >
                {isPositive ? (
                  <FaArrowUp className="w-3 h-3" />
                ) : (
                  <FaArrowDown className="w-3 h-3" />
                )}
                <span>{change}</span>
              </div>
              <span className="text-xs text-gray-500 ml-1">vs período anterior</span>
            </div>
          )}
        </div>
        
        <div className={cn(
          'flex items-center justify-center rounded-lg p-3 shadow-sm',
          color
        )}>
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
