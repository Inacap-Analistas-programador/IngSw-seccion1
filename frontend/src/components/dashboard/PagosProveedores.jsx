import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  ArrowUpRight,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  Plus,
  FileText,
  Building2
} from 'lucide-react';
import api from '../../config/api';
import RegistrarPagoProveedorModal from './RegistrarPagoProveedorModal';

const PagosProveedores = ({ onNavigate }) => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPago, setSelectedPago] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/pagos/pagos-proveedores/');
      const data = Array.isArray(response.data) ? response.data : (response.data.results || []);
      setPagos(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este pago?')) {
      try {
        await api.delete(`/pagos/pagos-proveedores/${id}/`);
        fetchData();
      } catch (error) {
        console.error('Error deleting payment:', error);
      }
    }
  };

  const filteredPagos = pagos.filter(pago => {
    const searchLower = searchTerm.toLowerCase();
    return (
      pago.proveedor_nombre?.toLowerCase().includes(searchLower) ||
      pago.ppr_observacion?.toLowerCase().includes(searchLower) ||
      pago.concepto_nombre?.toLowerCase().includes(searchLower)
    );
  });

  const totalPagado = filteredPagos.reduce((acc, curr) => acc + parseFloat(curr.ppr_valor || 0), 0);

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
            placeholder="Buscar por proveedor, concepto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => onNavigate && onNavigate('proveedores')}
            className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2.5 rounded-xl font-medium transition-all duration-200 border border-white/10"
          >
            <Building2 size={18} />
            <span className="hidden sm:inline">Proveedores</span>
          </button>
          <button
            onClick={() => {
              setSelectedPago(null);
              setIsModalOpen(true);
            }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-lg shadow-emerald-500/20"
          >
            <Plus size={18} />
            <span>Nuevo Pago</span>
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
                <th className="p-4 text-xs font-semibold text-white/60 uppercase tracking-wider">Proveedor</th>
                <th className="p-4 text-xs font-semibold text-white/60 uppercase tracking-wider">Concepto</th>
                <th className="p-4 text-xs font-semibold text-white/60 uppercase tracking-wider">Fecha</th>
                <th className="p-4 text-xs font-semibold text-white/60 uppercase tracking-wider text-right">Monto</th>
                <th className="p-4 text-xs font-semibold text-white/60 uppercase tracking-wider">Observación</th>
                <th className="p-4 text-xs font-semibold text-white/60 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-white/40">
                    Cargando pagos...
                  </td>
                </tr>
              ) : filteredPagos.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-white/40">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle size={32} />
                      <p>No se encontraron pagos a proveedores</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPagos.map((pago) => (
                  <tr key={pago.ppr_id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4 text-white/60 font-mono text-sm">#{pago.ppr_id}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                          {pago.proveedor_nombre?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-medium">{pago.proveedor_nombre}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-white/80 text-sm">{pago.concepto_nombre}</td>
                    <td className="p-4 text-white/60 text-sm">
                      {new Date(pago.ppr_fecha).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right font-medium text-white">
                      ${parseFloat(pago.ppr_valor).toLocaleString()}
                    </td>
                    <td className="p-4 text-white/60 text-sm max-w-xs truncate">
                      {pago.ppr_observacion || '-'}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => {
                            setSelectedPago(pago);
                            setIsModalOpen(true);
                          }}
                          className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-blue-400 transition-colors"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(pago.ppr_id)}
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

      <RegistrarPagoProveedorModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPago(null);
        }}
        onSuccess={fetchData}
        initialData={selectedPago}
      />
    </motion.div>
  );
};

export default PagosProveedores;