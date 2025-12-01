import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Filter, Search } from 'lucide-react';

const ComprobantesPagos = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white/5 p-3 rounded-2xl backdrop-blur-xl border border-white/10">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
          <input
            type="text"
            placeholder="Buscar comprobante..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-blue-500/50 transition-colors"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-white transition-colors">
          <Filter size={16} />
          <span>Filtrar</span>
        </button>
      </div>

      {/* Placeholder Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10 hover:bg-white/10 transition-all group cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <FileText size={24} />
              </div>
              <span className="px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                Emitido
              </span>
            </div>
            <h3 className="text-white font-semibold mb-1">Comprobante #00{item}</h3>
            <p className="text-white/40 text-xs mb-4">Emitido el 01/12/2025</p>
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <span className="text-white font-bold">$45.000</span>
              <button className="text-white/60 hover:text-blue-400 transition-colors">
                <Download size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ComprobantesPagos;
