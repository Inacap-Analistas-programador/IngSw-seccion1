import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    FaChartLine,
    FaBook,
    FaCreditCard,
    FaAward,
    FaUsers,
    FaDatabase,
    FaChevronDown,
    FaChevronRight,
    FaChevronLeft,
    FaToolbox,
    FaCircleUser,
} from 'react-icons/fa6';
import { motion, AnimatePresence } from 'framer-motion';

const ModernSidebar = ({ basePath = '/dashboard', collapsed, setCollapsed, isMobile }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [maestrosExpanded, setMaestrosExpanded] = useState(false);

    const menuItems = [
        { icon: FaChartLine, label: 'Vista Ejecutiva', path: `${basePath}/ejecutivo` },
        { icon: FaBook, label: 'Cursos', path: `${basePath}/gestion-cursos` },
        { icon: FaUsers, label: 'Personas', path: `${basePath}/personas` },
        { icon: FaCreditCard, label: 'Pagos', path: `${basePath}/gestion-pagos` },
        { icon: FaAward, label: 'Acreditaciones', path: `${basePath}/acreditacion` },
    ];

    const maestrosSubItems = [
        { icon: FaToolbox, label: 'Visor de Atributos', path: `${basePath}/maestros` },
        { icon: FaCircleUser, label: 'Mi Perfil', path: `${basePath}/perfil` },
    ];

    const isActive = (path) => location.pathname === path;

    const handleNavigation = (path) => {
        navigate(path);
        if (setCollapsed) {
            setCollapsed(true);
        }
    };

    return (
        <motion.aside
            initial={false}
            animate={{
                width: collapsed ? '80px' : '280px',
                backgroundColor: collapsed ? 'rgb(15, 23, 42)' : 'rgba(15, 23, 42, 0.9)', // slate-900
            }}
            transition={{
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1],
            }}
            className={`fixed left-0 top-0 h-screen shadow-2xl z-50 flex flex-col backdrop-blur-md ${collapsed ? 'bg-slate-900' : 'bg-slate-900/90'}`}
        >
            {/* Toggle Button - Top */}
            <div className="flex items-center justify-between h-20 px-4">
                <AnimatePresence mode="wait">
                    {!collapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center gap-3"
                        >
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                                <FaAward className="text-white text-xl" />
                            </div>
                            <div>
                                <h2 className="text-white font-bold text-lg tracking-tight" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                                    GIC Panel
                                </h2>
                                <p className="text-white/50 text-xs font-medium" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                                    Scout Chile
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all duration-200 hover:scale-110 active:scale-95 backdrop-blur-sm border border-white/10"
                    title={collapsed ? 'Expandir menú' : 'Contraer menú'}
                >
                    {collapsed ? <FaChevronRight className="text-lg" /> : <FaChevronLeft className="text-lg" />}
                </button>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 space-y-1 custom-scrollbar">
                {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                        <motion.button
                            key={item.path}
                            onClick={() => handleNavigation(item.path)}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`
                group relative w-full flex items-center gap-4 px-4 py-3.5 rounded-xl
                transition-all duration-200
                ${active
                                    ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-white border border-emerald-500/30 shadow-lg shadow-emerald-500/10'
                                    : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
                                }
              `}
                            title={collapsed ? item.label : ''}
                        >
                            <Icon className={`flex-shrink-0 transition-all duration-200 ${active ? 'text-emerald-400 scale-110' : 'text-white/70 group-hover:text-white group-hover:scale-110'}`} size={20} />

                            <AnimatePresence mode="wait">
                                {!collapsed && (
                                    <motion.span
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: 'auto' }}
                                        exit={{ opacity: 0, width: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className={`font-semibold text-sm whitespace-nowrap overflow-hidden ${active ? 'text-white' : 'text-white/80'}`}
                                        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>

                            {active && !collapsed && (
                                <motion.div
                                    layoutId="activeIndicator"
                                    className="ml-auto w-2 h-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50"
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                />
                            )}

                            {/* Tooltip for collapsed state */}
                            {collapsed && (
                                <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap border border-white/10 shadow-xl z-50">
                                    {item.label}
                                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-slate-900"></div>
                                </div>
                            )}
                        </motion.button>
                    );
                })}

                {/* Maestros Section */}
                <div className="border-t border-white/10 mt-3 pt-3">
                    <button
                        onClick={() => {
                            if (collapsed) setCollapsed(false);
                            setMaestrosExpanded(!maestrosExpanded);
                        }}
                        className={`
              group relative w-full flex items-center gap-4 px-4 py-3.5 rounded-xl
              text-white/70 hover:text-white hover:bg-white/5 transition-all duration-200
              border border-transparent
            `}
                        title={collapsed ? 'Maestros' : ''}
                    >
                        <FaDatabase className="flex-shrink-0 text-white/70 group-hover:text-white transition-all duration-200 group-hover:scale-110" size={20} />

                        <AnimatePresence mode="wait">
                            {!collapsed && (
                                <motion.span
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: 'auto' }}
                                    exit={{ opacity: 0, width: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="font-semibold text-sm text-white/80 whitespace-nowrap overflow-hidden"
                                    style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                                >
                                    Maestros
                                </motion.span>
                            )}
                        </AnimatePresence>

                        {!collapsed && (
                            <motion.div
                                animate={{ rotate: maestrosExpanded ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                                className="ml-auto"
                            >
                                <FaChevronDown className="text-white/50" size={14} />
                            </motion.div>
                        )}

                        {/* Tooltip for collapsed state */}
                        {collapsed && (
                            <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap border border-white/10 shadow-xl z-50">
                                Maestros
                                <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-slate-900"></div>
                            </div>
                        )}
                    </button>

                    {/* Maestros Submenu */}
                    <AnimatePresence>
                        {maestrosExpanded && !collapsed && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden ml-4 mt-1 space-y-1"
                            >
                                {maestrosSubItems.map((item, index) => {
                                    const Icon = item.icon;
                                    const active = isActive(item.path);

                                    return (
                                        <motion.button
                                            key={item.path}
                                            onClick={() => handleNavigation(item.path)}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className={`
                        group w-full flex items-center gap-3 px-4 py-2.5 rounded-lg
                        transition-all duration-200
                        ${active
                                                    ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-white border border-blue-500/30'
                                                    : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                                                }
                      `}
                                        >
                                            <Icon className={`flex-shrink-0 transition-all ${active ? 'text-blue-400' : 'text-white/60 group-hover:text-white'}`} size={16} />
                                            <span className={`font-medium text-xs ${active ? 'text-white' : 'text-white/70'}`} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                                                {item.label}
                                            </span>
                                            {active && (
                                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-lg shadow-blue-400/50" />
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </nav>

            {/* Footer - User Info */}
            <div className="border-t border-white/10 p-4">
                <AnimatePresence mode="wait">
                    {!collapsed ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                        >
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold shadow-lg">
                                A
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-semibold text-sm truncate" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                                    Administrador
                                </p>
                                <p className="text-white/50 text-xs truncate" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                                    admin@gic.cl
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex justify-center"
                        >
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold shadow-lg">
                                A
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Custom Scrollbar Styles */}
            <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
        </motion.aside>
    );
};

export default ModernSidebar;
