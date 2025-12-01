import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, Plus, Search, Filter, ArrowUpRight, ArrowDownRight, Users, Clock } from 'lucide-react';

const Prepagos = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Wallet size={20} />
            </div>
            <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
              <ArrowUpRight size={12} /> +15%
            </span>
          </div>
          <p className="text-white/60 text-xs uppercase font-medium">Saldo Total</p>
          <h3 className="text-2xl font-bold text-white mt-1">$1.250.000</h3>
        </div>
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
              <Users size={20} />
            </div>
          </div>
          <p className="text-white/60 text-xs uppercase font-medium">Usuarios con Saldo</p>
          <h3 className="text-2xl font-bold text-white mt-1">45</h3>
        </div>
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 rounded-lg bg-yellow-500/20 text-yellow-400">
              <Clock size={20} />
            </div>
          </div>
          <p className="text-white/60 text-xs uppercase font-medium">Movimientos Hoy</p>
          <h3 className="text-2xl font-bold text-white mt-1">12</h3>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white/5 p-3 rounded-2xl backdrop-blur-xl border border-white/10">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
          <input
            type="text"
            placeholder="Buscar usuario..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-white transition-colors">
          <Filter size={16} />
          <span>Filtrar</span>
        </button>
      </div>

      {/* List Placeholder */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="text-white/20" size={32} />
          </div>
          <p className="text-white/40 text-sm">Selecciona un usuario para ver sus movimientos</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Prepagos;
