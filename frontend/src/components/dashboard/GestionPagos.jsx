import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  Plus
} from 'lucide-react';
import api from '../../config/api';
import RegistrarPagoModal from './RegistrarPagoModal';

const GestionPagos = () => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPago, setSelectedPago] = useState(null);

  useEffect(() => {
    fetchPagos();
  }, []);

  const fetchPagos = async () => {
    try {
      const response = await api.get('/pagos/pagopersonas/');
      const data = response.data;
      const pagosArray = Array.isArray(data) ? data : (data.results || []);
      setPagos(pagosArray);
      setError(null);
    } catch (err) {
      console.error('Error fetching pagos:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterPayment = () => {
    setSelectedPago(null);
    setIsModalOpen(true);
  };

  const handleEdit = (pago) => {
    setSelectedPago(pago);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este pago?')) {
      try {
        await api.delete(`/pagos/pagopersonas/${id}/`);
        fetchPagos();
      } catch (err) {
        console.error('Error deleting pago:', err);
        setError(err);
      }
    }
  };

  const handleSuccess = () => {
    fetchPagos();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-2 border-white/20 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center backdrop-blur-xl">
        <AlertCircle className="mx-auto text-red-400 mb-2" size={32} />
        <p className="text-red-200 font-medium">No se pudieron cargar los pagos</p>
        <p className="text-sm text-red-300/60 mt-1">{error.message}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-white/5 p-3 rounded-2xl backdrop-blur-xl border border-white/10">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
          <input
            type="text"
            placeholder="Buscar pago..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={handleRegisterPayment}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-sm text-white font-medium transition-colors shadow-lg shadow-emerald-500/20"
          >
            <Plus size={16} />
            <span>Registrar Nuevo Pago</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-white transition-colors">
            <Filter size={16} />
            <span>Filtrar</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-white/60 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">ID</th>
                <th className="p-4 font-medium">Persona</th>
                <th className="p-4 font-medium">Curso</th>
                <th className="p-4 font-medium">Fecha</th>
                <th className="p-4 font-medium">Tipo</th>
                <th className="p-4 font-medium text-right">Valor</th>
                <th className="p-4 font-medium text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {pagos.map((pago) => (
                <tr key={pago.pap_id} className="text-white/80 hover:bg-white/5 transition-colors text-sm">
                  <td className="p-4 font-medium text-white">#{pago.pap_id}</td>
                  <td className="p-4">{pago.per_id}</td>
                  <td className="p-4">{pago.cur_id}</td>
                  <td className="p-4">{new Date(pago.pap_fecha_hora).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${pago.pap_tipo === 1
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                      {pago.pap_tipo === 1 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {pago.pap_tipo === 1 ? 'Ingreso' : 'Egreso'}
                    </span>
                  </td>
                  <td className="p-4 text-right font-medium text-white">
                    ${parseInt(pago.pap_valor).toLocaleString('es-CL')}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-1.5 hover:bg-white/10 rounded-lg text-white/60 hover:text-blue-400 transition-colors" title="Ver detalle">
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(pago)}
                        className="p-1.5 hover:bg-white/10 rounded-lg text-white/60 hover:text-emerald-400 transition-colors"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(pago.pap_id)}
                        className="p-1.5 hover:bg-white/10 rounded-lg text-white/60 hover:text-red-400 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pagos.length === 0 && !error && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-white/20" size={32} />
            </div>
            <p className="text-white/40 text-sm">No se encontraron pagos registrados</p>
          </div>
        )}
      </div>

      <RegistrarPagoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
        initialData={selectedPago}
      />
    </motion.div>
  );
};

export default GestionPagos;
