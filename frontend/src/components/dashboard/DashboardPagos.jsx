import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  FileText,
  CreditCard,
  BookOpen,
  LayoutDashboard,
  Building2,
  Truck
} from 'lucide-react';
import GestionPagos from './GestionPagos';
import ComprobantesPagos from './ComprobantesPagos';
import Prepagos from './Prepagos';
import ConceptoContable from './ConceptoContable';
import EstadisticasPagos from './EstadisticasPagos';
import PagosProveedores from './PagosProveedores';
import GestionProveedores from './GestionProveedores';

const DashboardPagos = () => {
  const [activeTab, setActiveTab] = useState('resumen');

  const tabs = [
    { id: 'resumen', label: 'Resumen', icon: LayoutDashboard },
    { id: 'gestion', label: 'Gestión de Pagos', icon: Wallet },
    { id: 'pagos-proveedores', label: 'Pagos a Proveedores', icon: Building2 },
    { id: 'proveedores', label: 'Proveedores', icon: Truck },
    { id: 'comprobantes', label: 'Comprobantes', icon: FileText },
    { id: 'prepagos', label: 'Prepagos', icon: CreditCard },
    { id: 'conceptos', label: 'Conceptos Contables', icon: BookOpen },
  ];

  return (
    <div className="w-full">
      {/* Header & Tabs */}
      <div className="sticky top-16 z-30 w-full bg-slate-900 border-b border-white/10 mb-6">
        <div className="flex overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-3 py-3 text-sm font-medium transition-all duration-200 border-b-2 whitespace-nowrap hover:bg-white/5
                ${activeTab === tab.id
                  ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                  : 'border-transparent text-white/60 hover:text-white'
                }
              `}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="relative min-h-[400px] px-6">
        <AnimatePresence mode="wait">
          {activeTab === 'resumen' && (
            <motion.div
              key="resumen"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <EstadisticasPagos />
            </motion.div>
          )}

          {activeTab === 'gestion' && (
            <motion.div
              key="gestion"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <GestionPagos />
            </motion.div>
          )}

          {activeTab === 'pagos-proveedores' && (
            <motion.div
              key="pagos-proveedores"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <PagosProveedores onNavigate={setActiveTab} />
            </motion.div>
          )}

          {activeTab === 'proveedores' && (
            <motion.div
              key="proveedores"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <GestionProveedores />
            </motion.div>
          )}

          {activeTab === 'comprobantes' && (
            <motion.div
              key="comprobantes"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <ComprobantesPagos />
            </motion.div>
          )}

          {activeTab === 'prepagos' && (
            <motion.div
              key="prepagos"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Prepagos />
            </motion.div>
          )}

          {activeTab === 'conceptos' && (
            <motion.div
              key="conceptos"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <ConceptoContable />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DashboardPagos;
