import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, Search, Filter, Edit, Trash2, CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import api from '../../config/api';
import RegistrarConceptoModal from './RegistrarConceptoModal';
import { useToast } from '@/components/ui/use-toast';

const ConceptoContable = () => {
    const [conceptos, setConceptos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedConcepto, setSelectedConcepto] = useState(null);
    const { toast } = useToast();

    useEffect(() => {
        fetchConceptos();
    }, []);

    const fetchConceptos = async () => {
        try {
            setLoading(true);
            const response = await api.get('/maestros/conceptos-contables/');
            // Handle pagination if present
            const data = Array.isArray(response.data) ? response.data : response.data.results || [];
            setConceptos(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching conceptos:', err);
            setError('No se pudieron cargar los conceptos contables');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedConcepto(null);
        setIsModalOpen(true);
    };

    const handleEdit = (concepto) => {
        setSelectedConcepto(concepto);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este concepto?')) return;

        try {
            await api.delete(`/maestros/conceptos-contables/${id}/`);
            toast({
                title: "Concepto eliminado",
                description: "El concepto contable ha sido eliminado correctamente.",
                variant: "success",
            });
            fetchConceptos();
        } catch (err) {
            console.error('Error deleting concepto:', err);
            toast({
                title: "Error",
                description: "No se pudo eliminar el concepto. Puede que esté en uso.",
                variant: "destructive",
            });
        }
    };

    const handleSuccess = () => {
        fetchConceptos();
        toast({
            title: selectedConcepto ? "Concepto actualizado" : "Concepto creado",
            description: selectedConcepto
                ? "El concepto contable ha sido actualizado correctamente."
                : "El nuevo concepto contable ha sido creado correctamente.",
            variant: "success",
        });
    };

    const filteredConceptos = conceptos.filter(c =>
        c.coc_descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && conceptos.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="flex-1 w-full sm:w-auto flex gap-3 bg-white/5 p-1.5 rounded-xl backdrop-blur-xl border border-white/10">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar concepto..."
                            className="w-full bg-transparent border-none py-2 pl-10 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-0"
                        />
                    </div>
                </div>

                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20"
                >
                    <Plus size={18} />
                    <span>Nuevo Concepto</span>
                </button>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-200">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            {/* Table */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-white/60 text-xs uppercase tracking-wider bg-white/5">
                                <th className="p-4 font-medium">ID</th>
                                <th className="p-4 font-medium">Descripción</th>
                                <th className="p-4 font-medium text-center">Estado</th>
                                <th className="p-4 font-medium text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredConceptos.length > 0 ? (
                                filteredConceptos.map((concepto) => (
                                    <tr key={concepto.coc_id} className="text-white/80 hover:bg-white/5 transition-colors text-sm group">
                                        <td className="p-4 font-medium text-white/40">#{concepto.coc_id}</td>
                                        <td className="p-4 font-medium text-white">{concepto.coc_descripcion}</td>
                                        <td className="p-4 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${concepto.coc_vigente
                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                : 'bg-white/5 text-white/40 border-white/10'
                                                }`}>
                                                {concepto.coc_vigente ? (
                                                    <>
                                                        <CheckCircle size={12} />
                                                        Vigente
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle size={12} />
                                                        Inactivo
                                                    </>
                                                )}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEdit(concepto)}
                                                    className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-indigo-400 transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(concepto.coc_id)}
                                                    className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-red-400 transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-white/40">
                                        {searchTerm ? 'No se encontraron conceptos que coincidan con la búsqueda.' : 'No hay conceptos contables registrados.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <RegistrarConceptoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleSuccess}
                initialData={selectedConcepto}
            />
        </motion.div>
    );
};

export default ConceptoContable;
