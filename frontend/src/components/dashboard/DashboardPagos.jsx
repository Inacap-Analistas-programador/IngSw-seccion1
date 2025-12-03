import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  FileText,
  CreditCard,
  BookOpen,
  History,
  LayoutDashboard
} from 'lucide-react';
import GestionPagos from './GestionPagos';
import ComprobantesPagos from './ComprobantesPagos';
import Prepagos from './Prepagos';
import ConceptoContable from './ConceptoContable';
import HistorialPagos from './HistorialPagos';
import EstadisticasPagos from './EstadisticasPagos';

const DashboardPagos = () => {
  const [activeTab, setActiveTab] = useState('resumen');

  const tabs = [
    { id: 'resumen', label: 'Resumen', icon: LayoutDashboard },
    { id: 'gestion', label: 'Gestión de Pagos', icon: Wallet },
    { id: 'comprobantes', label: 'Comprobantes', icon: FileText },
    { id: 'prepagos', label: 'Prepagos', icon: CreditCard },
    { id: 'conceptos', label: 'Conceptos Contables', icon: BookOpen },
    { id: 'historial', label: 'Historial', icon: History },
  ];

  return (
    <div className="space-y-3">
      {/* Header & Tabs */}
      <div className="flex flex-col gap-3">


        <div className="flex flex-wrap gap-2 p-1 bg-white/5 rounded-xl w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${activeTab === tab.id
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
                }
              `}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="relative min-h-[400px]">
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

          {activeTab === 'historial' && (
            <motion.div
              key="historial"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <HistorialPagos />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DashboardPagos;
