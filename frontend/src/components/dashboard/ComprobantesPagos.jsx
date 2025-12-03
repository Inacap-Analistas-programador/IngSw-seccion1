import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Filter, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/use-toast';
import api from '../../config/api';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ComprobantesPagos = () => {
  const { toast } = useToast();
  const [comprobantes, setComprobantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchComprobantes();
  }, []);

  const fetchComprobantes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/pagos/comprobantes/');
      setComprobantes(Array.isArray(response.data) ? response.data : response.data.results || []);
    } catch (error) {
      console.error('Error fetching comprobantes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateComprobante = () => {
    toast({ title: 'Info', description: 'Funcionalidad de creación manual en desarrollo.' });
  };

  const generarPDF = (comprobante) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Comprobante #${comprobante.cpa_numero}`, 14, 22);
    doc.setFontSize(12);
    doc.text(`Fecha: ${comprobante.cpa_fecha}`, 14, 32);
    doc.text(`Tipo: ${comprobante.cpa_tipo === 1 ? 'Ingreso' : 'Egreso'}`, 14, 40);
    doc.text(`Valor: $${parseInt(comprobante.cpa_valor).toLocaleString('es-CL')}`, 14, 48);
    doc.save(`comprobante_${comprobante.cpa_numero}.pdf`);
  };

  const filteredComprobantes = comprobantes.filter(c =>
    c.cpa_numero.toString().includes(searchTerm) ||
    (c.cpa_fecha && c.cpa_fecha.includes(searchTerm))
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/5 p-4 rounded-2xl backdrop-blur-xl border border-white/10 shadow-xl">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
          <input
            type="text"
            placeholder="Buscar por número o fecha..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleCreateComprobante}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-sm text-white font-semibold transition-all shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95"
          >
            <Plus size={18} />
            <span>Crear Comprobante</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredComprobantes.map((comprobante) => (
          <div key={comprobante.cpa_id} className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10 hover:bg-white/10 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <FileText size={24} />
              </div>
              <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${comprobante.cpa_tipo === 1 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                }`}>
                {comprobante.cpa_tipo === 1 ? 'Ingreso' : 'Egreso'}
              </span>
            </div>
            <h3 className="text-white font-semibold mb-1">Comprobante #{comprobante.cpa_numero}</h3>
            <p className="text-white/40 text-xs mb-4">Fecha: {comprobante.cpa_fecha}</p>
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <span className="text-white font-bold">${parseInt(comprobante.cpa_valor).toLocaleString('es-CL')}</span>
              <div className="flex gap-2">
                {/* Action next to 'Crear Comprobante' logic (here represented as download action in the card) */}
                <button
                  onClick={() => generarPDF(comprobante)}
                  className="flex items-center gap-1 text-white/60 hover:text-blue-400 transition-colors text-xs"
                  title="Descargar PDF Generado"
                >
                  <Download size={16} /> PDF
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredComprobantes.length === 0 && !loading && (
          <div className="col-span-full text-center py-12 text-white/40">
            No hay comprobantes registrados.
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ComprobantesPagos;
