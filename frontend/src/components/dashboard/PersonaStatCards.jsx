import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, UserX, TrendingUp, Activity } from 'lucide-react';

/**
 * Stat Card Component - Executive Style
 */
const StatCard = ({ title, value, subtitle, icon: Icon, gradient, delay, trend }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay, duration: 0.4, ease: 'easeOut' }}
    className="relative overflow-hidden"
  >
    <div className={`relative p-6 rounded-2xl border border-white/10 backdrop-blur-xl ${gradient}`}>
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
            <Icon className="h-6 w-6 text-white" />
          </div>
          {trend !== undefined && trend !== null && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              trend >= 50 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
            }`}>
              <Activity className="h-3 w-3" />
              {trend}%
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
          <p className="text-sm font-medium text-white/70">{title}</p>
          {subtitle && (
            <p className="text-xs text-white/50">{subtitle}</p>
          )}
        </div>
      </div>
      
      {/* Decorative element */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/5 blur-2xl" />
    </div>
  </motion.div>
);

/**
 * Persona Statistics Cards Component - Executive Dashboard Style
 */
const PersonaStatCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Registrados',
      value: stats.total.toLocaleString(),
      subtitle: 'Personas en el sistema',
      icon: Users,
      gradient: 'bg-gradient-to-br from-blue-600/20 via-blue-500/10 to-transparent',
      delay: 0.1,
    },
    {
      title: 'Vigentes',
      value: stats.vigentes.toLocaleString(),
      subtitle: 'Activos actualmente',
      icon: UserCheck,
      gradient: 'bg-gradient-to-br from-emerald-600/20 via-emerald-500/10 to-transparent',
      delay: 0.2,
      trend: stats.total > 0 ? Math.round((stats.vigentes / stats.total) * 100) : null,
    },
    {
      title: 'No Vigentes',
      value: stats.noVigentes.toLocaleString(),
      subtitle: 'Inactivos',
      icon: UserX,
      gradient: 'bg-gradient-to-br from-orange-600/20 via-orange-500/10 to-transparent',
      delay: 0.3,
    },
    {
      title: 'Tasa de Actividad',
      value: stats.total > 0 ? `${Math.round((stats.vigentes / stats.total) * 100)}%` : '0%',
      subtitle: 'Porcentaje de vigentes',
      icon: TrendingUp,
      gradient: 'bg-gradient-to-br from-purple-600/20 via-purple-500/10 to-transparent',
      delay: 0.4,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  );
};

export default PersonaStatCards;
