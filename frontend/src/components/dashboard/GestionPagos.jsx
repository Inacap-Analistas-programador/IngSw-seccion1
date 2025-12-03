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
  Plus,
  FileText,
  Users,
  Mail
} from 'lucide-react';
import api from '../../config/api';
import RegistrarPagoMasivoModal from './RegistrarPagoMasivoModal';
import RegistrarPagoModal from './RegistrarPagoModal';
import { useToast } from '@/components/ui/use-toast';

const GestionPagos = () => {
  const { toast } = useToast();
  const [pagos, setPagos] = useState([]);
  const [personas, setPersonas] = useState({});
  const [cursos, setCursos] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMassModalOpen, setIsMassModalOpen] = useState(false);
  const [selectedPago, setSelectedPago] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pagosRes, personasRes, cursosRes] = await Promise.all([
        api.get('/pagos/pagopersonas/'),
        api.get('/personas/personas/'),
        api.get('/cursos/cursos/')
      ]);

      const pagosData = Array.isArray(pagosRes.data) ? pagosRes.data : (pagosRes.data.results || []);
      setPagos(pagosData);

      const personasData = Array.isArray(personasRes.data) ? personasRes.data : (personasRes.data.results || []);
      const personasMap = {};
      personasData.forEach(p => {
        personasMap[p.per_id] = p; // Store full object
      });
      setPersonas(personasMap);

      const cursosData = Array.isArray(cursosRes.data) ? cursosRes.data : (cursosRes.data.results || []);
      const cursosMap = {};
      cursosData.forEach(c => {
        cursosMap[c.cur_id] = c; // Store full object
      });
      setCursos(cursosMap);

      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const headers = [
      'ID Pago', 'RUT', 'Nombre', 'Apellidos', 'Correo',
      'Curso', 'Tipo', 'Valor', 'Fecha', 'Observación'
    ];

    const csvContent = [
      headers.join(','),
      ...filteredPagos.map(pago => {
        const persona = personas[pago.per_id] || {};
        const curso = cursos[pago.cur_id] || {};

        return [
          pago.pap_id,
          persona.per_run || '',
          persona.per_nombres || '',
          persona.per_apelpat || '',
          persona.per_email || '',
          curso.cur_descripcion || '',
          pago.pap_tipo === 1 ? 'Ingreso' : 'Egreso',
          pago.pap_valor,
          new Date(pago.pap_fecha_hora).toLocaleDateString(),
          `"${(pago.pap_observacion || '').replace(/"/g, '""')}"`
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `pagos_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGenerateReceipt = async (pagoId) => {
    try {
      const response = await api.get(`/archivos/archivos/descargar-comprobante/?pap_id=${pagoId}`, {
        responseType: 'blob'
      });

      // Extract filename from Content-Disposition header
      const contentDisposition = response.headers['content-disposition'];
      let filename = `comprobante_pago_${pagoId}.pdf`; // Default to PDF if not found
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch && filenameMatch.length === 2) {
          filename = filenameMatch[1];
        }
      } else {
        // Fallback based on content-type if header is missing (e.g. CORS issues)
        const contentType = response.headers['content-type'];
        if (contentType && !contentType.includes('pdf')) {
             if (contentType.includes('image/jpeg')) filename = `comprobante_pago_${pagoId}.jpg`;
             else if (contentType.includes('image/png')) filename = `comprobante_pago_${pagoId}.png`;
        }
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading receipt:', error);
      // Toast for error
      if (error.response && error.response.status === 404) {
        // You might want to show a toast here saying "No receipt found"
        alert('No hay comprobante asociado a este pago.');
      }
    }
  };

  const handleSendReceiptEmail = async (pagoId) => {
    if (!window.confirm('¿Enviar comprobante por correo a la persona asociada?')) return;
    
    try {
      await api.post(`/pagos/pagopersonas/${pagoId}/enviar-comprobante/`);
      toast({
        title: 'Correo Enviado',
        description: 'El comprobante ha sido enviado exitosamente.',
        variant: 'success',
      });
    } catch (error) {
      console.error('Error sending receipt email:', error);
      const msg = error.response?.data?.detail || 'Error al enviar el correo.';
      toast({
        title: 'Error',
        description: msg,
        variant: 'destructive',
      });
    }
  };

  const handleRegisterPayment = () => {
    setSelectedPago(null);
    setIsModalOpen(true);
  };

  const handleRegisterMassPayment = () => {
    setIsMassModalOpen(true);
  };

  const handleEdit = (pago) => {
    setSelectedPago(pago);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas anular este pago?')) {
      try {
        await api.post(`/pagos/pagopersonas/${id}/anular/`);
        fetchData(); // Refresh all data to be safe
      } catch (err) {
        console.error('Error anulando pago:', err);
        setError(err);
      }
    }
  };

  const handleSuccess = () => {
    fetchData();
  };

  const filteredPagos = pagos.filter(pago => {
    const persona = personas[pago.per_id] || {};
    const personaName = `${persona.per_nombres || ''} ${persona.per_apelpat || ''}`.toLowerCase();
    const curso = cursos[pago.cur_id] || {};
    const cursoName = (curso.cur_descripcion || '').toLowerCase();
    const search = searchTerm.toLowerCase();
    return personaName.includes(search) || cursoName.includes(search) || pago.pap_id.toString().includes(search);
  });

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
      className="space-y-6"
    >
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/5 p-4 rounded-2xl backdrop-blur-xl border border-white/10 shadow-xl">
        <div className="relative w-full sm:w-72 order-2 sm:order-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre, curso o ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
          />
        </div>
        <div className="flex gap-3 w-full sm:w-auto order-1 sm:order-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-xl text-sm text-white font-semibold transition-all shadow-lg hover:scale-105 active:scale-95"
          >
            <FileText size={18} />
            <span>Exportar Excel</span>
          </button>
          <button
            onClick={handleRegisterMassPayment}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm text-white font-semibold transition-all shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95"
          >
            <Users size={18} />
            <span>Pago Masivo</span>
          </button>
          <button
            onClick={handleRegisterPayment}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-sm text-white font-semibold transition-all shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95"
          >
            <Plus size={18} />
            <span>Nuevo Pago</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-white/70 text-xs uppercase tracking-wider">
                <th className="p-5 font-semibold">ID</th>
                <th className="p-5 font-semibold">Persona</th>
                <th className="p-5 font-semibold">Curso</th>
                <th className="p-5 font-semibold">Fecha</th>
                <th className="p-5 font-semibold">Tipo</th>
                <th className="p-5 font-semibold text-right">Valor</th>
                <th className="p-5 font-semibold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredPagos.map((pago) => {
                const persona = personas[pago.per_id] || {};
                const curso = cursos[pago.cur_id] || {};
                const nombreCompleto = `${persona.per_nombres || ''} ${persona.per_apelpat || ''}`;

                return (
                  <tr key={pago.pap_id} className="text-white/90 hover:bg-white/5 transition-colors text-sm group">
                    <td className="p-5 font-medium text-white/50">#{pago.pap_id}</td>
                    <td className="p-5 font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                          {nombreCompleto.charAt(0) || '?'}
                        </div>
                        <div className="flex flex-col">
                          <span>{nombreCompleto || 'Desconocido'}</span>
                          <span className="text-xs text-white/40">{persona.per_run}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-5 text-white/70">{curso.cur_descripcion || 'Desconocido'}</td>
                    <td className="p-5 text-white/70">{new Date(pago.pap_fecha_hora).toLocaleDateString()}</td>
                    <td className="p-5">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${pago.pap_tipo === 1
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}>
                          {pago.pap_tipo === 1 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                          {pago.pap_tipo === 1 ? 'Ingreso' : 'Egreso'}
                        </span>
                        {pago.pap_estado === 2 && (
                          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-lg text-[10px] font-bold border bg-gray-500/10 text-gray-400 border-gray-500/20">
                            ANULADO
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-5 text-right font-bold text-white">
                      ${parseInt(pago.pap_valor).toLocaleString('es-CL')}
                    </td>
                    <td className="p-5">
                      <div className="flex items-center justify-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleGenerateReceipt(pago.pap_id)}
                          className="p-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-lg transition-colors border border-purple-500/20"
                          title="Descargar Comprobante"
                        >
                          <FileText size={18} />
                        </button>
                        <button
                          onClick={() => handleSendReceiptEmail(pago.pap_id)}
                          className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors border border-blue-500/20"
                          title="Enviar por Correo"
                        >
                          <Mail size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(pago)}
                          className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors border border-emerald-500/20"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(pago.pap_id)}
                          className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors border border-rose-500/20"
                          title="Anular"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredPagos.length === 0 && !error && (
          <div className="p-16 text-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
              <FileText className="text-white/20" size={40} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No se encontraron pagos</h3>
            <p className="text-white/40 text-sm max-w-xs mx-auto">
              {searchTerm ? 'Intenta ajustar tu búsqueda para encontrar lo que necesitas.' : 'Comienza registrando un nuevo pago o importando masivamente.'}
            </p>
          </div>
        )}
      </div>

      <RegistrarPagoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
        initialData={selectedPago}
      />

      <RegistrarPagoMasivoModal
        isOpen={isMassModalOpen}
        onClose={() => setIsMassModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </motion.div>
  );
};

export default GestionPagos;
