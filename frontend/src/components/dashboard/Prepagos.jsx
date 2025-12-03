import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Plus, Search, Filter, ArrowUpRight, Users, Clock, Edit, Trash2, AlertCircle } from 'lucide-react';
import api from '../../config/api';
import RegistrarPrepagoModal from './RegistrarPrepagoModal';

const Prepagos = () => {
  const [prepagos, setPrepagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrepago, setSelectedPrepago] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/pagos/prepagos/');
      const data = Array.isArray(response.data) ? response.data : (response.data.results || []);
      setPrepagos(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching prepagos:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este prepago?')) {
      try {
        await api.delete(`/pagos/prepagos/${id}/`);
        fetchData();
      } catch (error) {
        console.error('Error deleting prepago:', error);
      }
    }
  };

  const filteredPrepagos = prepagos.filter(p => {
    const searchLower = searchTerm.toLowerCase();
    return (
        p.ppa_id.toString().includes(searchLower) ||
        (p.ppa_observacion && p.ppa_observacion.toLowerCase().includes(searchLower))
    );
  });

  const totalSaldo = filteredPrepagos.reduce((acc, curr) => acc + parseFloat(curr.ppa_valor || 0), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/5 p-4 rounded-2xl backdrop-blur-xl border border-white/10">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
          <input
            type="text"
            placeholder="Buscar prepago..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => {
              setSelectedPrepago(null);
              setIsModalOpen(true);
            }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-lg shadow-emerald-500/20"
          >
            <Plus size={18} />
            <span>Nuevo Prepago</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="p-4 text-xs font-semibold text-white/60 uppercase tracking-wider">ID</th>
                <th className="p-4 text-xs font-semibold text-white/60 uppercase tracking-wider">Persona ID</th>
                <th className="p-4 text-xs font-semibold text-white/60 uppercase tracking-wider">Curso ID</th>
                <th className="p-4 text-xs font-semibold text-white/60 uppercase tracking-wider text-right">Monto</th>
                <th className="p-4 text-xs font-semibold text-white/60 uppercase tracking-wider">Observación</th>
                <th className="p-4 text-xs font-semibold text-white/60 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-white/40">
                    Cargando prepagos...
                  </td>
                </tr>
              ) : filteredPrepagos.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-white/40">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle size={32} />
                      <p>No se encontraron prepagos</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPrepagos.map((prepago) => (
                  <tr key={prepago.ppa_id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4 text-white/60 font-mono text-sm">#{prepago.ppa_id}</td>
                    <td className="p-4 text-white font-medium">{prepago.per_id}</td>
                    <td className="p-4 text-white/80 text-sm">{prepago.cur_id}</td>
                    <td className="p-4 text-right font-medium text-white">
                      ${parseFloat(prepago.ppa_valor).toLocaleString()}
                    </td>
                    <td className="p-4 text-white/60 text-sm max-w-xs truncate">
                      {prepago.ppa_observacion || '-'}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => {
                            setSelectedPrepago(prepago);
                            setIsModalOpen(true);
                          }}
                          className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-blue-400 transition-colors"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(prepago.ppa_id)}
                          className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-red-400 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <RegistrarPrepagoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPrepago(null);
        }}
        onSuccess={fetchData}
        initialData={selectedPrepago}
      />
    </motion.div>
  );
};

export default Prepagos;
