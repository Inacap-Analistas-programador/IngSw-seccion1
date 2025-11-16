import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHouse, FaCreditCard, FaBook, FaClipboardCheck, FaClipboardList } from 'react-icons/fa6';
import { cn } from '@/lib/utils';

const Sidebar = ({ className = '' }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: FaHouse, label: 'Inicio' },
    { path: '/dashboard/gestion-pagos', icon: FaCreditCard, label: 'Pagos' },
    { path: '/dashboard/gestion-cursos', icon: FaBook, label: 'Cursos' },
    { path: '/dashboard/inscripciones', icon: FaClipboardList, label: 'Inscripciones' },
    { path: '/dashboard/preinscripcion', icon: FaClipboardCheck, label: 'Preinscripción' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside
      className={cn(
        'w-64 bg-gradient-to-b from-scout-azul-oscuro to-scout-azul-medio text-white shadow-xl',
        className
      )}
    >
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-sm">
            <span className="text-2xl font-bold text-white">G</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Panel GIC</h2>
            <p className="text-xs text-white/60">Scout Chile</p>
          </div>
        </div>
      </div>
      
      <nav className="px-3 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    'group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                    'hover:bg-white/10 hover:translate-x-1',
                    active && 'bg-white/15 shadow-lg'
                  )}
                >
                  <Icon className={cn(
                    'w-5 h-5 flex-shrink-0 transition-transform duration-200',
                    'group-hover:scale-110',
                    active ? 'text-white' : 'text-white/70'
                  )} />
                  <span className={cn(
                    'font-medium text-sm',
                    active ? 'text-white' : 'text-white/80'
                  )}>
                    {item.label}
                  </span>
                  {active && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
